import { Componenet, IComposable } from "../Composite";
import { DependencyContainer, Resolved } from "../DependencyInjection";
import { ICanUpdate } from "../Interfaces";
import { HTMLTags } from "../types";

export interface IDrawable {
	readonly componentName: string;

	isAlive: boolean;

	/**
	 * The final output of a component, will be rendered as a DOM element
	 */
	render(): Element;
}

export abstract class DrawableComponent
	extends Componenet
	implements IDrawable, IComposable, ICanUpdate
{
	declare parent: DrawableComponent | undefined;
	public abstract componentName: string;
	protected abstract readonly elementTag: NoInfer<HTMLTags>;
	protected readonly elementAttributes: Map<string, string> = new Map();
	isAlive: boolean = false;

	protected abstract currentElement?: Element;

	@Resolved(() => DependencyContainer)
	private readonly dic: DependencyContainer | undefined;

	public render(): Element {
		this.isAlive = true;
		this.currentElement = document.createElement(this.elementTag);

		this.elementAttributes.forEach((value, key) => {
			this.currentElement!.setAttribute(key, value);
		});

		this.children.forEach((child) => {
			if (child instanceof DrawableComponent)
				this.currentElement!.appendChild(child.render());
		});

		return this.currentElement;
	}

	update(): void {
		if (this.isAlive) {
			this.currentElement?.replaceWith(this.render());
		} else this.currentElement?.remove();
		if (this.dic) this.dic.resolveDependencyFromRoot();
	}

	override add(item: IComposable | IComposable[]): this {
		super.add(item);
		this.update();
		return this;
	}

	override remove(item: IComposable | IComposable[]): this {
		super.remove(item);
		this.update();
		return this;
	}

	override dispose(): void {
		super.dispose();

		if (this.currentElement) {
			this.currentElement.remove();
		}
		delete this.currentElement;

		this.isAlive = false;

		this.update();
	}

	public setAttribute(key: string, value: string): this {
		this.elementAttributes.set(key, value);
		return this;
	}
}
