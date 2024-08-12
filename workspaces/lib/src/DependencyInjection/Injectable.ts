import { MetadataKeys } from "./Metadata";

/**
 * I don't know what is that even means but seems can access the class name from it by using `Typed().prototype.constructor.name as string`
 */
export type Typed = () => Object;

export interface IInjectable {
	/**
	 * Call when the dependency is loaded
	 */
	LoadCompleted?(): void;
}

// #region Decorators

export function Resolved(
	injectKey: string | symbol | Typed
): PropertyDecorator {
	if (typeof injectKey == "function") {
		// @ts-ignore
		injectKey = injectKey().prototype.constructor.name as string;
	}
	return (target: Object, propertyKey: string | symbol) => {
		Reflect.defineMetadata(
			MetadataKeys.ResolvedProperty,
			{
				DependencyKey: injectKey.toString(),
				Target: target,
				TargetPropertyKey: propertyKey.toString(),
			} satisfies InjectablePropertyMetadata,
			target,
			propertyKey
		);
	};
}

/**
 * Applicable for the literal value
 */
export function Cached(injectKey: string | symbol | Typed): PropertyDecorator {
	if (typeof injectKey == "function") {
		injectKey = injectKey().prototype.constructor.name as string;
	}
	return (target: Object, propertyKey: string | symbol) => {
		Reflect.defineMetadata(
			MetadataKeys.CachedProperty,
			{
				DependencyKey: injectKey.toString(),
				Target: target,
				TargetPropertyKey: propertyKey.toString(),
			} satisfies InjectablePropertyMetadata,
			target,
			propertyKey
		);
	};
}

export abstract class InjectablePropertyMetadata {
	abstract DependencyKey: string;
	/**
	 * The target here is the object not an instance
	 */
	abstract Target: Object;
	abstract TargetPropertyKey: string;
}

// #endregion
