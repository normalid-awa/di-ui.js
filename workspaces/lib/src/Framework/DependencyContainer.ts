import "reflect-metadata";
import { MetadataKeys } from "./Metadata";
import { Composite } from "../Composite";

export module DependencyInjection {
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
		/**
		 * Provide a value to the container, which can be injected
		 * @param type Determines the type of injection
		 * @param key The key to inject
		 * @param value The value to inject
		 */
		Provide<T>(type: ProvidedType, key: string | symbol, value: object): this;

		/**
		 * retrieve the value from the container
		 * @param key The key to get
		 */
		Get<T>(key: string | symbol): T;

		/**
		 * Inject dependencies to the children
		 */
		ResolveRoot(): void;
	}

	export class DependencyContainer implements IDependencyContainer {
		private readonly dependencies: Map<string, any> = new Map();
		private readonly injectTargetRoot: Composite.IComposable;

		constructor(injectTargetRoot: Composite.IComposable) {
			this.injectTargetRoot = injectTargetRoot;
		}

		ResolveRoot(): void {
			const flat_children = this.extractAllChildrenIntoFlatMap(
				this.injectTargetRoot.Children
			);

			for (const child of flat_children) {
				const own_keys = Object.getOwnPropertyNames(child);
				for (const property_key of own_keys) {
					if (
						Reflect.hasMetadata(
							MetadataKeys.InjectableProperty,
							child,
							property_key
						)
					) {
						const inject_key: string = Reflect.getMetadata(
							MetadataKeys.InjectableProperty,
							child,
							property_key
						) as string;
						(child as Record<string, any>)[property_key] =
							this.Get(inject_key) as unknown;
					}
				}
			}
		}

		private extractAllChildrenIntoFlatMap(
			children: Composite.IComposable[]
		): Composite.IComposable[] {
			const flat_map: Composite.IComposable[] = [];
			children.forEach((child) => {
				flat_map.push(child);
				flat_map.push(
					...this.extractAllChildrenIntoFlatMap(child.Children)
				);
			});
			return flat_map;
		}

		Provide<T>(
			type: ProvidedType,
			key: string | symbol,
			value: T | object
		): this {
			switch (type) {
				case ProvidedType.Class:
				case ProvidedType.Singleton:
				case ProvidedType.Value:
					this.dependencies.set(key.toString(), value);
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
