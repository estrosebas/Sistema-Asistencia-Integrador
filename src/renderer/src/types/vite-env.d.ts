// vite-env.d.ts
interface ImportMetaEnv {
  VITE_API_URL: "http://localhost:3000"; // Asegúrate de que coincida con tus variables de entorno
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
