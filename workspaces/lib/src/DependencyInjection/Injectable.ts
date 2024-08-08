import { Composite } from "../Composite";
import { MetadataKeys } from "./Metadata";

export module Injectable {
	/**
	 * I don't know what is that even means but seems can access the class name from it by using `Typed().prototype.constructor.name as string`
	 */
	export type Typed = () => new () => object;

	export interface IInjectable {
		/**
		 * Call when the dependency is loaded
		 */
		LoadComplete?(): void;
	}

	// #region Decorators

	export interface IInjectablePropertyMetadata {
		injectKey: string;
		target: Object;
		propertyKey: string;
	}

	export function Resolved(injectKey: string | symbol | Typed): PropertyDecorator {
		if (typeof injectKey == "function") {
			injectKey = injectKey().prototype.constructor.name as string;
		}
		return (target: Object, propertyKey: string | symbol) => {
			Reflect.defineMetadata(
				MetadataKeys.ResolvedProperty,
				injectKey.toString(),
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
				injectKey.toString(),
				target,
				propertyKey
			);
		};
	}

	// #endregion
}
