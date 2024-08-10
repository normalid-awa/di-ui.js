/* eslint-disable */
import "reflect-metadata";
import {
	Cached,
	DependencyContainer,
	DrawableComponent,
	Framework,
	IInjectable,
	Resolved,
	SpaAppEntry,
} from "di-ui.js";

const FirstWordDependency: unique symbol = Symbol("FirstWordDependency");
const SecondWordDependency: unique symbol = Symbol("SecondWordDependency");
const ThirdWordDependency: unique symbol = Symbol("ThirdWordDependency");

abstract class Container extends DrawableComponent {
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
	@Resolved(FirstWordDependency)
	protected declare DisplayText: string;
}

class SecondWordContainer extends WordContainer {
	@Resolved(SecondWordDependency)
	declare readonly DisplayText: string;

	@Cached("SomeWord")
	private SomeWordToBeCache = "SomeWord";

	private somePrivateWord = "some private word";

	@Cached("SomeFunction")
	public SomeFunctionWouldBeCached() {
		return `but i can't access private word: ${this.somePrivateWord}, because the dic euraced the "this" keyword :(`;
	}

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

class ShownLaterThirdWordContainer extends WordContainer implements IInjectable {
	public declare DisplayText: string;

	@Resolved("SomeWord")
	public readonly SomeWordToBeResolve!: string;

	@Resolved("SomeFunction")
	public readonly SomeFunctionWouldBeResolved!: () => string;

	constructor() {
		super();
		//Will log "undefined" because object constructor is alwasy ahead of injecting chain
		console.log(this.SomeWordToBeResolve);
	}

	LoadCompleted(): void {
		console.log(`SomeWord was injected with value ${this.SomeWordToBeResolve} !!!`)
		console.log(`SomeFunction was injected, called and return ${this.SomeFunctionWouldBeResolved()}`)
	}

	public override Render(): Element {
		// Will correctly log the injected value
		console.log(this.SomeWordToBeResolve);
		this.DisplayText = ""
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

const RootDependencyContainer = new DependencyContainer(Root);

RootDependencyContainer.Provide(FirstWordDependency, "This is the ")
	.Provide(SecondWordDependency, ",New era of front-end development!!!")
	.Provide(ThirdWordDependency, "Dependency injection is awesome!!");

const App = new SpaAppEntry(RootDependencyContainer, Root);

const RootFramework = new Framework(App, document.getElementById("app")!);

RootFramework.Start();

setTimeout(() => {
	//TODO: Reactive update will be implement later in the framework
	// Root.Add(new ShownLaterThirdWordContainer());
}, 1000);

setTimeout(() => {
	Root.Dispose();
}, 100000);
