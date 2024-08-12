import "reflect-metadata";
import { MetadataKeys } from "./Metadata";
import { IInjectable, InjectablePropertyMetadata } from "./Injectable";
import { IComposable } from "../Composite";

/**
 * Used internally in dependency container, used to emulate the class reference
 */
class EmulateDepdencyTarget {
	constructor(private readonly value: any) {}
}

/**
 * The litral index of a dependency
 */
export type DependencyLitralKey = string | symbol;
/**
 * The type index of a dependency
 * @example Resolved(() => SomeClass)
 */
export type DependencyTypeKey<T> = new () => T;

/**
 * The interface of a dependency container
 */
export interface IDependencyContainer {
	/**
	 * Provide the value to the container ``` ProvideType.Value ```
	 * WARN: As you directly pass by this method, it will be available globally
	 * @param key the unique key of the dependency, RECOMMENDED to use symbol
	 * @param value any thing you want to store
	 * @example
	 * const UsernameDependency = Symbol("username")
	 * dependencyContainer.provide(UsernameDependencyKey, "bob")
	 */
	provide<T>(key: DependencyLitralKey | DependencyTypeKey<T>, value: T): this;

	/**
	 * Inject dependencies to the root and all of its children
	 */
	resolveDependencyFromRoot(): void;
}

/**
 * Represent the dependency not found with the index you provide
 */
export class DependencyNotFoundError extends Error {
	constructor(dependencyKey: string, dependencyTree: IDependencyTree) {
		super(
			`Dependency "${dependencyKey}" not found in the dependency tree:[${Array.from(
				dependencyTree.dependencies.cached.keys()
			).join(", ".toString())}]`
		);
	}
}

type DependenciesMappedType = {
	cached: Map<string, InjectablePropertyMetadata>;
	resolved: Map<string, InjectablePropertyMetadata>;
};

//WARN: Not sure this is appropriate to exsite in here
// This code must be refactor in the near future, for now it is ok
// As long as the development, this will become a huge tech debt.
interface IDependencyTree {
	parent: IDependencyTree | undefined;
	children: IDependencyTree[];
	dependencies: DependenciesMappedType;
	target: IComposable;
}

export class DependencyContainer implements IDependencyContainer {
	/**
	 * The target root of the resolved root
	 */
	private readonly injectedTargetRoot: IComposable;

	private dependencyTree: IDependencyTree;

	constructor(injectTargetRoot: IComposable) {
		this.injectedTargetRoot = injectTargetRoot;
		this.dependencyTree = {
			parent: undefined,
			children: [],
			dependencies: {
				cached: new Map(),
				resolved: new Map(),
			},
			target: injectTargetRoot,
		};
		//Provide container itself as a dependency
		this.provide(
			((): typeof DependencyContainer => DependencyContainer)().prototype
				.constructor.name as string,
			this
		);
	}

	private extractInjectableMetadata(
		target: object
	): Record<keyof typeof MetadataKeys, InjectablePropertyMetadata[]> {
		const result: Record<
			keyof typeof MetadataKeys,
			InjectablePropertyMetadata[]
		> = {
			CachedProperty: [],
			ResolvedProperty: [],
		};
		const own_keys = Object.getOwnPropertyNames(target).concat(
			Object.getOwnPropertyNames(Object.getPrototypeOf(target))
		);

		for (const property_key of own_keys)
			(
				Object.getOwnPropertyNames(
					MetadataKeys
				) as (keyof typeof MetadataKeys)[]
			).forEach((metakey: keyof typeof MetadataKeys) => {
				if (
					Reflect.hasMetadata(
						MetadataKeys[metakey],
						target,
						property_key
					)
				) {
					result[metakey].push({
						...(Reflect.getMetadata(
							MetadataKeys[metakey],
							target,
							property_key
						) as InjectablePropertyMetadata),
						//This is because the metadata's target is the obejct i.e. it's not instaniated yet, the target here is the
						// instaniated object get from the vdom tree.
						target: target,
					});
				} else if (
					Reflect.hasOwnMetadata(
						MetadataKeys[metakey],
						target,
						property_key
					)
				) {
					result[metakey].push({
						...(Reflect.getOwnMetadata(
							MetadataKeys[metakey],
							target,
							property_key
						) as InjectablePropertyMetadata),
						//This is because the metadata's target is the obejct i.e. it's not instaniated yet, the target here is the
						// instaniated object get from the vdom tree.
						target: target,
					});
				}
			});

		return result;
	}

	private transformCompositeComponentIntoDependencyTree(
		root: IComposable,
		parentDependencies: DependenciesMappedType = {
			cached: new Map(),
			resolved: new Map(),
		}
	): IDependencyTree {
		const dependency_tree: IDependencyTree = {
			children: [],
			dependencies: parentDependencies,
			parent: undefined,
			target: root,
		};

		for (const child of root.children) {
			const metadatas = this.extractInjectableMetadata(child);
			const cached = new Map<string, InjectablePropertyMetadata>();
			const resolved = new Map<string, InjectablePropertyMetadata>();

			metadatas.CachedProperty.forEach((key) => {
				cached.set(key.dependencyKey, key);
			});
			metadatas.ResolvedProperty.forEach((key) => {
				resolved.set(key.dependencyKey, key);
			});
			const child_dependencies: DependenciesMappedType = {
				cached: cached,
				resolved: resolved,
			};

			dependency_tree.children.push({
				...this.transformCompositeComponentIntoDependencyTree(
					child,
					child_dependencies
				),
			});
		}

		return dependency_tree;
	}

	/**
	 * Build the dependency from the `injectedTargetRoot`
	 * @returns the generated tree
	 */
	protected buildDependencyTree(): IDependencyTree {
		const dependency_tree =
			this.transformCompositeComponentIntoDependencyTree(
				this.injectedTargetRoot,
				this.dependencyTree.dependencies
			);
		return dependency_tree;
	}

	private resolveDependency(
		target: IDependencyTree,
		parentDependencies: DependenciesMappedType = {
			cached: new Map(),
			resolved: new Map(),
		}
	): void {
		for (const child of target.children) {
			child.dependencies.resolved.forEach((resolveTarget) => {
				let resolveMetadata: InjectablePropertyMetadata | undefined =
					parentDependencies.cached.get(resolveTarget.dependencyKey);

				if (resolveMetadata == null)
					throw new DependencyNotFoundError(
						resolveTarget.dependencyKey,
						this.dependencyTree
					);

				let injectValue = Reflect.get(
					resolveMetadata.target,
					resolveMetadata.targetPropertyKey
				) as object | undefined;

				Reflect.set(
					child.target,
					resolveTarget.targetPropertyKey,
					injectValue
				);
			});

			(child.target as IInjectable).loadCompleted?.();

			parentDependencies.cached.forEach((v, k) => {
				child.dependencies.cached.set(k, v);
			});

			this.resolveDependency(child, child.dependencies);
		}
	}

	resolveDependencyFromRoot(): void {
		this.dependencyTree = this.buildDependencyTree();

		const global_cache = this.dependencyTree.dependencies;

		this.resolveDependency(this.dependencyTree, global_cache);
	}

	private getKeyName(
		key: DependencyLitralKey | DependencyTypeKey<any>
	): string {
		if (typeof key == "symbol" || typeof key == "string")
			return key.toString();
		else if (typeof key == "function") return key.name;
		throw new DependencyNotFoundError(String(key), this.dependencyTree);
	}

	provide<T>(
		key: DependencyLitralKey | DependencyTypeKey<T>,
		value: T
	): this {
		const emulate = new EmulateDepdencyTarget(value);
		this.dependencyTree.dependencies.cached.set(this.getKeyName(key), {
			dependencyKey: key.toString(),
			target: emulate,
			targetPropertyKey: "value",
		});
		return this;
	}
}
