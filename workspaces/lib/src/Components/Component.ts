import { Componenet, IComposable } from "../Composite";
import { DependencyContainer, Resolved } from "../DependencyInjection";
import { ICanUpdate } from "../Interfaces";
import { HTMLTags } from "../types";

export interface IDrawable {
	readonly ComponentName: string;

	IsAlive: boolean;

	/**
	 * The final output of a component, will be rendered as a DOM element
	 */
	Render(): Element;
}

export abstract class DrawableComponent
	extends Componenet
	implements IDrawable, IComposable, ICanUpdate
{
	declare Parent: DrawableComponent | undefined;
	public abstract ComponentName: string;
	protected abstract readonly ElementTag: NoInfer<HTMLTags>;
	protected readonly ElementAttributes: Map<string, string> = new Map();
	IsAlive: boolean = false;

	protected abstract CurrentElement?: Element;

	@Resolved(() => DependencyContainer)
	private readonly dic: DependencyContainer | undefined;

	public Render(): Element {
		this.IsAlive = true;
		this.CurrentElement = document.createElement(this.ElementTag);

		this.ElementAttributes.forEach((value, key) => {
			this.CurrentElement!.setAttribute(key, value);
		});

		this.Children.forEach((child) => {
			if (child instanceof DrawableComponent)
				this.CurrentElement!.appendChild(child.Render());
		});

		return this.CurrentElement;
	}

	Update(): void {
		if (this.IsAlive) {
			this.CurrentElement?.replaceWith(this.Render());
		} else this.CurrentElement?.remove();
		if (this.dic) this.dic.ResolveDependencyFromRoot();
	}

	override Add(item: IComposable | IComposable[]): this {
		super.Add(item);
		this.Update();
		return this;
	}

	override Remove(item: IComposable | IComposable[]): this {
		super.Remove(item);
		this.Update();
		return this;
	}

	override Dispose(): void {
		super.Dispose();

		if (this.CurrentElement) {
			this.CurrentElement.remove();
		}
		delete this.CurrentElement;

		this.IsAlive = false;

		this.Update();
	}

	public SetAttribute(key: string, value: string): this {
		this.ElementAttributes.set(key, value);
		return this;
	}
}
