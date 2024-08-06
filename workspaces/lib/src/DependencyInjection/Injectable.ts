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
			void Reflect.defineMetadata(
				MetadataKeys.InjectableProperty,
				injectKey.toString(),
				target,
				propertyKey
			);
		};
	}

	// #endregion
}
