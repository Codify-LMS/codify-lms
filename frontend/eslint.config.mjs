import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["tailwind.config.js"], // Terapkan aturan ini hanya untuk file ini
    rules: {
      "@typescript-eslint/no-require-imports": "off", // Nonaktifkan aturan ini
    },
  },
];

export default eslintConfig;