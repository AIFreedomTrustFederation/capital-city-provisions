# capital-city-provisions

Farm-to-table food provisioning company delivering premium beef, poultry, pork, seafood, and curated freezer-box solutions directly from trusted American producers to households, businesses, and communities.

## Sync A Codespace

Run this inside each Codespace to safely sync it with `origin/main`:

```bash
bash sync-current-codespace.sh
```

The script saves local work to a timestamped backup branch when needed, pushes that backup, fast-forwards `main`, installs dependencies, then runs typecheck and build.

It does not run destructive reset, clean, force-push, or delete commands.

After syncing each Codespace, check all Codespaces with:

```bash
bash check-all-codespaces-sync.sh
```

Optional fast modes:

```bash
bash sync-current-codespace.sh --no-build
bash sync-current-codespace.sh --no-install --no-build
```
