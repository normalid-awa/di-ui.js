import { expect, test } from "vitest";
import { CreateDummyAppEntry } from "./helper";

test("Test App Entry", () => {
	const app_entry = CreateDummyAppEntry();
	expect(app_entry.ComponentName).toBe("DummyAppEntry");
	expect(app_entry.Render()).instanceOf(Element);
});
