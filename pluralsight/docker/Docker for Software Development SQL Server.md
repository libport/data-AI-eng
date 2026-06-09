# Docker for Software Development: SQL Server
## Core model
A database combines a server process, persistent data and a schema that gives the data usable shape. SQL Server receives requests, processes queries and returns responses. Its data files matter, but the database also depends on tables, constraints, indexes, views, stored procedures, security objects and configuration. An empty database can still be a database because its schema can accept and organise future data.

Docker builds containers from layered images. Image layers remain read-only and each running container adds a thin writable layer. Files written to that layer disappear when the container disappears. Write-heavy workloads such as SQL Server should avoid that layer for durable database state because the storage driver adds overhead and the lifecycle does not match database persistence.

SQL Server containers suit development because they start quickly, reproduce environments reliably and reduce setup friction. They do not remove the need to handle persistence, authentication, backups, schema migration, orchestration or resource limits deliberately.
## Starting SQL Server in Docker
SQL Server container images come from Microsoft Container Registry under `mcr.microsoft.com/mssql/server`, with tags such as `2022-latest`. Microsoft supports SQL Server container images as Linux containers on supported Linux hosts. SQL Server deployments in Windows containers are not covered by Microsoft support. On Windows workstations, Docker Desktop can run Linux containers through WSL 2 or Hyper-V, so a Windows desktop can still run the Linux image.

A minimal development container needs these settings:
- `ACCEPT_EULA=Y` to accept the licence terms.
- `MSSQL_SA_PASSWORD=<password>` to set the `sa` login password.
- `-p 1433:1433` to publish SQL Server's default port.
- `--name <container>` to give the container a stable name.
- `mcr.microsoft.com/mssql/server:<tag>` to select the image.

The old `SA_PASSWORD` variable is deprecated. The password must meet SQL Server password policy. The Developer edition is the default in the quickstart scenario unless another edition or product ID is supplied through `MSSQL_PID`. A developer can then connect through SQL Server Management Studio or another client using the host port, the `sa` login and the configured password. Current client defaults often encrypt the connection, so a local development connection may need a trusted certificate or an explicit trust setting.

SQL Server Agent stays disabled by default in Linux containers. `MSSQL_AGENT_ENABLED=true` enables it when a development workflow genuinely needs Agent jobs. `MSSQL_ENABLE_HADR` enables availability group features, but availability groups also require SQL scripts, network configuration and coordinated instances.
## Authentication
SQL Server Authentication usually gives the simplest development setup. A development container can use a shared, non-production password if the database contains no sensitive data and the password never appears in source control. The better discipline is to inject the password from a secret store, environment-specific configuration or a local developer secret.

Domain-based authentication needs an identity provider and Kerberos or related identity plumbing. Active Directory authentication for SQL Server on Linux and containers uses Kerberos, a service principal name, a Kerberos configuration file and a keytab. A keytab is not a text file of hashed passwords. It is a cryptographic file that represents a Kerberos-protected service and its long-term key. Anyone who can read the keytab can impersonate the service, so the file needs strict permissions and secret handling.

Microsoft Entra options in SQL Server Management Studio serve different scenarios, especially Azure-connected workloads. For local containerised development, SQL Server Authentication normally reduces setup effort and keeps the environment reproducible.
## Persistence, backups and storage mounts
A SQL Server container that stores data only in its writable layer loses that state when the container is removed. Backups should leave the container, and database files should live outside the writable layer.

Docker offers four storage mount types for data outside the container layer:
- Volumes.
- Bind mounts.
- tmpfs mounts.
- Named pipes.

Docker-managed volumes often suit persistent, performance-sensitive data because Docker manages their lifecycle and location. Bind mounts map a host path directly into the container. A command such as `-v C:/SqlVolume/data:/var/opt/mssql/data` uses a bind mount, not a Docker-managed named volume. Bind mounts help when developers need to inspect or copy files from the host, but they depend on the host's path and operating system.

SQL Server containers commonly externalise these paths:
- `/var/opt/mssql/data` for data and transaction log files.
- `/var/opt/mssql/log` for SQL Server logs.
- `/var/opt/mssql/secrets` for certificates, keytabs and other secrets.

`docker commit` is the wrong persistence strategy for a database. A database engine may be halfway through file operations when the snapshot occurs. SQL Server backups exist because a raw file-system copy cannot guarantee a consistent database state while the engine is running.

Multiple running SQL Server containers should not point at the same live data and log files. Each SQL Server instance expects exclusive control over its database files. Multi-instance designs need database features such as backups, restores, replication, log shipping or availability groups, not shared MDF and LDF files.

Kubernetes high availability and SQL Server high availability solve different problems. Kubernetes can restart a failed pod and reattach storage through Persistent Volumes and Persistent Volume Claims. SQL Server availability groups handle database-level replication, failover and consistency between instances. A resilient production design needs both layers to do their own job.
## Schema migration
Transactional databases use schema-on-write. SQL Server enforces structure when data enters the database, which keeps data consistent and supports object-relational mappers such as Entity Framework and Hibernate. That strength complicates deployment because application code and database schema must evolve together.

Immutable infrastructure works well for application servers because a deployment can replace the whole image. A database cannot simply disappear and reappear with a new schema because the old data must survive. Deployment needs a controlled process that reconciles the current schema with the desired schema.

A single manual change shows the problem. Adding an `InStock` bit column with a default value works the first time. Running the same `ALTER TABLE` statement again fails because the column already exists. Adding conditional checks to every script creates fragile, cluttered migration code. A migration tool should track what has already run.

Flyway, DbUp, Liquibase and Entity Framework Migrations all solve the same core problem. They keep ordered migration records, compare those records with migration scripts and apply the missing changes. Flyway stores this information in `flyway_schema_history`, including the version, description, execution status and checksum.

Flyway versioned migrations run in version order and run exactly once. Once a migration reaches a shared environment, developers should not edit it. A later change should add a new migration and roll forward. This keeps checksums stable and allows every environment to reach the same target state.

Baseline handling needs care. The `baseline` command marks an existing database as starting from a chosen version and excludes migrations up to and including that baseline version. Migrations above the baseline can then run. This makes Flyway practical for existing databases, but a wrong baseline can hide missing work. `baselineOnMigrate` adds convenience and risk because it can automatically baseline a non-empty schema with no history table.

Backups and migrations complement each other. A backup restores data to a point in time. Migration scripts then bring the restored schema to the current version. Development, test and production may start from different schema versions, but a reliable migration chain can move each database to the latest expected state.

Flyway does not need a permanent local installation. A Flyway container can mount a directory of SQL migration files and receive the database URL, username and password through runtime parameters or pipeline secrets. The `info` command checks the target state. The `migrate` command applies pending work. Running the same migration command repeatedly should produce the same final schema when no new migration exists.
## Docker Compose
Docker Compose defines and runs a multi-container application from a YAML file. A Compose file can describe an application container, a SQL Server container, networks, ports, mounts, secrets and environment variables in one place. Modern Compose uses the Compose Specification and does not need the obsolete top-level `version` field.

Compose works well for local development, testing, staging, CI and simple deployments. Kubernetes or another orchestrator usually becomes the better production target when a system needs cluster scheduling, advanced rollout control, self-healing across hosts and richer operational policy. Kompose can convert many Compose files to Kubernetes resources, but the conversion is not always one-to-one.

Compose gives each service a DNS name on the project network. An application can connect to the database with a server name such as `testdb` rather than `localhost`. The application container and database container then communicate through the Compose network while the host can still publish selected ports for tools such as SQL Server Management Studio.

`depends_on` controls startup and shutdown order. Short syntax only waits for the dependency container to start. It does not prove that SQL Server has completed recovery or can answer queries. A database-dependent application should use a health check and the long `depends_on` form with `condition: service_healthy`. A minimal SQL Server health check can run a simple query such as `SELECT 1`.

Application images should keep environment-specific settings outside the image. Connection strings, passwords and certificates should come from Compose variables, mounted secret files or a secret manager. Storing database passwords in a Compose file may simplify a classroom demo, but it teaches a poor production habit.

A typical composed development stack builds the web application image, starts the SQL Server service, mounts persistent database paths and publishes only the ports that local tools need. The app should use the Compose service name for SQL Server, not the host's loopback address, because `localhost` inside a container refers to that same container.
## Resource management and observability
Resource limits belong in development as well as production. They reveal unrealistic assumptions before deployment and stop local containers from overwhelming a developer workstation. Compose can limit CPU and memory, reserve capacity and control swap behaviour.

A `cpus` value represents the number of CPU cores available to a service. For example, `0.5` allocates half a CPU core, not half of every processor in the machine. Memory limits cap RAM use. Memory reservations express expected minimum capacity. `memswap_limit` controls the total memory plus swap available when a memory limit is also set. Setting total memory plus swap equal to the memory limit effectively disables swap for that container.

`docker stats` provides live CPU, memory, network and block I/O data for running containers. `docker events` can capture lifecycle events such as starts and stops. These tools help developers build evidence-based limits instead of guessing.

Developer databases should contain generated, anonymised or disposable data. Shared development passwords and rapid restores only make sense when the dataset carries no production sensitivity. If a development copy includes real personal, financial or operational data, the authentication, network and secret controls must match that risk.

A useful SQL Server container workflow therefore has these characteristics:
- It uses the official Linux SQL Server image from Microsoft Container Registry.
- It keeps durable database state outside the writable container layer.
- It treats backups as recovery points, not schema deployment tools.
- It manages schema changes through ordered migrations.
- It keeps secrets out of source control.
- It uses Compose for repeatable local application stacks.
- It checks service health rather than assuming that a running container means a ready database.
- It measures resource use early and carries those expectations into later environments.