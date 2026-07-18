# Docker for Software Development: React Apps
> [!NOTE]
> A practical guide to creating fast, secure, and portable React containers with live-reloading development environments, optimized multi-stage builds, Nginx-based production serving, client-side routing, and safe configuration.
## Purpose and context
Globomantics needs to improve an ecommerce portal that has grown beyond its monolithic design. The front end provides the first practical target for containerisation. Docker gives the team repeatable environments across development, testing and production, while React provides the browser interface. A useful starting point includes Docker, Node.js, npm, React, an editor and command-line knowledge.

For new React work, current React guidance favours a framework. When a project only needs a client-side single-page app, a build tool such as Vite, Parcel or Rsbuild is a better modern starting point than Create React App. Create React App remains useful for maintaining older projects and understanding legacy examples.
## Development image
A Dockerfile describes the image that runs the application. A development image normally starts from a Node base image, sets a working directory such as `/app`, copies `package.json` and the lock file, installs dependencies, then copies the application source.

This order matters. Docker can reuse the dependency layer when source files change but package files do not. The build command creates an image from the current directory as the build context, not from the Dockerfile alone.

```bash
docker build -t globo-dev .
docker run -p 3000:3000 globo-dev
```

The image can grow quickly if it includes `node_modules`, logs, temporary files or unused dependencies. A `.dockerignore` file should exclude files that Docker does not need during the build. The `docker image history` command can also show which layers add the most size, which helps teams find waste and review unexpected changes.
## Local reload with volumes
A development container should reflect source-code changes without rebuilding after every edit. A bind mount shares the local project directory with the container, so edited files appear inside `/app`.

```bash
docker run -p 3000:3000 -v "$(pwd):/app" globo-dev
```

Some Docker file-watching setups miss native file-system events across mounted volumes. Setting `CHOKIDAR_USEPOLLING=true` can make React development tooling detect changes more reliably. Polling uses more CPU than event-based watching, so it belongs in local development only. It should not appear in a production image.
## Production image with multi-stage builds
A production image should not carry development tools. A multi-stage Dockerfile separates the build environment from the runtime environment. The builder stage installs dependencies and runs the production build. The runtime stage copies only the compiled static assets into a small web-server image such as Nginx Alpine.

For Create React App, the builder usually emits static files into `build`. For Vite, the output directory is usually `dist`. The runtime image needs the generated assets and the web server, not Node.js, npm, source files or development dependencies.

This approach reduces image size, transfer time and attack surface. It also clarifies responsibility. The builder stage builds the app. The runtime stage serves the app. Smaller images pull and start faster in CI/CD systems, registries and cloud platforms.
## Production serving and routing
Nginx serves static React assets efficiently and fits well in a small runtime image. A single-page app also needs routing support. Browser requests for `/about` or `/contact` should load `index.html` so the React router can render the matching route. Without this fallback, Nginx treats those paths as missing server files and returns its default 404 page.

A custom Nginx configuration should listen on the chosen HTTP port, point the document root at the copied build output and fall back to `index.html` for unknown client routes. The application should still handle genuinely unknown routes with a user-friendly not-found screen. Production setups should also use HTTPS, appropriate HTTP headers and safe file serving.
## Configuration and environment variables
Static React builds do not read container environment variables at runtime unless the server injects configuration into the served assets. Build-time variables become part of the JavaScript bundle. Create React App exposes custom variables only when their names start with `REACT_APP_`. Vite uses the `VITE_` prefix.

Teams should never place secrets, private API keys or credentials in a browser bundle. Public endpoints and feature flags can use build-time variables, but environment-specific values often work better through runtime configuration such as a generated `config.json` or server-side placeholder replacement. This lets teams build one image and deploy it across environments.
## Operational practices
Production containers should run detached with stable names and explicit port mappings. Names make stop, inspect and log commands safer than copying short container IDs from command output.

```bash
docker run -d --name globo-web -p 80:80 globo-multi
docker stop globo-web
```

Strong Docker practice for React applications includes:
- Use multi-stage builds for small runtime images.
- Exclude `node_modules`, `.git`, logs, temporary files, build outputs and local secrets with `.dockerignore`.
- Pin image versions and tag application images consistently.
- Copy package files before source files to improve cache reuse.
- Test local routes and assets before release.
- Keep containers stateless and move persistent data outside the container.
- Scan images and avoid unnecessary packages in the final image.
- Use Docker Compose when the front end must run with APIs, databases or authentication services in one local workflow.

These practices produce React containers that are smaller, safer, easier to audit and more predictable across development, CI/CD and production deployment.