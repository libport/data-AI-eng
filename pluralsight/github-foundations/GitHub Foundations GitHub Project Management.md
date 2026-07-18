## Managing software projects with GitHub
> [!NOTE]
> A practical guide to planning and tracking delivery with configurable Projects and milestones, marking important versions with Git tags, publishing documented releases, and maintaining detailed repository wikis.

GitHub combines Git-based source control with tools for planning work, tracking delivery and documenting a repository. Teams can organise issues and pull requests in Projects, group repository work into milestones, identify important commits with tags, publish releases and maintain long-form documentation in a wiki.
### GitHub Projects
A GitHub Project belongs to a user account or an organisation. A user project tracks work from repositories owned by that account, while an organisation project tracks work from the organisation's repositories. A project can span several repositories and can link back to relevant repositories or teams.

Projects contain three item types:
- Issues
- Pull requests
- Draft issues

Draft issues capture ideas or incomplete work without creating an issue in a repository. A project member can later convert a draft into a repository issue.

Projects present the same data through configurable views:
- Table views support rapid editing, sorting, filtering, grouping and field summaries.
- Board views arrange items in columns, often by status or priority, and support work-in-progress limits.
- Roadmap views place items on a timeline through date or iteration fields.

Teams can add custom fields for priority, effort, iteration, dates, numbers, single-choice values and notes. They can show or hide fields on cards, group a board by priority, slice a view by assignee, calculate field totals and limit the number of items in a column. These controls let one project support a backlog, a weekly plan, a capacity view and a delivery roadmap without duplicating the underlying work. Templates can supply predefined views, fields, workflows and charts. Project descriptions and READMEs can explain scope, conventions and responsibilities.

Moving an item between board columns changes the corresponding project field. It does not close the linked issue or merge the linked pull request. Built-in workflows can react to repository events, such as an issue closing, and then set the project status to `Done`. Other workflows can add matching items automatically, archive completed items or run through GitHub Actions and the GraphQL API.

A practical setup follows this sequence:
1. Create a user or organisation project from a blank table, board or roadmap, or select a template.
2. Name the project and add a concise description and README.
3. Grant access to collaborators.
4. Add issues and pull requests by searching, pasting URLs or importing repository items.
5. Create draft issues for early ideas, then convert them when the work becomes actionable.
6. Define fields and views that support the team's planning process.
7. Configure workflows so that project data stays aligned with repository activity.
### Milestones
A milestone tracks progress across a group of issues and pull requests within one repository. Teams commonly use milestones for a release, launch or other deliverable. Each milestone can include a title, description and due date. GitHub calculates completion from the number of associated items that are open or closed and displays both the percentage and item counts.

Teams create milestones from the repository's Issues or Pull requests area, associate relevant items and order open work by priority. Closing an issue or pull request updates milestone progress automatically. A milestone should represent a clear outcome rather than a general work queue. Its description should state the intended result, scope and deadline so that contributors can judge whether an item belongs. Milestones organise a defined repository outcome, while Projects provide broader planning across repositories, fields and views.
### Git tags
A Git tag gives a stable name to a specific object, usually a commit. Tags commonly identify versions that should remain easy to find.

A lightweight tag acts as a named reference. An annotated tag creates a tag object that records a tagger, date and message, and Git generally recommends annotated tags for releases.

Common commands include:

```text
git tag stable
git tag -a v0.1.0 -m "Version 0.1.0" <commit>
git push origin v0.1.0
git push origin --tags
```

A normal `git push` does not transfer tags by default. Teams must push a tag explicitly or use `--tags` to transfer all local tags that the remote does not already contain. GitHub then exposes the tagged source snapshot and commit history.
### GitHub releases
A GitHub release packages a deployable software version around a Git tag. A release can contain a title, Markdown release notes, uploaded assets such as installers or compiled programs, and an optional discussion. GitHub also provides automatic zip and tar archives of the repository at the tagged revision.

A team can select an existing tag or create a tag while drafting the release. GitHub can generate release notes from merged pull requests, contributors and a full changelog. Maintainers should review generated notes, describe significant changes and compatibility requirements, attach required assets and mark unstable versions as pre-releases. A draft allows the team to prepare notes and assets before publication. Semantic version numbers such as `v1.0.0` and `v1.1.0` help users compare releases consistently.

Tags identify points in repository history. Releases add distribution, documentation and downloadable assets to those points.
### Repository wikis
A repository wiki stores detailed, long-form documentation such as installation instructions, architecture decisions, coding standards, roadmaps and user guidance. The repository README should provide a concise entry point, while the wiki can expand topics across multiple linked pages.

GitHub stores each wiki in a separate Git repository rather than inside the main code repository. Editors can update pages in the web interface or clone the wiki repository, edit its markup files locally and push changes. Git records each edit, which supports review and recovery through the wiki's change history. Markdown is common, although GitHub wikis support other markup formats.

Special files add shared navigation and context:
- `_Sidebar.md` supplies a custom sidebar.
- `_Footer.md` supplies a custom footer.

Teams should organise wiki pages around reader tasks, link the wiki from the README and maintain documentation alongside product changes.