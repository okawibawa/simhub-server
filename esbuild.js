import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  target: "node20",
  format: "esm",
  loader: { ".ts": "ts", ".js": "js" },
  external: ["./node_modules/*"],
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
  },
});
