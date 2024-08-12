import { IHasDefaultValue } from "../Interfaces";

/**
 * When the bindable was bind to the others, and the value of the bind was change, this error would be thrown
 */
export class CouldNotSetValueToAbindedBindableError extends Error {
	constructor() {
		super(
			"Could not set value on a bindable that already bind to others, use Bindable.GetEditableCopy() to set value"
		);
	}
}

export interface IValueChangedEvent<T> {
	oldValue: T;
	newValue: T;
}

export type ValueChangedCallback<T> = (event: IValueChangedEvent<T>) => unknown;

export interface IBindable<T> extends IHasDefaultValue<T> {
	/**
	 * The value of the binding
	 */
	value: T;

	/**
	 * The bind target of the bind, null when it didn't bind o other
	 */
	readonly bindTarget?: IBindable<T>;

	/**
	 * Bind this binding to other, the value will be synced
	 * @param target
	 */
	bindTo(target: IBindable<T>): void;

	/**
	 * Register a callback to the value change event
	 * @param callback the callback function when the value was change
	 * @param runImmediately will it run once just after the event was register?
	 */
	onValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately?: boolean
	): void;

	/**
	 * Register a callback to the default value change event
	 * @param callback the callback function when the default value was change
	 * @param runImmediately will it run once just after the event was register?
	 */
	onDefaultValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately?: boolean
	): void;

	/**
	 * Will unbind from BindTarget, and the value will not longer be sync.
	 */
	unbind(): void;

	/**
	 * Copy the value and defualt value to the target, can be useful when the value only need to be sync once
	 * @param target the target binding
	 */
	copyTo(target: IBindable<T>): void;
}

export class Bindable<T> implements IBindable<T> {
	private readonly valueChangedCallbackFunctions: ValueChangedCallback<T>[] =
		[];
	private readonly defaultValueChangedCallbackFunctions: ValueChangedCallback<T>[] =
		[];
	private readonly bindings: Bindable<T>[] = [];
	private readonly bindTargetId: number = -1;
	private isEditableCopy: boolean = false;

	#defaultValue: T;
	get defaultValue(): T {
		return this.#defaultValue;
	}
	set defaultValue(newValue: T) {
		if (this.#defaultValue === newValue) return;
		this.triggerDefaultValueChangedEvent(this.#defaultValue, newValue);
		this.#defaultValue = newValue;
	}

	#bindTarget?: Bindable<T>;
	get bindTarget(): IBindable<T> | undefined {
		return this.#bindTarget;
	}

	#value: T;
	get value(): T {
		return this.#value;
	}
	set value(newValue: T) {
		if (this.bindTarget && !this.isEditableCopy)
			throw new CouldNotSetValueToAbindedBindableError();
		if (this.bindTarget && this.isEditableCopy) {
			this.bindTarget.value = newValue;
			return;
		}
		if (this.#value === newValue) return;
		this.triggerValueChangeEvent(this.#value, newValue);
		this.#value = newValue;
	}

	constructor(defaultValue: T) {
		this.#defaultValue = defaultValue;
		this.#value = defaultValue;
	}

	private triggerValueChangeEvent(oldVal: T, newVal: T): void {
		this.valueChangedCallbackFunctions.forEach((fn) => {
			fn({
				oldValue: oldVal,
				newValue: newVal,
			});
		});

		this.bindings.forEach((target) => {
			if (target.bindTarget == this) {
				target.#value = newVal;
				target.triggerValueChangeEvent(oldVal, newVal);
			} else target.value = newVal;
		});
	}

	onValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately: boolean = false
	): void {
		this.valueChangedCallbackFunctions.push(callback);
		if (runImmediately)
			callback({
				oldValue: this.#value,
				newValue: this.#value,
			});
	}

	private triggerDefaultValueChangedEvent(oldVal: T, newVal: T): void {
		this.defaultValueChangedCallbackFunctions.forEach((fn) => {
			fn({
				oldValue: oldVal,
				newValue: newVal,
			});
		});

		this.bindings.forEach((b) => {
			b.defaultValue = newVal;
		});
	}

	onDefaultValueChanged(
		callback: ValueChangedCallback<T>,
		runImmediately: boolean = false
	): void {
		this.defaultValueChangedCallbackFunctions.push(callback);
		if (runImmediately) {
			callback({
				oldValue: this.#defaultValue,
				newValue: this.#defaultValue,
			});
		}
	}

	copyTo(target: IBindable<T>): void {
		target.value = this.value;
		target.defaultValue = this.defaultValue;
	}

	protected ReferenceTo(target: Bindable<T>): number {
		return this.bindings.push(target);
	}

	protected DereferenceTo(id: number): void {
		this.bindings.splice(id, 1);
	}

	bindTo(target: Bindable<T>): void {
		if (this.bindTarget) this.unbind();

		target.copyTo(this);
		target.ReferenceTo(this);

		this.#bindTarget = target;
	}

	unbind(): void {
		this.#bindTarget?.DereferenceTo(this.bindTargetId);
		this.#bindTarget = undefined;
	}

	getEditableCopy(): Bindable<T> {
		const bind = new Bindable<T>(this.#defaultValue);
		bind.isEditableCopy = true;
		bind.bindTo(this);
		return bind;
	}
}
