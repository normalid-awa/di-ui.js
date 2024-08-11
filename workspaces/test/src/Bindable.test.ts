import { expect, test, vi } from "vitest";
import { Bindable, IValueChangedEvent } from "di-ui.js";

test("Test Bindable Value", () => {
	const bind = new Bindable<number>(0);
	bind.Value = 10;

	expect(bind.DefaultValue).eq(0);
	expect(bind.Value).eq(10);

	bind.DefaultValue = 5;

	expect(bind.DefaultValue).eq(5);
	expect(bind.Value).eq(10);
});

test("Test Bindable Value Change Event", () => {
	const bind = new Bindable<number>(0);

	const on_val_changed = vi.fn((v: IValueChangedEvent<number>) => v);

	bind.OnValueChanged(on_val_changed, true);

	expect(on_val_changed).toHaveReturnedWith({
		OldValue: 0,
		NewValue: 0,
	} satisfies IValueChangedEvent<number>);

	bind.Value = 10;

	expect(on_val_changed).toHaveReturnedWith({
		OldValue: 0,
		NewValue: 10,
	} satisfies IValueChangedEvent<number>);
});

test("Test Bindable Default Value Change Event", () => {
	const bind = new Bindable<number>(0);

	const on_default_val_changed = vi.fn();

	bind.OnDefaultValueChanged(on_default_val_changed, true);

	expect(on_default_val_changed).nthCalledWith(1, {
		OldValue: 0,
		NewValue: 0,
	} satisfies IValueChangedEvent<number>);

	bind.DefaultValue = 10;

	expect(on_default_val_changed).nthCalledWith(2, {
		OldValue: 0,
		NewValue: 10,
	} satisfies IValueChangedEvent<number>);
});

test("Test Bindable Bind To Others", () => {
	const root_bind = new Bindable<number>(0);
	const other_bind = new Bindable<number>(10);

	other_bind.BindTo(root_bind);

	expect(root_bind.Value).eq(0);
	expect(other_bind.Value).eq(0);

	root_bind.Value = 10;

	expect(root_bind.Value).eq(10);
	expect(other_bind.Value).eq(10);

	other_bind.Unbind();

	expect(root_bind.Value).eq(10);
	expect(other_bind.Value).eq(10);

	root_bind.Value = -10;
	other_bind.Value = 100;

	expect(root_bind.Value).eq(-10);
	expect(other_bind.Value).eq(100);
});

test("Test Editable Binding", () => {
	const root_bind = new Bindable<number>(0);
	const other_bind = root_bind.GetEditableCopy();

	const root_val_change = vi.fn();
	const other_val_change = vi.fn();
	root_bind.OnValueChanged(root_val_change);
	other_bind.OnValueChanged(other_val_change);

	expect(root_bind.Value).eq(0);
	expect(other_bind.Value).eq(0);

	root_bind.Value = 10;

	expect(root_val_change).nthCalledWith(1, {
		OldValue: 0,
		NewValue: 10,
	} satisfies IValueChangedEvent<number>);
	expect(other_val_change).nthCalledWith(1, {
		OldValue: 0,
		NewValue: 10,
	} satisfies IValueChangedEvent<number>);
	expect(root_bind.Value).eq(10);
	expect(other_bind.Value).eq(10);

	other_bind.Value = 100;

	expect(root_val_change).nthCalledWith(2, {
		OldValue: 10,
		NewValue: 100,
	} satisfies IValueChangedEvent<number>);
	expect(other_val_change).nthCalledWith(2, {
		OldValue: 10,
		NewValue: 100,
	} satisfies IValueChangedEvent<number>);
	expect(root_bind.Value).eq(100);
	expect(other_bind.Value).eq(100);

	other_bind.Unbind();

	expect(root_bind.Value).eq(100);
	expect(other_bind.Value).eq(100);

	root_bind.Value = -10;
	other_bind.Value = 1001;

	expect(root_bind.Value).eq(-10);
	expect(other_bind.Value).eq(1001);
});
