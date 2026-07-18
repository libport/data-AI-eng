# Docker for Software Development: Developing Docker Apps
> [!NOTE]
> A hands-on guide to building fast, secure, and maintainable containerized development workflows using live code mounting, multi-stage builds, intelligent caching, safe secret handling, linting, logging, and modern debugging tools.
## Development inside containers
A Dockerfile defines how Docker builds an image for an application. The file normally specifies the base image, working directory, source files, dependency installation steps, exposed port and command used to start the process. Docker reads these instructions during an image build and combines operating system content, application code and build artefacts into a template for container instances.

The normal development loop changes when an application must run in a container. Developers usually edit code, compile when necessary, run the application, test the result and debug failures before committing changes. Containerised development adds an image build before each test run if every code change must be baked into a new image. Complex Dockerfiles can make that step slow enough to interrupt the inner loop.

Development inside a container avoids many rebuilds. The container runs the same kind of environment that will host the application, while source code changes remain available between container runs. Containers are temporary by design, so source files should not live only in the container writable layer. Persistent host-backed storage keeps code safe while still making it visible inside the container.

Docker supports persistent storage through mounts. Named volumes work well for data that Docker manages, such as database files. Bind mounts work well for development because they mount a file or directory from the host into a container path. Code edited on the host appears inside the container, and changes made inside the mounted path persist on the host after the container stops.

The `--mount` flag gives an explicit bind-mount syntax. A typical command sets `type=bind`, a host source path and a container destination path. Mounting a host project directory over `/app` lets the container use live source files without rebuilding the image. When the mount hides files copied into the image at the same path, the mounted host content becomes the visible version.

A bind mount alone does not reload an application. A watcher inside the container must react to file changes. Interpreted stacks commonly use tools such as `nodemon` for Node.js or Watchdog-based tooling for Python. The development command can replace the production command so that the container runs the watcher, restarts the process and reflects changes immediately.

A Node.js to-do application illustrates the pattern. The image can keep the normal production command, while `docker run` overrides it with a package script such as `yarn dev`. The command bind mounts `src` into the container, maps the application port and starts `nodemon`. Editing a placeholder string on the host triggers a restart inside the container, and refreshing the browser shows the change without a new image build. Tests can be mounted the same way when the development workflow needs them.

Docker Compose Watch provides another development workflow. A Compose file can watch selected paths and apply actions such as `sync`, `rebuild` or `sync+restart`. This gives more granular control than a broad bind mount. It suits multi-service applications and teams that already use Compose, while bind mounts remain a simple and effective option for many single-service workflows.

Compose Watch also lets different file types trigger different actions. Source files can synchronise into the container. Dependency manifests can trigger a rebuild because the image needs new packages. Configuration files can synchronise and restart the service. This gives teams a declarative development model for applications that need several containers to start together.
## File ownership and container users
Bind mounts can expose ownership problems. Host files have user and group identifiers. Containers often run as root unless the image sets another user. Files created inside a bind mount can then appear on the host with ownership that prevents the host user from editing or deleting them.

Running development containers as root also increases risk. A root process inside a container does not automatically have unrestricted root access on the host, but it can increase the impact of a container escape, excessive Linux capabilities or unsafe mounts. Development images should run as a non-root user where practical.

A useful pattern creates a user and group in the image with the same user ID and group ID as the host developer. Dockerfile build arguments can provide defaults, such as `1000`, while allowing teams to override the values during the image build. The resulting container user can create and modify bind-mounted files without fighting host permissions.

This approach also keeps the Dockerfile portable across workstations. One developer can build with the default IDs. Another can pass different values with `--build-arg` during the image build. The Dockerfile remains the shared source of truth, while each build adapts to the local host user.
## Compiled applications and build separation
Compiled languages add another step to the inner loop. A source change may require compilation before the application can run. Putting the compiler and full toolchain in the runtime image works, but it produces large images and increases the attack surface.

The builder pattern separates compilation from execution. A build image contains the compiler and dependency tools. A runtime image contains only the compiled artefact and the libraries needed to run it. A Go application can compile a binary in a container that has the Go toolchain, then copy that binary into a small Debian, Alpine, scratch or distroless runtime image.

This pattern improves runtime image size, distribution speed and security. It also gives developers a consistent build environment. The trade-off is workflow complexity if separate Dockerfiles and containers handle build, test and execution. Multi-stage Dockerfiles solve much of that maintenance problem.

A simple Go editor example shows the benefit. A single image that contains the Go toolchain and the compiled binary can exceed hundreds of megabytes. Splitting the build and runtime responsibilities lets the development image compile the binary while the runtime image carries only the executable and minimal operating system content. The runtime image starts faster, transfers faster and exposes fewer tools to attackers.

The same separation helps testing. A build or development container can contain compilers, test fixtures and diagnostic tools, while the runtime image remains close to production. Developers can test the exact binary that will be shipped rather than a different binary built on the host.
## Docker image structure and multi-stage builds
Docker image content is stored as ordered read-only layers. Dockerfile instructions that create or copy files, such as `RUN`, `COPY` and `ADD`, contribute content layers. Instructions such as `CMD`, `ENTRYPOINT`, `WORKDIR` and `EXPOSE` mostly set image configuration metadata.

When Docker creates a container, it presents the image layers as a unified filesystem and adds a temporary writable layer for that container. New files live in the writable layer. Modified files from a lower layer are copied up before Docker writes changes, a behaviour known as copy-on-write. Removed files remain in the lower image layer but are hidden by whiteout entries. These mechanics explain why deleting temporary build files later in a Dockerfile may not reduce the earlier layer size.

Multi-stage Dockerfiles split one Dockerfile into named build stages. Each `FROM` starts a new stage. Later stages can copy artefacts from earlier stages with `COPY --from`. Docker builds the target stage and the stages it depends on, then the final image contains only the filesystem content from the selected target stage.

Named stages are easier to maintain than numeric stage references. `FROM golang AS build` and `COPY --from=build` remain clear if instructions move. A later stage can also use an earlier stage as its base. This removes duplication when several stages share common setup.

A practical multi-stage development Dockerfile can separate work by purpose:
- `base` defines the shared language image.
- `deps` copies dependency manifests and downloads dependencies.
- `lint` installs and runs a linter.
- `dev` installs a watcher, such as Air for Go, and expects source code through a bind mount.
- `build` compiles the application.
- `run` starts from a small runtime base and copies only the final artefact.

This structure supports linting, iterative development and production image generation from one Dockerfile. Large stages can contain tools for development and analysis, while the runtime stage stays small.

The lint stage can mount one source file or the whole project and run the configured linter in a throwaway container. The dev stage can mount source code and run Air, which recompiles the Go binary after changes. The run stage can build the production image from the same file without including the linter, watcher or compiler. This keeps development convenience and production discipline in the same build definition.
## Dockerfile linting and build checks
Dockerfile linting catches problems before a slow build fails. Docker build checks provide native BuildKit analysis of Dockerfiles and build options. Running `docker build --check .` validates the build configuration without producing an image. Checks can flag mixed keyword casing, relative `WORKDIR` paths, unsafe shell-form `CMD` or `ENTRYPOINT` use and other rule violations.

Hadolint provides a wider community linter for Dockerfiles. It parses Dockerfiles, applies best-practice rules and uses ShellCheck to inspect shell code in `RUN` instructions. It can detect missing base image tags, relative copy destinations, invalid ports, package-manager issues and shell variable mistakes. Docker build checks and Hadolint overlap, but they do not produce identical findings. Using both gives broader coverage.

Linting also improves team communication. A Dockerfile that follows consistent casing, absolute paths, pinned base images and JSON-form commands is easier to review. Automated checks in an editor, pre-commit hook or continuous integration job catch issues before a developer waits for a full build.

The findings should be treated as guidance rather than a substitute for engineering judgement. Some rules enforce syntax that prevents clear failures. Others express conventions that a team may tune. The important practice is to make Dockerfile quality visible, repeatable and reviewable.
## Build cache strategy
Docker uses a build cache to avoid repeating work. The builder compares Dockerfile instructions and relevant file metadata with cached layers. If a layer still matches, Docker reuses it. If a cache miss occurs, Docker rebuilds that instruction and every later instruction.

`COPY` and `ADD` instructions invalidate cache when relevant file metadata changes. A `RUN` instruction usually uses the command text for the cache key, so Docker does not automatically rerun package updates just because remote packages changed. This is useful for speed, but it means Dockerfile authors must decide when to force fresh builds.

Instruction order matters. Stable steps should appear before frequently changing steps when dependencies allow it. For example, a Node image should copy `package.json` and `yarn.lock`, install dependencies, then copy source code. Source edits then invalidate only the later source-copy layer rather than reinstalling dependencies.

More `COPY` instructions can improve cache reuse even if they create more layers. The best Dockerfile groups files according to their change patterns, not merely according to how short the file looks.

The same logic applies to multi-stage builds. A dependency stage should copy only dependency manifests, because source edits should not force dependency downloads. A build stage can then copy the source and compile. A runtime stage can copy only the compiled result. Each stage limits the scope of cache invalidation.

Cache mounts improve package manager performance when a layer must rebuild. A `RUN --mount=type=cache,target=...` instruction gives a build step access to a persistent cache that Docker manages outside the final image. If a dependency file changes, the package manager can reuse unchanged downloads and fetch only new or changed packages. Cache mounts also help compiled languages by preserving intermediate build artefacts.

External build caches help ephemeral environments such as continuous integration pipelines. A local builder keeps its own cache, but a remote registry or other external cache can share cache data across builders. Pipelines can import cache before a build and export updated cache afterwards.

Cache mounts are most useful when the ordinary layer cache has to miss. If a package list changes, Docker must rerun the package-install instruction. Without a cache mount, the package manager downloads everything again. With a cache mount, it can reuse cached package data and download only the missing content. The first build may take the same time or slightly longer, but later builds usually improve.
## Base images, secrets and build context
Base image choice affects size, security and reproducibility. Teams should choose trusted sources, inspect image contents and select a variant that matches the application runtime. Official images cover many common stacks. Alpine, distroless and hardened images can reduce image size and unused tooling, but they must still fit the application.

Images should not use an omitted tag or the `latest` tag for reproducible builds. Tags are mutable, so the same Dockerfile can resolve to different content later. A specific version tag improves clarity, while a digest pins the exact image content. Combining a version tag with a digest gives both readability and precision.

Secrets should not enter builds through build arguments or environment variables. They can appear in image history, image metadata, derived containers or files accidentally written during the build. BuildKit secret mounts and SSH mounts expose credentials only to the build step that needs them. Secret mounts can use files or environment variables as sources, while SSH mounts support private Git access. This keeps credentials out of the final image, cache and filesystem when the Dockerfile uses them correctly.

The build context should include only files needed for the build. Docker sends the context to the builder, so unnecessary files slow builds, risk cache invalidation and can leak secrets. A `.dockerignore` file excludes directories, generated artefacts, local configuration, logs and credentials from the context. Careful context management produces smaller, faster and safer builds.

The base image and context decisions should be treated as security controls. A small image is not automatically secure, and a large image is not automatically unsafe, but every unnecessary package creates maintenance work and potential vulnerabilities. Teams should rebuild images regularly, update base images deliberately and scan images as part of the build pipeline.

Secret handling needs the same discipline in local development and automation. A developer workstation may feel private, but image history and local registries can retain values longer than expected. Continuous integration systems multiply that risk because build logs, caches and images may be visible to more people. Secret mounts reduce exposure by keeping credentials temporary and scoped to a single build step.
## IDE-based container development
Container workflows do not require terminal-only development. Integrated development environments can build images, run containers, inspect objects and provide Dockerfile feedback. Visual Studio Code supports this through extensions such as Microsoft Container Tools and Docker DX. Container Tools exposes local containers, images, registries and related objects. Docker DX provides Dockerfile and Compose feedback, including syntax checks and some vulnerability warnings for referenced images.

A project can define reusable IDE tasks that run Docker commands. A `tasks.json` entry can start a development container with bind-mounted source code and a custom command such as `yarn dev`. The developer edits code in the IDE, the watcher in the container sees saved changes, and the application reloads without rebuilding the image.

Editor feedback can also shorten the error cycle. Dockerfile problems such as a relative `WORKDIR` or ambiguous `COPY` destination can appear as warnings while the file is open. Fixing them before the build starts saves time and makes the same rules visible to developers who prefer graphical tools over command-line linting.

Extension choice still requires due diligence. Official extensions from Microsoft and Docker are suitable starting points. Third-party extensions may be useful, but teams should review publisher identity, maintenance history, permissions and adoption before installing them.
## Logging and debugging
Containerised applications should write logs to standard output and standard error rather than managing log files inside the container. Docker captures these streams and passes them to a configured logging driver. This fits the twelve-factor application model because the application emits an event stream and the platform handles routing, storage and retention.

Docker supports several logging drivers. The `json-file` driver is the default and stores logs in JSON format. The `local` driver stores logs in an efficient local format with rotation and compression options. The `journald` driver sends logs to the systemd journal on Linux hosts. Other drivers can send logs to remote systems such as Fluentd, Splunk or cloud logging services.

The logging driver can be configured globally in the Docker daemon or per container with `--log-driver` and `--log-opt`. Docker can also use dual logging for drivers that do not support local reads, which lets `docker logs` read a local cache while the main driver sends logs elsewhere.

The `docker logs` command supports targeted inspection. Useful options include `--follow` for live output, `--tail` for recent lines, `--since` and `--until` for time windows, `--timestamps` for time context and `--details` for extra attributes. These filters help developers inspect application behaviour during the inner loop.

A Linux host can route a container's logs to `journald` and still permit local inspection through `docker logs` when dual logging applies. Filtering journal entries by `CONTAINER_NAME` helps find messages after a container has been removed. This is valuable in development, where throwaway containers are common but recent logs may still explain a failure.

Minimal runtime images improve security and efficiency but remove troubleshooting tools. A distroless image may not include a shell, package manager or common utilities, so `docker exec` may fail. Docker Debug addresses this by attaching a toolbox to a container or image without modifying the image. It can provide a shell and tools such as editors and process viewers for debugging. Docker Debug appears in Docker's current CLI documentation and is commonly provided through Docker Desktop. Docker Desktop licensing depends on use case and organisation size.

Debug tooling should not become a reason to ship bloated production images. A production image should stay minimal, then developers should attach tools only when troubleshooting requires them. This preserves the benefits of small images without leaving teams blind when a container fails before it can be inspected normally.

A common debugging pattern is to reproduce the failure in a temporary container, inspect the filesystem and process environment, then test a hypothesis with configuration rather than immediately changing the image. For example, a Node application running as a non-root user in a distroless image may fail when it tries to create a SQLite database under `/etc`. Setting an environment variable to move the database to a writable path such as `/tmp` can confirm the permission issue before the application code or image layout is fixed.