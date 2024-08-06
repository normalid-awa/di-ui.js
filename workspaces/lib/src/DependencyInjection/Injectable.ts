import { Composite } from "../Composite";
import { MetadataKeys } from "./Metadata";

export module Injectable {
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

	export function Resolved(injectKey: string | symbol): PropertyDecorator {
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
	export function CachedAs(injectKey: string | symbol): PropertyDecorator {
		return (target: Object, propertyKey: string | symbol) => {
			Reflect.defineMetadata(
				MetadataKeys.CachedAsProperty,
				injectKey.toString(),
				target,
				propertyKey
			);
		};
	}

	/**
	 * Applicable for the types or classes instance
	 */
	export function Cached(): PropertyDecorator {
		return (target: Object, propertyKey: string | symbol) => {
			Reflect.defineMetadata(
				MetadataKeys.CachedProperty,
				propertyKey.toString(),
				target,
				propertyKey
			);
		};
	}

	// #endregion
}
