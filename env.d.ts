/// <reference types="vite/client" />

declare module 'virtual:pwa-info' {
  export interface PwaInfo {
    pwaInDevEnvironment: boolean
    /**
     * The web manifest will be always here.
     */
    webManifest: {
      href: string
      useCredentials: boolean
      /**
       * The link tag with or without `crossorigin`:
       * - `<link rel="manifest" href="<webManifestUrl>" />`.
       * - `<link rel="manifest" href="<webManifestUrl>" crossorigin="use-credentials" />`.
       */
      linkTag: string
    }
    /**
     * The service worker data will be exposed only if required, that's, will **NOT** be exposed if:
     * - not using `pwaPluginOptions.injectRegister` with `script` or `inline` values
     * - if using `pwaPluginOptions.injectRegister` with `auto` (default) and importing any of the virtual modules
     */
    registerSW?: {
      /**
       * When this flag is `true` the service worker must be registered via inline script otherwise registered via script with src attribute `registerSW.js` .
       */
      inline: boolean
      /**
       * The path for the inline script: will contain the service worker url.
       */
      inlinePath: string
      /**
       * The path for the src script for `registerSW.js`.
       */
      registerPath: string
      /**
       * The scope for the service worker: only required for `inline: true`.
       */
      scope: string
      /**
       * The type for the service worker: only required for `inline: true`.
       */
      type: 'classic' | 'module'
      /**
       * The script tag if `shouldRegisterSW` returns `true`.
       */
      scriptTag?: string
    }
  }
  /**
   * Return the PWA information if available.
   *
   * This property will be `undefined` if:
   * - SSR build
   * - PWA is disabled: `pwaPluginOptions.disable = true`
   * - running `Dev Server` and `pwaPluginOptions.devOptions.enabled = false` (default).
   *
   * @returns The PWA information.
   */
  export const pwaInfo: PwaInfo | undefined
}

declare module 'virtual:pwa-register/vue' {
  // @ts-expect-error ignore when vue is not installed
  import type { Ref } from 'vue'

  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    /**
     * Called only if `onRegisteredSW` is not provided.
     *
     * @deprecated Use `onRegisteredSW` instead.
     * @param registration The service worker registration if available.
     */
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    /**
     * Called once the service worker is registered (requires version `0.12.8+`).
     *
     * @param swScriptUrl The service worker script url.
     * @param registration The service worker registration if available.
     */
    onRegisteredSW?: (
      swScriptUrl: string,
      registration: ServiceWorkerRegistration | undefined
    ) => void
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}

interface ImportMetaEnv {
  readonly VITE_API_CRUD_CRUD_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
