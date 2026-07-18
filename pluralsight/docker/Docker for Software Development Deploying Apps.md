# Docker for Software Development: Deploying Apps
> [!NOTE]
> A practical guide to choosing and scaling container deployment, from Docker Compose and serverless services to managed cloud platforms and Kubernetes, while maintaining secure, repeatable, and production-ready workflows.
## Core idea
Containerised applications become easier to build, test, release and move between platforms when teams treat deployment as a model rather than a sequence of commands. Docker Compose gives that model on one Docker host. Serverless container services add managed hosting and autoscaling. Advanced container platforms add private networking, controlled rollouts and deeper operational features. Kubernetes adds the most control, density and portability, but also brings the largest operating model.

The same application image can move through each stage. The work changes from packaging code to describing how services, networks, storage, security, traffic and scale should behave.
## Docker Compose
Docker Compose defines a local application stack in YAML. Services describe containers and their images, ports, environment variables, dependencies, volumes and networks. Networks provide private communication between containers. Volumes preserve data independently of the container lifecycle. Services use Docker's internal DNS, so one container can reach another by service name.

Compose suits development, testing, continuous integration and small production workloads that can tolerate a single host. It creates isolated projects, so the same Compose file can run development, test and staging copies on one machine with different project names, ports and environment variables. It can scale a service with `docker compose up --scale service=n`, although all replicas still share one host's compute.

Compose is not a full production platform. It has no central control plane, no durable API state store and no built-in high availability. The YAML files remain the source of truth. If the host fails, the deployment fails with it.
## Compose overrides and pipelines
A single Compose model should describe the shared application structure. Override files should add environment-specific details, such as build contexts, image tags, registry names, ports and release metadata. Later files take precedence when Compose merges them, which allows one base model to support local development, CI builds, staging images and production releases.

Environment variables and `.env` files keep dynamic values out of the model. A build pipeline can inject build numbers, Git commit hashes and registry targets while developers use local defaults. YAML anchors can reduce duplication when several services need the same build arguments.

This pattern keeps environments aligned. The application structure remains stable, while configuration changes by workflow. It also prevents the drift that appears when teams copy full Compose files for each environment.
## Build and release discipline
Container deployment works best when the build, test and release path is repeatable. A pipeline should build images once, tag them with meaningful version and source-control metadata, scan them, push them to a private registry and then deploy the same image to each later environment. A production release should not rebuild from source if a tested image already exists. Promotion should move the known image digest from one environment to another.

Smoke tests can run against a temporary deployment created from the same Compose or platform model. This keeps the pipeline close to the developer workflow. The same commands that build and run a local stack can build, publish and test the application in CI. Differences should come from variables, values files and platform-specific deployment files rather than separate manual processes.

Registries should sit close to the runtime platform where possible. Pulling images from a registry in the same cloud and region reduces latency, avoids public rate limits and simplifies access control. Public registries can still distribute open images, but production pipelines should prefer authenticated registries and controlled base images.
## Production images
Production readiness starts in the Dockerfile. A working image is not necessarily a production image. Images should use current, trusted base images, avoid unnecessary packages, separate build tooling from runtime dependencies and run as a non-root user where possible. Multi-stage builds support this pattern by compiling in one stage and copying only the final artefacts into a smaller runtime image.

Smaller images improve build, push, pull and cold-start times. They also reduce cloud storage and bandwidth costs. More importantly, they reduce attack surface. Toolchains, package managers and unused binaries add vulnerabilities without adding runtime value.

Image scanning should be part of the build process. Tools such as Trivy can identify known vulnerabilities in operating system packages, application dependencies and configuration files. The practical target is not perfection. The target is to remove high and critical issues when fixes exist, document exceptions when they do not and rebuild regularly as base images and dependencies change.

Secrets need different treatment across environments. Plain text passwords in Compose files may be acceptable for throwaway local demos, but production systems should use platform secret stores such as Azure Key Vault, AWS Secrets Manager or Google Secret Manager.
## Serverless container platforms
Serverless container platforms run container images without requiring teams to manage virtual machines or container runtimes. They accept an image and a service model, provision infrastructure, attach networking, collect logs and metrics, and scale instances according to traffic or configured rules.

These services suit stateless workloads that scale horizontally, including web apps, APIs, scheduled jobs, event processors and small microservices. They usually provide fast deployment, integrated identity, managed monitoring, public endpoints and simple cost models. They also impose limits on CPU, memory, storage, operating systems and networking. Persistent state should live in managed databases, object storage or file services rather than inside container filesystems.

Serverless containers are often cheapest for low or irregular traffic. At higher, steady volumes, dedicated or shared infrastructure can be cheaper because many workloads can share capacity more efficiently.
## Azure Container Instances
Azure Container Instances is the simplest Azure option for running containers. ACI can run a single container or a Linux multi-container group. Containers in a group share a lifecycle, resources, localhost networking and storage volumes, which makes container groups conceptually similar to a Kubernetes pod.

ACI is a close fit for proof of concepts, one-off jobs, batch work, development environments and simple internal applications. It can assign a public IP address and DNS name label, authenticate to Azure Container Registry with managed identity and run Linux or Windows containers, although multi-container groups are Linux-only.

ACI does not provide the orchestration features expected from a larger platform. Standard container groups do not provide native horizontal scaling, traffic splitting or managed HTTPS for an application endpoint. TLS can be added through a sidecar or a reverse proxy, but the platform does not offer the same ingress model as Azure Container Apps.

Preview NGroups extend ACI with features such as multiple related container group instances, rolling upgrades and load balancing, but teams that need production microservice operations should normally assess Azure Container Apps or Kubernetes.
## AWS App Runner
AWS App Runner runs containerised web applications and APIs from source repositories or container images. It creates a service, supplies an HTTPS endpoint, integrates with Amazon ECR and scales instances according to concurrent HTTP requests.

App Runner uses a service-oriented model rather than a Compose-style multi-container group. A distributed application usually becomes several App Runner services plus managed dependencies such as Amazon RDS. Services can access private AWS resources through VPC connectors. App Runner can also expose a private service through a VPC ingress connection, but it does not give multiple services a shared localhost namespace.

Its pricing model is useful for sporadic web traffic. App Runner charges for provisioned memory while instances are idle and charges for CPU and memory when instances actively process requests. This avoids the cold start profile of strict scale-to-zero services while reducing cost for idle applications.

App Runner suits teams that want a simple AWS-native path for web services and APIs. More complex networking, rollout control and infrastructure composition usually push AWS workloads towards ECS with Fargate or EKS.
## Google Cloud Run
Google Cloud Run is Google's serverless container platform for services and jobs. Each deployment creates an immutable revision. Traffic can shift between revisions for canary releases, blue-green releases and rollbacks. Revisions that receive no traffic do not consume resources unless minimum instances are configured.

Cloud Run scales quickly and can scale to zero. That makes it cost-effective for development environments, proof of concepts and sporadic APIs. The trade-off is cold-start latency after idle periods. Minimum instances can keep capacity warm when latency matters.

Cloud Run provides HTTPS, per-service URLs, IAM-based access control, private connectivity to Google Cloud resources and event-based integrations through Google Cloud services. It is not Google's only managed container platform, because Google Kubernetes Engine remains the managed Kubernetes option. Cloud Run is the simpler serverless choice when applications fit its service model.
## Advanced managed platforms
Simple serverless platforms become limiting when applications need private service-to-service communication, internal DNS, traffic management, canary releases, blue-green releases, event-based scaling and richer security controls. Azure Container Apps and Amazon ECS with Fargate cover this middle ground between simple serverless services and full Kubernetes.

They still avoid direct server management. Teams describe desired state, scaling rules, networking and security, then the platform runs containers and manages replicas. The trade-off is different on each cloud. Azure Container Apps packages more of the application platform into the product. ECS with Fargate exposes more building blocks and requires more explicit infrastructure design.
## Operations and observability
Managed container platforms provide logs, metrics and health state, but teams still need an operating model. Health checks should prove that a component can serve real traffic, not merely that the process is running. Readiness checks prevent traffic from reaching containers that have not finished starting. Liveness checks allow the platform to restart failed instances.

Autoscaling should match the workload. HTTP services often scale on concurrency or CPU. Workers often scale on queue length. Batch jobs may need scheduled capacity rather than reactive scaling. Minimum replica settings protect latency but increase cost. Maximum replica settings protect budgets and downstream systems.

Release safety depends on routing control. Rolling updates suit simple upgrades. Canary releases expose a small share of traffic to a new version while monitoring behaviour. Blue-green releases keep two complete environments available and switch traffic when the new one is ready. Fast rollback matters because a technically successful deployment can still fail under real users or real data.
## Azure Container Apps
Azure Container Apps groups services inside a Container Apps environment. That environment provides the networking boundary, observability integration and optional virtual network integration. Internal container apps stay private. External container apps receive public HTTPS endpoints with managed certificates.

Container Apps supports revisions, multiple active revisions, traffic splitting and quick rollback. A new revision can receive a small percentage of traffic as a canary. If the revision fails health checks, traffic remains on the healthy version. This gives production-grade release control without manually managing a load balancer.

Autoscaling uses KEDA-based triggers, including HTTP concurrency, queue length and other event sources. Services can scale independently and can scale to zero when configured with a minimum replica count of zero. Dapr integration adds service invocation, state and messaging abstractions for teams that want them.

Container Apps is a strong choice for Azure microservices that need private networking, managed ingress, event-driven scaling and straightforward Infrastructure as Code through Bicep or ARM templates.
## ECS with Fargate
Amazon ECS with Fargate separates orchestration from server management. ECS defines clusters, services, task definitions and tasks. Fargate supplies serverless compute for the tasks, so teams do not manage EC2 instances for the container hosts.

A task definition describes the container image, CPU, memory, environment variables, ports, logging, IAM roles and networking mode. A service keeps the desired number of tasks running and manages deployments. Fargate tasks use `awsvpc` networking, which gives tasks elastic network interfaces in configured subnets.

ECS usually requires explicit supporting infrastructure, including VPCs, subnets, security groups, service discovery, load balancers and target groups. That adds complexity, but also gives strong control. An Application Load Balancer can route traffic between blue and green target groups. CodeDeploy can manage ECS blue-green deployments with canary, linear or all-at-once traffic shifts.

Fargate charges for provisioned vCPU and memory while tasks run. Fargate Spot can reduce costs for fault-tolerant workloads. ECS with Fargate suits AWS teams that need flexible production architecture without operating container hosts.
## Configuration, storage and identity
Configuration should be explicit but not hardcoded. Environment variables, Compose override files, Helm values files and Infrastructure as Code parameters should hold values that differ by environment. The model should show what the application needs, while the deployment system supplies where it runs and which external resources it uses.

Storage choices reveal the boundary between containers and platforms. Containers should be disposable. Volumes, claims and managed database services carry durable state. Local ephemeral storage can improve performance through caching, but it should not become the only copy of important data. Cloud platforms implement storage differently, so portable application models often need environment-specific storage class or service settings.

Identity should replace stored credentials wherever the platform supports it. Managed identities, IAM roles and workload identity integrations let code reach registries, databases, queues and secret stores without embedding passwords in files. This matters more as deployments move from local demos to shared test systems and production.
## Kubernetes
Kubernetes provides the broadest container platform. It runs locally, on-premises and across managed cloud services such as AKS, EKS and GKE. The API models compute, networking, configuration and storage through declarative resources.

Pods are the smallest deployable units and can contain one or more containers that share network and storage context. Deployments manage replica counts, rolling updates and replacement pods. Services provide stable DNS names and virtual IPs for ephemeral pods. Persistent volumes and persistent volume claims abstract storage from the pods that consume it. Storage classes let each cluster map storage requests to platform-specific implementations.

The Kubernetes API is portable, but real deployments often use cloud-specific storage classes, ingress controllers, identity integrations and load balancer behaviour. Kubernetes improves portability, yet it does not make cloud providers interchangeable without engineering discipline.

Plain manifests become repetitive because YAML does not provide variables. Helm packages templates and default values into charts, then lets teams override values for each environment. The same chart can run local, test and production deployments with different image tags, replica counts, resources, ports, storage classes and ingress settings.
## Azure Kubernetes Service
Azure Kubernetes Service runs Kubernetes with an Azure-managed control plane and Azure VM node pools. The control plane contains the API server, scheduler and other management components. Node pools run workload pods and can use different VM sizes, CPU architectures and operating systems.

AKS integrates Kubernetes abstractions with Azure services. A load balancer service can provision an Azure Load Balancer and public IP address. The cluster autoscaler can add or remove nodes in a node pool when pods cannot be scheduled or capacity sits unused. Horizontal pod autoscaling can increase or reduce pod replicas based on metrics. Azure storage classes can provision managed disks or Azure Files for persistent volume claims.

Ingress adds production HTTP routing. In AKS, an ingress controller such as Application Gateway Ingress Controller can map Kubernetes ingress rules to Azure Application Gateway. That allows a single public entry point to route requests to internal services by host or path.

AKS reduces the burden of running Kubernetes, but it does not remove platform ownership. Teams still choose node pool design, upgrade timing, security posture, add-ons, cost controls and operational practices.
## Why Kubernetes remains relevant
Kubernetes earns its complexity when teams need density, advanced governance, platform extensibility and multi-environment consistency. It can host many applications in one cluster, route traffic through ingress, attach varied storage, enforce policies and integrate with service meshes and GitOps controllers.

Gatekeeper and other policy engines can block unapproved images or root containers. Istio and Linkerd can add mutual TLS, retries, circuit breaking, traffic splitting and tracing. Flux and Argo CD can make Git the source of truth and continuously reconcile clusters against declared state.

Kubernetes is not the best default for every application. Compose is simpler for local development. ACI, App Runner and Cloud Run are faster for small stateless services. Container Apps and ECS with Fargate handle many production needs with less platform engineering. Kubernetes becomes compelling when the organisation needs a platform, not only a place to run containers.
## Platform selection
Choose the smallest platform that meets the operational requirements.

- Use Docker Compose for local development, integration testing, CI smoke tests and simple single-host deployments.
- Use Azure Container Instances for short-lived tasks, proofs of concept and simple container groups.
- Use AWS App Runner for simple HTTPS web services and APIs on AWS.
- Use Google Cloud Run for stateless services, scale-to-zero economics and revision-based traffic management.
- Use Azure Container Apps for Azure microservices that need internal ingress, revisions, event-driven scaling and managed HTTPS.
- Use ECS with Fargate for AWS architectures that need explicit networking, load balancing and controlled deployment patterns.
- Use Kubernetes when portability, density, ecosystem extensibility and platform control justify the extra complexity.

Containers make these moves practical because the image stays stable. The deployment model changes as the application moves from a laptop to Compose, from Compose to serverless containers, from serverless containers to advanced managed platforms and, when needed, to Kubernetes.