import { App } from "../App";
import { DependencyInjection } from "./DependencyContainer";

export module Framework {
	export type HTMLString = string;

	export class Framework {
		private readonly appEntry: App.AppEntry;
		private readonly root: Element;

		/**
		 *
		 * @param app The app entry point, could be SPA or MPA or Custom
		 * @param pageRoot The root element of the page, mostly is ```document.getElementById("app")```
		 */
		constructor(app: App.AppEntry, pageRoot: Element) {
			this.appEntry = app;
			this.root = pageRoot;
		}

		/**
		 * Start the app, and render it on the root
		 */
		public Start(): void {
			this.root.append(this.appEntry.Render());
		}
	}
}
