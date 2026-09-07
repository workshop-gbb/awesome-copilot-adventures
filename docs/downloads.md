---
title: Download and start a lab
layout: default
nav_order: 10
permalink: /downloads/
last_verified: "2026-09-07"
---

# Download a lab. Keep your work separate.

One exercise, one learner kit, one disposable workspace. Start with the material
you need instead of cloning every language, installing every dependency or copying
an instructor's finished solution.

> [!TIP]
> **First visit?** Choose **01 — Context and interface** below. You need Node 24
> for its local tests; Copilot access is separate. No GitHub repository or cloud
> subscription is required for the local exercise.

| Your goal | Start here |
| --- | --- |
| Practice a professional scenario | A hands-on kit below |
| Follow the fantasy learning path | An adventure kit below |
| Understand the sequence first | [Curriculum map](curriculum-map.md) |
| Choose a runtime or solve setup problems | [Environment guide](../mslearn-github-copilot/Instructions/Reference/SETUP.md) |
| Verify a download | [Checksums](../assets/lab-kits/SHA256SUMS.txt) and [kit inventory](../assets/lab-kits/index.json) |

## What a kit contains

| File or folder | Use it for |
| --- | --- |
| `KIT-START.md` | Runtime, workspace root, baseline command and expected starting state |
| `KIT-LESSON.md` | Snapshot of the complete exercise instructions |
| Original project files | Starter code, existing tests, synthetic data and configuration |
| `.workshop/` | Local setup guidance and the lesson's bundled images |
| `KIT-MANIFEST.json` | Per-file sizes and SHA-256 hashes |
| `KIT-VERIFY.cjs` | Integrity check before you change the starter |
| `KIT-LICENSE.txt` | License accompanying the redistributed material |

Kits exclude the instructor `reference` directory, Git history, dependencies,
caches and local environment files. They do not include accounts, runtimes or
credentials. The canonical lesson and code remain in English inside the package;
the learning site also offers Spanish and Brazilian Portuguese reading views.
External official references still need an internet connection.

> [!IMPORTANT]
> **A starter is not a completed application.** Some first checks deliberately fail.
> Follow the expected state in `KIT-START.md`; a missing runtime, an import error
> or an empty test run is not a successful reproduction of an intentional failure.

## 1. Select and download

On the learning site, a ZIP link downloads the archive directly. On GitHub, if the
link opens a file preview, select **Download raw file**. Download the matching
checksum inventory from the same reviewed revision.

### Hands-on kits

The five preparation guides reuse the associated exercise kit; they do not need
five duplicate archives. Choose either the C# or Python variant for language-paired
labs, not both at once.

| Lab | Download | First local check |
| --- | --- | --- |
| 01 — Context and interface | [01-interface.zip](../assets/lab-kits/hands-on/01-interface.zip) | Greeting tests |
| 02 — Analyze C# | [02-csharp.zip](../assets/lab-kits/hands-on/02-csharp.zip) | Library tests |
| 02 — Analyze Python | [02-python.zip](../assets/lab-kits/hands-on/02-python.zip) | Library tests |
| 03 — Develop C# | [03-csharp.zip](../assets/lab-kits/hands-on/03-csharp.zip) | Existing library tests |
| 03 — Develop Python | [03-python.zip](../assets/lab-kits/hands-on/03-python.zip) | Existing library tests |
| 04 — xUnit | [04-xunit.zip](../assets/lab-kits/hands-on/04-xunit.zip) | Existing service tests |
| 04 — pytest | [04-pytest.zip](../assets/lab-kits/hands-on/04-pytest.zip) | Dependency-free unittest baseline |
| 05 — Refactor C# | [05-csharp.zip](../assets/lab-kits/hands-on/05-csharp.zip) | Characterization tests |
| 05 — Refactor Python | [05-python.zip](../assets/lab-kits/hands-on/05-python.zip) | Characterization tests |
| 06 — Shopping prototype | [06-prototype.zip](../assets/lab-kits/hands-on/06-prototype.zip) | Cart domain tests, not UI completion |
| 07 — Duplication | [07-duplication.zip](../assets/lab-kits/hands-on/07-duplication.zip) | Selected project build |
| 08 — Large functions | [08-functions.zip](../assets/lab-kits/hands-on/08-functions.zip) | Console project build |
| 09 — Decision rules | [09-conditionals.zip](../assets/lab-kits/hands-on/09-conditionals.zip) | Pricing project build |
| 10 — Bounded profiling | [10-profiling.zip](../assets/lab-kits/hands-on/10-profiling.zip) | Analyzer build; no load test |
| 11 — Issues | [11-issues.zip](../assets/lab-kits/hands-on/11-issues.zip) | Baseline passes; regression is initially red |
| 12 — Secret remediation | [12-secrets.zip](../assets/lab-kits/hands-on/12-secrets.zip) | Offline policy tests |
| 13 — Greenfield | [13-greenfield.zip](../assets/lab-kits/hands-on/13-greenfield.zip) | Intentional unfinished-store failure |
| 14 — Brownfield feature | [14-brownfield.zip](../assets/lab-kits/hands-on/14-brownfield.zip) | Old contract passes; feature is initially red |
| 15 — Customization | [15-customization.zip](../assets/lab-kits/hands-on/15-customization.zip) | Inventory tests |
| 16 — Copilot SDK | [16-sdk.zip](../assets/lab-kits/hands-on/16-sdk.zip) | Offline application tests |
| 17 — Modernization | [17-modernization.zip](../assets/lab-kits/hands-on/17-modernization.zip) | CSV baseline; migration is initially red |

### Adventure kits

Each kit contains the lab, its verifier and the adventure instructions. A verifier
rejects an unfinished exercise unless the table says otherwise. Host discovery and
live integrations require separate evidence.

| Level | Download | What the local work establishes |
| --- | --- | --- |
| Foundations | [portals-of-nexus.zip](../assets/lab-kits/adventures/portals-of-nexus.zip) | Role, harness, target and environment mapping |
| Foundations | [context-mirrors.zip](../assets/lab-kits/adventures/context-mirrors.zip) | Passing sequence baseline for controlled experiments |
| Basics | [tempora-loop.zip](../assets/lab-kits/adventures/tempora-loop.zip) | Bounded convergence behavior |
| Basics | [eldoria-laws.zip](../assets/lab-kits/adventures/eldoria-laws.zip) | Repository instruction contract |
| Intermediate | [algora-skills.zip](../assets/lab-kits/adventures/algora-skills.zip) | Focused skill structure |
| Intermediate | [stellaris-agents.zip](../assets/lab-kits/adventures/stellaris-agents.zip) | Custom-agent profile and handoff definition |
| Intermediate | [stonevale-guardrails.zip](../assets/lab-kits/adventures/stonevale-guardrails.zip) | Deterministic command policy |
| Advanced | [cartographer-mcp.zip](../assets/lab-kits/adventures/cartographer-mcp.zip) | Local read-only MCP exchange |
| Advanced | [lumoria-graph.zip](../assets/lab-kits/adventures/lumoria-graph.zip) | Cycle-safe dependency traversal |
| Advanced | [mythos-parallel.zip](../assets/lab-kits/adventures/mythos-parallel.zip) | Parallel task execution and ordered results |
| Surfaces | [cloud-citadel.zip](../assets/lab-kits/adventures/cloud-citadel.zip) | Bounded cloud-task contract, not a cloud run |
| Surfaces | [terminal-gate.zip](../assets/lab-kits/adventures/terminal-gate.zip) | Safe command parser, not CLI authentication |
| Surfaces | [automaton-foundry.zip](../assets/lab-kits/adventures/automaton-foundry.zip) | SDK structure and evaluation plan; live run separate |
| Capstone | [convergence-of-three-realms.zip](../assets/lab-kits/adventures/convergence-of-three-realms.zip) | Traceable cross-environment workflow contract |

## 2. Verify and extract on your system

Choose an existing project/work drive with enough space. The paths below are
examples: replace them with your approved work location. Never extract over an
existing repository. On the shared workshop Mac, use the T9 work drive.

| System | Check the downloaded ZIP | Extract into a new directory |
| --- | --- | --- |
| Windows PowerShell | `Get-FileHash .\01-interface.zip -Algorithm SHA256` | Right-click ZIP → **Extract All**; choose a new work-drive folder |
| macOS | `shasum -a 256 01-interface.zip` | Finder → double-click the ZIP in your chosen work-drive directory |
| Linux | `sha256sum 01-interface.zip` | File manager → **Extract Here**, in your chosen work-drive directory |

Compare the full hash with the entry in `SHA256SUMS.txt`. A hash from inside an
untrusted archive does not authenticate that archive. Review the repository and
download origin before executing any code.

Open the extracted folder and read `KIT-START.md`. It specifies whether VS Code
should open the kit root or `starter/`. Use **File → Open Folder** in a new window.
Do not leave another repository in a multi-root workspace.

**Checkpoint:** you can find the source, lesson and manifest on disk outside the
ZIP viewer. If Node 24 is installed, `node KIT-VERIFY.cjs` from the kit root checks
that extraction preserved the packaged files.

## 3. Run only the selected baseline

1. Read the runtime requirement in `KIT-START.md`.
2. Select the matching interpreter/SDK. Do not install all language stacks.
3. Use the working directory printed beside the baseline command.
4. Record the command, discovered tests, exit code and actual output.
5. Compare the result with **expected pass** or **intentional starter failure**.
6. Continue with `KIT-LESSON.md`: concepts, Ask, Plan, Agent, negative checks and review.

Local contract tests do not need Copilot authentication. A live agent, CLI, SDK or
cloud exercise may require account access and can consume usage. Keep it separate.

## 4. Create a local repository, if needed

Run these commands **inside the extracted kit root**, after inspecting its files:

```bash
git init -b training
git status --short
```

Review the file list. Exclude dependencies, environment files and runtime data in
the local `.gitignore` before staging. If Git needs an identity, configure it for
this repository only, with your own approved name and email.

```bash
git config user.name "YOUR NAME"
git config user.email "YOUR APPROVED EMAIL"
git add .
git commit -m "Record untouched learning baseline"
```

The two identity values are placeholders, not commands to copy unchanged.
Creating this local baseline does not create a repository on GitHub.

## 5. Optionally publish to your own GitHub repository

> [!CAUTION]
> Publishing transfers files to GitHub. Review licenses and every staged file.
> Never upload credentials, real personal data or instructor-private material.
> A private repository is a sensible default, not permission to upload secrets.

1. Sign in to GitHub using your authorized account.
2. Select **New repository** and choose an owner you are allowed to use.
3. Enter a unique training name and choose the appropriate visibility.
4. Leave initialization with README, license and `.gitignore` unchecked: the local
   kit already has files and a commit.
5. Create the empty repository and copy its HTTPS URL.
6. In the kit root, inspect `git remote -v`. If there is already an `origin`, stop
   and confirm which repository it identifies; do not replace it automatically.
7. Add the copied URL and push the training branch:

```bash
git remote add origin https://github.com/YOUR-OWNER/YOUR-TRAINING-REPOSITORY.git
git push -u origin training
```

Replace the URL placeholders. Use GitHub's approved authentication flow; do not
place an access token in the URL or a document. Check the branch and files on GitHub.
A cloud-agent assignment or pull request is a later, separately reviewed action.

## Finish, troubleshoot and reset

| Symptom | Next action |
| --- | --- |
| A file is missing after extraction | Download again and compare the archive hash; do not invent a replacement |
| `KIT-VERIFY.cjs` fails after editing | Expected when hashes changed; use the lesson tests for implementation evidence |
| Command not found | Install/select only the runtime named by the chosen kit |
| Python cannot find a module | Check the kit's `library` working directory and interpreter |
| A customization is not discovered | Open the specified root, including `starter/` where required |
| GitHub push is rejected | Verify owner, URL, authentication and branch; do not force-push |
| An advanced feature is unavailable | Record the blocker and use the documented local/paper alternative |

- [ ] Keep the original archive as a clean baseline.
- [ ] Save the diff, executed checks and limitations.
- [ ] Stop only processes and sessions created for the exercise.
- [ ] Extract into a new unused directory for another attempt.
- [ ] Close only exercise-owned remote resources after reviewing what must be preserved.

## Maintainer reproducibility

From the curriculum checkout, run `npm run build:kits` after changing a packaged
lesson, fixture or image. `npm run check:kits` rejects missing/stale artifacts.
The generator uses Node's standard library, sorted entries, fixed ZIP timestamps,
bundled licenses, file manifests and SHA-256 inventory. It never runs learner code.
This is reproducibility for the declared package format, not a security certification.

## Official references

- [Download source archives](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)
- [Add locally hosted code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- [Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git)
- [Open a VS Code workspace](https://code.visualstudio.com/docs/editing/workspaces/workspaces)
