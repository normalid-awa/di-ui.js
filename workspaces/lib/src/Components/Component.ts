import { Componenet, IComposable } from "../Composite";
import { HTMLTags } from "../types";

export interface IDrawable {
	readonly ComponentName: string;

	/**
	 * The final output of a component, will be rendered as a DOM element
	 */
	Render(): Element;
}

export abstract class DrawableComponent
	extends Componenet
	implements IDrawable, IComposable
{
	public abstract ComponentName: string;
	protected abstract readonly ElementTag: NoInfer<HTMLTags>;
	protected readonly ElementAttributes: Map<string, string> = new Map();

	protected abstract CurrentElement?: Element;

	public Render(): Element {
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

	override Add(item: IComposable | IComposable[]): this {
		super.Add(item);
		return this;
	}

	override Remove(
		item: IComposable | IComposable[]
	): void {
		super.Remove(item);
	}

	override Dispose(): void {
		super.Dispose();

		if (this.CurrentElement) {
			this.CurrentElement.remove();
		}
		delete this.CurrentElement;
	}

	public SetAttribute(key: string, value: string): this {
		this.ElementAttributes.set(key, value);
		return this;
	}
}
