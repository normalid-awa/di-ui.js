export class ComponentNotFound extends Error {
	constructor(name: string) {
		super(`Component ${name} not found`);
	}
}

export interface IComposable {
	/**
	 * The parent of this component, undefined means it's the root
	 */
	Parent: IComposable | undefined;

	/**
	 * Contains all child components
	 */
	Children: IComposable[];

	/**
	 * Add a new child or children to the component
	 * @param item
	 */
	Add(item: IComposable | IComposable[]): this;

	/**
	 * Remove a child or children from the component
	 * @param item
	 */
	Remove(item: IComposable | IComposable[]): this;

	/**
	 * Detach the component from its parent
	 */
	Detach(): void;

	/**
	 * Dispose this component and all its children
	 */
	Dispose(): void;

	ExtractChildrenToFlatList(): IComposable[];
}

export abstract class Componenet implements IComposable {
	public Parent: IComposable | undefined;

	public Children: IComposable[];

	constructor() {
		this.Children = [];
		this.Parent = undefined;
	}

	public Add(item: IComposable | IComposable[]): this {
		const add = (singleItem: IComposable): void => {
			singleItem.Detach();
			singleItem.Parent = this;
			this.Children.push(singleItem);
		};

		if (Array.isArray(item)) item.forEach((child) => void add(child));
		else add(item);

		return this;
	}

	public Remove(item: IComposable | IComposable[]): this {
		const remove = (singleItem: IComposable): void => {
			if (!this.Children.includes(singleItem))
				throw new ComponentNotFound(JSON.stringify(singleItem));

			const index = this.Children.indexOf(singleItem);
			this.Children.splice(index, 1);
		};

		if (Array.isArray(item)) item.forEach((child) => void remove(child));
		else remove(item);

		return this;
	}

	public Detach(): void {
		if (!this.Parent) return;
		this.Parent.Remove(this);
		delete this.Parent;
	}

	public Dispose(): void {
		this.Children.forEach((child) => void child.Dispose());
	}

	private extractChildrenToFlatList(children: IComposable[]): IComposable[] {
		const flat_map: IComposable[] = [];
		children.forEach((child) => {
			flat_map.push(child);
			flat_map.push(...this.extractChildrenToFlatList(child.Children));
		});
		return flat_map;
	}

	public ExtractChildrenToFlatList(): IComposable[] {
		return this.extractChildrenToFlatList(this.Children);
	}
}
