import { MetadataKeys } from "./Metadata";

/**
 * I don't know what is that even means but seems can access the class name from it by using `Typed().prototype.constructor.name as string`
 */
export type Typed = () => Object;

export interface IInjectable {
	/**
	 * Call when the dependency is loaded
	 */
	loadCompleted?(): void;
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
				dependencyKey: injectKey.toString(),
				target: target,
				targetPropertyKey: propertyKey.toString(),
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
		//@ts-ignore
		injectKey = injectKey().prototype.constructor.name as string;
	}
	return (target: Object, propertyKey: string | symbol) => {
		Reflect.defineMetadata(
			MetadataKeys.CachedProperty,
			{
				dependencyKey: injectKey.toString(),
				target: target,
				targetPropertyKey: propertyKey.toString(),
			} satisfies InjectablePropertyMetadata,
			target,
			propertyKey
		);
	};
}

export abstract class InjectablePropertyMetadata {
	abstract dependencyKey: string;
	/**
	 * The target here is the object not an instance
	 */
	abstract target: Object;
	abstract targetPropertyKey: string;
}

// #endregion
