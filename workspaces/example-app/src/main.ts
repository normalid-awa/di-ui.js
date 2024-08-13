/* eslint-disable */
import "reflect-metadata";
import {
	Bindable,
	Cached,
	DependencyContainer, Framework,
	IInjectable,
	Resolved,
	SpaAppEntry
} from "@di-ui.js/core";
import { DrawableDivHtmlComponent, DrawableSpanHtmlComponent } from "@di-ui.js/dom";

// Setup the dependency key, just like indexing
const FirstWordDependency: unique symbol = Symbol("FirstWordDependency");
const SecondWordDependency: unique symbol = Symbol("SecondWordDependency");

class CustomDivContainer extends DrawableDivHtmlComponent {
	public override render(): Element {
		super.render();
		this.currentElement!.style.width = "100vw";
		return this.currentElement!;
	}

	override dispose(): void {
		super.dispose();
		alert(`oh nooooooooo ${this.componentName} is disposing !!`);
	}
}

class WordWrapper extends CustomDivContainer {
	override componentName: string = "WordWrapper";
	// You can provide dependency via @Cached, this way the dependency can be retrive by the children
	@Cached(FirstWordDependency)
	firstWord: string = "Welcome to the";
}

abstract class WordContainer extends DrawableSpanHtmlComponent {
	public override componentName: string = "WordContainer";

	protected DisplayText!: string;

	public override render(): Element {
		super.render();
		this.currentElement!.style.display = "inline-block";
		this.currentElement!.style.textAlign = "center";
		this.currentElement!.style.width = "50vw";
		this.currentElement!.innerText = this.DisplayText;
		return this.currentElement!;
	}
}

class FirstWordComponent extends WordContainer implements IInjectable {
	// If you want your display text seperate to the backing
	// You can create a new property to handle that
	@Resolved(FirstWordDependency)
	private firstWord!: string;

	loadCompleted(): void {
		this.DisplayText = this.firstWord;
	}
}

class SecondWordComponent extends WordContainer implements IInjectable {
	// Or just keep it simple by just resolve the dependency with a decorator
	@Resolved(SecondWordDependency)
	private relayBinding!: Bindable<string>;

	private secondWord: Bindable<string> = new Bindable<string>("");

	loadCompleted(): void {
		this.secondWord.bindTo(this.relayBinding);
		// Update dom element text with bindable, notice that the second argument is true,
		// it means will perform the callback immediately when the callback was just register
		this.secondWord.onValueChanged((v) => {
			this.DisplayText = v.newValue;
			if (this.currentElement)
				this.currentElement.innerText = this.DisplayText;
		}, true);

		// Use `Unbind` method to disconnect bindings
		setTimeout(() => {
			this.secondWord.unbind();
			this.secondWord.value = "The binding was disconnected";
		}, 5000);
	}
}

// Get the target dom element we want to render to
const documentRoot = document.getElementById("app")!;

// Setup our app root container, children will be added into
const root = new CustomDivContainer();

const first_word = new FirstWordComponent();
const second_word = new SecondWordComponent();

const word_display = new WordWrapper().add(first_word).add(second_word);

root.add(word_display);

// Set up the dependency container so that dependencies can be inject
// Notice that the first parameter can be any component, As well as they needs d.i.
const dependencyContainer = new DependencyContainer(root);

const second_word_value = new Bindable<string>("New era!");

// You can also provide by using <c>Provide()</c> method on di container, can be retrive globally(inside the scope of di root)
dependencyContainer.provide(SecondWordDependency, second_word_value);

// Setup our app by passing our dependency container and root component.
const app = new SpaAppEntry(dependencyContainer, root);

// Lastly can now start the app!
new Framework(app, documentRoot).start();

async function delay(ms: number) {
	return new Promise((s) => setTimeout(s, ms));
}

async function updateSecondWordText() {
	await delay(100);
	second_word_value.value = `${Math.random().toFixed(
		2
	)} Bindable<T> can perform reactive action!`;
	updateSecondWordText();
}

updateSecondWordText();

(async () => {
	await delay(30000);
	first_word.dispose();
	await delay(10000);
	second_word.dispose();
	root.dispose();
})();
