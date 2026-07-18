# Getting started with GitHub Actions
> [!NOTE]
> A practical introduction to automating secure, reliable software delivery with event-driven workflows, runners, matrix builds, secrets, artifacts, pull-request checks, and enforced branch protections.

GitHub Actions lets repository maintainers automate software delivery work directly inside GitHub. A workflow can build code, run tests, publish packages, create issues, label pull requests, deploy applications, or call external services. The product works through YAML workflow files stored in `.github/workflows`, where repository events, scheduled times, or external API calls trigger jobs.

This abridged guide explains the core concepts, the shape of a simple workflow, the role of runners and logs, the use of secrets, and a practical continuous integration pipeline for a Node.js project. It also updates older examples to current terminology and practice. Current repositories normally use `main` as the default branch. Older repositories may still use `master`, so workflow examples should target the actual default branch used by the repository.
## Course scope
The course begins with a high-level view of GitHub Actions and then moves into practical repository work. It first introduces GitHub Flow, because Actions usually makes sense only when placed inside a branching and review process. It then creates a minimal workflow, inspects the generated logs and explains the YAML structure. Later sections add continuous integration, matrix builds, multiple jobs, artifacts, branch protections and marketplace actions.

The original course uses demonstration language, direct instructions and older interface names. This abridged version keeps the technical concepts and removes the training narration. It also updates examples that now look dated. References to `master` become references to the default branch, usually `main`. References to old action versions become current or version-aware guidance. References to GitHub Learning Lab become GitHub Skills.
## GitHub Flow and automation
GitHub Flow uses short-lived branches, pull requests and reviews to move changes safely into the default branch. A developer creates a branch from `main`, commits changes, opens a pull request, responds to review comments, waits for checks to pass, then merges the branch when the change is ready.

GitHub Actions strengthens that flow by automating checks and routine repository work. Branch protection rules or repository rulesets can require pull request reviews and passing status checks before a merge. A workflow can then run linting, tests, builds and deployment steps every time a pull request targets `main`. This gives contributors fast feedback and reduces the chance of broken code reaching the protected branch.
## Core concepts
GitHub Actions uses several related terms.

- Workflow: a configurable automated process defined in a `.yml` or `.yaml` file under `.github/workflows`.
- Event: an activity or schedule that starts a workflow, such as `push`, `pull_request`, `pull_request_review`, `workflow_dispatch`, `schedule`, or `repository_dispatch`.
- Workflow run: one execution of a workflow after a trigger occurs.
- Job: a set of steps that runs on the same runner.
- Step: one task inside a job. A step can run shell commands or call an action.
- Action: a reusable unit of automation referenced in a step. It may come from the same repository, a public repository, the GitHub Marketplace, or a container registry.
- Runner: the machine that executes a job. It can be GitHub-hosted, self-hosted, larger, or managed through runner groups.
- Artifact: a file or collection of files produced by a workflow run, such as build output, logs, reports, binaries or screenshots.
- Secret: an encrypted value used to protect credentials, tokens and other sensitive configuration.

The term GitHub Actions names the platform. The term action names a reusable task inside that platform.
## Workflow files
A workflow file normally defines a name, triggers and jobs. The `on` key defines when the workflow runs. The `jobs` key defines what the workflow does. Each job declares `runs-on` to select a runner, then lists steps that run commands or actions.

A simple workflow might run on a push to `main`, use an Ubuntu runner, check out the repository, and print a test message. The current checkout action is `actions/checkout@v6`. Workflows should pin actions to a version or commit SHA rather than an unversioned branch such as `master` or `main`, because an unpinned action can change unexpectedly.

The checkout action copies the repository into the runner workspace so later steps can build, test or inspect the code. Not every workflow needs checkout, but most build and test workflows do.
## A minimal hello workflow
A first workflow should prove that the repository can run automation before it attempts a full build. A useful starter workflow listens for a push to the default branch, runs one job on `ubuntu-latest`, checks out the repository and prints a short message. This keeps the first run small enough to understand.

After the workflow file is committed, the Actions tab records the run. The run shows the workflow name, the event that triggered it, the commit, the actor, the branch, the job and each step. Opening the job log reveals how GitHub provisions the runner, downloads or prepares actions, checks out the repository and runs the shell commands. This log view matters because every serious workflow failure eventually has to be diagnosed there.

The hello workflow also shows an important distinction between command steps and action steps. A `run` step executes a shell command. A `uses` step calls an action. The checkout step is an action step because it reuses packaged logic maintained outside the workflow file. An `echo` step is a command step because it runs directly in the runner shell.
## Runners and logs
GitHub-hosted runners provide clean environments for each job. Common labels include `ubuntu-latest`, `ubuntu-24.04`, `ubuntu-22.04`, `windows-latest`, `windows-2025`, `windows-2022`, `macos-latest`, `macos-15` and related arm64 labels. The `-latest` labels identify the latest stable runner images provided by GitHub, not necessarily the newest operating system released by the vendor.

Self-hosted runners provide more control over hardware, operating systems, installed tools and network access. They suit specialised builds, private networks and large workloads, but they also require maintenance, security hardening and monitoring.

The Actions tab shows workflow runs, jobs, step output, annotations and artifacts. Logs help diagnose failing builds. For example, a Node.js test failure may show that `npm test` ran successfully as a command but failed because no tests existed, a test expected the wrong value, or a dependency was missing. Reading the failing step first usually identifies the cause faster than scanning the whole workflow.
## Events and schedules
Workflows can respond to GitHub events, scheduled times or external dispatches.

A `push` event can run a workflow when commits reach a branch. A `pull_request` event can run when a pull request opens, synchronises, reopens or changes in another supported way. Activity types narrow a trigger to the exact cases that matter. For example, a workflow can run only for opened and reopened pull requests instead of every pull request activity.

Scheduled workflows use cron syntax and run on UTC time. External systems can trigger workflows through `repository_dispatch` when the automation needs to respond to activity outside GitHub. Manual workflows use `workflow_dispatch`, which allows a user to start a workflow from the GitHub interface or API.
## Secrets, variables and tokens
Workflows should keep credentials out of source code. Repository, organisation and environment secrets store sensitive values and expose them to workflows through the `secrets` context. A secret can be passed as an action input with `with`, or as an environment variable with `env`, depending on the action or command.

GitHub automatically creates a unique `GITHUB_TOKEN` for each workflow job. The token authenticates as the GitHub App installed on the repository and is limited to that repository. Workflows should set explicit `permissions` for the token, such as `contents: read`, `pull-requests: write` or `issues: write`, so each job receives only the access it needs.

Secrets require care in pull request workflows. Workflows that run untrusted code should avoid exposing secrets or high-privilege tokens. Marketplace actions should be reviewed before use, especially when they receive tokens, secrets or write permissions.
## Repository preparation for exercises
The course project uses a template repository so that the workflow work can focus on automation rather than application design. In a current workflow exercise, the same idea still applies. A learner can create or clone a small Node.js project, push it to a new repository and add workflow files through the GitHub interface or a local editor.

When a repository contains several exercise branches, cloning can preserve branch history better than using a basic fork. The original walkthrough checks out the exercise branches locally before replacing the remote origin and pushing the chosen branches to a new repository. The underlying point remains useful: Git remotes and branches should be understood before workflow changes are tested. CI failures are harder to diagnose when the branch, base branch or remote is not the one expected.

A workflow file should usually be added through a pull request rather than a direct commit to the protected branch. That habit ensures the workflow itself receives review and runs checks before it changes the main delivery process. It also avoids normalising direct pushes to `main`, which later undermines branch protection rules.
## Continuous integration for Node.js
A continuous integration workflow builds and tests code after relevant changes. For a Node.js project, a workflow commonly checks out the repository, sets up Node.js, installs dependencies, builds the project and runs tests. The current setup action is `actions/setup-node@v6`, which can install or select a Node.js version and configure package manager caching when appropriate.

Current examples should use supported Node versions, such as active long-term support and current releases, rather than obsolete examples such as Node 10, 12 or 14. A matrix strategy can run the same job across several versions and operating systems. For example, a repository may test Node 22 and Node 24 on `ubuntu-latest` and `windows-latest` if it supports both Linux and Windows users.

CI works best when the test command reflects the project configuration. In the original project, `npm test` expected a Jest test suite. The initial run failed because the test directory and test files were missing. Adding unit tests created useful failures, then fixing the faulty source value made the checks pass. That sequence shows the value of CI: it exposes errors early, records the failing command and makes the corrected result visible on the pull request.
## Matrix builds and environment coverage
A matrix strategy runs the same job across combinations of values. In a Node.js project, common matrix values include Node.js version and operating system. The workflow expands the matrix into separate jobs, which makes compatibility problems visible. A test may pass on Linux and fail on Windows because of path handling, shell differences, filesystem behaviour or dependency assumptions. A test may pass on one Node.js version and fail on another because an API, package or runtime feature has changed.

Matrix builds should match the real support policy of the project. Testing every possible version wastes time and makes failures noisy. Testing too little creates false confidence. A practical project usually tests the active versions that users or deployment environments actually need, then removes end-of-life versions from the matrix when support ends.

Environment variables can be set at workflow, job or step level. More specific settings override broader ones while that scope executes. A test job may set `CI: true` so tools use non-interactive behaviour suitable for automation. Secret values should not be stored as plain environment variables in the repository file. They should come from the `secrets` context.
## Multiple jobs and artifacts
Workflows can separate build and test work into different jobs. This improves clarity and allows teams to run independent jobs in parallel. Each job runs in its own runner environment, so files created in one job do not automatically appear in another job.

Artifacts solve that problem. A build job can upload compiled files, coverage reports or other outputs. A later job can download those artifacts and use them for testing, packaging or deployment. The `needs` keyword controls job order. A test job that needs build output should declare that it depends on the build job, then download the required artifact after the build succeeds.

GitHub's current artifact documentation still shows `actions/upload-artifact@v4` for upload examples and `actions/download-artifact@v5` for download examples. The Marketplace also lists newer release lines for some artifact actions. Teams should check current release notes before upgrading, especially on self-hosted runners, because newer action versions may require newer runner software.

Artifacts and caches are not interchangeable. Artifacts preserve build or test outputs for inspection or later jobs. Caches speed up repeated workflow runs by reusing dependencies that do not change often.
## Branch protections, reviews and approvals
Automated checks are strongest when repository settings enforce them. Branch protection rules can require pull request reviews, passing status checks, conversation resolution, signed commits, linear history, merge queues, successful deployments or other controls before a merge. Rulesets provide a newer way to apply related protections across branches and repositories.

A review workflow can respond to `pull_request_review` and perform follow-up work when a reviewer approves a change. For example, a workflow can label a pull request after it receives the required number of approvals. The label improves visibility, but it does not enforce the rule by itself. Enforcement comes from branch protection or a ruleset that blocks merging until required reviews and status checks pass.

Administrators and custom roles may be able to bypass protections unless the repository setting disallows bypassing. Teams should decide deliberately whether administrators must follow the same requirements as other contributors.
## Workflow design for teams
Team workflows combine technical checks with human judgement. CI can show whether code builds and tests pass. It cannot decide whether the design is appropriate, whether the change meets the product need, or whether the implementation is easy to maintain. Pull request reviews provide that human layer.

An approval workflow can make review state easier to see by adding labels or comments when the required number of approvals has been reached. This can help teams scan many pull requests. However, labels should be treated as signals, not controls. A label can be missing, duplicated, renamed or applied by the wrong automation. The protected branch rule or ruleset should enforce the merge requirement.

Required checks should be chosen carefully. If a required check is renamed, deleted or no longer runs for a branch, the repository may block all merges until the rule is updated. If an optional check is important but not required, a pull request may merge even though the check failed. Teams should periodically review required checks, runner labels, action versions, token permissions and branch rules as the repository evolves.
## Marketplace actions and external services
The GitHub Marketplace provides reusable actions for common tasks. Marketplace actions can reduce duplicated work, but each action also adds supply chain risk. Teams should prefer maintained actions from verified creators, review permissions, pin versions, read release notes and avoid giving broad tokens to actions that only need limited access.

An action that calls an external service, such as a GIF generator, usually needs a service token stored as a repository secret. If the token is missing or invalid, the workflow may fail with an authentication error such as HTTP 403. The remedy is to create the external service token, save it as a secret with the exact name used in the workflow, and rerun the triggering event.

Automation can also become noise. Fun or cosmetic workflows should not block important delivery work. Build, test, security and deployment workflows should receive priority over novelty actions.
## Example Code
```YAML
# File: .github/workflows/node-ci.yml

name: Node.js CI and Review Automation

on:
  # Runs when commits are pushed to the default branch.
  push:
    branches:
      - main

  # Runs when pull requests target the default branch.
  pull_request:
    branches:
      - main
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review

  # Runs when someone submits a pull request review.
  pull_request_review:
    types:
      - submitted

  # Allows manual execution from the GitHub Actions tab.
  workflow_dispatch:
    inputs:
      run_extra_checks:
        description: "Run extra checks?"
        required: false
        default: "false"

  # Runs on a schedule. Cron uses UTC.
  schedule:
    - cron: "0 2 * * 1"

  # Allows an external service to trigger the workflow through the API.
  repository_dispatch:
    types:
      - external-ci-request

# Give the default GITHUB_TOKEN only the access it needs.
permissions:
  contents: read
  pull-requests: write
  issues: write

# Workflow-level environment variables.
env:
  CI: true
  NODE_OPTIONS: --enable-source-maps

jobs:
  hello:
    name: Minimal hello workflow
    runs-on: ubuntu-latest

    steps:
      # A "uses" step calls a reusable action.
      - name: Check out repository
        uses: actions/checkout@v6

      # A "run" step executes shell commands on the runner.
      - name: Print workflow context
        run: |
          echo "Workflow: $GITHUB_WORKFLOW"
          echo "Event: $GITHUB_EVENT_NAME"
          echo "Branch or ref: $GITHUB_REF"
          echo "Actor: $GITHUB_ACTOR"

  build:
    name: Build on Node ${{ matrix.node-version }} / ${{ matrix.os }}
    needs: hello

    # Matrix builds test multiple environments.
    strategy:
      fail-fast: false
      matrix:
        node-version:
          - 22
          - 24
        os:
          - ubuntu-latest
          - windows-latest

    # GitHub-hosted runner selected from the matrix.
    runs-on: ${{ matrix.os }}

    # Job-level permissions can be more restrictive than workflow-level permissions.
    permissions:
      contents: read

    # Job-level environment variable.
    env:
      NODE_ENV: test

    steps:
      - name: Check out repository
        uses: actions/checkout@v6

      - name: Set up Node.js
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build --if-present

      - name: Run tests
        run: npm test

      - name: Create example test report
        run: |
          mkdir -p reports
          echo "Tests completed on Node ${{ matrix.node-version }} using ${{ matrix.os }}" > reports/test-summary.txt

      # Artifacts preserve files after the job finishes.
      - name: Upload test report artifact
        uses: actions/upload-artifact@v4
        with:
          name: test-report-node-${{ matrix.node-version }}-${{ matrix.os }}
          path: reports/

  package:
    name: Package build output
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v6

      - name: Set up Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build distributable package
        run: |
          npm run build --if-present
          mkdir -p dist
          echo "Example packaged output" > dist/app.txt

      - name: Upload package artifact
        uses: actions/upload-artifact@v4
        with:
          name: node-package
          path: dist/

  verify-artifact:
    name: Download and verify artifact
    needs: package
    runs-on: ubuntu-latest

    steps:
      - name: Download package artifact
        uses: actions/download-artifact@v5
        with:
          name: node-package
          path: downloaded-package

      - name: Inspect downloaded artifact
        run: |
          echo "Downloaded files:"
          ls -R downloaded-package
          cat downloaded-package/app.txt

  secret-backed-step:
    name: Example secret-backed external service step
    needs: build
    runs-on: ubuntu-latest

    # Avoid exposing secrets to untrusted pull request code.
    if: github.event_name != 'pull_request'

    steps:
      - name: Call external service using a repository secret
        env:
          EXTERNAL_SERVICE_TOKEN: ${{ secrets.EXTERNAL_SERVICE_TOKEN }}
        run: |
          if [ -z "$EXTERNAL_SERVICE_TOKEN" ]; then
            echo "Secret EXTERNAL_SERVICE_TOKEN is not configured."
            exit 1
          fi

          echo "A real workflow could call an external API here."
          echo "Never print the actual secret value."

  label-approved-pr:
    name: Label approved pull request
    runs-on: ubuntu-latest

    # This job runs only when a PR review is submitted with approval.
    if: >
      github.event_name == 'pull_request_review' &&
      github.event.review.state == 'approved'

    permissions:
      contents: read
      pull-requests: write
      issues: write

    steps:
      - name: Add approval label
        uses: actions/github-script@v8
        with:
          script: |
            const pullRequest = context.payload.pull_request;

            if (!pullRequest) {
              core.info("No pull request found in event payload.");
              return;
            }

            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: pullRequest.number,
              labels: ["review-approved"]
            });

            core.info(`Added review-approved label to PR #${pullRequest.number}.`);

  optional-extra-checks:
    name: Optional manually triggered checks
    runs-on: ubuntu-latest

    # Runs only when manually started with run_extra_checks=true.
    if: >
      github.event_name == 'workflow_dispatch' &&
      inputs.run_extra_checks == 'true'

    steps:
      - name: Check out repository
        uses: actions/checkout@v6

      - name: Run extra checks
        run: |
          echo "Running extra manual checks..."
          npm audit --audit-level=high || true
```
## Summary
GitHub Actions automates software workflows from inside the repository. A workflow file defines triggers, jobs, runners, steps, actions, secrets and artifacts. Events start workflow runs. Runners execute jobs. Logs show what happened. Secrets protect sensitive values. Artifacts move outputs between jobs or preserve them after a run.

The strongest workflow combines automation with repository governance. CI catches build and test failures early. Matrix jobs test supported environments. Artifacts preserve outputs. Branch protections or rulesets require reviews and passing checks before code reaches the default branch. Marketplace actions can extend the workflow, but they should be versioned, maintained and given only the permissions they need.