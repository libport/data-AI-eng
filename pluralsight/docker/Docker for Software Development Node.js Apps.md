# Docker for Software Development: Node.js Apps
## Containers and Node.js development
Containers package an application with the runtime, libraries, operating system files, metadata, and default configuration it needs to run. A Node.js application can therefore run in a repeatable environment on a developer workstation, in continuous integration, and in production. The result is not perfect portability, because the host kernel, CPU architecture, filesystem, networking, and runtime settings still matter. Even so, containers reduce the difference between development, test, and deployment environments.

A container image is a static artefact. A container is a running instance created from that image. Images can be named, tagged, stored in a registry, pulled by other systems, and rebuilt from a Dockerfile. Tags such as `latest` are convenient for experiments, but production builds should pin explicit versions so the same input produces the same result.

Application containers differ from virtual machines. They normally share the host kernel and isolate processes, users, filesystems, and networks through operating system features. They usually run one main process, although helper processes can exist when the image design requires them. They also write logs to standard output and standard error, which lets the container runtime collect logs consistently.

Docker and Podman run containers. Kubernetes orchestrates containerised workloads across machines. The Open Container Initiative defines standards that allow images and runtimes to interoperate across tools.

Containers help development teams by providing:
- repeatable local and remote development environments
- faster setup for new developers
- consistent artefacts for testing and deployment
- isolation between application versions and dependencies
- easier integration with CI/CD pipelines
- a practical way to run several services on one machine
## Images, registries, and base images
A container image contains a filesystem snapshot and metadata. Image names usually include a registry, organisation or project name, image name, and tag. Docker Hub hosts official images such as `node`, `ubuntu`, `postgres`, and `nginx`. Other registries include GitHub Container Registry, GitLab Container Registry, Quay.io, JFrog Artifactory, and cloud provider registries.

Base images provide the starting point for an application image. A Node.js service commonly starts from a Node image. Debian-based variants usually provide broader compatibility and more familiar debugging tools. Slim variants reduce size by removing non-essential packages. Alpine variants are smaller again, but use musl libc rather than glibc, which can affect native dependencies. Teams should choose the smallest image that still supports reliable builds, runtime behaviour, security patching, and debugging.

Third-party images need the same scrutiny as any other software dependency. Teams should prefer official images or trusted internal images, review image provenance, scan for vulnerabilities, and avoid images that lack maintenance signals.
## Building Node.js images with Dockerfiles
A Dockerfile is a text file that tells Docker how to assemble an image. `FROM` selects a base image. `LABEL` adds metadata. `RUN` executes commands during the build. `COPY` adds files from the build context. `USER` sets the user for later build steps and for the default runtime. `WORKDIR` sets the working directory for later instructions. `CMD` defines the default command for containers created from the image. `ENTRYPOINT` defines the executable that runs when the container starts.

`RUN`, `CMD`, and `ENTRYPOINT` support shell form and exec form. Exec form is usually safer and clearer because Docker passes arguments directly to the executable. Shell form relies on a shell, performs shell expansion, and can obscure signal handling. Entrypoint scripts should normally end with `exec "$@"` so the application becomes the main process and receives signals correctly.

`COPY` should be the default way to add local files. `ADD` has extra behaviours, such as downloading remote files and unpacking local archives, which can surprise readers and complicate builds. Docker will not allow `COPY` to read files outside the build context. This protects the host and helps builds stay reproducible.

Layer caching strongly affects build speed. Docker caches build steps and reuses layers when inputs do not change. A common Node.js pattern is to copy only `package.json` and the lock file first, install dependencies, then copy the rest of the source code. A change to application source then avoids reinstalling dependencies unless dependency files change.

For Node.js applications, dependency installation should normally use the lock file. `npm ci` is often a better build command than `npm install` in CI and image builds because it installs exactly what the lock file records and fails when the lock file and manifest do not match. The image should avoid copying host `node_modules` because native packages may have been built for the host rather than the container base image.

A good `.dockerignore` file keeps local artefacts out of the build context. It should normally exclude `node_modules`, local data, logs, test output, build output, temporary files, editor state, and secrets. Smaller build contexts improve performance and reduce the risk of leaking sensitive files into the image.

Build arguments and environment variables serve different purposes. `ARG` supplies build-time values. `ENV` sets variables that remain available to later build steps and at runtime. Neither is appropriate for secrets in a Dockerfile. Build secrets should use Docker secret mounts or another secret management mechanism because `ARG` and `ENV` values can persist in image metadata or history.
## Running and configuring containers
`docker run` creates and starts a container. Common options include `--rm` to remove the container after it exits, `-i` and `-t` for interactive terminal use, `--name` to set a container name, `-p` to publish ports, `--network` to choose a network, `-e` to set environment variables, `--env-file` to load them from a file, `-u` to set the runtime user, and `-w` to set the working directory.

Runtime overrides matter. The same image can behave differently across development, staging, and production if teams pass different commands, environment variables, mounts, users, ports, or networks. These overrides should be treated as configuration and stored in version-controlled deployment files where possible.

Node.js applications commonly read configuration through `process.env`. This works well for ports, feature flags, service endpoints, log levels, and non-secret local settings. Developers can also use `.env` files during local development. They should not copy private `.env` files into images or commit them to source control.

Configuration files can be mounted into a container instead of baked into an image. This allows the same image to run in different environments. Read-only mounts are preferable for configuration files because the application should not modify them at runtime.
## Volumes and bind mounts
Containers can write to their own writable layer, but that layer disappears when the container is removed. Docker volumes store data outside the container lifecycle and suit databases, caches, uploads, and other persistent state. Volumes are managed by Docker and can be backed up, migrated, or shared across containers.

Bind mounts connect a host file or directory to a path inside a container. They suit local development because they let a container run code from the host. They also work well for injecting local configuration. Bind mounts are more tightly coupled to the host filesystem and can create permission problems, especially across Linux, macOS, and Windows. They also allow container processes to modify host files unless the mount is read only.
## Initialisation, CMD, and ENTRYPOINT
`CMD` supplies the default command for a container. It does not run during the image build. A user can override it by passing another command to `docker run`.

`ENTRYPOINT` supplies the default executable. It is useful when the container should behave like a command-line tool or when it must run setup logic before starting the main process. An entrypoint can wait for a database, run migrations, prepare directories, check external services, or initialise data.

Health checks can make readiness clearer. A Node.js service can expose a small endpoint that reports whether the application can serve requests and reach required dependencies. Compose, orchestrators, and operational scripts can then distinguish between a process that merely started and a service that is ready.

Entrypoints should remain small and predictable. Long startup logic can hide failure modes. If a service depends on another service, the container should handle temporary unavailability gracefully. Docker Compose `depends_on` controls startup order, but it does not guarantee that an application inside another container is ready unless health checks or explicit readiness logic are used.
## Logging and debugging containers
Containerised applications should log to standard output and standard error. Docker can then retrieve logs with `docker logs`. Useful options include `--follow` for streaming, `--since` for time filtering, and `--tail` for recent lines. With Docker Compose, `docker compose logs` can aggregate logs across services or filter them by service name.

In Express applications, `console.log` is adequate for quick local debugging, but production systems need structured levels and consistent request logging. Morgan can log HTTP requests. Winston can add log levels, transports, formatting, and metadata. In containers, console transport is usually appropriate because the runtime collects the stream.

`docker inspect` reports container, image, network, and volume configuration. It helps confirm environment variables, commands, entrypoints, users, labels, mounts, network settings, and published ports. `docker exec` starts an additional process inside a running container. It is useful for opening a shell, inspecting the filesystem, checking network connectivity, clearing caches, and running operational commands. It should not replace reproducible builds or declarative configuration.

Debug images should be separate from production images when extra tools are needed. Installing shells, package managers, or network tools in a production image can increase size and attack surface. A separate development image or temporary debug container usually gives developers the tools they need without weakening the deployed artefact.

Node.js provides two debugging modes. `node inspect` starts an interactive command-line debugger and requires an interactive terminal. `node --inspect` opens an inspector endpoint, normally on port 9229, so an external debugger such as a browser or IDE can attach. Remote debugging should be restricted carefully because an exposed debugger can allow code execution.
## Networking and port publishing
Bridge networking is Docker's common default. Containers on the default bridge have limited automatic service discovery. User-defined bridge networks are preferred for application stacks because they provide DNS-based service discovery, better isolation, and easier attachment or detachment at runtime.

Host networking removes network isolation between the container and the Docker host. It can reduce overhead and simplify some tests, but it also increases risk and can cause port conflicts. On Docker Desktop, host networking involves the Linux virtual machine that runs the Docker daemon, and behaviour can differ from native Linux.

Port publishing makes a container port reachable through the host. The Dockerfile `EXPOSE` instruction documents which ports the application listens on, but it does not publish the port. Publishing happens at runtime with `-p` or `--publish`. Binding to `127.0.0.1` limits access to the local host. Binding to all interfaces can expose the service to the network.

Internal services should usually communicate over Docker networks rather than through published host ports. This keeps private services private and reduces accidental exposure.
## Docker Compose for multi-tier applications
Docker Compose defines multi-container applications in YAML. A Compose file describes services, networks, volumes, build contexts, images, environment variables, commands, entrypoints, dependencies, and published ports. `docker compose up` builds or recreates services and starts them. `docker compose down` removes the stack resources it created. `docker compose build`, `docker compose logs`, `docker compose ps`, `docker compose exec`, and `docker compose run` support common development workflows.

Compose helps teams automate the runtime configuration that would otherwise require long `docker run` commands. It is especially useful for applications with a front end, API gateway, application services, databases, queues, and caches. Services can join only the networks they need. A front end can reach an API gateway, the gateway can reach back-end services, and databases can remain unavailable to the public interface.

Compose also helps test multiple Node.js versions. A Dockerfile can accept a build argument for the runtime version, while the Compose file defines several services or build targets with different values. Teams can then build and run tests against several Node.js images without installing each runtime locally.
## Practical guidance
- Pin image versions for reproducible builds.
- Use trusted base images and scan them regularly.
- Prefer `COPY` over `ADD` unless the extra `ADD` behaviour is required.
- Copy dependency manifests before source files to improve caching.
- Keep `.dockerignore` strict and exclude secrets.
- Run application containers as non-root users where practical.
- Keep configuration outside images when it changes between environments.
- Use volumes for persistent data and bind mounts for local development.
- Treat runtime options as code with Compose or another deployment tool.
- Log to standard output and standard error.
- Use user-defined bridge networks for multi-service development.
- Publish only the ports that must be reachable from the host.