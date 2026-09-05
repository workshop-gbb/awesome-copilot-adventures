# Automaton Foundry lab

Build and evaluate a minimal TypeScript application with the GitHub Copilot SDK.

## Isolate the exercise

Copy this lab to a disposable location and open `starter/` as the workspace root. Do not add credentials to source files.

## Mission

1. Complete `starter/index.ts`:
   - read the prompt from command-line arguments;
   - create `CopilotClient`;
   - create a session with `model: "auto"`;
   - call `sendAndWait`;
   - print the returned content;
   - stop the client in `finally`.
2. Complete the five cases in `starter/evaluation.json`:
   - grounded explanation;
   - bounded plan;
   - verified implementation;
   - unsupported request;
   - controlled tool failure.
3. Run the deterministic structural verifier:

```bash
node ../verify.js
```

4. If Copilot CLI authentication is available, run the application:

```bash
npm install
npm start -- "Explain the evidence required before declaring a task complete."
```

Record the command, exit code, observed response, and authentication limitations. The verifier does not claim model quality or make a network call.
