"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Returns false on the server and during the first client render, then true -
// without ever calling setState in an effect (avoids the extra render + the
// react-hooks/set-state-in-effect lint rule) while still avoiding hydration
// mismatches for client-only UI (portals, etc).
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
