# GitHub Copilot Fundamentals: AI Paired Programming
GitHub Copilot is an AI coding assistant that supports software development across editors, GitHub.com and command-line workflows. It can suggest code as a developer types, answer questions about a project, explain unfamiliar code, draft tests, propose refactors, review changes and help complete repository tasks. Current Copilot features also include agent-based workflows that can plan and implement changes for human review.

Copilot can reduce the time spent recalling syntax, creating routine structures and searching for common implementation patterns. It does not replace programming knowledge, engineering judgement or team controls. Its responses are probabilistic, so the same prompt can produce different results. Generated code can be incomplete, insecure, inefficient or unsuitable for the project. Developers must inspect, test and review every proposed change.

GitHub research found that developers completed one controlled coding task up to 55 per cent faster with Copilot. That result describes a particular study, not a guaranteed improvement across all developers, languages or projects. Productivity depends on task complexity, codebase quality, prompt quality, tool configuration and the developer's ability to validate the output. Copilot can help developers stay focused, but it does not create a universally tenfold improvement.
## Core capabilities
Copilot provides several related forms of assistance:
- Inline suggestions complete a line, block or function while a developer types.
- Natural-language comments can prompt code generation inside a source file.
- Copilot Chat answers questions, explains code, proposes changes and uses supplied project context.
- Edit and agent modes can update several files, run tools and prepare larger changes for review.
- Code review can identify possible defects and suggest fixes.
- Command-line support can explain commands, draft commands and assist with terminal-based development.
- GitHub features can summarise repository information, support pull requests and work with issues.

Copilot supports many programming languages and frameworks. GitHub identifies Python, JavaScript, TypeScript, Ruby, Go, C# and C++ among the languages for which inline suggestions work especially well. Performance still varies because languages, frameworks and code patterns differ in their representation, complexity and available context.

GitHub now offers a range of individual, education and organisational plans, including Free, Student, Pro, Pro+, Max, Business and Enterprise options. Features, model access, usage allowances and prices change over time. The current plan documentation provides the authoritative comparison. The former Copilot X name described an early product vision rather than a current subscription tier.
## Getting started
A developer first needs a GitHub account and access through an eligible Copilot plan. Copilot works through supported extensions and integrations in environments such as Visual Studio Code, Visual Studio, JetBrains IDEs, Vim or Neovim, Xcode and Eclipse. It also operates on GitHub.com and through command-line tools. Installation requirements differ by environment, so the developer should follow the current GitHub instructions for the selected editor.

A sound setup includes more than installing an extension. The developer should also:
- confirm which Copilot features and models the plan permits
- review personal or organisational policies
- configure public-code matching preferences
- exclude sensitive content where the plan supports content exclusion
- keep relevant project files available as context
- establish tests, formatting, linting and security checks before accepting generated changes

Copilot performs best when the repository already communicates its design. Clear names, small functions, accurate documentation, consistent patterns and reliable tests give the assistant better evidence about the intended behaviour.
## AI-assisted development workflow
An effective workflow treats Copilot as a collaborator whose work requires supervision. The developer defines the goal, supplies relevant context, requests a small change, reviews the response, runs the code and then decides whether to accept, revise or reject it. Small validated steps reduce the risk of combining several hidden errors into one large change.

A useful cycle follows six stages:
1. State the outcome and constraints.
2. Identify the files, functions, interfaces and examples that establish context.
3. Ask for one coherent change.
4. Inspect the explanation and the proposed diff.
5. Run tests, static analysis and manual checks.
6. Commit a verified increment before starting the next change.

The developer should ask Copilot to explain unfamiliar code before accepting it. An explanation can expose assumptions about input, state, dependencies and error handling. The developer should then verify the explanation against the actual code because Copilot can describe code inaccurately.

Git version control remains essential. A clean branch, small commits and readable diffs make generated changes easier to audit and reverse. Copilot can accelerate implementation, but Git records what changed and supports accountable review.
## Working with chat, suggestions and alternatives
Inline completion and chat solve different parts of a development problem. Inline completion works well when the surrounding code already establishes a clear pattern. A function name, type signature, comment or partially written loop can give Copilot enough context to suggest the next lines. Chat works better when the developer needs an explanation, a plan, a comparison or coordinated changes across files.

A developer can use chat to ask how two files interact, why a test fails, which edge cases remain uncovered or how a proposed refactor affects an interface. The prompt should identify the relevant files or selected code. Requests such as `explain the control flow in the selected function` or `find the cause of the failing score update without changing the public API` create a narrower and more reviewable response than a broad request to fix everything.

Copilot may present alternative completions or different implementation strategies. The developer should compare them against project requirements rather than select the longest or most sophisticated option. A suitable solution should fit the existing style, minimise new dependencies, handle errors, remain testable and avoid unnecessary complexity.

A small Fibonacci function demonstrates the pattern. A comment can request a function that returns the first n values. Copilot may generate a loop and then suggest a call site. Before acceptance, the developer should decide how the function handles zero, negative values, non-integers and large inputs. The developer should also decide whether the function prints, returns a list or yields values. These choices belong in the specification because a plausible implementation can still expose the wrong interface.

Chat can explain the generated function, but the developer should verify the explanation by tracing variables and running examples. Tests for n values of zero, one, two and a typical larger value reveal boundary errors. Static type checking or runtime validation can enforce the intended input contract.

Open and referenced files can improve context, but excess context can reduce precision. The developer should keep relevant interfaces, tests and configuration available while excluding unrelated logs, generated files and obsolete code. Explicit file references produce more dependable results than assuming that Copilot has selected the correct context.
## Debugging and code quality
Copilot can support debugging by interpreting an error message, locating suspicious code and proposing a change. A disciplined debugging prompt includes the observed behaviour, expected behaviour, reproduction steps, relevant logs and the smallest code section that demonstrates the fault. The developer should ask for possible causes before requesting a patch when the cause remains uncertain.

Generated fixes need regression tests. A patch that removes the visible symptom can break another path or hide the underlying defect. The developer should first add a test that fails for the reported bug, then apply the smallest suitable change and confirm that the complete suite passes.

Code quality also includes readability and maintenance. Copilot can rename unclear variables, split large functions, add type annotations and remove duplication. The developer should constrain these requests so the refactor preserves behaviour and public interfaces. Large style changes mixed with functional changes make review harder and should normally occur in separate commits.

Documentation generated by Copilot requires the same scrutiny as code. Comments can become false when they describe an assumption rather than actual behaviour. Useful documentation records purpose, constraints, inputs, outputs, side effects and non-obvious design choices. It should not paraphrase every line.
## Building a browser-based Snake game
A small Snake game demonstrates an incremental Copilot workflow. A developer can create a repository with an HTML page and a separate JavaScript file, then ask Copilot to scaffold a basic game using an HTML canvas. The initial version needs a game loop, keyboard input, snake movement, food placement, growth and collision detection.

The developer should separate structure from behaviour. The HTML file can define the canvas, heading, instructions and score display. The JavaScript file can define game state, drawing, input handling, movement and collision rules. Copilot can add comments, but those comments should explain intent rather than repeat the code.

The game can then improve through focused prompts:
- add a visible border and centre the canvas with CSS
- create obstacles and detect collisions with them
- wrap the snake from one edge to the opposite edge
- track and display the score after food consumption
- stabilise the layout so the score does not move the canvas
- improve colours, spacing, instructions and accessibility

Each change requires a browser test. The developer should check keyboard behaviour, wall wrapping, obstacle placement, food placement, self-collision, scoring and restart behaviour. Random placement also needs safeguards so food and obstacles do not appear inside the snake or in impossible positions.

The exercise shows both the value and the limits of AI assistance. Copilot can quickly produce scaffolding and explain unfamiliar JavaScript or CSS. The developer still determines the rules, detects visual defects, notices missing edge cases and decides whether the implementation fits the intended game.
## Prompt engineering
Prompt engineering is the practice of shaping instructions and context so an AI system can produce a useful response. A good prompt connects the development goal with the relevant code, constraints and acceptance criteria. Copilot cannot infer every unstated requirement, even when it recognises a familiar pattern.

A strong prompt usually includes:
- the goal or problem
- the relevant language, framework and files
- required inputs and outputs
- constraints on libraries, interfaces, performance or style
- edge cases and error behaviour
- an example of the desired result
- the form of the response, such as a plan, explanation, patch or tests

A weak prompt such as `make the game better` gives Copilot broad freedom and produces unpredictable changes. A stronger prompt identifies a bounded result, such as adding a score element above the canvas, incrementing it only when the snake eats food and preventing the layout from shifting.

Developers should begin with the overall goal and then add specific requirements. Large tasks should be divided into smaller tasks that can be tested independently. Ambiguous pronouns and vague references should be replaced with file names, function names or selected code. Relevant context should remain available, while unrelated files and stale chat history should be removed when they distract the model.

Examples can improve a response. In prompting, zero-shot, one-shot and few-shot describe the number of examples supplied with the request. A zero-shot prompt provides instructions without an example. A one-shot prompt includes one example. A few-shot prompt includes several examples that demonstrate the intended pattern. These terms describe in-context guidance, not additional training of the underlying model during the conversation.

A creative coding exercise in p5.js illustrates the process. A broad request to draw a boat may produce an image with the wrong proportions, colours and positions. A better prompt can define a brown hull, a dark mast, a triangular white sail, blue water, a light-blue sky, an overlapping three-circle cloud and a layered sun in the top-right corner. The developer can then refine individual elements rather than regenerate the entire scene without direction.

Prompting remains iterative. When a result fails, the developer should identify the failure, adjust the requirement and try again. Repeated generation without analysing the error often wastes time. A concise correction such as `keep the public function signature unchanged and add validation for non-positive integers` gives the model a clearer target.
## Models, context and response generation
Large language models process a prompt and predict a response from patterns learned during training and from the context supplied at run time. They represent text and code as tokens, evaluate relationships among those tokens and generate output step by step. This process explains why responses can sound confident while containing errors. The model predicts plausible output rather than proving that the output is correct.

GitHub Copilot no longer relies on one fixed OpenAI Codex model. Current Copilot products can use models from several providers, including Microsoft, OpenAI, Anthropic and Google. Available models vary by feature, plan, policy and product surface. Some interfaces let the developer choose a model, while automatic selection can choose a model for the request.

Copilot builds a contextual prompt from the developer's request and information available to the feature. Context can include the active file, selected code, open files, workspace information, repository content, chat history, referenced files, tool results or web information when enabled. The exact context depends on the environment, permissions and mode. Fixed claims about a universal character window or one unchanging data path do not describe the current product.

The service sends the assembled request to an eligible model and returns generated content through GitHub's product controls. Filtering and public-code matching can affect the result. Model hosting and data handling differ across providers and plans, so teams should base privacy decisions on current GitHub documentation, contractual terms and administrator settings rather than old architectural descriptions.
## Security, privacy and intellectual property
Copilot can suggest vulnerable code. Common risks include weak validation, insecure authentication, injection flaws, unsafe file handling, exposed credentials, outdated dependencies and incorrect cryptography. The assistant can also omit error handling or invent APIs. Security filters reduce some risks but cannot guarantee safe code.

Developers should apply the same or stronger controls used for human-authored changes:
- review every diff and require peer review for significant changes
- run unit, integration and end-to-end tests
- use formatters, linters and type checking
- scan dependencies and code for vulnerabilities
- scan repositories for secrets and remove exposed credentials
- test authorisation, validation and failure paths
- verify external packages, versions and licences
- use protected branches and continuous integration

GitHub provides tools such as Dependabot, code scanning, secret scanning and GitHub Actions. These tools support review but do not transfer responsibility away from the developer or organisation.

Copilot may use source code, selected text, repository information and conversation history as context. The scope varies by feature. Developers should not assume that the assistant sees only the current line, and they should not paste secrets, private keys, credentials, regulated data or unnecessary personal information into prompts. Organisations can use policies, model controls and content exclusion where available.

Data retention, model improvement and provider processing depend on the plan, feature, settings and applicable terms. Teams handling confidential or regulated code should confirm the current arrangements before deployment. They should document approved use cases, prohibited data, access controls, retention requirements and incident procedures.

Copilot checks many suggestions for matches with publicly available code. Depending on policy and product support, it can block a matching suggestion or show a code reference with repository and licence information. This feature helps identify possible provenance but does not provide complete licence clearance. Developers must still review the referenced source, its licence and the compatibility of any obligations with the project.

Generated output can resemble existing code or carry legal and technical risks. GitHub's terms govern the service, but the developer remains responsible for deciding whether to use a suggestion. Teams should preserve attribution when required, avoid copying code with incompatible terms and seek legal advice for high-risk licensing questions.
## Building and testing a Python game
A rock-paper-scissors program provides a compact exercise in generation, refactoring and testing. The developer can begin with comments that define the intended flow: display a welcome message, collect the player's choice, generate the computer's choice, compare the choices, report the result and offer another round.

Copilot can generate an initial implementation, but an interactive function that mixes input, randomness and game rules is difficult to test. The developer should separate pure game logic from user interaction. A function that receives two choices and returns a result can be tested without reading input or controlling random behaviour. Another function can handle the terminal conversation.

The test suite should cover every rule:
- each choice defeats one other choice
- each choice loses to one other choice
- equal choices produce a draw
- invalid input receives defined handling
- repeated play and exit behaviour work as intended

The developer should inspect Copilot's tests rather than accept a green result automatically. A generated test can repeat the implementation's mistake, omit an assertion or exercise the wrong branch. Mutation, boundary and manual testing can reveal weaknesses that a shallow generated suite misses.

After local tests pass, GitHub Actions can run them on pushes and pull requests. Continuous integration gives the team a repeatable check, while branch protection can prevent untested changes from merging. Copilot can draft the workflow file, but the developer must verify the operating system, language version, dependency installation, test command and permissions.
## Where Copilot performs well
Copilot often performs well on routine and pattern-rich tasks. Useful examples include project scaffolding, repetitive transformations, data models, API clients, common CSS changes, regular expressions, command syntax, documentation, test cases and straightforward refactoring. It can also help a developer enter an unfamiliar language by translating a known design into new syntax and explaining the result.

The assistant becomes less reliable when requirements remain unstated, domain rules are complex, the repository lacks tests or the task depends on current external facts. It can struggle with large architectural decisions, subtle concurrency, performance constraints, novel algorithms and security-critical code. These tasks require deeper context and stronger human review.

Copilot works best when a developer already knows how to evaluate the response. Beginners can use it as a tutor, but they should ask for explanations, trace execution, consult primary documentation and practise writing code without generated assistance. Otherwise, rapid output can hide gaps in understanding.
## Responsible adoption
A team should introduce Copilot through an engineering process rather than through unmeasured enthusiasm. A pilot can identify suitable tasks, define safeguards and compare outcomes such as cycle time, review effort, escaped defects, security findings and developer satisfaction. The team should distinguish faster code production from faster delivery of reliable software.

Clear governance should specify approved features, models and repositories. It should also define rules for confidential data, public-code matches, third-party licences, agent permissions and human approval. Agent-based features can read files, call tools and change several parts of a repository, so their permissions and proposed actions require careful review.

Copilot should complement established DevSecOps practices. Peer review, automated tests, deterministic linters, type systems, dependency controls and security scanning remain necessary because they evaluate code through methods that differ from probabilistic generation. A model can suggest a fix, but the engineering system must verify it.

The strongest use of Copilot keeps the developer in control. The developer supplies intent, constrains the task, reviews the evidence and accepts only validated work. Copilot then reduces routine effort and supports exploration without weakening accountability for the software.