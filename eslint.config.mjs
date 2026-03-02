import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    ignores: [
      "lib/dal/**",
      "lib/auth.ts",
      "auth.config.ts",
      "auth.ts",
      "app/api/auth/[...nextauth]/route.ts",
      "__tests__/**",
      "app/(auth)/**",
      "app/(dashboard)/settings/_actions/settings.ts",
      "lib/tokens.ts"
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/prisma",
              message: "Do not import Prisma directly. Use the Data Access Layer (DAL) in @/lib/dal/* instead."
            }
          ]
        }
      ]
    }
  }
]);

export default eslintConfig;
