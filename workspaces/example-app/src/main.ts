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

class WordContainer extends Container {
	public override ComponentName: string = "WordContainer";
	protected override ElementTag: keyof HTMLElementTagNameMap = "span";
	protected override CurrentElement?: HTMLSpanElement;

	protected readonly DisplayText!: string;

	public override Render(): Element {
		// console.log("render", this.DisplayText);
		super.Render();
		this.CurrentElement!.style.display = "inline-block";
		this.CurrentElement!.style.textAlign = "center";
		this.CurrentElement!.style.width = "50vw";
		this.CurrentElement!.prepend(document.createTextNode(this.DisplayText));
		return this.CurrentElement!;
	}
}

class FirstWordContainer extends WordContainer {
	@Di.Injectable.Resolved(FirstWordDependency)
	protected declare DisplayText: string;
}

class SecondWordContainer extends WordContainer {
	@Di.Injectable.Resolved(SecondWordDependency)
	declare readonly DisplayText: string;

	@Di.Injectable.Cached("SomeWord")
	private SomeWordToBeCache = "SomeWord";

	constructor() {
		super();
		this.SomeWordToBeCache += " " + "Constructor!";
	}

	public override Render(): Element {
		// This appended string won't be shown below, because the dic only tracked to constructor
		this.SomeWordToBeCache += " " + "Render!";
		return super.Render();
	}
}

class ShownLaterThirdWordContainer extends WordContainer {
	public declare DisplayText: string;

	@Di.Injectable.Resolved("SomeWord")
	public readonly SomeWordToBeResolve: string = "not resolved";

	constructor() {
		super();
		//Will log "not resolved" because object constructor is alwasy ahead of injecting chain
		console.log(this.SomeWordToBeResolve);
	}

	public override Render(): Element {
		// Will correctly log the injected value
		console.log(this.SomeWordToBeResolve);
		this.DisplayText = this.SomeWordToBeResolve;
		return super.Render();
	}
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

const shown_later = new ShownLaterThirdWordContainer();
// console.log(shown_later.DisplayText);
Root.Add(new FirstWordContainer()).Add(
	new SecondWordContainer().Add(shown_later)
);

const DependencyContainer = new Di.DependencyContainer.DependencyContainer(
	Root
);

DependencyContainer.Provide(FirstWordDependency, "This is the ")
	.Provide(SecondWordDependency, ",New era of front-end development!!!")
	.Provide(ThirdWordDependency, "Dependency injection is awesome!!");

const App = new Di.App.SpaAppEntry(DependencyContainer, Root);

const Framework = new Di.Framework.Framework(
	App,
	document.getElementById("app")!
);

Framework.Start();

setTimeout(() => {
	//TODO: Reactive update will be implement later in the framework
	// Root.Add(new ShownLaterThirdWordContainer());
}, 1000);

setTimeout(() => {
	Root.Dispose();
}, 100000);
