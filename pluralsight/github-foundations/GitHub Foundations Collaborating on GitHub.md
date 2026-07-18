# Collaborating on GitHub
> [!NOTE]
> A comprehensive guide to coordinating software work through effective branching, focused pull requests, disciplined reviews, issue tracking, discussions, notifications, and supporting tools such as forks, Pages, and Gists.

GitHub combines Git-based version control with tools for reviewing changes, tracking work, supporting communities, publishing static sites and sharing small code collections. Effective collaboration depends on clear branch policies, focused pull requests, disciplined review and deliberate notification settings.
## Git branches and collaboration models
Git records project snapshots as commits. A branch is a movable reference to a commit, so creating or switching branches usually requires little work. `HEAD` identifies the currently checked-out branch or commit. Each new commit advances the active branch reference while other branches remain unchanged.

Teams commonly create short-lived branches for features, bug fixes and experiments. A branch isolates work until the team decides to integrate it. When the target branch has not advanced, Git may perform a fast-forward update. When histories have diverged, Git combines them through a merge or replays commits through a rebase.

A branching strategy defines when contributors create branches, where they branch from and how they integrate completed work. A useful strategy stays simple enough for every contributor to apply consistently.

Common approaches include:
- A centralised workflow sends most changes to one branch. It is familiar but reduces isolation and review opportunities.
- Gitflow maintains long-lived production and development branches, plus feature, release and hotfix branches. It supports parallel release work but adds process overhead.
- A forking workflow gives each contributor a separate repository connected to an upstream repository. It suits open-source projects and contributors without write access.
- GitHub flow uses short-lived branches and pull requests. It works well when the default branch should remain releasable and automated checks support frequent integration.
### Practical branch workflow
A typical local workflow starts by updating the base branch, creating a topic branch and recording a small set of related changes. Modern Git supports `git switch`, while `git checkout` remains widely used. A concise sequence looks like this:

```text
git switch main
git pull
git switch -c feature/thank-you-message
# edit files
git add .
git commit -m "Add thank-you message"
git push -u origin feature/thank-you-message
```

The `-u` option records the remote tracking branch, which allows later `git push` and `git pull` commands to omit the remote and branch names. Contributors should inspect `git status` before committing and review the staged diff with `git diff --staged`. These checks reduce accidental commits and expose generated files, credentials or unrelated edits before they leave the workstation.

A branch name should describe the work without becoming a sentence. Prefixes such as `feature/`, `fix/` and `docs/` can help teams scan branch lists, although a repository should adopt only conventions that improve coordination. Long-lived branches require regular updates from the base branch because divergence increases conflict risk and makes review harder.
## Pull requests
A pull request proposes changes from a head branch into a base branch. The head branch contains the proposed work. The base branch receives the work after approval and merging. A pull request can target the default branch or another branch.

A sound pull request process follows a clear sequence:
1. A contributor creates a focused branch from an appropriate base.
2. The contributor makes coherent commits and pushes the branch to GitHub.
3. The contributor opens a pull request with a concise title and a description of purpose, scope, testing and risk.
4. Reviewers examine the diff, discuss the approach and request changes when required.
5. Automated checks test quality, security and compatibility.
6. The contributor updates the same head branch. GitHub adds the new commits to the open pull request.
7. An authorised contributor merges the approved change after required checks pass.
8. The team deletes the head branch when it no longer serves a purpose.

Pull requests improve code quality by placing review before integration. They also preserve the rationale, discussion, approvals and checks associated with a change. Branch protection rules or rulesets can require reviews, status checks, signed commits, linear history or a merge queue before GitHub permits a merge.
### Preparing a reviewable change
A reviewable pull request limits itself to one purpose. Large changes should be split when reviewers can assess each part independently and the repository can merge the parts safely. Refactoring, formatting and functional behaviour should not be mixed without a clear reason because unrelated edits conceal defects and complicate rollback.

Commit messages should describe completed actions in plain language. A useful message identifies the changed behaviour and, when needed, explains why the change exists. Reviewers can then inspect commits individually or assess the final combined diff. Fix-up commits are acceptable during discussion, but the chosen merge method determines whether they remain visible on the base branch.

Before opening the pull request, the contributor should run relevant tests, inspect the complete branch diff and remove debugging output. The description should identify known limitations rather than leave reviewers to discover them. Screenshots help with visual changes, while logs or reproducible commands help with failures and performance work.

GitHub displays the conversation, commits, checks and changed files in separate views. Reviewers should use the changed-files view for code-level analysis and the conversation view for decisions that apply to the whole proposal. Suggestions can provide an exact replacement that the author may apply directly when permissions and branch state allow it.
### Reviews and comments
Reviewers can comment on the entire pull request, a single line or a range of lines. A review can approve the change, request changes or leave non-blocking comments. Repository rules determine whether a requested change blocks merging.

Pull requests themselves remain open until they are merged or closed. Approval and changes-requested decisions belong to reviews and affect merge readiness. A merged pull request is also closed, but GitHub displays it as merged to distinguish it from an unmerged closure.

Reviewers should assess behaviour, design, tests, security, maintainability and documentation rather than focus only on formatting. Authors should respond through code changes or reasoned discussion, then request another review when the change is ready.
### Draft pull requests
A draft pull request signals work in progress. It supports early discussion without presenting the change as ready to merge. GitHub prevents merging while the pull request remains a draft and does not automatically request code-owner reviews. Marking it ready for review starts the normal review process and requests applicable code owners.

Availability depends on repository visibility and the organisation's GitHub plan. Public repositories support drafts on free plans, while private repository support requires an eligible paid plan.
## Merge methods
Repository administrators can allow one or more merge methods. Each method produces a different history.
### Merge commit
A merge commit combines the base and head histories and normally has two parents. It preserves the branch's individual commits and creates an explicit record of integration. This method provides the fullest historical context but can produce a busy graph in repositories with frequent merges.
### Squash and merge
Squash and merge combines the head branch's commits into one new commit on the base branch. It produces a concise history and removes incidental development commits. The trade-off is the loss of each original commit as a separate entry on the base branch.
### Rebase and merge
Rebase and merge reapplies the head branch's commits individually onto the tip of the base branch. GitHub does not create a merge commit for this method. The result is a linear history that retains separate commits, although GitHub creates new commit identifiers because each rebased commit has a new parent.

Teams should choose a method that supports their debugging, release and audit needs. Merge commits preserve context, squashing favours compact history and rebasing favours a linear sequence.
### Choosing and completing a merge
The repository's policy should specify who may merge, which checks must pass and whether the head branch must be current with the base branch. Busy repositories can use a merge queue to test each pull request against the latest protected branch state before integration. This reduces the risk that two independently passing pull requests fail when combined.

After merging, the team should verify deployment or release automation when the change affects production. Deleting the head branch removes a stale collaboration surface but does not erase the merged commits. GitHub can restore a recently deleted pull request branch in many cases, although contributors should not treat restoration as a substitute for deliberate history management.
## Merge conflicts
A conflict occurs when Git cannot combine changes automatically. Typical causes include incompatible edits to the same lines, an edit to a file deleted elsewhere or competing file moves.

GitHub can resolve simple text conflicts in the web interface. The contributor selects the intended content, removes conflict markers, marks each file resolved and commits the resolution. Complex conflicts require a local Git client.

A local resolution normally involves these steps:
1. Fetch the latest remote changes.
2. Update or merge the target branch into the working branch, or rebase the working branch as the team requires.
3. Open each conflicted file and choose the correct final content.
4. Remove conflict markers and test the combined result.
5. Stage and commit the resolution, or continue the rebase.
6. Push the updated branch and allow checks to run again.

A contributor should never resolve a conflict by selecting one side without understanding both changes. The final result must preserve the intended behaviour from each branch or deliberately replace it with an agreed solution.

Git marks unresolved regions with markers that separate the current content from the incoming content. Editors may present buttons for accepting one side or both sides, but the contributor remains responsible for constructing the correct result. A valid resolution can combine parts of both versions or replace both with a new implementation.

After resolving a conflict, the contributor should rerun tests that cover the affected area. A syntactically valid merge can still introduce duplicated logic, lost validation or inconsistent assumptions. Reviewers should pay particular attention to conflict-resolution commits because the final content may differ from either original branch.
## Standardising pull requests
A pull request template prompts contributors to supply consistent information. A repository can place a single template in the repository root, the `docs` directory or the `.github` directory. Multiple templates belong in a supported pull request template directory and can be selected through a query parameter or template chooser.

Useful fields include:
- Purpose and user impact
- Related issue or design record
- Type of change
- Testing performed
- Screenshots or logs when relevant
- Deployment, migration and rollback notes
- Checklist for documentation, security and compatibility

Templates should request information that reviewers use. Excessive checklists encourage mechanical completion and obscure risk.
## History, reverts and default branches
GitHub exposes commit history, file history and line attribution. The blame view identifies the latest commit that changed each line, while the commit view shows the complete diff for a snapshot. These tools help contributors trace decisions, investigate regressions and locate earlier context. They should support investigation rather than assign personal fault.

Reverting a merged pull request creates a new change that reverses the original diff when GitHub can generate it cleanly. The reversal still needs review and may conflict with later work.

The default branch is the initial base for new pull requests and the branch GitHub shows first. Administrators can change it, but they should update automation, documentation and external integrations that refer to the old name. Rulesets and branch protection can restrict direct pushes and enforce the repository's integration policy.
## Forks
A fork is a repository in the same network as an upstream repository. It contains the upstream Git history at the time of creation and can evolve independently. Contributors usually clone their fork, configure the fork as `origin` and add the source repository as `upstream`.

Changes pushed to a fork do not update the upstream repository. A contributor proposes integration by opening a pull request from a branch in the fork to a branch in the upstream repository. Maintainers can review the proposal and may receive permission to update the contributor's pull request branch when the contributor enables that option.

Anyone can fork a public repository to an eligible account or organisation. Private repository forks depend on the owner's policy, repository permissions and plan. Forks inherit visibility from the repository network, so a public fork stays public and a private fork stays private within the applicable access model.

Branches and forks solve different problems. Branches share one repository and its permissions. Forks provide separate repositories and suit external contribution, experimentation and independent maintenance.
## Linking pull requests to work
GitHub can connect pull requests with issues, milestones, projects, commits and other pull requests. These links expose dependencies and show which change addresses a tracked item.

Closing keywords such as `Fixes #42`, `Closes #42` and `Resolves #42` can link a pull request or commit to an issue. GitHub automatically closes the linked issue when the change reaches the repository's default branch. Keywords in a pull request description do not trigger automatic closure when the pull request targets another branch.

Saved replies store reusable responses for issues, pull requests and discussions under a personal account. They help maintainers handle recurring questions consistently, but each reply should still be checked and adapted to the specific conversation.
### Pull request lifecycle and search
GitHub supports filters for open, closed, merged, draft and review-related pull requests. Teams can combine qualifiers to find work assigned to a person, awaiting review, linked to a milestone or blocked by requested changes. Saved searches and consistent labels help maintainers manage large queues.

Closing a pull request without merging records the decision and preserves the discussion. Maintainers should explain why the proposal will not proceed, especially when the author invested substantial work. A later proposal can reference the closed pull request and reuse its analysis without reopening obsolete code.
## Code ownership
A `CODEOWNERS` file maps file patterns to responsible users or teams. GitHub searches for the file in `.github/`, the repository root or `docs/`, using the first valid file it finds for the relevant branch.

When a ready-for-review pull request changes an owned path, GitHub requests review from the matching owner. Repository rules can require code-owner approval before merging. The file should assign ownership to people who understand the code and have appropriate repository access. Broad wildcard rules need careful ordering because later matching patterns can override earlier ones.
## Issues
GitHub Issues tracks bugs, features, tasks, ideas and other units of work. An issue can contain a description, comments, assignees, labels, milestones, projects, issue types, fields, sub-issues and dependencies. Closing an issue preserves its history.

A useful issue states the desired outcome, current behaviour, evidence, acceptance criteria and relevant context. Teams can use labels to classify and prioritise issues, pull requests and discussions within a repository. Consistent labels improve filtering and reporting, while too many overlapping labels create ambiguity.

Issue and pull request numbers share the same sequence within a repository. A reference such as `#42` can therefore identify either type. GitHub resolves the link from context.

Repositories can pin up to three important issues above the issue list. Maintainers can also create a branch from an issue so the relationship between planned work and implementation remains visible.
### Issue triage and progress
Triage converts incoming reports into actionable work. A maintainer confirms the report, requests missing evidence, removes duplicates, assigns a type and priority, and decides whether the repository will address it. Labels can express domain, severity or workflow state, but one label should represent one clear dimension.

Milestones group issues and pull requests around a release or objective. Projects can add richer planning views, custom fields and status tracking. Assignees identify current ownership, while comments preserve decisions and updates. An issue should not remain assigned to an inactive contributor when the team expects someone else to continue the work.

A branch linked from an issue shows that implementation has started. A pull request linked through the development panel or a closing keyword shows the proposed solution. This chain connects the original need, the implementation discussion and the final code history.
### Issue templates and forms
Markdown issue templates provide headings, prompts and checklists in a free-form editor. GitHub stores repository templates under `.github/ISSUE_TEMPLATE`.

Issue forms use YAML to collect structured responses through fields such as text areas, inputs, drop-down lists and checkboxes. Validations can require essential information. Forms improve consistency and reduce incomplete reports, while templates remain useful when contributors need flexible narrative space.

The form should ask only for information needed to understand, reproduce or prioritise the work. Security vulnerabilities should follow the repository's private reporting process rather than a public issue form.
## Discussions
GitHub Discussions provides a community forum for questions, announcements, ideas, polls and open-ended conversation. Issues track actionable work. Discussions support exploration, support and decision-making before a clear task exists.

Repositories and organisations can organise discussions into categories. Common formats include open-ended conversation, question and answer, announcements and polls. Maintainers can mark an answer in a question category, pin important discussions and moderate participation.

A discussion can lead to tracked work. Maintainers can convert suitable conversations into issues or link the resulting issue so the original context remains available. Conversely, an issue that proves to be an open-ended question can become a discussion.

Discussion categories should set expectations. A question category invites a specific answer, an ideas category invites evaluation, and an announcement category communicates decisions. Clear category descriptions reduce misplaced posts and help community members choose between an issue and a discussion. Maintainers should move or convert conversations when their purpose changes rather than force contributors to repeat the same context elsewhere.
## Notifications
GitHub notifications report activity from issues, pull requests, discussions, repositories, teams, security alerts and automated workflows. A person commonly receives notifications after participating, being mentioned, receiving an assignment, receiving a review request or watching a repository.

Watching behaviour depends on personal settings. GitHub can automatically watch repositories where an account receives push access, but the account holder can disable that preference. A repository can use participating and mentions, all activity, ignore or a custom selection.

The notification inbox supports filters for unread items, assignments, participation, mentions, team mentions, review requests and repositories. Recipients can mark items done, save them for later or unsubscribe from a thread. Email delivery and repository exclusions can be configured separately.

Effective notification management favours selective subscriptions. Watching all activity in a large repository can hide urgent work within routine updates.

A practical inbox routine processes direct responsibilities before general subscriptions. Assignments, review requests and direct mentions usually require a response. Repository-wide updates can then be scanned or grouped. Marking an item done removes it from the active inbox without changing the underlying issue or pull request. Unsubscribing stops future thread updates unless a new event, such as another direct mention, creates a fresh reason for notification.
## GitHub Pages
GitHub Pages publishes static websites from repository content. It serves HTML, CSS, JavaScript and generated static assets. It does not run a general server-side application, although a build workflow can generate the final files before deployment.

GitHub supports two site types:
- A user or organisation site associated with an account and normally published from a repository named `<account>.github.io`
- A project site associated with a specific repository and normally published below the account's Pages domain

An account can have one user or organisation site, while repositories can each host a project site when the plan and repository settings allow it. Pages can publish from a branch and folder or through GitHub Actions. Custom domains are supported.

Most Pages sites are public. Eligible GitHub Enterprise Cloud organisations can restrict access to selected project sites. Repositories must not publish credentials, private keys or confidential data because generated files may become publicly accessible.

Pages deployments should use a reproducible source and build process. A branch-based deployment suits simple checked-in sites. A GitHub Actions workflow suits generated documentation, static-site generators and projects that need validation before publication. Custom-domain owners should configure DNS carefully and enable HTTPS.

Because Pages publishes files from a repository workflow, maintainers should review generated artefacts and dependency changes with the same care as application code. A compromised build dependency can alter the published site even when the repository's source appears harmless.
## Gists
A gist is a Git repository designed for small collections of files, notes or code snippets. A gist can contain multiple files but does not support directories. Git history records each revision, and users can comment, clone, fork, download or embed a gist.

GitHub offers public and secret gists. Public gists are discoverable. Secret gists are unlisted rather than private, and anyone with the URL can access them. Neither type should contain passwords, access tokens, personal data or confidential code.

Gists suit examples, reproducible fragments and short references. A normal repository suits projects that need directories, issues, pull requests, releases, access controls or sustained team development.

A gist revision behaves like a Git commit, so later edits remain visible in history. Forks support experimentation on another account, and cloning allows normal local Git operations. These features make a gist more durable than a temporary paste service, but discoverability and access control remain limited compared with a repository.