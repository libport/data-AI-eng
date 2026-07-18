# Docker for Software Development: Docker Compose
> [!NOTE]
> A practical introduction to defining, building, running, networking, scaling, and troubleshooting multi-container applications as a single repeatable stack with Docker Compose.
## Purpose
Docker Compose defines and runs multi-container Docker applications from a Compose file. It helps developers describe an application once, then build images, start services, view logs, enter containers, scale selected services and remove runtime resources with repeatable commands.

A typical application may include a web client, one or more APIs, a database, a cache and a reverse proxy. Containers make those components more consistent across local development, testing, staging and production. Compose adds coordination. Instead of typing a separate `docker build`, `docker run`, `docker network create` and `docker push` command for each component, developers define services, networks, volumes, ports and runtime settings in YAML and manage the stack as one project.

Compose suits developers who already understand images, containers, Dockerfiles and command-line work. Docker Desktop includes the Compose CLI, and the command form is `docker compose`, followed by a subcommand such as `build`, `up`, `down`, `logs` or `exec`.
## Core application model
A Compose project usually centres on a `compose.yaml` file. Docker also supports names such as `docker-compose.yml`, but the current Compose specification favours `compose.yaml`. The file describes the application model. Its most common top-level elements include:
- `services`, which define the application components
- `networks`, which define explicit communication networks
- `volumes`, which define persistent or shared storage
- `configs` and `secrets`, which supply configuration material when the platform supports them

A service is not the same thing as a single container. A service defines how Compose creates and runs one or more containers for a component. For example, a `node` service may describe the image, build context, environment variables, published ports, mounted volumes and networks for a Node.js API. A `mongodb` service may use an existing MongoDB image and attach to the same network so the API can connect to the database by service name.

Compose creates a default network for a project unless the file defines another network. Explicit networks become useful when the application needs clearer boundaries, specific names, custom drivers or separate communication paths.
## YAML fundamentals
Compose files use YAML, a human-readable data serialisation format. YAML relies on structure, not braces and commas. Indentation carries meaning, so spacing must remain consistent. Developers should use spaces rather than tabs.

YAML commonly uses maps and lists. A map pairs a key with a value, such as `image: node:alpine`. A list uses hyphen-prefixed items, such as a sequence of ports or environment files. Maps can contain other maps, and lists can contain maps. Compose uses this structure to express service definitions clearly.

A minimal service definition may name an image, map ports and attach a volume. A more complete service definition may add build instructions, environment variables, dependencies, restart policies and network membership.
## Building images
Compose can build one or many images from Dockerfiles. The `build` section tells Compose how to run the image build process. It commonly includes:
- `context`, which sets the build context path
- `dockerfile`, which identifies the Dockerfile relative to the build context
- `args`, which supplies build-time values

The canonical Dockerfile name is `Dockerfile`. Compose can use another filename when the service sets `dockerfile`, such as `node.dockerfile`.

The `image` field names and tags the image that Compose builds or pulls. Developers should use meaningful tags rather than relying on `latest` for repeatable development and deployment. A registry-qualified name, such as an account or organisation prefix plus an image name, lets `docker compose push` publish the image to the right registry after login.

A service may build a local image, use an existing registry image or combine both behaviours. For example, a Node.js service may build from project source, while a MongoDB service may pull an official image. Larger applications can build several customised services, such as NGINX, Node.js, MongoDB and Redis, from one Compose file.

The basic build command is:

```bash
docker compose build
```

Developers can build a single service by adding the service name:

```bash
docker compose build node
```

When service definitions include `image` names, Compose tags built images accordingly. If the build context, Dockerfile or source files change, developers rebuild the relevant services before running them again.
## Pushing images
After building tagged images, developers can publish them to a registry with:

```bash
docker compose push
```

Compose pushes services that have image names configured. A single service can be pushed by naming it after the command:

```bash
docker compose push node
```

This approach reduces repeated `docker push` commands and keeps registry naming in source-controlled configuration. It works best when the Compose file uses clear image names and versioned tags.
## Running and removing services
Compose starts a project with:

```bash
docker compose up
```

This command creates and starts containers for services, starts linked or dependent services where needed, and attaches log output to the terminal. When the terminal session ends with an interrupt, Compose stops the containers.

Detached mode keeps containers running in the background:

```bash
docker compose up -d
```

Compose removes the project with:

```bash
docker compose down
```

By default, `down` removes service containers, declared networks and the default project network. It does not remove external networks or external volumes. It also does not remove named volumes unless developers use the relevant option. This distinction matters because databases and other stateful services often require persistent storage.

Compose can also stop and start services without deleting containers:

```bash
docker compose stop mongodb
docker compose start mongodb
```

The project status appears with:

```bash
docker compose ps
```

The `-a` option also shows stopped containers.
## Ports
Port publishing connects host traffic to a container. The usual format maps a host port to a container port:

```yaml
ports:
- "8080:80"
```

The left side is the host port. The right side is the container port. A browser request to `localhost:8080` reaches port `80` inside the container.

Not every service needs a published port. Internal services can communicate across a Compose network without exposing a host port. For example, an API can talk to a database through the database service name on the project network, while only the web frontend or proxy publishes a host-facing port.

Scaling requires extra care. If a service runs multiple replicas, fixed host port mappings can conflict because only one container can bind to a specific host port at a time. Developers can omit the host side and let Docker assign available host ports, or place a load balancer or reverse proxy in front of the replicas.
## Volumes
Containers usually lose writable layer changes when they are removed. Volumes and bind mounts preserve or share data outside the container lifecycle.

A bind mount maps a host path into a container path:

```yaml
volumes:
- ./logs:/var/www/logs
```

This mount lets application logs written inside the container appear in the project directory on the host. Named volumes provide a Docker-managed storage location and suit database data. External volumes let Compose use storage that it does not create or remove.

Developers should choose storage deliberately. Logs, source files and local development folders often use bind mounts. Database state usually uses named volumes. Temporary containers can use no persistent volume when data does not need to survive removal.
## Environment variables and configuration
Environment variables let the same image run with different settings across environments. Compose can define them directly:

```yaml
environment:
- NODE_ENV=production
- PORT=3000
```

Compose can also load variables from one or more files:

```yaml
env_file:
- .env
- .env.production
```

Environment files reduce repetition when services need many values. They also help teams switch between development and production settings without editing service definitions.

Sensitive values need careful handling. Environment variables can leak through process listings, logs or configuration files. Secrets should use supported secret-management features or the deployment platform's secret store where possible. Local examples may use environment variables for convenience, but production systems require stronger controls.
## Networks
Networks let services communicate. Compose gives each project a default network, and services on that network can resolve each other by service name. A Node.js service can connect to `mongodb` when both services share the same project network and the database listens on its internal port.

Explicit networks help when the project needs isolation or clearer architecture:

```yaml
networks:
  app-network:
    driver: bridge
```

A service joins the network by listing it under `networks`. The `bridge` driver suits local single-host development. Other drivers and platform features may suit different deployment targets.

A network definition is not only a communications shortcut. It documents the intended boundaries between components. For example, an API may share a backend network with the database, while a reverse proxy shares a frontend network with the API.
## Dependencies and readiness
The `depends_on` attribute controls startup and shutdown order. If the `node` service depends on `mongodb`, Compose starts MongoDB before Node and stops Node before MongoDB.

Startup order does not always mean readiness. A database container can start before it accepts connections. Applications should include retry logic, and production-grade Compose files should use health checks or supported wait options where appropriate. The `docker compose up --wait` option can wait for services to be running or healthy when the project defines suitable health checks.

The `--no-deps` option starts a service without starting linked services. This helps during development when a database already runs and only an application service needs to be recreated:

```bash
docker compose up -d --no-deps node
```
## Logs and troubleshooting
Compose collects service logs in one place. Attached `docker compose up` streams logs for the project. Detached projects use:

```bash
docker compose logs
```

A service name narrows the output:

```bash
docker compose logs mongodb
```

The `--tail` option limits older output, and `--follow` streams new entries:

```bash
docker compose logs --tail 50 --follow node
```

This matters in multi-container applications because failures often span more than one service. A frontend error may trace to an API, a database connection or a cache. Compose logging gives developers a quick project-wide view before they inspect individual containers.
## Shell access
Developers often need to inspect a running container, test a command, seed a database or check network access. Docker supports this with `docker exec`. Compose simplifies it by using service names:

```bash
docker compose exec node sh
```

The shell available inside the container depends on the image. Alpine-based images commonly use `sh`, while other images may include `bash`. Once inside, developers can run tools such as `curl`, inspect files, check environment variables and verify that the service can reach its dependencies.

Shell access should support diagnosis, not become the main way to change application state. Durable fixes belong in source code, Dockerfiles, Compose files or database migration scripts.
## Scaling services
Compose normally creates one container per service. Developers can run multiple containers for a service with the command-line scale option:

```bash
docker compose up -d --scale node=5
```

The Compose service `scale` setting can also define the desired number of replicas. Command-line scaling overrides the file setting for that run.

Scaling in local Compose helps teams test concurrency, load balancing behaviour, failure recovery and service discovery. It does not replace an orchestrator such as Kubernetes for production scheduling across many hosts, but it gives developers a practical simulation environment.

Published ports require care when scaling. Fixed host ports usually prevent multiple replicas of the same service from starting. A reverse proxy, load balancer or dynamic host port assignment avoids this conflict.

Restart policies add resilience during local experiments:

```yaml
restart: on-failure
```

If a container exits with an error, Docker can restart it according to the policy. Developers can then test recovery by stopping or killing one replica and watching Compose recreate or restart the service.
## Example service shape
A small Compose file can express most of the concepts at once:

```yaml
services:
  node:
    image: example/nodeapp:1.0
    build:
      context: .
      dockerfile: node.dockerfile
      args:
        PACKAGES: "nano wget curl"
    environment:
    - NODE_ENV=production
    - PORT=3000
    ports:
    - "8080:3000"
    volumes:
    - ./logs:/var/www/logs
    networks:
    - app-network
    depends_on:
    - mongodb

  mongodb:
    image: mongo:latest
    volumes:
    - mongo-data:/data/db
    networks:
    - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo-data:
```

This structure names two services. The Node service builds a custom image and publishes a host port. The MongoDB service uses an existing registry image and stores database files in a named volume. Both services join the same bridge network, so the Node application can connect to the database through the `mongodb` service name. The dependency list helps Compose start services in a useful order, while the application still needs retry logic because startup order does not prove readiness.

This kind of file gives a repository a clear operational entry point. The Compose file records how the system should run, not only how the source code should compile. Developers can review changes to runtime behaviour in pull requests, and teams can compare development, test and demonstration setups with less guesswork.
## Development and automation value
Compose works well for local development because it reduces environment drift. Each developer can run the same database version, cache version, proxy settings and application image definitions. Teams spend less time explaining manual setup steps and more time changing application behaviour.

Compose also helps automated workflows. A continuous integration job can build images, start dependent services, run integration tests, collect logs after failure and tear the project down. The same commands that support a local workstation can support a test runner when the runner has access to Docker. This does not make Compose a complete production deployment platform, but it gives teams a practical bridge between development and automated verification.

Modern Compose can also watch source files and rebuild or refresh services during development when the file defines watch rules. The command `docker compose up --watch` starts the project and enters watch mode. This supports a faster edit-test loop, especially for applications where container rebuilds or file synchronisation form part of the normal workflow.
## Practical workflow
A practical Compose workflow keeps the application definition in version control and uses repeatable commands:
1. Define services, networks, volumes, ports and configuration in `compose.yaml`.
2. Build custom images with `docker compose build`.
3. Start the project with `docker compose up` or `docker compose up -d`.
4. Inspect status with `docker compose ps`.
5. Troubleshoot with `docker compose logs` and `docker compose exec`.
6. Rebuild or restart only the services that changed.
7. Remove project resources with `docker compose down` when the environment is no longer needed.

Compose improves productivity because it makes the runtime architecture visible, repeatable and shareable. A new developer can clone the repository, run a small set of commands and start the same collection of services. A team can review changes to build settings, ports, volumes and dependencies in source control instead of relying on undocumented terminal commands.
## Key cautions
- Prefer `compose.yaml` for new projects, while recognising that `docker-compose.yml` remains common.
- Treat a service as a definition that can create one or more containers.
- Use explicit networks only when the default network does not express the needed design.
- Publish only the ports that host users or tools must reach.
- Use named volumes for persistent data and understand what `docker compose down` removes.
- Use tags that support repeatability rather than relying on `latest`.
- Do not assume `depends_on` proves that a dependency is ready.
- Protect secrets with proper secret stores or platform features.
- Use local scaling to test behaviour, not as a full production orchestration strategy.