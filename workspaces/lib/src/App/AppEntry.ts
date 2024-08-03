import { Components } from "../Components";
import { DependencyInjection } from "../Framework";

export namespace App {
	export abstract class AppEntry implements Components.IDrawable {
		public ComponentName: string = "App";
		protected abstract RootContainer: Components.DrawableComponent;
		protected Container: DependencyInjection.IDependencyContainer;

		constructor(diContainer: DependencyInjection.IDependencyContainer) {
			this.Container = diContainer;
		}

		public abstract Render(): Element;
	}

	export class SpaAppEntry extends AppEntry {
		public override ComponentName: string = "SpaApp";
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
