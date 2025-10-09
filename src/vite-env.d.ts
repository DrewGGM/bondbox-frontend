/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_AI_FEATURES: string
  readonly VITE_ENABLE_GOOGLE_CALENDAR: string
  readonly VITE_GOOGLE_CALENDAR_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
