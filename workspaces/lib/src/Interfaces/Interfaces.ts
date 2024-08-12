export interface IHasDefaultValue<T> {
	defaultValue: T;
}

export interface ICanUpdate {
	update(): void;
}
