import { expect, test } from "vitest";
import { CreateDummyAppEntry } from "./helper";
import { Framework } from "di-ui.js";

test("Test Framework Render", () => {
	const app_entry = CreateDummyAppEntry();
	const document_root = document.createElement("div");
	document_root.id = "root";
	const framework = new Framework(app_entry, document_root);

	expect(void framework.Start());

	expect(document_root.childNodes).contain(app_entry.Render())
});
