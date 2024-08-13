import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const LIB_NAME = "di-ui";

export default defineConfig((env) => {
	return {
		build: {
			lib: {
				entry: "dist/generated.ts",
				name: LIB_NAME,
				formats: ["cjs", "es", "umd", "system"],
				fileName: "generated",
			},
			minify: !env.isPreview,
		},
		plugins: [
			dts({
				tsconfigPath: "./tsconfig.json",
			}),
		],
	};
});
