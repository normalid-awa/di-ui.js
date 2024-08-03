import "reflect-metadata";
import * as Di from "di-ui.js";

class DivContainer extends Di.Components.DrawableComponent {

	// The container would be inject the value of `FirstWorld`
	@Di.DependencyInjection.Resolved("FirstWorld")
	private readonly theWordThatInjectedToThisVar: string = "placeholder";

	constructor(name: string = "DivContainer") {
		super();
		this.ComponentName = name;
	}

	override Render(): Element {
		super.Render();
		this.CurrentElement!.id = this.ComponentName;
		this.CurrentElement!.prepend(
			document.createTextNode(
				`${this.ComponentName} - ${this.theWordThatInjectedToThisVar}`
			)
		);
		return this.CurrentElement!;
	}
}

const ROOT = new DivContainer();

const HELLO = new DivContainer("Hello");

HELLO.SetAttribute("style", "color: blue;")
	.Add(
		new DivContainer("World")
			.SetAttribute("style", "color: red;")
			.SetAttribute("id", "world")
	)
	.Add(new DivContainer("!!!"));
ROOT.Add(HELLO);

const DEPENDENCY_CONTAINER = new Di.DependencyInjection.DependencyContainer(
	ROOT
);

DEPENDENCY_CONTAINER.Provide(
	Di.DependencyInjection.ProvidedType.Value,
	"FirstWorld",
	"Hello "
).Provide(Di.DependencyInjection.ProvidedType.Value, "SecondWorld", "World");

const APP = new Di.App.SpaAppEntry(DEPENDENCY_CONTAINER, ROOT);

const FRAMEWORK = new Di.Framework.Framework(
	APP,
	document.getElementById("app")!
);

setTimeout(() => {
	ROOT.Dispose();
}, 10000);

FRAMEWORK.Start();
