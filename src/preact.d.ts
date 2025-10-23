declare module "htm" {
  function htm(h: any): any;
  export default htm;
}

declare module "react-list" {
  const ReactList: any;
  export default ReactList;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
