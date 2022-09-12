// fetches the wasm file `file` and returns its exports
export default async function fetchWasm(
  file: string, 
  imports: WebAssembly.Imports = {}
): Promise<WebAssembly.Exports> {
  const obj = await WebAssembly.instantiateStreaming(fetch(file), imports);
  return obj.instance.exports;
}
