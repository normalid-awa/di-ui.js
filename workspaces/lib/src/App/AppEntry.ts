import { Components } from "../Components";

export namespace App {
	export abstract class AppEntry {
		protected abstract RootContainer: Components.DrawableComponent;
		public abstract Render(): Element;
	}

	export class SpaAppEntry extends AppEntry {
		protected override RootContainer: Components.DrawableComponent;

		public constructor(root: Components.DrawableComponent) {
			super()
			this.RootContainer = root;
		}

		Render(): Element {
			return this.RootContainer.Render();
		}
	}
}
