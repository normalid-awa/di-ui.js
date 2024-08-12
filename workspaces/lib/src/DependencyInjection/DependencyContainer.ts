import "reflect-metadata";
import { MetadataKeys } from "./Metadata";
import { IInjectable, InjectablePropertyMetadata } from "./Injectable";
import { IComposable } from "../Composite";

class EmulateDepdencyTarget {
	constructor(private readonly value: any) {}
}

export type DependencyLitralKey = string | symbol;
export type DependencyTypeKey<T> = new () => T;

export interface IDependencyContainer {
	/**
	 * Provide the value to the container ``` ProvideType.Value ```
	 * WARN: As you directly pass by this method, it will be available globally
	 * @param key the unique key of the dependency, RECOMMENDED to use symbol
	 * @param value any thing you want to store
	 */
	Provide<T>(key: DependencyLitralKey | DependencyTypeKey<T>, value: T): this;

	/**
	 * Inject dependencies to the children
	 */
	ResolveDependencyFromRoot(): void;
}

export class DependencyNotFoundError extends Error {
	constructor(dependencyKey: string, dependencyTree: IDependencyTree) {
		super(
			`Dependency "${dependencyKey}" not found in the dependency tree:[${Array.from(
				dependencyTree.Dependencies.Cached.keys()
			).join(", ".toString())}]`
		);
	}
}

type DependenciesMappedType = {
	Cached: Map<string, InjectablePropertyMetadata>;
	Resolved: Map<string, InjectablePropertyMetadata>;
};

//WARN: Not sure this is appropriate to exsite in here
// This code must be refactor in the near future, for now it is ok
// As long as the development, this will become a huge tech debt.
interface IDependencyTree {
	Parent: IDependencyTree | undefined;
	Children: IDependencyTree[];
	Dependencies: DependenciesMappedType;
	Target: IComposable;
}

export class DependencyContainer implements IDependencyContainer {
	private readonly injectedTargetRoot: IComposable;

	private dependencyTree: IDependencyTree;

	constructor(injectTargetRoot: IComposable) {
		this.injectedTargetRoot = injectTargetRoot;
		this.dependencyTree = {
			Parent: undefined,
			Children: [],
			Dependencies: {
				Cached: new Map(),
				Resolved: new Map(),
			},
			Target: injectTargetRoot,
		};
		//Provide container itself as a dependency
		this.Provide(
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
						Target: target,
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
						Target: target,
					});
				}
			});

		return result;
	}

	private transformCompositeComponentIntoDependencyTree(
		root: IComposable,
		parentDependencies: DependenciesMappedType = {
			Cached: new Map(),
			Resolved: new Map(),
		}
	): IDependencyTree {
		const dependency_tree: IDependencyTree = {
			Children: [],
			Dependencies: parentDependencies,
			Parent: undefined,
			Target: root,
		};

		for (const child of root.Children) {
			const metadatas = this.extractInjectableMetadata(child);
			const cached = new Map<string, InjectablePropertyMetadata>();
			const resolved = new Map<string, InjectablePropertyMetadata>();

			metadatas.CachedProperty.forEach((key) => {
				cached.set(key.DependencyKey, key);
			});
			metadatas.ResolvedProperty.forEach((key) => {
				resolved.set(key.DependencyKey, key);
			});
			const child_dependencies: DependenciesMappedType = {
				Cached: cached,
				Resolved: resolved,
			};

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

	private resolveDependency(
		target: IDependencyTree,
		parentDependencies: DependenciesMappedType = {
			Cached: new Map(),
			Resolved: new Map(),
		}
	): void {
		for (const child of target.Children) {
			child.Dependencies.Resolved.forEach((resolveTarget) => {
				let resolveMetadata: InjectablePropertyMetadata | undefined =
					parentDependencies.Cached.get(resolveTarget.DependencyKey);

				if (resolveMetadata == null)
					throw new DependencyNotFoundError(
						resolveTarget.DependencyKey,
						this.dependencyTree
					);

				let injectValue = Reflect.get(
					resolveMetadata.Target,
					resolveMetadata.TargetPropertyKey
				) as object | undefined;

				Reflect.set(
					child.Target,
					resolveTarget.TargetPropertyKey,
					injectValue
				);
			});

			(child.Target as IInjectable).LoadCompleted?.();

			parentDependencies.Cached.forEach((v, k) => {
				child.Dependencies.Cached.set(k, v);
			});

			this.resolveDependency(child, child.Dependencies);
		}
	}

	ResolveDependencyFromRoot(): void {
		this.dependencyTree = this.BuildDependencyTree();

		const global_cache = this.dependencyTree.Dependencies;

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

	Provide<T>(
		key: DependencyLitralKey | DependencyTypeKey<T>,
		value: T
	): this {
		const emulate = new EmulateDepdencyTarget(value);
		this.dependencyTree.Dependencies.Cached.set(this.getKeyName(key), {
			DependencyKey: key.toString(),
			Target: emulate,
			TargetPropertyKey: "value",
		});
		return this;
	}
}
