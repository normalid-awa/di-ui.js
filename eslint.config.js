// @ts-check
/* eslint-env node */

import eslint from "@eslint/js";
import tseslint, { parser, plugin } from "typescript-eslint";

export default [
	// eslint.configs.recommended,
	// tseslint.configs.strict,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: parser,
			parserOptions: {
				project: ["tsconfig.json"],
				// @ts-ignore
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			"@typescript-eslint": plugin,
		},
		ignores: ["node_modules/**", "dist/**", "workspaces/example-*/**"],
		rules: {
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variable",
					format: ["camelCase"],
				},
				{
					selector: "variable",
					modifiers: ["global", "const"],
					format: ["UPPER_CASE"],
				},
				{
					selector: "variable",
					modifiers: ["const"],
					format: ["snake_case"],
				},
				{
					selector: "interface",
					format: ["PascalCase"],
					prefix: ["I"],
				},
				{
					selector: "classProperty",
					modifiers: ["private", "static", "readonly"],
					format: ["snake_case"],
				},
				{
					selector: "classProperty",
					modifiers: ["public", "static", "readonly"],
					format: ["UPPER_CASE"],
				},
				{
					selector: ["classProperty", "classMethod"],
					modifiers: ["private"],
					format: ["strictCamelCase"],
				},
				{
					selector: ["classProperty", "classMethod"],
					modifiers: ["public"],
					format: ["strictCamelCase"],
				},
				{
					selector: ["function"],
					format: ["strictCamelCase"],
				},
				{
					selector: ["function"],
					modifiers: ["exported"],
					format: ["StrictPascalCase"],
				},
				{
					selector: ["class"],
					format: ["StrictPascalCase"],
				},
			],
			"@typescript-eslint/array-type": ["error", { default: "array" }],
			"consistent-return": "off",
			"@typescript-eslint/consistent-return": "error",
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"max-params": "off",
			"@typescript-eslint/max-params": ["error", { max: 4 }],
			"@typescript-eslint/member-ordering": [
				"error",
				{ default: ["signature", "field", "constructor", "method"] },
			],
			"@typescript-eslint/no-confusing-non-null-assertion": "error",
			"@typescript-eslint/no-confusing-void-expression": [
				"error",
				{ ignoreVoidOperator: true },
			],
			"@typescript-eslint/no-extra-non-null-assertion": "error",
			"@typescript-eslint/no-for-in-array": "error",
			"no-loss-of-precision": "error",
			"@typescript-eslint/no-misused-new": "error",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					checksVoidReturn: {
						arguments: true,
						attributes: true,
					},
					checksSpreads: false,
					checksConditionals: true,
				},
			],
			"@typescript-eslint/no-mixed-enums": "error",
			"@typescript-eslint/no-non-null-asserted-nullish-coalescing":
				"error",
			"@typescript-eslint/no-non-null-asserted-optional-chain": "error",
			"@typescript-eslint/no-redundant-type-constituents": "error",
			"@typescript-eslint/no-unnecessary-boolean-literal-compare":
				"error",
			"@typescript-eslint/no-unnecessary-condition": "error",
			"@typescript-eslint/no-unnecessary-parameter-property-assignment":
				"error",
			"@typescript-eslint/no-unnecessary-qualifier": "error",
			"@typescript-eslint/no-unnecessary-template-expression": "error",
			"@typescript-eslint/no-unnecessary-type-constraint": "error",
			"@typescript-eslint/no-unsafe-argument": "error",
			"@typescript-eslint/no-unsafe-assignment": "error",
			"@typescript-eslint/no-unsafe-call": "error",
			"@typescript-eslint/no-unsafe-enum-comparison": "error",
			"@typescript-eslint/no-unsafe-function-type": "error",
			"@typescript-eslint/no-unsafe-return": "error",
			"no-use-before-define": "off",
			"@typescript-eslint/no-use-before-define": "error",
			"@typescript-eslint/no-useless-empty-export": "error",
			"@typescript-eslint/non-nullable-type-assertion-style": "error",
			"no-throw-literal": "off",
			"@typescript-eslint/only-throw-error": "error",
			"@typescript-eslint/prefer-as-const": "error",
			"@typescript-eslint/prefer-enum-initializers": "warn",
			"@typescript-eslint/prefer-for-of": "warn",
			"@typescript-eslint/prefer-function-type": "warn",
			"@typescript-eslint/prefer-includes": "error",
			// "@typescript-eslint/prefer-namespace-keyword": "error",
			"@typescript-eslint/prefer-optional-chain": "error",
			"@typescript-eslint/prefer-readonly": "warn",
			//NOTES: Having bug with using interface method
			// "@typescript-eslint/prefer-readonly-parameter-types": [
			// 	"error",
			// 	{
			// 		ignoreInferredTypes: true,
			// 		checkParameterProperties: false,
			// 	},
			// ],
			"@typescript-eslint/prefer-string-starts-ends-with": "error",
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/strict-boolean-expressions": "warn",
		},
	},
];
