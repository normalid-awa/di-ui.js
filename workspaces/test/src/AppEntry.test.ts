import { expect, test } from "vitest";
import { CreateDummyAppEntry } from "./helper";

test("Test App Entry", () => {
	const app_entry = CreateDummyAppEntry();
	expect(app_entry.componentName).toBe("DummyAppEntry");
	expect(app_entry.render()).instanceOf(Element);
});
