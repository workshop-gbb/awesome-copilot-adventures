# Skills of Algora lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/algora-skills.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/.github/skills/evidence-report/SKILL.md`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The file has valid metadata, a narrow use case and no instruction to invent successful results. |

**Concept in practice:** An evidence-report skill is useful after a code change with a test command. A request to brainstorm a name should not trigger a fake verification report just because the skill exists.


Build a small reusable skill for evidence-first completion reports.

## Isolate the exercise

Copy this lab to a disposable location and open `starter/` as the workspace root. Start a new session so the skill is discovered under `.github/skills/`.

## Mission

Complete `starter/.github/skills/evidence-report/SKILL.md`:

- keep YAML frontmatter with `name` and `description`;
- add steps to run the requested verification;
- require recording the command, exit code, and observed result;
- prohibit unsupported success claims.

From `starter/`, run `node ../verify.js`. Record separate evidence that the selected harness discovered or invoked the skill.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Define when evidence-report is relevant and when it is not. Specify the procedure for running an existing check and reporting real output, including blocked or failed checks.
4. Implement only the approved slice, then rerun the same verifier.
5. Remove the observed-result requirement and confirm the structural check rejects it. Restore the rule and compare one in-scope and one out-of-scope request.
6. Review the diff and record the limitation: The verifier checks skill content; actual discovery and invocation depend on the selected harness.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/02-intermediate/algora-skills/README.md).
