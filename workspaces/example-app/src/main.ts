/* eslint-disable */
import "reflect-metadata";
import {
	Bindable,
	Cached,
	DependencyContainer,
	DrawableComponent,
	Framework,
	IInjectable,
	Resolved,
	SpaAppEntry,
} from "di-ui.js";

import type { IBindable } from "di-ui.js";

// Setup the dependency key, just like indexing
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

	override Dispose(): void {
		super.Dispose();
		alert(`oh nooooooooo ${this.ComponentName} is disposing !!`);
	}
}

class WordWrapper extends DivContainer {
	override ComponentName: string = "WordWrapper";
	// You can provide dependency via @Cached, this way the dependency can be retrive by the children
	@Cached(FirstWordDependency)
	firstWord: string = "Welcome to the";
}

abstract class WordContainer extends Container {
	public override ComponentName: string = "WordContainer";
	protected override ElementTag: keyof HTMLElementTagNameMap = "span";
	protected override CurrentElement?: HTMLSpanElement;

	protected DisplayText!: string;

	public override Render(): Element {
		super.Render();
		this.CurrentElement!.style.display = "inline-block";
		this.CurrentElement!.style.textAlign = "center";
		this.CurrentElement!.style.width = "50vw";
		this.CurrentElement!.innerText = this.DisplayText;
		return this.CurrentElement!;
	}
}

class FirstWordComponent extends WordContainer implements IInjectable {
	// If you want your display text seperate to the backing
	// You can create a new property to handle that
	@Resolved(FirstWordDependency)
	private firstWord!: string;

	LoadCompleted(): void {
		this.DisplayText = this.firstWord;
	}
}

class SecondWordComponent extends WordContainer implements IInjectable {
	// Or just keep it simple by just resolve the dependency with a decorator
	@Resolved(SecondWordDependency)
	private relayBinding!: Bindable<string>;

	private secondWord: Bindable<string> = new Bindable<string>("");

	LoadCompleted(): void {
		this.secondWord.BindTo(this.relayBinding);
		// Update dom element text with bindable, notice that the second argument is true,
		// it means will perform the callback immediately when the callback was just register
		this.secondWord.OnValueChanged((v) => {
			this.DisplayText = v.NewValue;
			if (this.CurrentElement)
				this.CurrentElement!.innerText = this.DisplayText;
		}, true);

		// Use `Unbind` method to disconnect bindings
		setTimeout(() => {
			this.secondWord.Unbind();
			this.secondWord.Value = "The binding was disconnected";
		}, 5000);
	}
}

// Get the target dom element we want to render to
const documentRoot = document.getElementById("app")!;

// Setup our app root container, children will be added into
const root = new DivContainer();

const first_word = new FirstWordComponent();
const second_word = new SecondWordComponent();

const word_display = new WordWrapper().Add(first_word).Add(second_word);

root.Add(word_display);

// Set up the dependency container so that dependencies can be inject
// Notice that the first parameter can be any component, As well as they needs d.i.
const dependencyContainer = new DependencyContainer(root);

const second_word_value = new Bindable<string>("New era!");

// You can also provide by using <c>Provide()</c> method on di container, can be retrive globally(inside the scope of di root)
dependencyContainer.Provide(SecondWordDependency, second_word_value);

// Setup our app by passing our dependency container and root component.
const app = new SpaAppEntry(dependencyContainer, root);

// Lastly can now start the app!
new Framework(app, documentRoot).Start();

async function delay(ms: number) {
	return new Promise((s) => setTimeout(s, ms));
}

async function updateSecondWordText() {
	await delay(100);
	second_word_value.Value = `${Math.random().toFixed(
		2
	)} Bindable<T> can perform reactive action!`;
	updateSecondWordText();
}

updateSecondWordText();

(async () => {
	await delay(30000);
	first_word.Dispose();
	await delay(10000);
	second_word.Dispose();
	root.Dispose();
})();
