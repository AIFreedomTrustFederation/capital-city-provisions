# Live Snapshot Page Swaps

The live snapshot wrappers are available:

- `components/LiveDriverMobileWorkflow.tsx`
- `components/LiveDatabaseOpsConsole.tsx`

If a connector blocks direct page updates, make these two import swaps locally:

```ts
// app/driver/page.tsx
import DriverMobileWorkflow from '../../components/LiveDriverMobileWorkflow';
```

```ts
// app/system-database/page.tsx
import DatabaseOpsConsole from '../../components/LiveDatabaseOpsConsole';
```

Then run:

```bash
./wire-postgres.sh
```
