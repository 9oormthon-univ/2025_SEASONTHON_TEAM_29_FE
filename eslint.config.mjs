import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // 0) 전역 ignore: 문자열만 허용
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      ".turbo/**",
      "dist/**",
      "next-env.d.ts",
      // Storybook 산출물
      "storybook/**",
      "storybook-static/**",
      // 외부/난독화 스크립트
      "public/**/*.js",
      "public/**/*.min.js",
      "**/*.min.js",
      // 관용 벤더/생성물 폴더
      "vendor/**",
      "third_party/**",
      "third-party/**",
      "externals/**",
      "src/**/vendor/**",
      "src/**/vendors/**",
      "src/**/third_party/**",
      "src/**/third-party/**",
      "src/**/externals/**",
      "src/**/generated/**",
      "src/**/gen/**",
      "src/**/__fixtures__/**",
      "src/**/__mocks__/**",
    ],
  },

  // 1) Next + TS 권장
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2) 일반 소스 규칙
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
      ],
      "@typescript-eslint/no-this-alias": ["error", { allowDestructuring: false, allowedNames: [] }],
      "@typescript-eslint/no-array-constructor": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // 3) 타입 선언 파일 소음 감소
  {
    files: ["**/*.d.ts", "src/types/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // 4) Storybook 권장 (마지막에)
  ...storybook.configs["flat/recommended"],
];

export default config;