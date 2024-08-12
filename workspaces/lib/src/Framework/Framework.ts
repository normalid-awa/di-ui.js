import { AppEntry } from "../App";

/**
 * The class that hold app entry and real dom
 */
export class Framework {
	private readonly appEntry: AppEntry;
	private readonly root: Element;

	/**
	 * @param app The app entry point, could be SPA or MPA or Custom
	 * @param pageRoot The root element of the page, mostly is ```document.getElementById("app")```
	 */
	constructor(app: AppEntry, pageRoot: Element) {
		this.appEntry = app;
		this.root = pageRoot;
	}

	/**
	 * Start the app, and render it on the root
	 */
	public start(): void {
		this.root.append(this.appEntry.render());
	}
}
