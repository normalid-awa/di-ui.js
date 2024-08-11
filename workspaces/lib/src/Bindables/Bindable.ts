import { IHasDefaultValue } from "../Interfaces";

export interface IValueChangedEvent<T> {
	OldValue: T;
	NewValue: T;
}

export type ValueChangedCallback<T> = (event: IValueChangedEvent<T>) => unknown;

export interface IBindable<T> extends IHasDefaultValue<T> {
	Value: T;
	readonly BindTarget?: IBindable<T>;
	BindTo(target: IBindable<T>): void;
	OnValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately: boolean
	): void;
	OnDefaultValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately: boolean
	): void;
	/**
	 * Will unbind from BindTarget
	 */
	Unbind(): void;
	CopyTo(target: IBindable<T>): void;
}

export class Bindable<T> implements IBindable<T> {
	private readonly valueChangedCallbackFunctions: ValueChangedCallback<T>[] = [];
	private readonly defaultValueChangedCallbackFunctions: ValueChangedCallback<T>[] = [];
	private readonly bindings: IBindable<T>[] = [];
	private readonly bindTargetId: number = -1;

	private defaultValue: T;
	get DefaultValue(): T {
		return this.defaultValue;
	}
	set DefaultValue(newValue: T) {
		if (this.defaultValue === newValue) return;
		this.triggerDefaultValueChangedEvent(this.defaultValue, newValue);
		this.defaultValue = newValue;
	}

	private bindTarget?: Bindable<T>;
	get BindTarget(): IBindable<T> | undefined {
		return this.bindTarget;
	}

	private value: T;
	get Value(): T {
		return this.value;
	}
	set Value(newValue: T) {
		if (this.value === newValue) return;
		this.triggerValueChangeEvent(this.value, newValue);
		this.value = newValue;
	}

	constructor(defaultValue: T) {
		this.defaultValue = defaultValue;
		this.value = defaultValue;
	}

	private triggerValueChangeEvent(oldVal: T, newVal: T): void {
		this.valueChangedCallbackFunctions.forEach((fn) => {
			fn({
				OldValue: oldVal,
				NewValue: newVal,
			});
		});

		this.bindings.forEach((target) => {
			target.Value = newVal;
		});
	}

	OnValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately: boolean
	): void {
		this.valueChangedCallbackFunctions.push(callback);
		if (runImmediately)
			callback({
				OldValue: undefined as T,
				NewValue: this.value,
			});
	}

	private triggerDefaultValueChangedEvent(oldVal: T, newVal: T): void {
		this.defaultValueChangedCallbackFunctions.forEach((fn) => {
			fn({
				OldValue: oldVal,
				NewValue: newVal,
			});
		});

		this.bindings.forEach((b) => {
			b.DefaultValue = newVal;
		});
	}

	OnDefaultValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately: boolean
	): void {
		this.defaultValueChangedCallbackFunctions.push(callback);
		if (runImmediately) {
			callback({
				OldValue: this.defaultValue,
				NewValue: this.defaultValue,
			});
		}
	}

	CopyTo(target: IBindable<T>): void {
		target.Value = this.Value;
		target.DefaultValue = this.DefaultValue;
	}

	protected ReferenceTo(target: IBindable<T>): number {
		return this.bindings.push(target);
	}

	protected DereferenceTo(id: number): void {
		this.bindings.splice(id, 1);
	}

	BindTo(target: Bindable<T>): void {
		this.Unbind();
		this.bindTarget = target;

		target.CopyTo(this);
		target.ReferenceTo(this);
	}

	Unbind(): void {
		this.bindTarget?.DereferenceTo(this.bindTargetId);
		this.bindTarget = undefined;
	}
}
