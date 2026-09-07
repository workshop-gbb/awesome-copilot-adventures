# Hands-on GitHub Copilot labs

This is the **non-fantasy companion track** of Awesome Copilot Adventures.
It adapts the imported Microsoft learning material into locally reproducible,
step-by-step exercises. The original `Instructions/Labs` filenames and nested
`lab` metadata are preserved; the exercises are not converted into adventures.

## Start

1. Read the [catalog](index.md).
2. [Download a learner kit](../docs/downloads.md) or prepare [the environment](Instructions/Reference/SETUP.md) from an existing clone.
3. Review [Copilot boundaries](Instructions/Reference/COPILOT.md).
4. For Spec Kit, use [the versioned reference](Instructions/Reference/SPEC_KIT.md).
5. Open only the selected copy as the workspace root and record the baseline
   described by its lesson. The ZIP's `KIT-START.md` explains the exact directory.

## What changed

- All 25 imported preparation/exercise guides were audited individually.
- One new numbered hands-on exercise adds **Spec Kit modernization**, distinct
  from the existing greenfield and brownfield cases.
- Core examples run locally with synthetic data. Remote GitHub, cloud-agent,
  account changes, live SDK inference and profiling extensions are explicitly optional.
- Every Mermaid diagram uses the shared monochrome style, accessible title,
  legend and explanation.
- [The audit report](Instructions/Reference/AUDIT.md) records findings and evidence,
  including what validation did not prove.

## Source and publication

`catalog.json` is the machine-readable inventory. The root repository's Astro
pipeline builds these instructions under each language's `/hands-on/` route.
There is no separate nested site or release pipeline.

`LabFiles` remain available as source, not an executable web service. The
[download catalog](../docs/downloads.md) offers per-exercise ZIPs with bundled
instructions, assets, licenses, file manifests and archive checksums.
Instructor references are deliberately omitted by the preparation script and kits.
Historical screenshots in `Instructions/Labs/Media` are retained with a provenance
notice, not used as current setup instructions.

## Licensing

Retain the [Microsoft MIT license](LICENSE) with redistributed fixtures. These
community adaptations are maintained by this repository; they are not a claim of
Microsoft course certification, support, or endorsement.
