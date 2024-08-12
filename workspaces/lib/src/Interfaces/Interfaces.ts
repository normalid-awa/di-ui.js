/**
 * Represent the class have the default value
 */
export interface IHasDefaultValue<T> {
	defaultValue: T;
}

/**
 * Represent the class can be update
 */
export interface ICanUpdate {
	update(): void;
}
