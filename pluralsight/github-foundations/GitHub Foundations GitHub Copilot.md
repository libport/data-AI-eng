## GitHub Copilot foundations
GitHub Copilot is an AI coding assistant that supports software development in integrated development environments, on GitHub, in mobile tools and through the command line. Depending on the product, plan and editor, Copilot can complete code, propose edits, explain unfamiliar code, generate tests, suggest fixes, review changes and help plan implementation work.

Copilot can reduce repetitive work and help developers explore unfamiliar technologies, but it does not replace technical judgement. Developers remain responsible for architecture, correctness, security, maintainability and compliance.
### How Copilot produces suggestions
Inline suggestions process code near the cursor and relevant context such as the current file and open editor tabs. Copilot sends that prompt to a language model, receives a proposed completion or edit, and displays it separately from the accepted code. The developer can accept, reject or modify the proposal.

Context varies across Copilot features and clients. Chat and agent workflows can also use selected files, repository instructions, conversation history, explicit file references and approved tools. Some agents can inspect a broader codebase, edit files and run commands. Copilot does not always use every project file, and excessive or irrelevant context can reduce the quality of a response.
### Prompting practices
Effective prompts give Copilot enough direction to produce a useful, testable result.

- State the objective and expected outcome.
- Describe technical constraints, interfaces, conventions and edge cases.
- Open or reference relevant files and remove distracting context.
- Divide a large request into small, ordered tasks.
- Provide examples when formats or behaviours must follow an existing pattern.
- Ask for tests, assumptions and possible failure cases.
- Refine the prompt when the first response is unclear or incomplete.

Specific instructions usually outperform broad requests. A prompt such as `Add exponentiation to this calculator, preserve the current API shape, validate numeric input and add tests for zero and negative exponents` gives clearer direction than `Improve the calculator`.
### Plans and access
GitHub currently lists the following Copilot plans and monthly prices in US dollars:

| Plan | Intended use | Listed monthly price |
|---|---|---:|
| Copilot Free | Limited individual use | $0 |
| Copilot Student | Eligible students | $0 |
| Copilot Pro | Individual development | $10 |
| Copilot Pro+ | Expanded model and feature access | $39 |
| Copilot Max | Highest individual allowance | $100 |
| Copilot Business | Organisations and teams | $19 per granted seat |
| Copilot Enterprise | GitHub Enterprise Cloud organisations | $39 per granted seat |

Paid plans include different feature sets and GitHub AI Credit allowances. Code completions and next edit suggestions remain unlimited on paid plans under the current billing model. Plan availability, allowances and pricing can change, so organisations should confirm current terms before purchasing or assigning seats.
### Adding exponentiation to a Node.js calculator
A small calculator application shows how Copilot can support a controlled change across several files.

1. Run the existing application and test addition, subtraction, multiplication and division to establish a working baseline.
2. Inspect the HTML, client-side JavaScript, server-side controller and CSS before editing them.
3. Add an exponent button that follows the existing markup and styling.
4. Pass one consistent operation token through the interface and client logic.
5. Map that token to `Math.pow(base, exponent)` or JavaScript's exponentiation operator in the calculation layer.
6. Restart the application and test normal inputs, zero, negative values and invalid input.
7. Use Copilot Chat with the relevant files selected to diagnose mismatched tokens or control flow.
8. Adjust the CSS grid so the new control fits the existing layout.

JavaScript uses an exponentiation operator for powers and `^` for bitwise exclusive OR. A calculator may display or transmit `^` as a user-interface token, but its calculation logic must explicitly map that token to exponentiation. Mixing `^` and the exponentiation operator across HTML, client and server code causes dispatch errors unless the application translates them consistently.
### Review and verification
Copilot can generate inaccurate, insecure, outdated or incompatible code. Every proposed change should pass human review, compilation, automated tests, static analysis and security checks. Reviewers should inspect new dependencies, confirm that the implementation follows project conventions, protect secrets and verify that generated code complies with organisational and licensing policies.

The strongest workflow treats Copilot as a fast collaborator. Clear context and focused prompts improve its output, while disciplined review determines whether that output belongs in the codebase.