export interface IHasDefaultValue<T> {
	DefaultValue: T;
}

export interface ICanUpdate {
	Update(): void;
}
