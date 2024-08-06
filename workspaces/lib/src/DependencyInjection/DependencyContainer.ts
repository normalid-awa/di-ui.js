import "reflect-metadata";
import { MetadataKeys } from "./Metadata";
import { Composite } from "../Composite";

export module DependencyContainer {
	export type DependencyLitralKey = string | symbol;
	export type DependencyTypeKey<T> = new () => T;

	export enum ProvideType {
		Value = "Value",
		Singleton = "Singleton",
	}

	export interface IDependencyContainer {
		/**
		 * Provide the value to the container ``` ProvideType.Value ```
		 * @param key the unique key of the dependency, RECOMMENDED to use symbol
		 * @param value any thing you want to store
		 */
		Provide<T>(
			key: DependencyLitralKey | DependencyTypeKey<T>,
			value: T
		): this;

		Get<T>(key: DependencyLitralKey | DependencyTypeKey<T>): T;

		/**
		 * Inject dependencies to the children
		 */
		// ResolveRoot(): void;
	}

	export class DependencyNotFoundError extends Error {
		constructor(dependencyKey: string) {
			super(`Dependency "${dependencyKey}" not found in the registry`);
		}
	}

	export class DependencyContainer implements IDependencyContainer {
		private readonly valuesDependencies: Map<string, any> = new Map();
		private readonly singletonsDependencies: Map<string, any> = new Map();
		private readonly injectTargetRoot: Composite.IComposable;

		constructor(injectTargetRoot: Composite.IComposable) {
			this.injectTargetRoot = injectTargetRoot;
		}

		// ResolveRoot(): void {
		// 	const flat_children = this.extractAllChildrenIntoFlatMap(
		// 		this.injectTargetRoot.Children
		// 	);

		// 	for (const child of flat_children) {
		// 		const own_keys = Object.getOwnPropertyNames(child);
		// 		for (const property_key of own_keys) {
		// 			if (
		// 				Reflect.hasMetadata(
		// 					MetadataKeys.InjectableProperty,
		// 					child,
		// 					property_key
		// 				)
		// 			) {
		// 				const inject_key: string = Reflect.getMetadata(
		// 					MetadataKeys.InjectableProperty,
		// 					child,
		// 					property_key
		// 				) as string;
		// 				(child as Record<string, any>)[property_key] = this.Get(
		// 					inject_key
		// 				) as unknown;
		// 			}
		// 		}
		// 	}
		// }

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

		private determineKeyType(
			key: DependencyLitralKey | DependencyTypeKey<any>
		): ProvideType {
			if (typeof key == "symbol" || typeof key == "string") 
				return ProvideType.Value;
			else if (typeof key == "function") 
				return ProvideType.Singleton;
			throw new DependencyNotFoundError(String(key));
		}

		Provide<T>(
			key: DependencyLitralKey | DependencyTypeKey<T>,
			value: T
		): this {
			switch (this.determineKeyType(key)) {
				case ProvideType.Value:
					key = key as DependencyLitralKey;
					this.valuesDependencies.set(key.toString(), value);
					break;
				case ProvideType.Singleton:
					key = key as DependencyTypeKey<T>;
					this.singletonsDependencies.set(key.name, value);
					break;
			}
			return this;
		}

		Get<T>(key: DependencyLitralKey | DependencyTypeKey<T>): T {
			switch (this.determineKeyType(key)) {
				case ProvideType.Value:
					key = key as DependencyLitralKey;
					return this.valuesDependencies.get(key.toString()) as T;
				case ProvideType.Singleton:
					key = key as DependencyTypeKey<T>;
					return this.singletonsDependencies.get(key.name) as T;
				default:
					throw new DependencyNotFoundError(String(key));
			}
		}
	}
}
