# Docker for Software Development: Your First Docker App
## Purpose
Containers help development teams package an application with the runtime, libraries, configuration, environment variables and operating system dependencies it needs. That packaging reduces the gap between development, test, staging and production environments.

A typical application may use a web front end, one or more application programming interfaces, a cache and a database. Without containers, each part may require different installation steps, framework versions, local services and deployment assumptions. Docker gives each part a repeatable unit that developers can build, share, run, stop, move and remove.

Docker improves three common development problems:
- Onboarding becomes faster because a new developer can start a working stack without installing every runtime and service manually.
- Teams can run different framework or library versions side by side, such as two application programming interface versions with different runtime requirements.
- Deployments become more consistent because the same image can run in several environments.

Containers do not remove every software problem. They reduce environment drift and make the packaging process more explicit.
## Images and containers
An image is a read-only template made from layers. Each layer usually comes from a Dockerfile instruction or from a parent image. The image contains the files and metadata that Docker needs to create a container.

A container is a running instance of an image. When Docker starts a container, it adds a thin writable layer over the read-only image layers. The application can write to that container layer while the container exists, but Docker removes that layer when the container is removed unless the application stores data outside the container.

Developers should treat released images as immutable artefacts. When an application changes, the team should build a new image and publish it with a new tag rather than altering an existing release. Tags can technically be moved, but stable version tags make builds and deployments easier to reproduce.

Docker pulls image layers from a registry. The first pull downloads all missing layers. Later pulls only download layers that the local machine does not already have.
## Development environment
Docker Desktop provides a common way to build, run and manage containers on macOS, Windows and Linux. It includes Docker Engine, the Docker command-line interface, Docker Compose and a graphical dashboard. The dashboard can manage images, containers, volumes, settings and logs, but developers should still learn the command-line tools because servers and automation environments may not provide a graphical interface.

Docker Engine can run directly on Linux. Docker Desktop for Linux now runs a virtual machine to provide a more consistent desktop experience across operating systems. Docker Desktop for macOS and Windows also uses a Linux virtual machine or Linux subsystem for Linux containers.

After installation, developers can confirm that Docker is available with:

```bash
docker --version
docker compose version
docker images
```

The course application uses Node.js, Express and MongoDB. The same Docker ideas apply to applications written in .NET, Java, Python or other runtimes. The sample stack contains a Node application container and a MongoDB container, then uses Docker Compose to build and run them together.
## Application structure
The sample application keeps the Docker concepts small enough to observe directly. The Node.js service exposes a web application on port `3000`. It uses Express for routing, Mongoose for MongoDB access, configuration files for runtime settings and a database seeder that inserts example records. The MongoDB service runs from a standard image rather than a custom application image.

This split reflects a common development pattern. Teams usually build custom images for code they own and reuse trusted base images for infrastructure services. A front end, an application programming interface, a worker and a database can each run in a separate container. Each container owns one main process and one clear responsibility.

The same image can run many containers. Two NGINX containers can run from `nginx:alpine` at the same time if each one publishes to a different host port. The image layers stay shared and read-only, while each container receives its own writable layer and runtime configuration.
## Pulling and running an existing image
Docker Hub and other registries store images that developers can pull and run. A simple example uses the NGINX Alpine image:

```bash
docker pull nginx:alpine
docker run -p 8080:80 nginx:alpine
```

The `-p` option publishes a container port to the host. The first number is the host port. The second number is the port inside the container. In this example, a browser calls `localhost:8080`, and Docker forwards that traffic to port `80` inside the NGINX container.

A foreground container attaches logs to the terminal. Pressing `Ctrl+C` stops the running process. Detached mode keeps the container running and returns the terminal to the user:

```bash
docker run -d -p 8080:80 nginx:alpine
```

Developers inspect running containers and stopped containers with:

```bash
docker ps
docker ps -a
```

They can view logs, stop containers and remove containers with:

```bash
docker logs <container-id-or-name>
docker stop <container-id-or-name>
docker rm <container-id-or-name>
```

Docker only needs enough of an identifier to distinguish one object from another. Names are often clearer than shortened IDs, especially in scripts and documentation.
## Dockerfiles
A Dockerfile is a plain text file that contains instructions for building an image. Docker reads those instructions during `docker build` and creates the image layer by layer.

A typical Node.js Dockerfile uses instructions such as:

```dockerfile
FROM node:alpine
LABEL maintainer="Example Maintainer"
ARG PACKAGES="nano"
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /var/www
RUN apk update && apk add --no-cache $PACKAGES
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . ./
EXPOSE $PORT
ENTRYPOINT ["npm", "start"]
```

The `FROM` instruction sets the base image. `node:alpine` gives the application a Node runtime on Alpine Linux. In production, teams should usually pin a specific version, such as a known Node major or patch version, rather than relying on `latest`.

`LABEL` stores metadata. `ARG` defines build-time values. `ENV` defines environment variables that the image or running container can use. `WORKDIR` sets the working directory for later instructions. `RUN` executes commands during the image build. `COPY` copies files into the image. `EXPOSE` documents the container port. `ENTRYPOINT` defines the command Docker runs when it starts a container from the image.

The JSON array form of `ENTRYPOINT` is safer than a shell string because it lets the application receive operating system signals as the main process.

A `.dockerignore` file prevents unwanted files from entering the build context. It commonly excludes `node_modules`, logs, temporary files and local editor files. For Node projects, Docker should install dependencies inside the Linux image rather than copy a host-specific `node_modules` folder from macOS or Windows.

A common build pattern copies `package.json` and `package-lock.json` before copying the rest of the source. Docker can then reuse the dependency installation layer when the source code changes but dependency files do not.
## Build context and cache
The build context matters because Docker can only copy files that the context sends to the builder. In most small projects, the context is the project root. A large or careless context slows builds and may include files that do not belong in an image. `.dockerignore` protects the build from unnecessary files and from accidental inclusion of local secrets, logs and dependency folders.

Docker's build cache speeds repeated builds. If Docker sees that an instruction and its inputs have not changed, it can reuse the existing layer. That is why dependency files are often copied before the application source. Source edits then avoid reinstalling packages. Dependency changes still invalidate the correct layer and rebuild from that point.

Layer order should move from stable to volatile. Base images, operating system packages and dependency files usually change less often than application source. Placing stable steps first makes builds faster and easier to reason about.

Build arguments and environment variables serve different purposes. `ARG` values exist during the build and can influence what the image contains. `ENV` values persist in the image and can affect the running container. Sensitive data should not be baked into either one. Secrets belong in secret management systems or runtime configuration.
## Building and tagging images
The standard build command names and tags an image:

```bash
docker build -t nodeapp:1.0 .
```

The final dot sets the build context. Docker looks for a file named `Dockerfile` in that context by default. When the Dockerfile has another name, the build command must specify it:

```bash
docker build -f node.dockerfile -t nodeapp:1.0 .
```

A full image reference can include a registry namespace and tag:

```bash
docker build -f node.dockerfile -t danwahlin/nodeapp:1.0 .
```

The tag after the colon identifies a version or variant. Omitting the tag makes Docker use `latest`, which reduces reproducibility. Development experiments can use `latest`, but shared images should use deliberate version tags.

Developers list and remove images with:

```bash
docker images
docker rmi <image-id-or-name>
```
## Registries
A registry stores images so other machines can pull them. Docker Hub is the default public registry, but teams can also use private registries from cloud providers or internal platforms.

After an image has a registry-compatible name, a developer can publish it with:

```bash
docker push danwahlin/nodeapp:1.0
```

Other users or deployment hosts can then pull that version:

```bash
docker pull danwahlin/nodeapp:1.0
```

A registry stores image layers and tags. When a new version changes only some layers, clients can reuse unchanged local layers. This makes image distribution more efficient.
## VS Code Docker extension
The Visual Studio Code Docker extension offers a graphical way to build images, view containers, inspect files, open logs, attach a shell and connect to registries. It can build a selected Dockerfile without manually typing `docker build -f ...`.

The extension helps beginners and speeds up common tasks, but command-line knowledge remains essential. Build servers, remote hosts, minimal Linux servers and troubleshooting sessions often rely on Docker commands rather than editor features.
## Container lifecycle
Docker separates images from containers. Removing a container does not remove its image. Removing an image does not remove a running container that already uses it. This separation lets developers stop, start, inspect and delete containers without rebuilding the application image each time.

Container names improve everyday work. A generated name can identify a container, but a deliberate name such as `nodeapp` or `mongodb` makes logs, shell access and networking clearer. Names must be unique on the Docker host while the container exists.

Port conflicts happen on the host, not inside the image. Two containers may both listen on container port `80`, but they cannot both publish to host port `8080` at the same time. Publishing one container as `8080:80` and another as `8081:80` works because the host ports differ.

Detached mode suits services that should continue running while the terminal remains available. Foreground mode suits active debugging because logs stream immediately. Developers can switch between those behaviours by adding or omitting `-d`, then use `docker logs` whenever they need historical output.
## Persistent data
A container's writable layer disappears when the container is removed. Applications should not store important logs, uploads or database files only inside that layer.

Docker provides two common storage mechanisms:
- Volumes store persistent data managed by Docker.
- Bind mounts map a specific host file or directory into a container.

An anonymous Docker-managed volume can mount a path inside the container:

```bash
docker run -p 3000:3000 -v /var/www/logs nodeapp:1.0
```

A bind mount maps a known host directory to a container directory. On macOS, Linux or Windows Subsystem for Linux, `$(pwd)` expands to the current directory:

```bash
docker run -p 3000:3000 -v $(pwd)/logs:/var/www/logs nodeapp:1.0
```

In PowerShell, the equivalent syntax is:

```powershell
docker run -p 3000:3000 -v ${PWD}/logs:/var/www/logs nodeapp:1.0
```

Bind mounts are useful during development because changes on the host can appear inside the container immediately. For example, a developer can mount a local NGINX HTML directory to `/usr/share/nginx/html` and refresh the browser without rebuilding the image.

Volumes suit data that Docker should manage, such as database storage. Bind mounts suit source files, local configuration and logs that developers want to inspect from the host.
## Container networks
Multi-container applications need containers to communicate. A user-defined bridge network lets containers on the same Docker host reach each other by container name or network alias. It also isolates that application stack from unrelated containers.

A developer can create, list and remove a bridge network with:

```bash
docker network create --driver bridge isolated_network
docker network ls
docker network rm isolated_network
```

Containers join the network when Docker starts them:

```bash
docker run -d --network=isolated_network --name mongodb mongo
docker run -d -p 3000:3000 --network=isolated_network --name nodeapp nodeapp:1.0
```

The MongoDB container does not need a published host port for the Node application to reach it from the same network. Host port publishing only matters when software outside the Docker network, such as a browser or host process, must connect to the container.

Application configuration should use the container or service name, such as `mongodb`, as the database host when both containers share a user-defined bridge network.
## Shell access and troubleshooting
`docker exec` runs a command inside an existing container. Developers use it to inspect files, run diagnostic tools, test network connectivity and seed databases.

```bash
docker exec -it nodeapp sh
node dbSeeder.js
exit
```

The `-it` options create an interactive terminal session. Containers based on small Linux images often include `sh`. Other images may include `bash`, PowerShell or application-specific tools. A command can also run directly without starting a shell:

```bash
docker exec -it mongodb mongosh
```

Shell access helps diagnose database connection failures, missing files, configuration errors and networking problems.
## Running the sample stack
The manual workflow starts by building the Node image, creating a bridge network, starting MongoDB on that network and starting the Node container on the same network. The Node application publishes port `3000` to the host so a browser can reach it at `localhost:3000`. MongoDB does not need a host port for this application because only the Node container must reach the database.

After both containers start, the database seeder can run inside the Node container with `docker exec`. That command proves two things at once. The application files exist inside the container, and the Node container can resolve and connect to the MongoDB container over the Docker network.

The cleanup step stops and removes the application containers, then removes the user-defined network. Developers should remove unused containers during local work because stopped containers still occupy names and can clutter output from `docker ps -a`. Images can remain if developers plan to reuse them.
## Docker Compose
Docker Compose defines and runs a multi-container application from a YAML file. Modern Docker documentation prefers `compose.yaml`, while `docker-compose.yml` remains widely supported.

Compose turns several long `docker build`, `docker run`, volume and network commands into a small set of repeatable commands:

```bash
docker compose build
docker compose up
docker compose down
```

`docker compose build` builds images for services that define a `build` section. `docker compose up` creates and starts the services, attaches their logs by default and creates the default network if required. `docker compose down` stops and removes containers and networks created by `up`. Named volumes remain unless the command removes volumes explicitly.

A Compose file for the sample application contains two services:
- `mongodb`, based on the official MongoDB image.
- `node`, based on the local application Dockerfile.

The Node service can define a custom container name, image name, build context, Dockerfile name, build arguments, environment variables, port mapping, bind mount and network membership. It can also use `depends_on` to start MongoDB before the Node application.

`depends_on` controls startup order, not service readiness. The application should retry database connections because MongoDB may take time to accept connections after its container starts.

A simplified Compose structure looks like this:

```yaml
services:
  node:
    build:
      context: .
      dockerfile: node.dockerfile
      args:
        PACKAGES: nano wget curl
    image: nodeapp:1.0
    container_name: nodeapp
    ports:
      - "3000:3000"
    volumes:
      - ./logs:/var/www/logs
    environment:
      NODE_ENV: production
      APP_VERSION: "1.0"
    depends_on:
      - mongodb
  mongodb:
    image: mongo
    container_name: mongodb
```

Compose gives development teams a concise, repeatable way to describe a complete application stack. It improves local onboarding, reduces typing errors and gives continuous integration pipelines a clear build and run definition.
## Practical development workflow
A clear Docker workflow keeps local development predictable:
- Build the application image from a Dockerfile.
- Run the image locally with the same command options the team expects in development.
- Publish only the ports that external tools need.
- Store generated data in a volume or bind mount.
- Put related containers on a user-defined network.
- Use `docker exec` and `docker logs` for inspection.
- Replace long manual command sequences with Docker Compose once more than one container is involved.

Teams should keep Dockerfiles small, explicit and versioned with the application code. They should pin important base image versions, rebuild images when dependencies change, and publish new image tags for meaningful releases. They should also keep credentials out of images and avoid copying local dependency folders into Linux containers.

For local development, bind mounts can shorten the feedback loop because the container reads files from the host. For repeatable test and deployment runs, rebuilt images give stronger guarantees because the image contains the exact files that the process will run.
## Core command reference
```bash
# Images
docker pull <image>:<tag>
docker images
docker build -f <dockerfile> -t <image>:<tag> .
docker rmi <image>
docker push <namespace>/<image>:<tag>
# Containers
docker run -d -p <host-port>:<container-port> --name <name> <image>:<tag>
docker ps
docker ps -a
docker logs <container>
docker exec -it <container> sh
docker stop <container>
docker rm <container>
# Networks
docker network create --driver bridge <network>
docker network ls
docker network rm <network>
# Compose
docker compose build
docker compose up
docker compose down
```
## Key result
Docker gives developers a repeatable path from source code to running application stack. Dockerfiles define images. Images create containers. Registries share images. Volumes and bind mounts preserve or share data. User-defined bridge networks connect containers. Docker Compose describes and runs the full stack with a small set of commands.