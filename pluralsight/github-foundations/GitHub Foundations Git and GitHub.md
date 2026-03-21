# GitHub Foundations: Git and GitHub
## Course purpose and expected capabilities
The course introduces Git and GitHub as complementary tools for version control and collaboration. Git manages version history locally, while GitHub hosts Git repositories and adds review, project management, and automation features.
## Module 1: Version control with Git
### Why version control exists
Version control addresses recurring problems in software work:
- accidental loss of work, caused by overwriting files or deleting the wrong version
- unclear provenance, where it is difficult to explain who changed something and why
- risky collaboration, where changes are shared informally and become hard to reconcile
- uncertain release history, where the content of a past deployment cannot be recreated
- limited experimentation, where reverting is difficult

Git stores history so that work can be reviewed, compared, restored, and released predictably. It also makes collaboration safer by recording change sets as commits that can be shared, reviewed, and merged.
### Centralised and distributed models
Older tools often used a centralised model, where a server held the authoritative history and developers worked against it. Examples include Subversion and other similar systems. Git is distributed, so each developer can have a full local copy of history. This supports offline work for many tasks and reduces reliance on continuous access to a central server.

Distributed history also changes collaboration habits. Rather than locking files, Git encourages parallel work through branching, then resolving differences through merges and reviews.
### What Git is
Git is a distributed version control system created in 2005 for large scale collaborative development. It is widely used because:
- local operations such as viewing history and creating commits are typically fast
- branching is lightweight and encourages parallel development
- history is content-addressed, improving integrity and traceability
- it scales from small projects to large repositories

Git can introduce a learning curve, particularly for developers unfamiliar with command line workflows or branching and merging concepts. Large binary assets and generated artefacts can also be awkward to manage without extra practices.
### Core Git terms used in the course
#### Repository, working tree, and the `.git` directory
A Git repository is a project managed by Git. On disk, Git stores metadata, references, and objects in a hidden `.git` directory. The working tree is the visible project directory that contains editable files.
#### The staging area and why it exists
The staging area, also called the index, holds the set of changes that will be included in the next commit. Staging supports:
- partial commits, where only selected files or changes are committed
- deliberate commit boundaries, keeping unrelated changes separate
- review before committing, using diffs of staged content
#### Commits, hashes, and references
A commit records a snapshot of the project plus metadata such as author, timestamp, and a message. Commits are identified by a hash. The hash can be used to reference a commit precisely, and the same content produces the same identifier.

Git tracks the current position in history through references:
- `HEAD` points to the currently checked-out branch, or directly to a commit in a detached state
- branch names point to commits and move forward as new commits are added    
- tags point to commits but are typically fixed to mark releases or milestones
#### Objects and snapshots
Git represents repository content through objects. In simplified terms:
- blobs store file contents
- trees store directory structure and point to blobs and other trees
- commits point to a tree and to parent commits, capturing project state and lineage
- tags provide named references, often with release metadata

Commits form a chain through parent links. Merge commits can have multiple parents, representing the merging of history from different branches.

Git stores objects in a way that supports integrity checking and efficient transfer. Over time, objects can be packed to reduce duplication and to compress repeated content.
### File states and the common workflow
Git commonly describes file state as:
- untracked, not yet part of the repository
- modified, changed in the working tree
- staged, selected for the next commit
- committed, recorded in repository history

A practical workflow in the course follows a repeated pattern:
1. create or edit files in the working tree
2. inspect changes and repository state
3. stage changes deliberately
4. create a commit with a clear message
5. synchronise with a remote when collaboration requires it
### Installing Git and configuring identity
Git requires local installation and basic configuration. Configuration is stored at multiple levels:
- system-wide configuration    
- user-level configuration, often called global configuration
- repository-level configuration

User identity is set so commits can be attributed correctly:
```bash
git config --global user.name "Name Surname"
git config --global user.email "name@example.com"
```

Git can be configured to use a preferred editor for operations such as commit messages and merge prompts:
```bash
git config --global core.editor "code --new-window --wait"
```
### Creating a repository and making the first commit
The course demonstrates initialising a repository and building history.

```bash
mkdir -p ~/code/example
cd ~/code/example
git init
git status
```

After creating content, changes are staged and committed:
```bash
git add README.md
git commit -m "Add README"
```

The `git status` output is used frequently to understand current state. The log is used to inspect history:
```bash
git log
```

A shorter history view can be created by adding options, such as displaying a single line per commit:
```bash
git log --oneline
```
### Inspecting and comparing changes
Reviewing changes before committing:
- `git diff` compares the working tree to the staging area
- `git diff --staged` compares staged changes to the last commit

Example usage:
```bash
git diff
git diff --staged
```

Git can also show changes for a specific commit or file:
```bash
git show <commit>
git show <commit>:path/to/file
```
### Writing useful commit messages
Commit messages are a part of project communication. Effective messages tend to:
- describe what changed, rather than how the developer felt about it
- keep unrelated changes in separate commits
- avoid vague text such as “fix stuff” or “changes”
- use consistent conventions across a repository
### Moving and removing files
Git tracks content changes, including moves and deletions. Typical commands include:
```bash
git mv oldname.txt newname.txt
git rm obsolete.txt
git status
git commit -m "Rename file and remove obsolete content"
```
### Undoing and correcting history safely
Undo operations are part of normal development. The appropriate action depends on whether commits have been shared.

Common scenarios include:
- unstage changes while keeping work in the working tree
- discard local modifications to return to the last committed state
- revert a commit by creating a new commit that undoes it, which is safer for shared history
- reset to move the branch pointer locally, which requires care when history has been pushed

These actions are tools for reducing risk during experimentation and incremental delivery.
### Working with remotes
Git distinguishes between local history and remote history. A remote is a named reference to another repository location, often a GitHub repository.

Common remote operations include:
- viewing configured remotes
- fetching remote updates
- pushing local commits to a remote branch

Examples:
```bash
git remote -v
git fetch origin
git push origin main
```

Remote tracking connects a local branch to a remote branch, supporting simpler push and pull behaviour.
### Branching, merging, and conflicts
Branches support parallel work. A branch can be created for a feature, fix, or experiment so that the default branch stays stable.

Creating and switching:
```bash
git checkout -b feature/add-instructions
```

Switching back:
```bash
git checkout main
```

Merging integrates changes. Git can fast-forward when no divergence exists, or create a merge commit when both branches have new commits:
```bash
git merge feature/add-instructions
```

Conflicts occur when different changes affect the same lines. Conflict resolution typically involves:
- reviewing conflict markers in the affected files
- choosing or reconciling the intended content
- staging the resolved files
- completing the merge, then pushing the result

Git also supports tagging commits to mark versions, which becomes relevant when GitHub releases and versioned artefacts are discussed.
## Module 2: Getting started with GitHub
### GitHub background and purpose
GitHub launched in 2008 as a platform for hosting Git repositories and supporting collaboration. It is now widely used across commercial, government, and open source work. Microsoft acquired GitHub in 2018, while GitHub continues to operate as a platform for developers and organisations.
### What GitHub provides beyond Git
GitHub hosts repositories and provides collaboration features around Git. Features highlighted in the course include:
- pull requests as the primary review and merge mechanism
- issues for capturing bugs, tasks, and discussion threads
- actions for automation, including test and build workflows
- projects for organising work as boards and roadmaps
- discussions for community question and answer
- repository insights, traffic, and activity graphs
- security tooling, including dependency and vulnerability features

GitHub also supports gists for sharing snippets and GitHub Pages for static site hosting from repositories.
### Navigating GitHub
The course introduces key navigation areas:
- the top search bar, used to search repositories, code, and more
- the user dashboard, which lists recent activity and repositories
- the user profile, including pinned repositories and contribution activity
- repository pages, including commits, branches, and tags
- repository tabs such as Code, Issues, Pull requests, Actions, Projects, Wiki, Security, Insights, and Settings
- notifications, which track mentions, pull request activity, and watched repositories

The repository interface also exposes common signals:
- Star, a bookmarking and interest signal
- Watch, a way to receive notifications about activity
- Fork, a way to create a copy for independent work and contribution
### Accounts and plans
GitHub accounts and billing concepts are introduced:
- Personal accounts represent individuals.
- Organisations represent groups and provide shared ownership and permission controls.
- Enterprise layers manage policies and billing across multiple organisations.

Plan types are described at a high level, including free and paid options that influence limits and advanced controls.
### Profile and security hygiene
Security related settings such as:
- enabling two-factor authentication
- reviewing the security log for account events
- understanding how credentials are used for remote access
- managing tokens and keys with care so repository access remains controlled

The role of authentication is important in preventing unauthorised access and reducing the risk of compromised accounts.
### Connecting to GitHub with SSH
GitHub supports remote operations over HTTPS or SSH. SSH uses a key pair rather than a password and supports secure non-interactive authentication.

The course workflow includes:
1. locating existing keys in `~/.ssh`
2. generating a new key pair when needed
3. starting the SSH agent and adding the private key
4. adding the public key to GitHub account settings
5. testing connectivity

Example commands:
```bash
ls -al ~/.ssh
ssh-keygen -t ed25519 -C "name@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh -T git@github.com
```

SSH keys are treated as sensitive credentials. Private keys remain on the local machine, while only the public key is uploaded to GitHub.
### Searching GitHub effectively
Because GitHub contains a large volume of repositories and code, search is treated as a core skill.

Search approaches:
- global search across repositories, code, issues, and pull requests
- scoped search within a repository
- filtering by result type

Qualifiers:
- stars and forks to identify popular repositories
- language filters to narrow code search
- ranges for numeric filters
- exclusion terms to remove common patterns

Examples:
```text
dotnet stars:>1000
dotnet stars:10..50
dotnet -"hello world"
language:C# forks:10..1000
```

Search is useful for discovering patterns, learning from examples, and finding libraries, templates, and configuration references.
## Module 3: Working with repositories and collaboration
### Creating repositories
Repositories are the core unit in GitHub. A repository can be created in GitHub and cloned locally, or started locally then pushed to GitHub.

When creating a repository, key choices include:
- name and description
- visibility, public or private
- initial content, often a README
- a `.gitignore` template appropriate for the language or tooling
- a licence, clarifying reuse rights

A README can document purpose, prerequisites, setup instructions, usage examples, contribution guidance, and contact information. A `.gitignore` prevents accidental commits of build artefacts, logs, local secrets, and editor files. A licence clarifies reuse permissions and expectations for distribution.
### Working with files in GitHub
GitHub can display and edit files in the browser:
- browsing directories and file history    
- viewing blame information to see line-by-line attribution
- editing a file and committing changes through the web interface
- adding new files and folders in the repository UI

Web editing is useful for small documentation changes, quick fixes, or triage, while most development continues locally for efficiency and tooling support.
### Cloning, adding files, and pushing
A standard workflow begins with a clone:
```bash
git clone git@github.com:owner/repo.git
cd repo
```

After editing, a typical commit flow is:
```bash
git status
git add .
git commit -m "Add initial project files"
git push origin main
```

Note the relationship between local branches and remote branches. The default remote name is often `origin`, and the default branch is commonly `main`.
### Fetching, pulling, and staying up to date
Remote updates are integrated using:
- `git fetch` to download remote commits without modifying the working tree
- `git pull` to fetch and then merge into the current branch

```bash
git fetch
git status
git pull
```

If a push is rejected, it usually indicates the remote has new commits. Integrating those commits first reduces the risk of overwriting others’ work. Conflicts can occur when concurrent changes affect the same content and must be resolved before the merge can complete.
### Branching workflows and pull requests
Branches isolate work and reduce risk to the default branch. The course uses feature branches as the primary example:
```bash
git checkout -b feature/add-docs
```

After commits are made, the branch is pushed and set to track a remote branch:
```bash
git push -u origin feature/add-docs
```

GitHub workflows then encourage opening a pull request to:
- compare the feature branch with the base branch
- run automated checks if configured
- request review from collaborators or teams
- discuss changes in a structured thread
- merge the branch when ready and optionally delete it

Pull request templates and checklists are presented as useful for consistency. Reviews can include inline comments, overall approvals, or requests for changes.
### Forks, contributors, and contribution models
Distinguish between direct collaboration and fork-based contribution:
- Collaborators can be granted direct access to push branches.
- External contributors often fork a repository, push changes to the fork, then open a pull request back to the original repository.

Forking keeps the original repository protected while still enabling broad contribution. This is a common model for open source projects where many contributors participate.
### Template repositories
Template repositories provide a starting point for new projects. Marking a repository as a template enables new repositories to be created from its structure without keeping a fork relationship. This supports consistent project scaffolding, such as standard README sections, folder layouts, licences, and workflow files.
### Repository files that GitHub recognises
GitHub detects specific filenames and surfaces them in the interface to guide collaboration and governance.

Common files include:
- `README.md`, shown on the repository landing page.
- `LICENSE`, used to display licensing terms.
- `CONTRIBUTING.md`, contribution expectations and workflow.
- `CHANGELOG`, a list of notable changes by version.
- `SUPPORT.md`, support channels and contact options.
- `CODE_OF_CONDUCT.md`, behaviour expectations for participants.
- `CODEOWNERS`, a mapping from paths to required reviewers.
- issue templates and pull request templates, which can live under `.github`

These files can live in the repository root or in conventional locations such as a `docs` folder or a `.github` folder, depending on the file type and repository conventions.

`CODEOWNERS` uses path patterns to associate areas of the repository with individuals or teams. This helps route reviews to the right people and supports accountability in large repositories.
### Repository settings and signals
Following are repository features that improve governance and discovery.

Discovery and communication:
- Topics describe a repository’s domain and improve discovery.
- Stars allow users to bookmark and signal interest.
- Watching repositories increases notifications about activity.
- Releases can be created from tags to package and communicate versioned changes.

Project management:
- Issues capture tasks, bugs, and proposals.
- Labels, milestones, and assignees structure issue tracking.
- Projects organise work across issues and pull requests.

Insights:
- Traffic and activity graphs help maintainers understand usage.
- Contributor graphs show who is changing what over time.

Access management:
- collaborators can be granted granular permissions
- branch protection can require reviews, prevent force pushes, and block merges when checks fail
- security settings can enforce policies such as required reviews or signed commits, depending on organisational needs
## Module 4: GitHub Flavoured Markdown
### Purpose and typical locations
Markdown is used throughout GitHub for communication and documentation. Common locations include:
- repository README files
- issue descriptions and comments
- pull request descriptions and review discussion
- wikis and documentation pages
- project notes and discussions

GitHub Flavoured Markdown extends standard Markdown with features that suit software work, including task lists and tables.
### Editing and preview
The preview step reduces errors in documentation and helps keep issues and pull requests readable.
### Common structures and patterns
Foundational syntax and encourages consistent layout:

Headings:
```text
# Title
## Section
### Subsection
```

Lists and checklists:
```text
- bullet
  - nested bullet
1. ordered step
2. next step

- [ ] task not done
- [x] task done
```

Quotes, used for notes and warnings:
```text
> A note or warning
```

Links and relative links to repository files:
```text
[link text](https://example.com)
[local file](docs/setup.md)
```

Code formatting supports inline code and blocks.

Inline code uses backticks, for example `git status`.

Fenced code blocks use three backticks and can specify a language for syntax highlighting, for example:
```bash
git add .
git commit -m "Message"
```

Tables:
```text
| Name | Purpose |
| --- | --- |
| README | Project overview |
| LICENSE | Reuse permissions |
```

Mentions and references integrate Markdown with GitHub objects:
- `@username` and `@team` notify people and link identities
- references to issues and pull requests link work items to discussions
- commit identifiers can link directly to specific changes

Markdown is presented as a key tool for maintaining readable documentation, consistent issue reports, and effective review discussions.
## Module 5: Organisations, teams, and permissions
### Why organisations are used
Organisations provide a shared workspace for repositories, with centralised access control and administration. They are common in companies and communities because they support:
- consistent permission management across many repositories
- shared ownership rather than reliance on a single personal account
- membership management and role assignment
- optional policy and security controls at scale
### Roles and access patterns
The module introduces common roles:
- Owners manage organisation settings, billing, and high-level permissions.
- Members collaborate according to repository and team permissions.
- Outside collaborators access specific repositories without full membership.

Repository permissions are described in terms of typical levels such as read, triage, write, maintain, and admin. The exact model depends on organisational settings and the repository configuration.
### Creating an organisation and transferring repositories
The course demonstrates creating an organisation and then moving repositories into it. Transfer changes the repository owner and places it under organisational governance. Invitations are used to add members and assign initial roles.
#### Teams as permission groups
Teams group members so access can be managed efficiently. The module demonstrates:
- creating teams for logical groupings, such as a general team and an internal team
- assigning repositories to teams with defined permission levels
- nesting teams to inherit access and reduce administration overhead
- mentioning a team in discussions to notify the right people

Team structure is positioned as a practical way to scale collaboration, especially when repository count and member count grow.
### Additional topics and conventions
#### Tags, releases, and versioning
The course links Git tags to release management. A tag marks a specific commit as a meaningful point in history, such as a versioned release. In Git, tags can be lightweight or annotated. On GitHub, tags are often used as the basis for releases that package changes for users.

Typical actions include:
- creating a tag locally
- pushing the tag to GitHub
- creating a release in GitHub from the tag, with notes that summarise changes

Example commands:
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
git push --tags
```

Release notes are positioned as a communication tool that complements a changelog. They help downstream users understand what changed and what action might be required.
### Choosing SSH or HTTPS for repository URLs
GitHub provides multiple clone URLs. HTTPS is straightforward and widely compatible, while SSH relies on key-based authentication and can reduce repeated credential prompts.

- HTTPS URLs are useful when SSH is not available in a constrained environment.
- SSH URLs are useful when a stable key-based workflow is preferred.

The course treats authentication choice as an operational decision that should align with organisational policy and developer workflow.
#### Recommended repository habits
The material encourages habits that improve collaboration and traceability:
- keep commits small and focused on a single intent
- use clear commit messages that describe the change
- prefer feature branches and pull requests for collaborative work
- use issues to capture requirements, decisions, and acceptance criteria
- keep documentation close to the code, particularly in the README and supporting files
- avoid committing secrets, credentials, and large generated files
- use a `.gitignore` to exclude build outputs and environment-specific files
### GitHub Actions in context
GitHub Actions is introduced as an automation feature attached to repositories. Workflows are defined as YAML files in a `.github/workflows` directory. The course treats Actions as a way to automate tasks such as:
- running tests on pull requests
- building artefacts on each push
- enforcing style and quality checks
- deploying to environments when checks pass

Even when workflows are not authored in the course, the module frames Actions as part of standard GitHub repository operations.
### Pull request life cycle, at a practical level
The course frames pull requests as a structured unit of collaboration that ties together code, discussion, and decisions. A typical life cycle includes:

1. a branch is pushed to GitHub
2. a pull request is opened with a clear title and description
3. reviewers provide feedback, often with inline comments
4. updates are pushed to the branch in response to feedback
5. checks run and review requirements are satisfied
6. the pull request is merged using an approved merge strategy
7. the branch is optionally deleted after merge to keep the repository tidy

Repository settings can require reviews or checks before merging, particularly on protected branches.
### Extended Git command views used for understanding history
Several Git commands are highlighted as ways to understand history and branch structure:
```bash
git log --oneline --decorate --graph --all
git branch
git branch -a
git branch -vv
```

These views help developers understand divergence, identify the current branch, and see which local branches track a remote.
### Issues, projects, and templates
Issues are presented as a lightweight tool for tracking work. An issue typically contains:
- a clear title describing the problem or request
- a description that includes context, steps to reproduce, or acceptance criteria
- labels to classify the issue, such as bug or documentation
- an assignee to indicate ownership
- optional milestones to group work against a target release or time period

Templates can standardise issue and pull request content. The course notes that templates help maintainers collect consistent information, reduce back-and-forth, and improve triage. Templates can be stored under a `.github` directory so they apply across a repository.

Projects provide a higher-level view over issues and pull requests. Board-style views support columns that reflect workflow stages, for example To do, In progress, and Done. Projects are positioned as useful when a repository has enough work items to require coordination beyond an issue list.
### Community and maintenance signals
GitHub repositories surface signals that help users evaluate activity and reliability:
- the commit history and release cadence
- open and closed issue counts
- pull request activity and review responsiveness
- contributor lists and contribution graphs
- documentation quality, particularly the README and contribution guidance

These signals support decision making for reuse and dependency choices. They also help maintainers understand where to focus effort, such as improving documentation, simplifying contribution steps, or clarifying licensing.
### Security and safe collaboration
The course treats repository security as a shared responsibility. Practical measures include:
- enabling two-factor authentication on GitHub accounts
- using SSH keys or tokens rather than sharing passwords
- limiting repository access through least privilege permissions
- using branch protection to prevent direct pushes to the default branch when reviews are required
- reviewing automation, such as Actions workflows, to reduce the risk of untrusted code execution
- avoiding secrets in commits, including API keys and passwords, then rotating credentials when exposure occurs

Security features in GitHub are framed as most effective when combined with team conventions, such as consistent review practices and clear ownership of sensitive areas of the codebase.
### Practical reference: common command sets
### Initialise and record changes
```bash
git init
git status
git add <file>
git add .
git commit -m "Message"
git log
```
### Review changes
```bash
git diff
git diff --staged
git show <commit>
```
### Work with a GitHub remote
```bash
git remote -v
git clone <remote>
git fetch
git pull
git push origin main
```
### Branch and publish
```bash
git checkout -b feature-branch
git push -u origin feature-branch
git merge feature-branch
```
### SSH authentication
```bash
ssh-keygen -t ed25519 -C "name@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh -T git@github.com
```