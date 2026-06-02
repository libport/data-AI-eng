# Docker for Software Development: Docker Foundations
Docker helps developers build, share and run applications as containers. A container packages an application with the files, libraries and configuration it needs, then runs it as an isolated process. Containers share the host kernel, so they are not small virtual machines, although developers often manage them with similar start, stop and restart workflows.

A practical Docker setup gives developers three core capabilities:
- Build container images from application source code.
- Store and share those images through a registry such as Docker Hub.
- Run containers locally, in CI pipelines, on servers or in orchestrated platforms.
## Choosing a Docker environment
Docker Desktop suits most software development work. It bundles Docker Engine, the Docker CLI, Docker Compose, Docker Hub integration, Docker Scout, Kubernetes support and a graphical interface for managing containers, images, volumes, extensions and related tools. It runs on macOS, Windows and Linux, with builds for common AMD64 and ARM64 systems.

Docker Desktop is free for personal use, education, non-commercial open source projects and small businesses that meet Docker's free-tier limits. Larger organisations and some commercial uses need a paid subscription. Developers should check their organisation's policy before installing it on work-managed devices.

On macOS, Docker Desktop runs Linux containers inside a lightweight Linux virtual machine. On Windows, it normally uses the WSL 2 backend. This architecture matters because most container images run Linux applications and need Linux kernel features. Docker hides most of that plumbing, so developers can still use the same `docker` commands from a normal terminal.

Docker Engine is the core container runtime and command-line tooling without the Docker Desktop interface and bundled desktop features. It is a strong fit for Linux servers, CI runners and environments that need a smaller install. A default Engine install can require root privileges, so production-style Linux environments should consider rootless mode or user namespace isolation where supported. Rootless mode runs the daemon and containers inside a user namespace, which reduces the risk of a compromised container gaining host-level privileges.

Podman Desktop and Rancher Desktop are useful alternatives when Docker Desktop is unavailable or unsuitable. Podman is daemonless and Linux-native, and its CLI deliberately resembles Docker's CLI. Podman Desktop can also expose Docker-compatible behaviour so some Docker tooling can target a Podman engine. Rancher Desktop focuses heavily on desktop Kubernetes and can use either containerd with `nerdctl` or dockerd through Moby, which enables Docker CLI workflows.

The safest learning path is to begin with Docker Desktop when licensing and local policy allow it, then learn where the same commands map to other engines. This prevents the graphical interface from becoming a crutch. The GUI helps with discovery, but the CLI remains the portable skill. A developer who can build, tag, push, run, inspect and remove containers from the terminal can work across desktop machines, build agents and servers.

Tool choice should also reflect risk. Desktop tools are convenient because they bundle many features, but they can hide resource use and background services. Server and CI environments usually need fewer moving parts, clearer upgrade control and tighter security settings. A team should standardise the supported toolchain so local builds, CI builds and production images do not drift.
## Docker ID and registries
A Docker ID gives developers access to Docker Hub. Docker Hub stores container images in repositories, which makes images available across laptops, servers, CI jobs and deployment environments. Docker Hub is not the only registry. GitHub, AWS, Azure, Google and private on-premises registries can also store images. Any registry that follows the OCI distribution specification works with standard container tooling.

Developers usually push images to a registry after building them locally. The registry becomes the shared source of truth, while local machines pull images as needed. This workflow keeps application packaging consistent across development and deployment.
## Images, containers and Dockerfiles
A container image is an immutable package that contains the files, binaries, libraries and configuration needed to create a container. A container is a running instance of an image. Multiple containers can run from the same image, just as many objects can be created from one class or many virtual machines can be created from one template. The image is not a stopped container. It is the template from which containers start.

A Dockerfile describes how Docker should build an image. For a simple Node.js web application, the Dockerfile might start from a Node base image, add metadata, create an application directory, copy source files into the image, install dependencies from `package.json`, set a working directory and define the command that runs when a container starts.

The base image does not include a full operating system with its own kernel. It usually provides a Linux filesystem and the packages needed by the application. Containers then share the Linux kernel provided by the host, Docker Desktop virtual machine or WSL 2 environment.

Developers can write Dockerfiles manually or generate a first draft with AI tools, but they should review every instruction. A good Dockerfile uses the smallest practical base image, avoids unnecessary packages, runs applications as a non-root user where possible and keeps build steps reproducible.

A Dockerfile should be read as an ordered set of filesystem and metadata changes. Each instruction contributes to the final image or records default runtime behaviour. `FROM` selects the base image. `WORKDIR` sets the directory for later commands. `COPY` adds application files. `RUN` executes commands while the image is being built. `CMD` or `ENTRYPOINT` defines what starts when a container is created from the image. Small changes to early instructions can invalidate later build cache layers, so teams usually copy dependency manifests before source files when they want faster rebuilds.

The build context also matters. Docker sends the selected context to the builder, so a careless context can include secrets, dependency caches or large unused files. A `.dockerignore` file should exclude files that do not belong in the image, such as local environment files, credentials, build artefacts and version-control metadata.

A typical image build uses `docker build`:

```bash
docker build -t example-user/dockerfun:2025 .
```

The tag identifies the registry namespace, repository name and image tag. The final `.` tells Docker to use the current directory as the build context, including the Dockerfile and application files. Docker reads the Dockerfile, downloads any required base layers, adds the application and dependencies, and produces a local image.
## Publishing and multi-platform images
Developers publish an image with `docker push`:

```bash
docker push example-user/dockerfun:2025
```

Docker may require `docker login` before pushing. A user can push only to repositories they own or have permission to update.

Architecture matters. An image built on Apple Silicon may produce an ARM64 image by default, which will not run natively on AMD64 hosts unless the image also supports AMD64 or the runtime emulates the architecture. Docker Buildx can create multi-platform images from one build command, such as `linux/arm64` and `linux/amd64`. Registries then store a manifest that lets each host pull the right image for its platform.

A registry tag such as `2025` or `latest` is a movable label. It can point to a different image after a later push. For repeatable deployments, teams should track immutable digests or use version tags that align with release processes. Tags remain useful for humans, but digests identify the exact image content.

Pushing to a registry also creates a supply-chain boundary. Developers should avoid publishing images that contain secrets, private source code that should not leave the organisation, or build files that reveal internal infrastructure. Registry permissions, image scanning and retention policies should be part of the workflow rather than afterthoughts.
## Running and managing containers
Developers start containers with `docker run`. A web application that listens on port 8080 inside the container can publish that service on port 8000 of the host:

```bash
docker run -d --name web -p 8000:8080 example-user/dockerfun:2025
```

The `-d` flag runs the container in the background. The `--name` flag gives the container a readable name. The `-p` flag maps `host port:container port`, so requests to the host on port 8000 reach the application on port 8080 inside the container.

Docker checks for the image locally first. If the image is absent and the name does not specify another registry, Docker tries Docker Hub. After Docker pulls the image, it starts the container and assigns it a unique container ID.

Common container management commands include:
- `docker ps` lists running containers.
- `docker ps -a` lists running and stopped containers.
- `docker stop web` asks the container to shut down.
- `docker start web` starts a stopped container.
- `docker rm web` removes a stopped container.
- `docker rm -f web` removes a running container forcefully.

When Docker stops a container, it sends the main process a termination signal and then sends a kill signal after the grace period if the process does not exit. The default grace period for many Docker workflows is 10 seconds.

Some containers run interactively instead of in the background. For example, an Alpine container can start a shell attached to the terminal:

```bash
docker run -it --name shell alpine sh
```

The `-i` flag keeps standard input open, and `-t` allocates a terminal. Exiting the shell stops the container because the shell is the container's main process. The keyboard sequence `Ctrl-P Ctrl-Q` detaches from an attached container while leaving it running.

Containers should be treated as disposable. A container filesystem may preserve changes while that container exists, but rebuilding or replacing the container can remove those changes. Persistent data belongs in named volumes, bind mounts or external services. Logs should go to standard output and standard error so Docker, Compose and production platforms can collect them consistently.

Port publishing should be deliberate. Publishing a port exposes a service beyond the container network, often to the host and sometimes to other machines depending on host firewall and binding settings. Databases, queues and internal services should normally remain on private networks unless another component outside Docker must reach them.
## Multi-container applications with Docker Compose
Most real applications use more than one container. A web frontend, database, cache, queue and worker process may each need a separate container. Docker Compose lets developers define those services, networks and volumes in a YAML file, then start the application with one command.

A simple Compose application might include:
- A frontend service called `fe` that builds from a local Dockerfile and runs a Python Flask application.
- A backend service called `be` that uses the `redis:alpine` image from Docker Hub.
- A private network called `internal` that lets the frontend reach Redis without publishing Redis to the host.
- A port mapping that exposes the frontend to the host, such as host port 5555 to container port 8080.

The command `docker compose up -d` reads the `compose.yaml` file, builds images where required, pulls registry images where required, creates networks and starts containers. Compose also gives services predictable names and network discovery, so the frontend can reach the backend by service name rather than by hard-coded IP address.

The command `docker compose down` stops and removes the application resources created by Compose. This makes Compose a practical tool for local development, testing and demos, because a developer can recreate a complete application stack consistently.

Compose does not replace production orchestration, but it gives teams a readable application model. The same file can document which services exist, which images or build contexts they use, which ports they publish, which environment variables they expect and which volumes they mount. This makes onboarding easier because a new developer can start a known application stack without manually creating each container.

A Compose file should avoid embedding secrets directly. Environment files and secret managers provide safer patterns, especially when the same repository is shared. Compose is also useful in CI because tests can start a real database or cache for integration testing, then tear the stack down when the job ends.
## Related Docker Desktop features
Docker Desktop now reaches beyond basic container workflows. These features are useful, but they should not distract from the core container model of images, registries and running containers.

Docker Model Runner helps developers pull, run and serve AI models from Docker Hub, OCI-compliant registries and Hugging Face. It integrates with Docker Desktop and the Docker CLI and can expose models through an OpenAI-compatible API. It is useful for local AI development, but platform support, GPU support and performance vary by operating system and hardware.

Docker Desktop includes Kubernetes support for local testing. Developers can enable Kubernetes from the settings, choose a version and use `kubectl` against the local cluster. The newer `kind` provisioner supports multi-node clusters, which better resemble real Kubernetes environments. Local Kubernetes still consumes significant CPU, memory and storage, so it should be disabled when not needed.

Docker Desktop has supported Wasm workloads alongside Linux containers, but Docker's current documentation marks Docker Desktop Wasm workloads as deprecated and no longer actively maintained. Developers should treat Wasm container demos as experimental or transitional rather than as a core Docker Desktop learning path.

Docker Offload lets developers build and run containers in Docker-managed cloud resources while using local Docker Desktop tools and workflows. It can help when local machines lack nested virtualisation, sufficient CPU or GPU capacity, but it requires Docker Desktop 4.68 or later and access to the Docker Offload subscription. Because Offload shifts execution to cloud resources, developers should monitor context, cost and data-transfer implications.

Docker Scout analyses container images, builds a software bill of materials and compares components with vulnerability data. It can report affected packages, severity, policy status and remediation guidance. Scout works well as part of supply-chain security, but it does not remove the need to patch base images, rebuild applications, test changes and manage exceptions for false positives or accepted risk.
## Practical guidance
Docker Desktop is the best default for developers who want the broadest local workflow and whose organisation permits it. Docker Engine is better for Linux servers, automation and lean CI runners. Podman suits teams that prefer a daemonless, rootless-first model or need Docker-like commands without Docker Desktop. Rancher Desktop suits developers focused on local Kubernetes and open container tooling.

The core workflow remains consistent across these tools:
- Start with application source code and a Dockerfile.
- Build an image.
- Push the image to a registry.
- Run one or more containers from that image.
- Use Compose for multi-container local applications.
- Use Kubernetes or another orchestrator when the application needs production-grade scheduling, scaling and resilience.

Good Docker practice treats images as repeatable artefacts, registries as distribution points and containers as disposable runtime instances. Containers should start quickly, stop cleanly, log to standard output, avoid unnecessary privileges and store persistent data in volumes or external services rather than inside the container filesystem.