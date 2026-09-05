# Echo Chamber starter

This runnable Node.js application is the controlled subject for **The Hall of Context Mirrors**.

Learners perform the same scoped change in fresh sessions with progressively richer context:

1. prompt only;
2. explicit file context;
3. repository instructions;
4. path-specific instructions;
5. custom agent;
6. custom agent plus skill.

The objective is not to prove that one configuration is universally faster. Compare observable evidence: tests passed, files changed outside scope, failed commands, human interventions, and whether the requested validation ran.

## Run

```bash
cd labs/context-mirrors/starter
npm test
npm start
```

Open `http://localhost:3000` and probe `http://localhost:3000/api/health`.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/analyze` | Detect a supported sequence pattern |
| POST | `/api/predict-multiple` | Predict multiple values |
| POST | `/api/generate` | Generate a supported sequence |
| GET | `/api/statistics` | Return observed analysis statistics |
| GET | `/api/history` | Return in-memory history |
| DELETE | `/api/history` | Clear history |
| GET | `/api/export` | Export history |
| GET | `/api/trends` | Summarize observed patterns |
| GET | `/api/health` | Runtime health |

Performance numbers are intentionally not promised. Measure them on the environment where the experiment runs.
