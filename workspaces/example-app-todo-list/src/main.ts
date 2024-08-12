import {
	DependencyContainer,
	DrawableComponent,
	Framework,
	SpaAppEntry,
} from "@di-ui.js/core";
import { TodoListContainer } from "./TodoListContainer"

class AppRoot extends DrawableComponent {
	protected elementTag: keyof HTMLElementTagNameMap = "div";
	protected currentElement?: Element | undefined;
	componentName: string = "AppRoot";
}

const root = new AppRoot().add(new TodoListContainer())

const dic = new DependencyContainer(root);

const app = new SpaAppEntry(dic, root);

new Framework(app, document.getElementById("app")!).start();
