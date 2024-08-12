import { AppEntry, DependencyContainer, DrawableComponent, IDependencyContainer, IDrawable } from "di-ui.js";

export class DummyAppEntry extends AppEntry {
	protected rootComponenet: IDrawable;
	componentName: string = "DummyAppEntry";

	constructor(dic: IDependencyContainer, root: IDrawable) {
		super(dic);
		this.rootComponenet = root;
	}
}

export class DummyDivContainer extends DrawableComponent {
	componentName: string = "DummyDivContainer";
	protected elementTag: keyof HTMLElementTagNameMap = "div";
	protected currentElement?: Element | undefined;	

	render(): Element {
		const element = super.render();

		element.append("<h1>Dummy text </h1>")

		return element
	}
}

export function CreateDummyAppEntry(): AppEntry {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root);
	return new DummyAppEntry(dic, root);
}
