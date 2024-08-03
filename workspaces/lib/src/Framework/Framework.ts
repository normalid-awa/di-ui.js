import { App } from "../App";
import { DependencyInjection } from "./DependencyContainer";

export namespace Framework {
	export type HTMLString = string;

	export class Framework {
		private readonly appEntry: App.AppEntry;
		private readonly root: Element;


		constructor(
			app: App.AppEntry,
			pageRoot: Element,
		) {
			this.appEntry = app;
			this.root = pageRoot;
		}

		public Start(): void {
			this.root.append(this.appEntry.Render());
		}
	}
}
