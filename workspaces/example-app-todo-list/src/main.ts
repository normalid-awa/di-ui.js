import { DependencyContainer, Framework, SpaAppEntry } from "@di-ui.js/core";
import { TodoListContainer } from "./TodoListContainer";
import { DrawableDivHtmlComponent } from "@di-ui.js/dom";

class AppRoot extends DrawableDivHtmlComponent {
	componentName: string = "AppRoot";
}

const root = new AppRoot().add(new TodoListContainer());

const dic = new DependencyContainer(root);

const app = new SpaAppEntry(dic, root);

new Framework(app, document.getElementById("app")!).start();
