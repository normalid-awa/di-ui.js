/* eslint-disable */
import "reflect-metadata";
import * as Di from "di-ui.js";

const FirstWordDependency: unique symbol = Symbol("FirstWordDependency");
const SecondWordDependency: unique symbol = Symbol("SecondWordDependency");

class DivContainer extends Di.Components.DrawableComponent {
	override ComponentName: string = "DivContainer";
}

class WordContainer extends DivContainer {
	override ComponentName: string = "WordContainer";
	protected override ElementTag: keyof HTMLElementTagNameMap = "span";

	protected readonly DisplayText!: string;

	override Render(): Element {
		super.Render();
		this.CurrentElement!.prepend(document.createTextNode(this.DisplayText));
		return this.CurrentElement!;
	}
}

class FirstWordContainer extends WordContainer {
	@Di.DependencyInjection.Resolved(FirstWordDependency)
	protected override readonly DisplayText: string = "";
}

class SecondWordContainer extends WordContainer {
	@Di.DependencyInjection.Resolved(SecondWordDependency)
	protected override readonly DisplayText: string = "";
}

const Root = new DivContainer();


/**
 * Few ways to add children :
 * Root.Children.push(new FirstWordContainer(), new SecondWordContainer());
 * ===== or =====
 * Root.Add(new FirstWordContainer(), new SecondWordContainer());
 * ===== or =====
 * Root.Children = [new FirstWordContainer(), new SecondWordContainer()];
 */
Root.Add(new FirstWordContainer()).Add(new SecondWordContainer());

const DependencyContainer = new Di.DependencyInjection.DependencyContainer(
	Root
);

DependencyContainer
	.Provide(Di.DependencyInjection.ProvidedType.Value, FirstWordDependency, "Hello ")
	.Provide(Di.DependencyInjection.ProvidedType.Value, SecondWordDependency, ",World!");

const App = new Di.App.SpaAppEntry(DependencyContainer, Root);

const Framework = new Di.Framework.Framework(
	App,
	document.getElementById("app")!
);

Framework.Start();

setTimeout(() => {
	Root.Dispose();
}, 10000);
