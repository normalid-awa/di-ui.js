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
		ResolveRoot(): void;
	}

	export class DependencyNotFoundError extends Error {
		constructor(dependencyKey: string) {
			super(`Dependency "${dependencyKey}" not found in the registry`);
		}
	}

	interface IDependencyTree {
		Parent: IDependencyTree | undefined;
		Children: IDependencyTree[];

		dependencies: Map<string, any>;
	}

	export class DependencyContainer implements IDependencyContainer {
		private readonly dependencyTree: IDependencyTree = {
			Parent: undefined,
			Children: [],
			dependencies: new Map<string, any>(),
		};
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
						(child as Record<string, any>)[property_key] = this.Get(
							inject_key
						) as unknown;
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

		private getKeyName(
			key: DependencyLitralKey | DependencyTypeKey<any>
		): string {
			if (typeof key == "symbol" || typeof key == "string")
				return key.toString();
			else if (typeof key == "function") return key.name;
			throw new DependencyNotFoundError(String(key));
		}

		Provide<T>(
			key: DependencyLitralKey | DependencyTypeKey<T>,
			value: T
		): this {
			this.dependencyTree.dependencies.set(this.getKeyName(key), value);
			return this;
		}

		Get<T>(key: DependencyLitralKey | DependencyTypeKey<T>): T {
			return this.dependencyTree.dependencies.get(this.getKeyName(key)) as T;
		}
	}
}
