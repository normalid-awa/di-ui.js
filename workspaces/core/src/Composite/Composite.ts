export class ComponentNotFound extends Error {
	constructor(name: string) {
		super(`Component ${name} not found`);
	}
}

/**
 * Represent the class can be composite
 */
export interface IComposable {
	/**
	 * The parent of this component, undefined means it's the root
	 */
	parent: IComposable | undefined;

	/**
	 * Contains all child components
	 */
	children: IComposable[];

	/**
	 * Add a new child or children to the component
	 * @param item
	 */
	add(item: IComposable | IComposable[]): this;

	/**
	 * Remove a child or children from the component
	 * @param item
	 */
	remove(item: IComposable | IComposable[]): this;

	/**
	 * Detach the component from its parent
	 */
	detach(): void;

	/**
	 * Dispose this component and all its children
	 */
	dispose(): void;

	extractChildrenToFlatList(): IComposable[];
}

/**
 * The implementation of `IComposable`
 */
export abstract class Componenet implements IComposable {
	public parent: IComposable | undefined;

	public children: IComposable[];

	constructor() {
		this.children = [];
		this.parent = undefined;
	}

	public add(item: IComposable | IComposable[]): this {
		const add = (singleItem: IComposable): void => {
			singleItem.detach();
			singleItem.parent = this;
			this.children.push(singleItem);
		};

		if (Array.isArray(item)) item.forEach((child) => void add(child));
		else add(item);

		return this;
	}

	public remove(item: IComposable | IComposable[]): this {
		const remove = (singleItem: IComposable): void => {
			if (!this.children.includes(singleItem))
				throw new ComponentNotFound(JSON.stringify(singleItem));

			const index = this.children.indexOf(singleItem);
			this.children.splice(index, 1);
		};

		if (Array.isArray(item)) item.forEach((child) => void remove(child));
		else remove(item);

		return this;
	}

	public detach(): void {
		if (!this.parent) return;
		this.parent.remove(this);
		delete this.parent;
	}

	public dispose(): void {
		this.children.forEach((child) => void child.dispose());
	}

	private extractTargetChildrenToFlatList(targetChildren: IComposable[]): IComposable[] {
		const flat_map: IComposable[] = [];
		targetChildren.forEach((child) => {
			flat_map.push(child);
			flat_map.push(...this.extractTargetChildrenToFlatList(child.children));
		});
		return flat_map;
	}

	public extractChildrenToFlatList(): IComposable[] {
		return this.extractTargetChildrenToFlatList(this.children);
	}
}
