import { expect, test } from "vitest";
import { DummyAppEntry, DummyDivContainer } from "./helper";
import { AppEntry, DependencyContainer } from "di-ui.js";

function createDummyAppEntry(): AppEntry {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root);
	return new DummyAppEntry(dic, root);
}

test("Test App Entry", () => {
	const app_entry = createDummyAppEntry();
	expect(app_entry.ComponentName).toBe("DummyAppEntry");
	expect(app_entry.Render()).instanceOf(Element);
});
