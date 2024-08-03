/* eslint-disable*/
import * as Di from "di-ui.js";

class DivContainer extends Di.Components.DrawableComponent {
	constructor(name: string = "DivContainer") {
		super();
		this.ComponentName = name;
	}

	override Render(): Element {
		super.Render();
		this.CurrentElement!.id = this.ComponentName;
		this.CurrentElement!.prepend(
			document.createTextNode(this.ComponentName)
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

const APP = new Di.App.SpaAppEntry(ROOT);

const FRAMEWORK = new Di.Framework.Framework(
	APP,
	document.getElementById("app")!
);

setTimeout(() => {
	ROOT.Dispose();
}, 10000);

FRAMEWORK.Start();
