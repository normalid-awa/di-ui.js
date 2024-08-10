import { AppEntry, DependencyContainer, DrawableComponent, IDependencyContainer, IDrawable } from "di-ui.js";

export class DummyAppEntry extends AppEntry {
	protected RootComponenet: IDrawable;
	ComponentName: string = "DummyAppEntry";

	constructor(dic: IDependencyContainer, root: IDrawable) {
		super(dic);
		this.RootComponenet = root;
	}
}

export class DummyDivContainer extends DrawableComponent {
	ComponentName: string = "DummyDivContainer";
	protected ElementTag: keyof HTMLElementTagNameMap = "div";
	protected CurrentElement?: Element | undefined;	

	Render(): Element {
		const element = super.Render();

		element.append("<h1>Dummy text </h1>")

		return element
	}
}

export function CreateDummyAppEntry(): AppEntry {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root);
	return new DummyAppEntry(dic, root);
}
