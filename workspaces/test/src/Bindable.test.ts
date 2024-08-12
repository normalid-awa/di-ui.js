import { expect, test, vi } from "vitest";
import { Bindable, IValueChangedEvent } from "di-ui.js";

test("Test Bindable Value", () => {
	const bind = new Bindable<number>(0);
	bind.value = 10;

	expect(bind.defaultValue).eq(0);
	expect(bind.value).eq(10);

	bind.defaultValue = 5;

	expect(bind.defaultValue).eq(5);
	expect(bind.value).eq(10);
});

test("Test Bindable Value Change Event", () => {
	const bind = new Bindable<number>(0);

	const on_val_changed = vi.fn((v: IValueChangedEvent<number>) => v);

	bind.onValueChanged(on_val_changed, true);

	expect(on_val_changed).toHaveReturnedWith({
		oldValue: 0,
		newValue: 0,
	} satisfies IValueChangedEvent<number>);

	bind.value = 10;

	expect(on_val_changed).toHaveReturnedWith({
		oldValue: 0,
		newValue: 10,
	} satisfies IValueChangedEvent<number>);
});

test("Test Bindable Default Value Change Event", () => {
	const bind = new Bindable<number>(0);

	const on_default_val_changed = vi.fn();

	bind.onDefaultValueChanged(on_default_val_changed, true);

	expect(on_default_val_changed).nthCalledWith(1, {
		oldValue: 0,
		newValue: 0,
	} satisfies IValueChangedEvent<number>);

	bind.defaultValue = 10;

	expect(on_default_val_changed).nthCalledWith(2, {
		oldValue: 0,
		newValue: 10,
	} satisfies IValueChangedEvent<number>);
});

test("Test Bindable Bind To Others", () => {
	const root_bind = new Bindable<number>(0);
	const other_bind = new Bindable<number>(10);

	other_bind.bindTo(root_bind);

	expect(root_bind.value).eq(0);
	expect(other_bind.value).eq(0);

	root_bind.value = 10;

	expect(root_bind.value).eq(10);
	expect(other_bind.value).eq(10);

	other_bind.unbind();

	expect(root_bind.value).eq(10);
	expect(other_bind.value).eq(10);

	root_bind.value = -10;
	other_bind.value = 100;

	expect(root_bind.value).eq(-10);
	expect(other_bind.value).eq(100);
});

test("Test Editable Binding", () => {
	const root_bind = new Bindable<number>(0);
	const other_bind = root_bind.getEditableCopy();

	const root_val_change = vi.fn();
	const other_val_change = vi.fn();
	root_bind.onValueChanged(root_val_change);
	other_bind.onValueChanged(other_val_change);

	expect(root_bind.value).eq(0);
	expect(other_bind.value).eq(0);

	root_bind.value = 10;

	expect(root_val_change).nthCalledWith(1, {
		oldValue: 0,
		newValue: 10,
	} satisfies IValueChangedEvent<number>);
	expect(other_val_change).nthCalledWith(1, {
		oldValue: 0,
		newValue: 10,
	} satisfies IValueChangedEvent<number>);
	expect(root_bind.value).eq(10);
	expect(other_bind.value).eq(10);

	other_bind.value = 100;

	expect(root_val_change).nthCalledWith(2, {
		oldValue: 10,
		newValue: 100,
	} satisfies IValueChangedEvent<number>);
	expect(other_val_change).nthCalledWith(2, {
		oldValue: 10,
		newValue: 100,
	} satisfies IValueChangedEvent<number>);
	expect(root_bind.value).eq(100);
	expect(other_bind.value).eq(100);

	other_bind.unbind();

	expect(root_bind.value).eq(100);
	expect(other_bind.value).eq(100);

	root_bind.value = -10;
	other_bind.value = 1001;

	expect(root_bind.value).eq(-10);
	expect(other_bind.value).eq(1001);
});
