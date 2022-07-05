interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_LOCALSTORAGE_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}