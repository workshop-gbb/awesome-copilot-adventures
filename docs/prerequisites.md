---
title: Prerequisites and accounts
layout: default
nav_order: 2
permalink: /prerequisites/
last_verified: "2026-09-08"
---

# Prepare your tools, accounts and spending limits

**Goal:** choose one learning environment, install only its required tools, and
prove that you can run a small local check before starting an agent.
Product guidance and official links were checked on **2026-09-08**. Offers,
prices, models and availability can change; the linked provider pages remain
the authority.

External download, signup and product-documentation links on this page **open
in a new tab**. Keep this guide open while following them. Internal lesson links
stay in this tab. On the site, use **Copy code** on a command or prompt block;
in a Markdown file, select and copy the block's contents without the backticks.
Never paste a whole page into a terminal.

> [!IMPORTANT]
> **The first local lab does not require a credit card, Azure, Codespaces, a
> paid Copilot plan or a published GitHub repository.** A GitHub account and
> authorized Copilot access are needed for the live AI steps, not for the
> deterministic local tests. Creating an account does not complete a lab.

## 1. Choose one route

| Route | What runs where | Required for that route |
| --- | --- | --- |
| VS Code Stable, recommended first | Editor and lab on your computer | VS Code, the selected lab runtime and its ZIP |
| VS Code Insiders, optional | Early editor builds on your computer | Insiders and its own checked configuration |
| Copilot CLI | Terminal agent and lab on your computer | Standalone `copilot`, authorized access and the lab runtime |
| GitHub Codespaces, optional | Linux development environment hosted by GitHub | Browser, GitHub account, available quota and reviewed billing settings |

For live Copilot work, add the account and plan checks below. You do not need
both editors or both local and cloud environments. A browser editor is not
automatically a runtime, and Azure is not the service that bills Codespaces.

## 2. Create your personal GitHub account

1. Open <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer">GitHub signup</a>.
2. For this independent workshop, use a **personal email address you control
   and expect to keep**. This is a learning recommendation, not a GitHub rule
   that forbids work addresses. Do not borrow an account or bypass an employer's
   managed-account policies.
3. Follow the signup flow, choose your username and complete the requested
   verification. Never share your password, email verification code or recovery
   codes with an instructor or agent.
4. Verify your email by following GitHub's message. If it does not arrive, check
   the spam folder and the address entered before requesting another message.
5. Enable two-factor authentication, preferably an authenticator or security
   key, and save recovery codes somewhere private.
6. Confirm that your avatar menu shows **your own username**. Use this account
   consistently when activating Copilot and signing in to your chosen client.

**Checkpoint:** you can sign in, your email is verified, and you know how to
recover access. Your GitHub password is not a Git command-line credential.
A local Git repository and a GitHub-hosted repository are different things;
publication is optional and covered in [the download guide](downloads.md).

Official help:
<a href="https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github" target="_blank" rel="noopener noreferrer">create an account</a>,
<a href="https://docs.github.com/en/account-and-profile/how-tos/email-preferences/verifying-your-email-address" target="_blank" rel="noopener noreferrer">verify email</a>,
and <a href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication" target="_blank" rel="noopener noreferrer">configure two-factor authentication</a>.

## 3. Understand Copilot Free and the other plans

**GitHub Free is an account plan; Copilot Free is an AI product plan.** Signing
in to GitHub does not prove that Copilot is enabled in your editor or CLI.
Start with the free option if you are eligible and it covers the exercise.

| Copilot plan | Who it is for | Published price or condition at verification |
| --- | --- | --- |
| Free | Individuals starting with limited usage | Free; 2,000 code completions per month and a limited AI Credits allowance |
| Student | Eligible, verified students | Separate student benefit and activation; not automatically enabled by signup |
| Pro | Individual paid use | US$10 per month |
| Pro+ | Individuals needing a larger included AI allowance | US$39 per month |
| Max | A higher individual usage tier | Check its current price and allowance in the official comparison |
| Business | Organizations managing licenses and policy | US$19 per granted seat per month |
| Enterprise | Eligible organizations using GitHub Enterprise Cloud | US$39 per granted seat per month |

These are published reference prices, not a checkout quote. Taxes, eligibility,
allowances and offers can differ or change. An organization license is not a
reason to purchase a second personal subscription.

Current plans use **GitHub AI Credits** for metered AI usage. A credit is not
one question: usage depends on the model and tokens. Included and flex credits,
available models, additional paid usage and organizational policy differ.
Do not reuse old premium-request tables for new subscriptions; some existing
annual subscriptions remain on explicitly documented legacy billing.
The current Free documentation does not publish a numeric AI Credits allowance
on the pages checked here, so this guide does not invent one.

1. Read the <a href="https://docs.github.com/en/copilot/get-started/plans" target="_blank" rel="noopener noreferrer">official plan comparison</a>
   and the <a href="https://github.com/features/copilot/plans" target="_blank" rel="noopener noreferrer">current purchase options</a>.
2. While signed in to your personal account, follow
   <a href="https://docs.github.com/en/copilot/how-tos/manage-your-account/get-started-with-a-copilot-plan" target="_blank" rel="noopener noreferrer">the plan activation instructions</a>.
   Select Free if eligible; do not select a paid trial or upgrade just to follow
   this workshop.
3. Review usage and billing controls before enabling additional paid usage.
   Copilot, Codespaces and Azure have separate allowances and controls.
4. If your account is managed, ask the administrator about access restrictions;
   do not create a second account to evade policy.

**Copilot CLI is available with all Copilot plans, including Free**, subject to
usage limits and applicable policy. That does not make every model, cloud-agent
operation or IDE integration universally available.
If an allowance is exhausted, record the blocker, continue with local tests,
and resume the AI steps when access is available; upgrading is not compulsory.

Eligible learners can check
<a href="https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students" target="_blank" rel="noopener noreferrer">Copilot Student</a>.
Verification and activation are separate steps; do not assume an academic email
alone grants the benefit. See also
<a href="https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals" target="_blank" rel="noopener noreferrer">individual AI billing</a>
and <a href="https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises/usage-based-billing" target="_blank" rel="noopener noreferrer">organization billing</a>.

## 4. Install VS Code Stable or Insiders

| Edition | Difference | Recommendation |
| --- | --- | --- |
| <a href="https://code.visualstudio.com/download" target="_blank" rel="noopener noreferrer">VS Code Stable download</a> | Normal release channel | Use this for a first workshop |
| <a href="https://code.visualstudio.com/insiders/" target="_blank" rel="noopener noreferrer">VS Code Insiders download</a> | Nightly builds with earlier changes and possible regressions | Optional; use when deliberately testing an upcoming feature |

The editions can run side by side. Insiders is not a paid Copilot plan and does
not grant extra account permissions. Do not assume that installing extensions
or signing in in one edition prepares the other: check the edition and profile
you actually use. Stable and Insiders use different Settings Sync services by
default; sharing them is an explicit choice.

1. Choose your operating system and processor on the download page, then follow
   the installer. On macOS, move the application into Applications.
2. Open the selected editor. Use **File > Open Folder** to open only the
   extracted learning workspace, not your entire home folder.
3. Review the files before granting Workspace Trust. Trust enables execution;
   it is not a claim that downloaded code is safe.
4. Open the Copilot/Chat entry in that edition and follow the GitHub sign-in
   flow. Review requested access and confirm the intended username. If prompted
   for an extension, use the official GitHub publisher.
5. If the terminal command is unavailable on macOS, open the Command Palette
   and run **Shell Command: Install 'code' command in PATH**, or the corresponding
   Insiders command. Reopen the terminal afterward.

For Stable, run this in the **terminal**:

```bash
code --version
```

For Insiders instead:

```bash
code-insiders --version
```

After extracting a kit, change into the workspace named by its first-run guide
and use **one** of these commands, not both:

```bash
code .
```

```bash
code-insiders .
```

**Checkpoint:** the intended edition opens the intended folder. A harmless
read-only request succeeds in Copilot if you are doing the live steps.
Use [Start here](start-here.md) for the first guided Ask, Plan and Agent session.
Do not infer that a Preview feature exists in Stable merely because it appeared
in an Insiders demonstration.

Official help:
<a href="https://code.visualstudio.com/docs/getstarted/overview" target="_blank" rel="noopener noreferrer">editor setup</a>,
<a href="https://code.visualstudio.com/docs/setup/copilot" target="_blank" rel="noopener noreferrer">Copilot setup</a>,
<a href="https://code.visualstudio.com/docs/configure/command-line" target="_blank" rel="noopener noreferrer">terminal commands</a>,
and <a href="https://code.visualstudio.com/docs/configure/settings-sync" target="_blank" rel="noopener noreferrer">Settings Sync</a>.

## 5. Install only the selected lab's runtime

All 14 adventures and the first hands-on lab use **Node 24** for their local
checks. For another hands-on kit, read its first-run guide before installing a
second language. No global installation of a test framework is needed for the
first Node exercise.

| Tool | When needed | Official installation |
| --- | --- | --- |
| Node 24 LTS and npm | Adventure checks, Node hands-on kits and the npm CLI installation route | <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer">Node.js download</a> |
| Git | A local baseline, diffs or optional GitHub publication | <a href="https://git-scm.com/install/" target="_blank" rel="noopener noreferrer">Git installers</a> |
| .NET 10 SDK | C# hands-on kits targeting `net10.0`; a runtime alone cannot build them | <a href="https://dotnet.microsoft.com/en-us/download/dotnet/10.0" target="_blank" rel="noopener noreferrer">.NET 10 SDK</a> |
| Python | Python hands-on kits; the repository environment selects Python 3.14 | <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">Python downloads</a> |
| Language extensions, pytest, uv or SDK packages | Only when the selected exercise explicitly requires them | [Environment guide](../mslearn-github-copilot/Instructions/Reference/SETUP.md) and that exercise's setup guide |

After installing Node, reopen the terminal and run:

```bash
node --version
npm --version
```

Expect Node's version to begin with `v24.`. A version check proves the executable
is found; the lab's baseline is the next check. When using Git, also run:

```bash
git --version
```

For a C# kit only:

```bash
dotnet --list-sdks
```

Confirm that a compatible .NET 10 SDK is listed. For Python only, select the
same interpreter in VS Code and the terminal and follow the Python setup lab's
virtual-environment instructions. On Windows, `py` may be the installed launcher
instead of `python`. Do not install packages into an unrelated global environment.

## 6. Install the standalone Copilot CLI

**Copilot CLI uses the command `copilot`. GitHub CLI uses `gh`.** They are
different products. The old `gh copilot` extension is not the installation route
taught here. Choose **one** installer below; do not install every variant.
The npm route requires Node 22 or later; this curriculum already uses Node 24.
That Node requirement belongs to the npm installer, not every native installer.

### macOS

If Homebrew is already available, use the command in the official installation
guide:

```bash
brew install --cask copilot-cli
```

If you do not use Homebrew, the npm route below is an alternative once Node is
installed. You do not need to install a package manager solely to follow this
route.

### Windows

Use PowerShell 6 or later; a current PowerShell 7 installation is a suitable
choice. Windows PowerShell 5.1 and PowerShell 7 are different installations.
See <a href="https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows" target="_blank" rel="noopener noreferrer">PowerShell installation</a>
if needed. Check the shell you opened:

```powershell
$PSVersionTable.PSVersion
```

With WinGet available:

```powershell
winget install GitHub.Copilot
```

Reopen PowerShell so it can see the updated PATH. If WinGet is unavailable,
follow the approved installation route for your machine or use npm with Node.

### Linux, or npm on macOS/Windows

With Node available, this is the cross-platform npm installation:

```bash
npm install -g @github/copilot
```

If installation reports a permissions error, use a user-owned Node installation
or your administrator's approved method. Do not solve it by running arbitrary
downloads as an administrator.

As an alternative on macOS/Linux, download the official installer **without
executing it immediately**:

```bash
curl -fsSL https://gh.io/copilot-install -o copilot-install.sh
```

Open the downloaded file in an editor, verify the official source and review its
downloads and installation paths. Only if you approve that exact file, run:

```bash
bash ./copilot-install.sh
```

### Verify, authenticate and start safely

In a new terminal:

```bash
copilot --version
```

Then change into the extracted kit's intended workspace and start:

```bash
copilot
```

Inside the **interactive Copilot session**, not the operating-system shell:

```text
/login
```

Follow the browser or device-code flow shown by your session, using your
intended GitHub account. Do not paste tokens into lesson files or prompts.
After authentication, inspect the session's help:

```text
/help
```

Use a read-only prompt before allowing changes:

```text
Inspect this learning workspace and identify its starter files and existing tests.
Do not edit files, install packages, access secrets, publish code or run commands yet.
State the working directory, the proposed verification command and what it proves.
```

**Checkpoint:** you have the CLI version, the intended account and workspace,
and an explanation you can check against real files. Review each permission
request; do not enable blanket approval for a training exercise.
Then follow [the extracted-kit CLI workflow](downloads.md#use-copilot-cli-from-the-extracted-kit).
Ask, Plan and Agent describe responsibilities here; the CLI need not present
the same buttons, roles or handoffs as VS Code.

Official help:
<a href="https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli" target="_blank" rel="noopener noreferrer">CLI installation</a>,
<a href="https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli" target="_blank" rel="noopener noreferrer">CLI authentication</a>,
and <a href="https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference" target="_blank" rel="noopener noreferrer">current command reference</a>.

## 7. Use a Codespace instead of a local runtime, if useful

A **GitHub Codespace** is a hosted development environment: a Linux container
on a virtual machine with files, tools and a terminal. You can use its VS Code
web interface or connect from VS Code desktop. Code runs remotely, not on your
laptop. You still need Copilot authorization for live AI steps.

**Codespaces is not `github.dev`.** The lightweight editor reached by pressing
`.` on a GitHub repository does not provide compute or an integrated terminal
for building and running these labs. Its documentation currently labels it
public preview.

### Check quota before creating the environment

| Personal GitHub account plan, not Copilot plan | Included monthly compute | Included storage |
| --- | --- | --- |
| GitHub Free | 120 core-hours | 15 GB-month |
| GitHub Pro | 180 core-hours | 20 GB-month |

Core-hours multiply running time by machine cores: 120 core-hours can mean up
to 60 running hours on a 2-core machine, before other usage or storage limits.
GB-month measures storage over time; it is not merely a disk-size allowance.
Organization-paid environments and their policies can differ.

1. Read <a href="https://docs.github.com/en/billing/concepts/product-billing/github-codespaces" target="_blank" rel="noopener noreferrer">current Codespaces billing</a>
   and check who will pay. With no valid payment method, use is blocked after
   the included allowance is exhausted.
2. If paid usage is enabled, review the budget and **Stop usage when budget
   limit is reached** setting. A budget alert alone is not a spending stop.
3. Review this repository's [container configuration](../.devcontainer/devcontainer.json)
   and [setup script](../.devcontainer/post-create.sh) before creating a Codespace.
   Provisioning downloads tools and consumes resources; a local ZIP is simpler
   if those tools are already installed.

### Create and run one isolated exercise

1. Open <a href="https://github.com/workshop-gbb/awesome-copilot-adventures" target="_blank" rel="noopener noreferrer">the curriculum repository on GitHub</a>.
2. Select **Code > Codespaces**, inspect the payer notice and choose the creation
   options. Check the branch and machine size; use a small available machine
   appropriate for the selected exercise.
3. Create the Codespace and wait for setup to finish. If setup fails, read the
   reported error; do not call a half-created environment ready.
4. In its terminal, from the curriculum checkout root, prepare only the first
   fixture in an unused directory outside that checkout:

   ```bash
   node scripts/prepare-hands-on.js --lab 01-interface --destination /workspaces/aca-01-interface
   ```

5. Open `/workspaces/aca-01-interface` as the folder in the editor and start a
   new terminal there. The preparation command creates a fixture copy, not a
   downloaded ZIP, so it does not create `KIT-VERIFY.cjs`.
6. Run the existing tests:

   ```bash
   node --test --test-concurrency=1 greeting.test.mjs
   ```

7. Expect 2 passing baseline tests. Record your actual result, then continue
   the investigation and change in [Start here](start-here.md).
   If the destination already exists, preserve it and select a different unused
   name; the preparation tool deliberately refuses to overwrite it.

For the desktop route, install the official GitHub Codespaces extension and
follow <a href="https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-in-visual-studio-code" target="_blank" rel="noopener noreferrer">connecting with VS Code</a>.
CLI access, extensions and authenticated sessions must be checked inside the
remote environment, not inferred from your laptop.

### Stop or delete deliberately

At <a href="https://github.com/codespaces" target="_blank" rel="noopener noreferrer">your Codespaces list</a>,
use the environment's menu:

- **Stop codespace** stops compute but preserves files; storage is still counted.
- **Delete** removes the environment. Save, export or commit/push work to your
  authorized repository first, after reviewing the files. Deletion does not
  undo usage already incurred.
- Merely closing the browser tab does **not** stop the Codespace.

Official help:
<a href="https://docs.github.com/en/codespaces/about-codespaces/what-are-codespaces" target="_blank" rel="noopener noreferrer">what Codespaces is</a>,
<a href="https://docs.github.com/en/codespaces/the-githubdev-web-based-editor" target="_blank" rel="noopener noreferrer">the github.dev distinction</a>,
<a href="https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository" target="_blank" rel="noopener noreferrer">creation steps</a>,
<a href="https://docs.github.com/en/billing/how-tos/set-up-budgets" target="_blank" rel="noopener noreferrer">budgets</a>,
<a href="https://docs.github.com/en/codespaces/developing-in-a-codespace/stopping-and-starting-a-codespace" target="_blank" rel="noopener noreferrer">stopping</a>,
and <a href="https://docs.github.com/en/codespaces/developing-in-a-codespace/deleting-a-codespace" target="_blank" rel="noopener noreferrer">deleting</a>.

## 8. Azure personal free account: optional, with conditions

> [!CAUTION]
> **Do not create Azure resources to pass a local lab.** Azure credit does not
> pay for a Copilot subscription or GitHub Codespaces. The GitHub cloud agent
> is also not a requirement to create an Azure subscription.

The Azure free-account offer advertises **US$200 in credit for the first
30 days**, for eligible new customers. This is not R$200, not cash paid to you,
and not an unconditional benefit for every existing account. Normally only
one free-account benefit is available per new customer.

1. Open <a href="https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account" target="_blank" rel="noopener noreferrer">the official Azure free-account offer</a>
   and read the eligibility and country/region conditions.
2. If eligible and you want this optional cloud route, select the free-account
   signup, not a pay-as-you-go purchase by mistake. Use a personal Microsoft
   account or the supported GitHub sign-in option with an email you control.
3. Complete the identity checks. The offer requests a phone and a non-prepaid
   credit/debit card where supported; **Brazil and Hong Kong require a credit
   card** for this offer. A temporary US$1-equivalent authorization may appear.
   Use accurate details; do not enter a payment card into a chat or repository.
4. Check the actual subscription offer, remaining credit and expiration in
   the portal before deploying anything. If the benefit is not shown, stop
   and consult the provider rather than assuming credit exists.
5. Keep the free-account spending limit in place. Microsoft says it does not
   charge this free account unless you explicitly choose to upgrade to
   pay-as-you-go. When credit or the 30 days ends, services are disabled unless
   you opt to upgrade; this is not an instruction to upgrade.
6. If you later choose pay-as-you-go, review costs first. The free-credit spending
   limit is not available on pay-as-you-go; budget alerts are not a hard cap.
   Stop/delete only your own exercise resources after saving needed work.

Some items, including certain Marketplace products and support, are excluded.
Check <a href="https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p" target="_blank" rel="noopener noreferrer">the offer terms</a>,
<a href="https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/spending-limit" target="_blank" rel="noopener noreferrer">spending-limit behavior</a>
and <a href="https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/upgrade-azure-subscription" target="_blank" rel="noopener noreferrer">what upgrading changes</a>.

Eligible students can instead review
<a href="https://azure.microsoft.com/en-us/free/students" target="_blank" rel="noopener noreferrer">Azure for Students</a>:
the published offer is US$100 for 12 months without a credit card, with its own
age, institution, enrollment and regional requirements. Its eligibility is
not the same as GitHub Education. Neither student benefit is guaranteed by this
curriculum.

## 9. Final readiness checklist and troubleshooting

- [ ] I selected one environment and know where files and processes run.
- [ ] I verified my own GitHub account and intended Copilot plan for live AI work.
- [ ] My selected runtime is found in the terminal used for the lab.
- [ ] I downloaded one matching kit, extracted it into a new folder, and read
  its workspace and expected baseline instructions.
- [ ] I can distinguish a terminal command from a Copilot prompt or slash command.
- [ ] I know that an intentional starter failure is different from missing tools.
- [ ] I reviewed any optional cloud quota and know how to stop and remove my work.
- [ ] I recorded an actual local result, not a copied success message.

| Problem | Next step |
| --- | --- |
| A command is not found after installation | Reopen the terminal, check PATH and select the intended installation |
| Copilot is unavailable or the allowance is exhausted | Check account, plan and policy; run local tests and record the live-step blocker |
| Copy is unavailable or denied | Use HTTPS or localhost; select the exact block manually if browser permissions block it |
| A command contains an example path or identity | Replace the explicitly marked placeholder before running; never paste secrets |
| The ZIP's initial verifier fails | Compare with the declared intentional failure; a missing file or runtime is not that failure |
| The CLI cannot reproduce an IDE-only step | Use the documented IDE for that evidence or mark the step not performed |
| A cloud page requests an unexpected upgrade | Stop; review the offer and spending settings before accepting charges |

Continue to [your first verified local change](start-here.md), or choose
[one adventure or hands-on ZIP](downloads.md). Full lessons include investigation,
planning, implementation, a negative case, evidence and safe reset.
