/* eslint-disable */
import "reflect-metadata";
import Di from "di-ui.js";

const FirstWordDependency: unique symbol = Symbol("FirstWordDependency");
const SecondWordDependency: unique symbol = Symbol("SecondWordDependency");
const ThirdWordDependency: unique symbol = Symbol("ThirdWordDependency");

abstract class Container extends Di.Components.DrawableComponent {
	protected override ElementTag: keyof HTMLElementTagNameMap = "div";
	override ComponentName: string = "DivContainer";
}

class DivContainer extends Container {
	public override ComponentName: string = "DivContainer";
	protected override ElementTag: keyof HTMLElementTagNameMap = "div";
	protected override CurrentElement?: HTMLDivElement;

	public override Render(): Element {
		super.Render();
		this.CurrentElement!.style.width = "100vw";
		return this.CurrentElement!;
	}
}

abstract class WordContainer extends Container {
	public override ComponentName: string = "WordContainer";
	protected override ElementTag: keyof HTMLElementTagNameMap = "span";
	protected override CurrentElement?: HTMLSpanElement;

	protected abstract readonly DisplayText: string;

	public override Render(): Element {
		super.Render();
		this.CurrentElement!.style.display = "inline-block";
		this.CurrentElement!.style.textAlign = "center";
		this.CurrentElement!.style.width = "50vw";
		this.CurrentElement!.prepend(document.createTextNode(this.DisplayText));
		return this.CurrentElement!;
	}
}

class FirstWordContainer extends WordContainer {
	@Di.DependencyInjection.Resolved(FirstWordDependency)
	protected override readonly DisplayText!: string;
}

class SecondWordContainer extends WordContainer {
	@Di.DependencyInjection.Resolved(SecondWordDependency)
	protected override readonly DisplayText!: string;
}

class ShownLaterThirdWordContainer extends WordContainer {
	@Di.DependencyInjection.Resolved(ThirdWordDependency)
	protected override readonly DisplayText!: string;
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
	.Provide(Di.DependencyInjection.ProvidedType.Value, FirstWordDependency, "This is the ")
	.Provide(Di.DependencyInjection.ProvidedType.Value, SecondWordDependency, ",New era of front-end development!!!")
	.Provide(Di.DependencyInjection.ProvidedType.Value, ThirdWordDependency, "Dependency injection is awesome!!");

const App = new Di.App.SpaAppEntry(DependencyContainer, Root);

const Framework = new Di.Framework.Framework(
	App,
	document.getElementById("app")!
);

Framework.Start();

setTimeout(() => {
	//TODO: Reactive update will be implement later in the framework
	Root.Add(new ShownLaterThirdWordContainer());
}, 1000)

setTimeout(() => {
	Root.Dispose();
}, 10000);
