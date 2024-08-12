import { expect, test, vi } from "vitest";
import { DummyDivContainer } from "./helper";

test("Test Will The Add Method Trigger Update", () => {
	const dummy_component = new DummyDivContainer();

	vi.spyOn(dummy_component, "update");
	dummy_component.add(new DummyDivContainer());

	expect(dummy_component.update).toBeCalledTimes(1);
});

test("Test Will The Remove Method Trigger Update", () => {
	const dummy_component = new DummyDivContainer();
	const child = new DummyDivContainer();

	vi.spyOn(dummy_component, "update");
	dummy_component.add(child);

	expect(dummy_component.update).toBeCalledTimes(1);

	dummy_component.remove(child);

	expect(dummy_component.update).toBeCalledTimes(2);
});

test("Test Will The Remove Method Trigger Update", () => {
	const dummy_component = new DummyDivContainer();

	vi.spyOn(dummy_component, "update");
	dummy_component.dispose();

	expect(dummy_component.update).toBeCalledTimes(1);
});

