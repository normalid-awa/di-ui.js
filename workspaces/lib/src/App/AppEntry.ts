import { Components } from "../Components";
import { DependencyInjection } from "../Framework";

export namespace App {
	export abstract class AppEntry {
		protected abstract RootContainer: Components.DrawableComponent;
		protected Container: DependencyInjection.IDependencyContainer;

		constructor(diContainer: DependencyInjection.IDependencyContainer) {
			this.Container = diContainer;
		}

		public abstract Render(): Element;
	}

	export class SpaAppEntry extends AppEntry {
		protected override RootContainer: Components.DrawableComponent;

		public constructor(diContainer: DependencyInjection.IDependencyContainer, root: Components.DrawableComponent) {
			super(diContainer);
			this.RootContainer = root;
		}

		Render(): Element {
			this.Container.ResolveRoot();
			return this.RootContainer.Render();
		}
	}
}
