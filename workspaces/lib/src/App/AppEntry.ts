import { Components } from "../Components";
import { DependencyContainer } from "../DependencyInjection";

export module App {
	export abstract class AppEntry implements Components.IDrawable {
		Presented: boolean = false;
		public ComponentName: string = "App";
		protected abstract RootComponenet: Components.DrawableComponent;
		protected Container: DependencyContainer.IDependencyContainer;

		constructor(diContainer: DependencyContainer.IDependencyContainer) {
			this.Container = diContainer;
		}

		public Render(): Element {
			this.Presented = true;
			this.Container.ResolveDependencyFromRoot();
			return this.RootComponenet.Render();
		}
	}

	export class SpaAppEntry extends AppEntry {
		public override ComponentName: string = "SpaApp";
		protected override RootComponenet: Components.DrawableComponent;

		public constructor(
			diContainer: DependencyContainer.IDependencyContainer,
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
