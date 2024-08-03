export namespace DependencyContainer {
	export enum ProvidedType {
		/**
		 * Includes literals, instances of classes, and functions
		 */
		Value = 0,
		/**
		 * Includes types, class, type aliases, instances, and type of functions
		 */
		Class = 1,
		/**
		 * Only includes singletons instances that shared globally
		 */
		Singleton = 2,
	}

	export interface IDependencyContainer {
		Provide<T>(
			type: ProvidedType,
			key: string,
			value: object
		): this;

		Get<T>(key: string): T;
	}

	export class DependencyContainer implements IDependencyContainer {
		private readonly dependencies: Map<string, any> = new Map();

		Provide<T>(
			type: ProvidedType,
			key: string,
			value: T | object
		): this {
			switch (type) {
				case ProvidedType.Class:
					this.dependencies.set(key, value);
					break;
				case ProvidedType.Singleton:
					this.dependencies.set(key, value);
					break;
				case ProvidedType.Value:
					this.dependencies.set(key, value);
					break;
			}

			return this;
		}

		Get<T>(key: string): T {
			return this.dependencies.get(key) as T;
		}
	}

	export interface IInjectable {
		/**
		 * Call when the dependency is loaded
		 */
		LoadComplete(): void;

		/**
		 * Call when the dependency is disposed
		 */
		Dispose(): void;
	}
}
