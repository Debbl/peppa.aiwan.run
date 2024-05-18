// @ts-check
import { config } from "@debbl/eslint-config";
import pluginReactCompiler from "eslint-plugin-react-compiler";

export default config({
  typescript: true,
  tailwindcss: true,
  react: {
    next: true,
  },
  customConfig: {
    files: ["src/**/*.{jsx,tsx}"],
    plugins: {
      "react-compiler": pluginReactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
});
