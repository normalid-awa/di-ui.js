import { Composite } from "../Composite";
import { HTMLTags } from "../types";

export module Components {
	export interface IDrawable {
		readonly ComponentName: string;

		/**
		 * The final output of a component, will be rendered as a DOM element
		 */
		Render(): Element;
	}

	export abstract class DrawableComponent
		extends Composite.Componenet
		implements IDrawable, Composite.IComposable
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

		override Add(
			item: Composite.IComposable | Composite.IComposable[]
		): this {
			super.Add(item);
			return this;
		}

		override Remove(
			item: Composite.IComposable | Composite.IComposable[]
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
}
