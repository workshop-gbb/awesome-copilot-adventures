---
layout: default
title: Contributing
nav_order: 9
permalink: /contributing/
---

# Contributing

Read the repository [Contribution Guide](https://github.com/paulasilvatech/awesome-copilot-adventures/blob/main/CONTRIBUTING.md), [Code of Conduct](https://github.com/paulasilvatech/awesome-copilot-adventures/blob/main/CODE_OF_CONDUCT.md), and [Security Policy](https://github.com/paulasilvatech/awesome-copilot-adventures/blob/main/SECURITY.md) before proposing changes.

```mermaid
flowchart LR
    O["Choose one learning outcome"] --> D["Verify official documentation"]
    D --> E["Define observable evidence"]
    E --> W["Write adventure + lab + rubric"]
    W --> V["Run focused and repository checks"]
    V --> R["Open a reviewable pull request"]
```

## Adventure checklist

- [ ] Metadata and a real verification date.
- [ ] Current official GitHub or Microsoft references.
- [ ] One primary agentic learning objective.
- [ ] Ask → Plan → Agent → Review → Evidence.
- [ ] Guided mission and intentional failure.
- [ ] Independent challenge.
- [ ] Deterministic evidence and reset instructions.
- [ ] Rubric with observable completion criteria.
- [ ] Starter material and verifier when files change.
- [ ] Preview or experimental status clearly labeled.
- [ ] No credentials, fabricated output, or universal availability claims.

## Validation

Run the smallest relevant check first, then:

```bash
npm test
```

If a language solution changes, run its documented build or test command. Media contributions must follow the [Media Prompt and Accessibility Guide](media-prompts.md).
