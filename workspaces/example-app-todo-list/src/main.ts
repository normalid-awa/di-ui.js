import {
	DependencyContainer,
	DrawableComponent,
	Framework,
	SpaAppEntry,
} from "di-ui.js";
import { TodoListContainer } from "./TodoListContainer"

class AppRoot extends DrawableComponent {
	protected ElementTag: keyof HTMLElementTagNameMap = "div";
	protected CurrentElement?: Element | undefined;
	ComponentName: string = "AppRoot";
}

const root = new AppRoot().Add(new TodoListContainer())

const dic = new DependencyContainer(root);

const app = new SpaAppEntry(dic, root);

new Framework(app, document.getElementById("app")!).Start();
