import { defineConfig } from 'vite';
import path from "path";
import dts from "vite-plugin-dts";

const lib_name = "di-ui";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "lib/index.ts"),
			name: lib_name,
			formats: ['cjs','es','umd'],
			fileName: "index",
		},
	},
	plugins: [dts()]
});
