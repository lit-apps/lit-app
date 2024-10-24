// @ts-check
import notOnlyTest from 'eslint-plugin-no-only-tests';
import lit from 'eslint-plugin-lit'
import litA11y from 'eslint-plugin-lit-a11y'
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      notOnlyTest,
      lit,
      litA11y
    },
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "max-len": [
        "warn",
        {
          "code": 100,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true,
          "ignoreComments": true
        }
      ],
      "no-unused-vars": "off",
      "no-prototype-builtins": "off",
      "notOnlyTest/no-only-tests": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off"
    }
  }, {
    ignores: [
      "**/dist/**/*",
      "**/build/**/*",
      "**/test/**/*",
      "**/redefine-custom-elements.ts",
    ]
  }
);

