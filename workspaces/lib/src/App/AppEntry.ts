import { Components } from "../Components";
import { DependencyInjection } from "../Framework";

export namespace App {
	export abstract class AppEntry implements Components.IDrawable {
		Presented: boolean = false;
		public ComponentName: string = "App";
		protected abstract RootComponenet: Components.DrawableComponent;
		protected Container: DependencyInjection.IDependencyContainer;

		constructor(diContainer: DependencyInjection.IDependencyContainer) {
			this.Container = diContainer;
		}

		public Render(): Element {
			this.Presented = true;
			this.Container.ResolveRoot();
			return this.RootComponenet.Render();
		}
	}

	export class SpaAppEntry extends AppEntry {
		public override ComponentName: string = "SpaApp";
		protected override RootComponenet: Components.DrawableComponent;

		public constructor(
			diContainer: DependencyInjection.IDependencyContainer,
			root: Components.DrawableComponent
		) {
			super(diContainer);
			this.RootComponenet = root;
		}

		override Render(): Element {
			return super.Render();
		}
	}
}
