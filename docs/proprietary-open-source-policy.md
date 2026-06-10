# Proprietary Code And Open-Source Dependency Policy

Capital City Provisions application code is proprietary. The repo intentionally does not grant an open-source license for original business logic, UI, copy, assets, workflows, or operational systems.

## Dependency Rule

Runtime and development dependencies should be fully open-source and license-compatible with proprietary application code.

Allowed dependency license families:

- MIT
- Apache-2.0
- BSD-2-Clause and BSD-3-Clause
- ISC
- 0BSD
- MPL-2.0
- LGPL-3.0-or-later, with review before production distribution
- Python-2.0
- BlueOak-1.0.0
- CC0-1.0
- CC-BY-4.0 for data/content packages, with attribution review

Blocked dependency license families:

- GPL
- AGPL
- Proprietary, commercial-only, source-available, or unknown licenses
- Packages without usable license metadata

## Required Check

Run this before adding or upgrading dependencies:

```bash
npm run license:audit
```

The audit fails on blocked or unknown licenses and warns for open-source licenses that need review, such as LGPL and CC-BY.

## Ownership Boundary

Using open-source dependencies does not make this application open-source. Dependency notices and obligations must be honored, but Capital City Provisions source code remains all-rights-reserved unless the owner grants a separate written license.
