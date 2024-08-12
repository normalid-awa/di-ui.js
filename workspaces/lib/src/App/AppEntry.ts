import {IDrawable } from "../Components";
import { Cached, DependencyContainer, IDependencyContainer } from "../DependencyInjection";

export abstract class AppEntry implements IDrawable {
	IsAlive: boolean = false;
	public ComponentName: string = "App";
	protected abstract RootComponenet: IDrawable;
	
	@Cached(() => DependencyContainer)
	protected Container: IDependencyContainer;

	constructor(diContainer: IDependencyContainer) {
		this.Container = diContainer;
	}
	
	Update(): void {
		this.Container.ResolveDependencyFromRoot();
	}


	public Render(): Element {
		this.IsAlive = true;
		this.Container.ResolveDependencyFromRoot();
		return this.RootComponenet.Render();
	}
}

export class SpaAppEntry extends AppEntry {
	public override ComponentName: string = "SpaApp";
	protected override RootComponenet: IDrawable;

	public constructor(
		diContainer: IDependencyContainer,
		root: IDrawable
	) {
		super(diContainer);
		this.RootComponenet = root;
	}

	override Render(): Element {
		return super.Render();
	}
}
