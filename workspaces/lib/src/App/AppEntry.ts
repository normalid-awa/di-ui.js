import {IDrawable } from "../Components";
import { Cached, DependencyContainer, IDependencyContainer } from "../DependencyInjection";

export abstract class AppEntry implements IDrawable {
	isAlive: boolean = false;
	public componentName: string = "App";
	protected abstract rootComponenet: IDrawable;
	protected container: IDependencyContainer;

	constructor(diContainer: IDependencyContainer) {
		this.container = diContainer;
	}

	public render(): Element {
		this.isAlive = true;
		this.container.resolveDependencyFromRoot();
		return this.rootComponenet.render();
	}
}

export class SpaAppEntry extends AppEntry {
	public override componentName: string = "SpaApp";
	protected override rootComponenet: IDrawable;

	public constructor(
		diContainer: IDependencyContainer,
		root: IDrawable
	) {
		super(diContainer);
		this.rootComponenet = root;
	}

	override render(): Element {
		return super.render();
	}
}
