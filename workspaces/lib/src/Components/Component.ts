import { Composite } from "../Composite";
import { DependencyInjection } from "../Framework";

export namespace Components {
	export abstract class CompositeComponent
		extends Composite.Composite
		implements Composite.IComposable, DependencyInjection.IInjectable
	{
		public LoadComplete(): void {}
	}

	export abstract class DrawableComponent extends CompositeComponent {
		public ComponentName: string = "DrawableComponent";
		protected readonly ElementTag: string = "div";
		protected readonly ElementAttributes: Map<string, string> = new Map();

		protected CurrentElement?: Element;

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
