import "reflect-metadata";
import { MetadataKeys } from "./Metadata";
import { Composite } from "../Composite";

export namespace DependencyInjection {
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
		Provide<T>(type: ProvidedType, key: string, value: object): this;

		Get<T>(key: string): T;

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

			flat_children.forEach((child) => {
				const injectable_properties = Object.keys(child)
					.map((propertyKey) => {
						if (
							Reflect.hasMetadata(
								MetadataKeys.InjectableProperty,
								child,
								propertyKey
							)
						)
							return propertyKey;
						return undefined;
					})
					.filter((value) => value !== undefined);

				injectable_properties.forEach((propertyKey) => {
					const inject_key: string = Reflect.getMetadata(
						MetadataKeys.InjectableProperty,
						child,
						propertyKey
					) as string;

					(child as Record<string, any>)[propertyKey] =
						this.dependencies.get(inject_key) as unknown;
				});
			});
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

		Provide<T>(type: ProvidedType, key: string, value: T | object): this {
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

	// #region Decorators

	export interface IInjectablePropertyMetadata {
		injectKey: string;
		target: Object;
		propertyKey: string;
	}

	export function Resolved(injectKey: string): PropertyDecorator {
		return (target: Object, propertyKey: string | symbol) => {
			void Reflect.defineMetadata(
				MetadataKeys.InjectableProperty,
				injectKey,
				target,
				propertyKey
			);
		};
	}

	// #endregion
}
