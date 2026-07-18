## GitHub Codespaces
> [!NOTE]
> A practical guide to creating, configuring, securing, and cost-managing reproducible cloud development environments that streamline onboarding and support building, testing, and debugging from anywhere.

GitHub Codespaces provides cloud-hosted development environments for repositories. Each codespace runs a development container on a GitHub-hosted virtual machine and can open in a browser, Visual Studio Code or GitHub CLI. A repository can store its environment configuration with its code, giving contributors a consistent set of tools, runtimes and settings without requiring the same local setup.

Codespaces supports distributed teams by reducing configuration differences and shortening onboarding. Organisations can control access, machine types, network settings, port visibility, retention and spending. Developers can select an available region and machine type, although repository settings and organisational policies may restrict the choices.

Each contributor normally works in a separate codespace, so the repository configuration provides consistency without forcing the team into one shared machine. Visual Studio Live Share can grant invited collaborators real-time access to the current editor and debugging session when joint work is required. This distinction corrects the common description of Codespaces as a shared team environment.

Applications running inside a codespace can expose development servers through forwarded ports. Codespaces often detects localhost addresses in terminal output and forwards the corresponding port automatically. A repository can also declare ports through `forwardPorts`. Port visibility can remain private, be limited to an organisation or become public, subject to organisational policy. Public ports should expose only services that are safe for unauthenticated access.
### Create a codespace
1. Open the repository and select the required branch.
2. Select `Code`, then `Codespaces`.
3. Create the codespace with the default configuration, or select `New with options` to choose a branch, dev container configuration, region and machine type.
4. Open the environment in the browser or connect through Visual Studio Code.

A codespace without a repository configuration uses GitHub's default Ubuntu-based development container, which includes common languages and tools. Larger or more complex repositories can use prebuilds to prepare source code, dependencies, extensions and setup commands before contributors create their codespaces. Prebuilds reduce creation time but consume storage and may use GitHub Actions minutes.
### Manage the lifecycle
A codespace preserves saved work on its virtual machine and can be stopped, reopened, rebuilt or deleted. Closing the browser tab does not stop it. By default, inactivity stops a codespace after 30 minutes, although personal settings or organisational policies can change the timeout for new environments.

Rebuilding applies changes from the dev container configuration. A normal rebuild can reuse cached images. A full rebuild clears the cache and uses fresh images. Files inside `/workspaces`, including the repository clone, survive a rebuild. Files stored elsewhere in the container do not.

A stopped codespace retains its saved files and incurs storage usage, while compute charges apply only while it runs. Inactive codespaces are deleted after 30 days by default, subject to personal or organisational retention settings. Contributors should commit and push valuable work before deletion because deleting the codespace removes unpushed files and commits. Codespaces requires an internet connection, although the remote environment remains available for reconnection in its last saved state.
### Configure a repository
The primary configuration file is usually `.devcontainer/devcontainer.json`. It can define:
- a container image or Dockerfile
- development container features
- language runtimes and command-line tools
- forwarded ports
- lifecycle commands such as `postCreateCommand`
- Visual Studio Code extensions and settings
- the user account used inside the container

Visual Studio Code can generate a configuration from maintained templates. A JavaScript project, for example, can start from a Node.js template and add project dependencies, linting tools, database clients or other required features. Extensions can be added under `customizations.vscode.extensions`, while editor settings can be placed under `customizations.vscode.settings`. A theme can be installed as an extension and selected with the `workbench.colorTheme` setting. GitHub Copilot can also be recommended when the project and organisation permit its use.

Changes do not affect the current container until the codespace is rebuilt. After testing the rebuilt environment and confirming that the application still runs, contributors can commit and push the configuration. Future codespaces created from that revision will use the shared setup. Project requirements belong in the repository configuration, while personal preferences are often better handled through Settings Sync or dotfiles.
### Control cost
Personal GitHub Free accounts currently include 120 Codespaces core hours and 15 GB-month of storage each month. GitHub Pro accounts include 180 core hours and 20 GB-month. Usage beyond those allowances requires billing details and an appropriate budget.

An organisation on GitHub Team or GitHub Enterprise Cloud can pay for codespaces created from its repositories after enabling billing. Codespaces is not a GitHub Enterprise Server service. Costs depend mainly on active compute time, machine size and stored data. Larger machines consume the compute allowance faster, and stopped codespaces continue to use storage until deleted. Current allowances, rates and billing controls should be checked before adoption because GitHub can change them.
### Choose between Codespaces and github.dev
Both tools edit repository files in a browser, but they serve different tasks.

| Capability | github.dev | GitHub Codespaces |
|---|---|---|
| Start-up | Opens almost immediately, including by pressing `.` on a repository or pull request | Creates or resumes a virtual machine and configures a container |
| Compute | No attached compute | Dedicated cloud compute |
| Terminal | Not available | Integrated terminal available |
| Run and debug | Not available | Supported |
| Extensions | Web-compatible extensions only | Most Visual Studio Code Marketplace extensions |
| Cost | Free | Included allowances and usage-based billing |

Github.dev suits quick file edits, source-control changes and pull-request reviews. Codespaces suits building, running, testing and debugging software in a reproducible environment.