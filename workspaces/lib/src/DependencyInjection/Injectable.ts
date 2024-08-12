import { MetadataKeys } from "./Metadata";

/**
 * I don't know what is that even means but seems can access the class name from it by using `Typed().prototype.constructor.name as string`
 */
export type Typed = () => Object;

/**
 * Apply to the class that needs a callback when dependency was injected
 */
export interface IInjectable {
	/**
	 * Call when the dependency is loaded
	 */
	loadCompleted?(): void;
}

// #region Decorators

/**
 * Apply to the property that need the dependency
 * @see Cached
 * @param injectKey The index of the dependency
 * @example
 * \@Resolved("username")
 * username!: string;
 *
 * \@Resolved("register")
 * register!: (name: string, password: string) => void;
 */
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
 * Apply to the property that can provide dependency to its children
 * @remarks if you want to provide a method, you must write it as arrow function to so that the `this` won't change when inject
 * @see Resolved
 * @param injectKey The index of the dependency
 * @example
 * \@Cached("username")
 * username: string;
 *
 * \@Cached("register")
 * register = (name: string, password: string): void => { };
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
