import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";

const LIB_NAME = "di-ui";

export default defineConfig({
	build: {
		lib: {
			entry: "lib/index.ts",
			name: LIB_NAME,
			formats: ['cjs','es','umd'],
			fileName: "index",
		},
	},
	plugins: [dts()]
});
