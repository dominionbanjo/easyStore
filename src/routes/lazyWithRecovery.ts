import { lazy, type ComponentType, type LazyExoticComponent } from "react";

type ModuleWithDefault<T extends ComponentType<any>> = {
  default: T;
};

type Importer<T extends ComponentType<any>> = () => Promise<ModuleWithDefault<T>>;

const RETRY_PARAM = "_lr";
const RETRY_PREFIX = "easystore:lazy-retry:";

function getRetryStorageKey(moduleKey: string) {
  return `${RETRY_PREFIX}${moduleKey}`;
}

function isLikelyChunkError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`.toLowerCase()
      : String(error ?? "").toLowerCase();

  return [
    "failed to fetch dynamically imported module",
    "importing a module script failed",
    "failed to load module script",
    "expected a javascript-or-wasm module script",
    "mime type of \"text/html\"",
    "mime type",
    "chunkloaderror",
    "loading chunk",
  ].some((fragment) => message.includes(fragment));
}

function buildReloadUrl(): string {
  const next = new URL(window.location.href);
  next.searchParams.set(RETRY_PARAM, Date.now().toString());
  return next.toString();
}

async function importWithRecovery<T extends ComponentType<any>>(
  importer: Importer<T>,
  moduleKey: string,
): Promise<ModuleWithDefault<T>> {
  try {
    const module = await importer();

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(getRetryStorageKey(moduleKey));
    }

    return module;
  } catch (error) {
    if (typeof window === "undefined" || !isLikelyChunkError(error)) {
      throw error;
    }

    const storageKey = getRetryStorageKey(moduleKey);
    const alreadyRetried = sessionStorage.getItem(storageKey) === "1";

    if (!alreadyRetried) {
      sessionStorage.setItem(storageKey, "1");
      window.location.replace(buildReloadUrl());

      return new Promise<ModuleWithDefault<T>>(() => {
        // Keep pending until browser navigation replaces this page.
      });
    }

    sessionStorage.removeItem(storageKey);
    throw error;
  }
}

export function lazyWithRecovery<T extends ComponentType<any>>(
  importer: Importer<T>,
  moduleKey?: string,
): LazyExoticComponent<T> {
  const resolvedModuleKey = moduleKey || importer.toString();
  return lazy(() => importWithRecovery(importer, resolvedModuleKey));
}

export function isChunkLoadLikeError(error: unknown): boolean {
  return isLikelyChunkError(error);
}

export function forceAppReload(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.location.replace(buildReloadUrl());
}
