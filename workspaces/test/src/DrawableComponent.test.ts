import { DrawableComponent } from "di-ui.js";
import { expect, test, vi } from "vitest";
import { DummyDivContainer } from "./helper";

test("Test Will The Add Method Trigger Update", () => {
	const dummy_component = new DummyDivContainer();

	vi.spyOn(dummy_component, "Update");
	dummy_component.Add(new DummyDivContainer());

	expect(dummy_component.Update).toBeCalledTimes(1);
});

test("Test Will The Remove Method Trigger Update", () => {
	const dummy_component = new DummyDivContainer();
	const child = new DummyDivContainer();

	vi.spyOn(dummy_component, "Update");
	dummy_component.Add(child);

	expect(dummy_component.Update).toBeCalledTimes(1);

	dummy_component.Remove(child);

	expect(dummy_component.Update).toBeCalledTimes(2);
});

test("Test Will The Remove Method Trigger Update", () => {
	const dummy_component = new DummyDivContainer();

	vi.spyOn(dummy_component, "Update");
	dummy_component.Dispose();

	expect(dummy_component.Update).toBeCalledTimes(1);
});

