# Migration Guide

## 0.1.0 → 0.2.0

### `@floating-ui/vue` is now a required peer dependency

**Who is affected:** Any consumer who did not have `@floating-ui/vue` installed.

**Components that depend on it:** Popover, ContextMenu, DropdownMenu.

**What to do:**

```bash
pnpm add @floating-ui/vue@^1.0.0
```

If none of those three components are used, the package is still required as a peer dep but will not be imported at runtime (tree-shaking removes the imports). Install it to satisfy the peer dep check.

**Why:** In 0.1.0, `@floating-ui/vue` was marked optional and consumers who did not import Popover/ContextMenu/DropdownMenu could omit it. In 0.2.0, the peer dep is unconditional to simplify the install story and because the three dependent components are now widely used.
