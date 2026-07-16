## GitHub Copilot, AI agents and MCP
GitHub launched Copilot as a technical preview in June 2021 and made it generally available in June 2022. It began as an AI pair programmer that suggested lines and functions inside an editor. Copilot now supports chat, multi-file editing, code review, pull request assistance, selectable models and autonomous agents across editors, GitHub and the command line.

This shift changes the developer's role. Developers still define outcomes, judge trade-offs, review code and approve releases. Agents take on bounded implementation work such as locating relevant files, editing code, running commands, checking tests and preparing pull requests. The strongest results come from clear objectives, useful context, appropriate tools and human review.

Copilot provides two main agentic workflows:

| Workflow | Where it runs | Best suited to |
|---|---|---|
| Agent mode | A supported IDE | Interactive work on a local workspace, with immediate guidance and review |
| Copilot cloud agent | GitHub-hosted infrastructure | Background tasks that can produce branches, commits, session logs and pull requests |

Both workflows can use Model Context Protocol servers and repository instructions. They differ mainly in location, timing and control. Agent mode works alongside a developer in a live session. The cloud agent continues independently after receiving a well-scoped task.
## Model Context Protocol
Anthropic introduced Model Context Protocol, or MCP, in November 2024 as an open standard for connecting AI applications to external systems. MCP gives clients a common way to discover and call tools, read resources and use predefined prompts exposed by servers. It reduces the need for separate, product-specific integrations for every data source or service.

Large language models generate responses from their training and supplied context. They do not automatically know the latest state of a repository, issue tracker, build pipeline or design system. MCP servers can expose that information and the actions associated with it. An agent can then retrieve an issue, inspect a pull request, query a service or invoke an approved operation through a defined interface.

MCP does not make model output inherently correct. It improves access to current context and tools. Teams still need to validate source data, restrict permissions and review agent actions.
### GitHub MCP Server
The GitHub MCP Server exposes GitHub capabilities to compatible AI clients. Depending on configuration and permissions, Copilot can work with repositories, issues, pull requests, branches, discussions and other GitHub resources.

The remote GitHub MCP Server is the recommended option for most supported IDEs. OAuth configuration avoids creating a personal access token or installing local server software. A local server remains useful for environments that require it, including some enterprise deployments. Teams should never commit credentials to a repository. They should use OAuth, secure input handling, environment variables or an approved secret store.

A typical setup follows this sequence:
1. Enable MCP access under the relevant Copilot policy.
2. Add the remote or local GitHub MCP Server through the IDE's MCP configuration.
3. Authenticate with the narrowest practical permissions.
4. Open Copilot Chat and select Agent.
5. Review the enabled tools before submitting a task.
6. Confirm consequential actions and inspect the results.

The server allows agent mode to perform GitHub work without constant context switching. A developer can ask Copilot to find related repositories, compare features, triage issues, create a branch, implement a change and prepare a pull request. Each step still requires appropriate access and oversight.
## Agent mode
Agent mode accepts a goal rather than a single code completion. It gathers workspace context, identifies available tools, forms an implementation approach and acts through an iterative loop. The agent may read files, search the workspace, edit code, run terminal commands, inspect diagnostics and test the result. It uses tool output to choose the next step and stops when it reaches the goal, encounters a blocker or needs guidance.

Useful tasks include:
- adding a focused feature
- fixing a reproducible bug
- writing or extending tests
- refactoring a contained area
- migrating a library or framework
- updating documentation
- exploring an unfamiliar codebase
- preparing an implementation plan

Agent mode remains probabilistic. The same prompt can produce different code, and plausible changes can still be wrong. The source example shows Copilot incorrectly removing a required CSS brace, then proposing another incorrect edit. Human review identified the fault and restored the valid structure. That incident demonstrates the correct operating model. The agent accelerates diagnosis and implementation, while a developer remains accountable for correctness.

Effective prompts define the outcome, constraints and verification method. A strong request names the affected feature, expected behaviour, relevant files, required tests and any prohibited changes. Large tasks work better when split into small, independently reviewable units.

Developers should review every diff, run the normal test suite and inspect the application before committing. Visible tool calls, edits and command results support review, but they do not replace it. Copilot should not receive permission to use an unnecessary tool or modify unrelated areas.
### Integrated issue workflow
Agent mode and the GitHub MCP Server can connect repository management with local implementation. A team can use natural language to research comparable public repositories, identify useful features, compare them with the current codebase and create separate feature requests. Copilot can then retrieve open issues and help rank them using labels, descriptions, comments and stated urgency. The ranking remains a recommendation. Product and engineering owners should decide priority against user value, risk and delivery commitments.

For a selected issue, a controlled workflow can proceed as follows:
1. Retrieve the issue and restate its acceptance criteria.
2. Create and check out a dedicated branch.
3. Identify the files and tests likely to change.
4. Implement the smallest change that satisfies the criteria.
5. Run tests, linters and the application locally.
6. Review and revise the diff.
7. Commit and push the branch.
8. Create a pull request that links the issue.
9. Add a concise issue update and close the issue through the merged pull request.

This sequence keeps decisions visible and produces familiar repository artefacts. It also separates reversible exploration from changes that affect shared systems. Teams should require confirmation before issue creation, branch operations, pushes, pull requests or comments when the client offers that control.
## Copilot cloud agent
GitHub now describes its asynchronous coding agent as Copilot cloud agent. It is available across paid Copilot plans, subject to repository and organisation policies. A task can start from GitHub, supported IDEs, GitHub CLI, Copilot CLI, MCP-enabled tools and selected integrations. Assigning an issue to Copilot remains a common entry point, but it is not the only one.

The cloud agent works in an isolated GitHub-hosted environment. It can inspect a repository, plan a change, edit files, run tests and push work to a branch. It records progress in session logs and can create or update a pull request. Developers can review the diff, comment on the pull request and ask the agent to revise its work.

The cloud agent suits well-scoped, low-to-medium complexity tasks such as:
- routine bug fixes
- test coverage improvements
- documentation updates
- contained refactoring
- dependency or configuration updates
- small features with clear acceptance criteria

A useful issue includes a concise problem statement, acceptance criteria, relevant files or functions, test expectations and security constraints. Atomic issues reduce exploration time and make review easier. Multiple independent sessions can run in parallel, although teams should account for usage limits, AI credits and workflow capacity.

The agent does not guarantee a correct or secure result. Repository rules, review requirements and protected branches remain essential. GitHub restricts the cloud agent's internet access through a configurable firewall. GitHub Actions workflows require approval by default, unless administrators explicitly change that setting. Agent-generated commits and session logs improve traceability, but reviewers must still assess behaviour, quality and risk before merge.
### Reviewing agent output
Reviewers should assess agent work as they would assess a colleague's contribution, while accounting for model-specific failure modes. A polished explanation does not prove that the implementation works. Review should cover:
- alignment with the issue and acceptance criteria
- unintended changes outside the requested scope
- correctness across expected and edge cases
- tests that fail for the right reason before the fix and pass afterwards
- security, privacy and permission boundaries
- maintainability, naming and consistency with local conventions
- dependency, performance and accessibility effects
- documentation and migration requirements

Screenshots and summaries can speed review, but reviewers should inspect the underlying files and run independent checks. When an agent introduces an error, the safest response is to describe the observed failure, provide relevant diagnostics and constrain the next change. Direct manual correction remains appropriate when it is faster or clearer than another model iteration.
## GitHub Spark
GitHub Spark turns natural-language descriptions into interactive web applications. It can generate and revise a working app, accept images as context, display a live preview and publish a shareable result. A spark can also connect to a GitHub repository and move into a codespace for deeper development.

Spark is useful for prototypes, internal tools, feature mock-ups and early validation. Product managers, designers and developers can test an idea before investing in a production implementation. A team can attach a screenshot, request a similar interface, add a dark-mode control or prototype a form, then share the result for feedback.

Spark is not a general-purpose production platform without constraints. It uses an opinionated React and TypeScript stack, and external libraries may not integrate reliably with its SDK. Published applications require testing. Spark's default data store can be shared across users of a published app, so private or sensitive information should be removed before publication. Read-only publishing can reduce some risks when the goal is demonstration.

As of July 2026, Spark remains in public preview and is available with Copilot Pro+, Copilot Max and Copilot Enterprise, subject to enterprise restrictions.
## Selecting the right capability
Teams should match the tool to the task rather than defaulting every request to an autonomous agent.

| Need | Suitable capability | Reason |
|---|---|---|
| Explain code or answer a focused question | Copilot Chat | Produces guidance without changing files |
| Apply a known edit across several files | Scoped Copilot edits or agent mode | Keeps the developer in an interactive review loop |
| Investigate and implement a local task | Agent mode | Combines workspace context, tools and immediate feedback |
| Delegate a bounded repository task | Copilot cloud agent | Runs in the background and returns reviewable GitHub artefacts |
| Prototype an interface or small application | GitHub Spark | Produces an interactive concept quickly |
| Access external systems or repository operations | MCP-enabled agent | Adds approved tools and current context |

Simple changes often need less autonomy. A precise manual edit or ordinary code completion can be faster, cheaper and easier to verify than a multi-step session. Agents provide the greatest value when they can remove coordinated but reviewable work without obscuring ownership.
## Customising Copilot
Repository customisation reduces repeated explanations and aligns Copilot with established engineering practices. Teams can define standing instructions, reusable prompts and specialised agents.
### Repository instructions
A repository-wide file at `.github/copilot-instructions.md` can describe the technology stack, directory structure, coding conventions, build commands, test commands, review expectations and business constraints. Copilot uses these instructions as contextual guidance in supported experiences.

Instructions should be brief, specific and verifiable. They should state commands exactly, identify approved frameworks and explain non-obvious constraints. Vague directions such as "write good code" provide little value.
### Path-specific instructions
Files under `.github/instructions/` can apply guidance to selected paths. A filename normally ends in `.instructions.md`, and a YAML header can define an `applyTo` pattern. A project can require one structure for assignment documents, another for frontend files and another for infrastructure code.

Path-specific rules help Copilot preserve local conventions without overloading every task with unrelated guidance.
### Prompt files
Reusable prompt files live under `.github/prompts/` and end in `.prompt.md`. They package a repeated workflow, required context and expected output. In supported IDEs, a developer can invoke a prompt file through a slash command.

A prompt for creating a course assignment might ask for a topic, create the correct directory and files, follow the assignment template, add starter code and update the site's configuration. This approach improves consistency and shortens routine work.
### Custom agents
Current Copilot customisation uses custom agent profiles rather than the older custom chat-mode format described in the source. Repository agent profiles live under `.github/agents/` and end in `.agent.md`. A YAML header defines the agent's name, description, tools and optional MCP configuration, while the Markdown body defines its behaviour.

A curriculum brainstorming agent could scan existing material, suggest several content gaps, avoid writing full specifications and finish with a focused question. A security review agent could use a restricted tool set and apply the organisation's review checklist. Specialised agents improve consistency by combining role, instructions and tools in one reusable profile.
## Secure use of Copilot agents
AI-assisted development needs the same engineering controls as other code changes, with additional controls for prompts, tools and data access.

Teams should apply these practices:
- grant each agent and MCP server the least privilege needed
- prefer read-only access until write access becomes necessary
- keep secrets out of prompts, repositories and logs
- use protected branches and required reviews
- require tests, linters, type checks and security scans
- isolate experiments in branches, forks or non-production environments
- pin external tools and dependencies where practical
- restrict network access to approved destinations
- include security acceptance criteria in delegated tasks
- inspect generated code for unsafe assumptions and hidden scope changes

Custom instructions can define approved authentication patterns, parameterised database access, validation requirements and mandatory security commands. Reusable security prompts can request negative tests, safer error handling or focused vulnerability reviews. These controls guide the agent, but automated output still requires independent verification.

MCP servers deserve the same scrutiny as privileged integrations. Administrators should approve servers, tool sets and destinations, review authentication methods and monitor changes. A broadly authorised MCP server can expose sensitive data or actions even when the underlying model behaves as designed.

The most productive workflow combines clear delegation with strict review. Agents can research, implement, test and document changes at high speed. Developers and organisations retain responsibility for architecture, correctness, security, licensing and release decisions.