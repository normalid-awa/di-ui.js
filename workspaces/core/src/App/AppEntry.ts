import { IDrawable } from "../Components";
import { IDependencyContainer } from "../DependencyInjection";

/**
 * Where the app will be start and render
 */
export abstract class AppEntry implements IDrawable {
	isAlive: boolean = false;
	public componentName: string = "App";
	protected abstract rootComponenet: IDrawable;
	protected container: IDependencyContainer;

	constructor(diContainer: IDependencyContainer) {
		this.container = diContainer;
	}

	/**
	 * Render the root element
	 * @returns The final output of all the children being render
	 */
	public render(): Element {
		this.isAlive = true;
		this.container.resolveDependencyFromRoot();
		return this.rootComponenet.render();
	}
}

/**
 * SPA App
 */
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
