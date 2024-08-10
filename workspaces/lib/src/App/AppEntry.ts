import { DrawableComponent, IDrawable } from "../Components";
import { IDependencyContainer } from "../DependencyInjection";

export abstract class AppEntry implements IDrawable {
	Presented: boolean = false;
	public ComponentName: string = "App";
	protected abstract RootComponenet: IDrawable;
	protected Container: IDependencyContainer;

	constructor(diContainer: IDependencyContainer) {
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
protected override RootComponenet: DrawableComponent;

	public constructor(
		diContainer: IDependencyContainer,
		root: DrawableComponent
	) {
		super(diContainer);
		this.RootComponenet = root;
	}

	override Render(): Element {
		return super.Render();
	}
}
