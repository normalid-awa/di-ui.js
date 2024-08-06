import "reflect-metadata";
import { MetadataKeys } from "./Metadata";
import { Composite } from "../Composite";

export module DependencyContainer {
	export type DependencyLitralKey = string | symbol;
	export type DependencyTypeKey<T> = new () => T;

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
		Dependencies: Map<string, any>;
		Target: Composite.IComposable;
	}

	export class DependencyContainer implements IDependencyContainer {
		private readonly injectedTargetRoot: Composite.IComposable;

		private readonly dependencyTree: IDependencyTree;
		
		constructor(injectTargetRoot: Composite.IComposable) {
			this.injectedTargetRoot = injectTargetRoot;
			this.dependencyTree = {
				Parent: undefined,
				Children: [],
				Dependencies: new Map<string, any>(),
				Target: injectTargetRoot,
			};
		}

		private transformCompositeComponentIntoDependencyTree(
			root: Composite.IComposable
		): IDependencyTree {
			const dependency_tree: IDependencyTree = {
				Parent: undefined,
				Children: [],
				Dependencies: new Map<string, any>(),
			};

			for (const child of root.Children) {
				dependency_tree.Children.push({
					...this.transformCompositeComponentIntoDependencyTree(
						child
					),
					Parent: dependency_tree,
				});
				//TODO: dependency properties needs to be setted here
			}

			return dependency_tree;
		}

		protected BuildDependencyTree(): IDependencyTree {
			const dependency_tree =
				this.transformCompositeComponentIntoDependencyTree(
					this.injectedTargetRoot
				);
			return dependency_tree;
		}

		ResolveRoot(): void {
			this.BuildDependencyTree();

			// flatern di injection
			const flat_children = this.injectedTargetRoot.ExtractChildrenToFlatList();

			for (const child of flat_children) {
				const own_keys = Object.getOwnPropertyNames(child);
				for (const property_key of own_keys) {
					if (
						Reflect.hasMetadata(
							MetadataKeys.ResolvedProperty,
							child,
							property_key
						)
					) {
						const inject_key: string = Reflect.getMetadata(
							MetadataKeys.ResolvedProperty,
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
			this.dependencyTree.Dependencies.set(this.getKeyName(key), value);
			return this;
		}

		Get<T>(key: DependencyLitralKey | DependencyTypeKey<T>): T {
			return this.dependencyTree.Dependencies.get(
				this.getKeyName(key)
			) as T;
		}
	}
}
