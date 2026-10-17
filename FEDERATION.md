# Federation Role: capital-city-provisions

## Layer

`applied-business`

## Role

applied federation business model and real-world provisions system

## Operating Principle

This repository is part of the AI Freedom Trust Federation operating system. It remains sovereign in its own repo while participating in the shared federation control plane.

## Control Plane

Top-level workspace:

```bash
/data/data/com.termux/files/home/AIFT
```

Primary command:

```bash
/data/data/com.termux/files/home/AIFT/aift-os.sh
```

## Standard Commands

Status:

```bash
git status --short
```

Pull:

```bash
git pull --ff-only
```

Verify:

```bash
npm run verify
```

**Verification prerequisites and scope:** Run from the repository root with Node.js 20+ and dependencies installed (`npm ci` with the repository's inert-install `.npmrc` policy). `npm run verify` runs Next.js type generation, TypeScript checking, ESLint, the open-source dependency license audit, and a production build, stopping at the first failure. Do not substitute the previous optional `--if-present` chain: it skipped type generation and the mandatory license audit. There is currently no `test` script in `package.json`, so this verification does not run unit, integration, or browser tests. A successful build does not establish live delivery, customer intake, or production availability.

## Federation Metadata

This repo declares its federation role in:

```bash
aift.repo.json
```

The workspace-level federation manifest is generated at:

```bash
/data/data/com.termux/files/home/AIFT/manifests/workspace.json
```
