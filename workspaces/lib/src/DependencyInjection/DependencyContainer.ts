import "reflect-metadata";
import { MetadataKeys } from "./Metadata";
import { Composite } from "../Composite";
import { Injectable } from "./Injectable";

export module DependencyContainer {
	export type DependencyLitralKey = string | symbol;
	export type DependencyTypeKey<T> = new () => T;

	export interface IDependencyContainer {
		/**
		 * Provide the value to the container ``` ProvideType.Value ```
		 * WARN: As you directly pass by this method, it will be available globally
		 * @param key the unique key of the dependency, RECOMMENDED to use symbol
		 * @param value any thing you want to store
		 */
		Provide<T>(
			key: DependencyLitralKey | DependencyTypeKey<T>,
			value: T
		): this;

		/**
		 * Inject dependencies to the children
		 */
		ResolveDependency(): void;

		CacheDependency(): void;
	}

	export class DependencyNotFoundError extends Error {
		constructor(dependencyKey: string) {
			super(`Dependency "${dependencyKey}" not found in the registry`);
		}
	}

	export type InjectableMetadataTypes =
		| Injectable.ICachedPropertyMetadata
		| Injectable.IResolvedPropertyMetadata;

	export type DependenciesMappedType = Map<
		"Cached" | "Resolved",
		Map<string, any>
	>;

	//WARN: Not sure this is appropriate to exsite in here
	// This code must be refactor in the near future, for now it is ok
	// As long as the development, this will become a huge tech debt.
	interface IDependencyTree {
		Parent: IDependencyTree | undefined;
		Children: IDependencyTree[];
		Dependencies: DependenciesMappedType;
		Target: Composite.IComposable;
	}

	export class DependencyContainer implements IDependencyContainer {
		private readonly injectedTargetRoot: Composite.IComposable;

		private dependencyTree: IDependencyTree;

		constructor(injectTargetRoot: Composite.IComposable) {
			this.injectedTargetRoot = injectTargetRoot;
			this.dependencyTree = {
				Parent: undefined,
				Children: [],
				Dependencies: new Map(),
				Target: injectTargetRoot,
			};
		}

		private extractInjectableMetadata(
			target: object
		): Record<keyof typeof MetadataKeys, InjectableMetadataTypes[]> {
			const result: Record<
				keyof typeof MetadataKeys,
				InjectableMetadataTypes[]
			> = {
				CachedProperty: [],
				ResolvedProperty: [],
			};
			const own_keys = Object.getOwnPropertyNames(target);
			for (const property_key of own_keys)
				(
					Object.getOwnPropertyNames(
						MetadataKeys
					) as (keyof typeof MetadataKeys)[]
				).forEach((metakey: keyof typeof MetadataKeys) => {
					if (
						!Reflect.hasMetadata(
							MetadataKeys[metakey],
							target,
							property_key
						)
					)
						return;

					result[metakey].push(
						Reflect.getMetadata(
							MetadataKeys[metakey],
							target,
							property_key
						) as InjectableMetadataTypes
					);
				});

			return result;
		}

		private transformCompositeComponentIntoDependencyTree(
			root: Composite.IComposable,
			parentDependencies: DependenciesMappedType = new Map()
		): IDependencyTree {
			const dependency_tree: IDependencyTree = {
				Children: [],
				Dependencies: parentDependencies,
				Parent: undefined,
				Target: root,
			};

			for (const child of root.Children) {
				const metadatas = this.extractInjectableMetadata(child);
				const cached = new Map<string, any>();
				const resolved = new Map<string, any>();

				metadatas.CachedProperty.forEach((key) => {
					cached.set(key.dependencyKey, key);
				});
				metadatas.ResolvedProperty.forEach((key) => {
					resolved.set(key.dependencyKey, key);
				});

				const child_dependencies: DependenciesMappedType = new Map();
				child_dependencies.set("Cached", cached);
				child_dependencies.set("Resolved", resolved);

				dependency_tree.Children.push({
					...this.transformCompositeComponentIntoDependencyTree(
						child,
						child_dependencies
					),
				});
			}

			return dependency_tree;
		}

		protected BuildDependencyTree(): IDependencyTree {
			const dependency_tree =
				this.transformCompositeComponentIntoDependencyTree(
					this.injectedTargetRoot,
					this.dependencyTree.Dependencies
				);
			return dependency_tree;
		}

		//TODO: Implement this
		ResolveDependency(): void {
			this.dependencyTree = this.BuildDependencyTree();
			console.log(this.dependencyTree);

			
		}

		//TODO: Implement this
		CacheDependency(): void {}

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
			if (!this.dependencyTree.Dependencies.has("Cached"))
				this.dependencyTree.Dependencies.set(
					"Cached",
					new Map<string, T>()
				);

			this.dependencyTree.Dependencies.get("Cached")!.set(
				this.getKeyName(key),
				value
			);
			return this;
		}
	}
}
