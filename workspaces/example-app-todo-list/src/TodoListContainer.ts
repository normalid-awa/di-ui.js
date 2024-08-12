import { Cached, DrawableComponent, Resolved } from "di-ui.js";
import {
	DeleteItemDependencyKey,
	ToggleItemCompleteDependencyKey,
	TodoListItem,
} from "./TodoListItem";

const AddNewTodoItemDependencyKey = Symbol("AddNewTodoItemDependencyKey");

export class TodoListAddButton extends DrawableComponent {
	componentName: string = "TodoListAddButton";
	protected elementTag: keyof HTMLElementTagNameMap = "button";
	protected currentElement?: HTMLButtonElement | undefined;

	@Resolved(AddNewTodoItemDependencyKey)
	private addItem!: (name: string) => void;

	render(): Element {
		super.render();
		this.currentElement!.textContent = "Add new todo item";
		this.currentElement!.onclick = () => {
			const result = prompt("Todo item:", "name");
			if (!result) return;
			this.addItem(result);
		};
		return this.currentElement!;
	}
}

export class TodoListContainer extends DrawableComponent {
	componentName: string = "TodoListContainer";
	protected elementTag: keyof HTMLElementTagNameMap = "div";
	protected currentElement?: HTMLDivElement | undefined;

	private todoList: {
		text: string;
		completed: boolean;
	}[] = [];

	@Cached(DeleteItemDependencyKey)
	deleteItem = (index: number) => {
		this.todoList.splice(index, 1);
		this.refreshTodoList();
	};

	@Cached(ToggleItemCompleteDependencyKey)
	toggleItemComplete = (index: number) => {
		this.todoList[index].completed = !this.todoList[index].completed;
		this.refreshTodoList();
	};

	@Cached(AddNewTodoItemDependencyKey)
	addItem = (name: string) => {
		this.todoList.push({
			completed: false,
			text: name,
		});
		this.refreshTodoList();
	};

	refreshTodoList() {
		this.children.forEach((v) => v.dispose());
		this.children = this.todoList.map((v, k) => {
			return new TodoListItem(v.text, v.completed, k);
		});
		this.add(new TodoListAddButton());
		this.update();
	}

	constructor() {
		super();
		this.refreshTodoList();
	}

	render(): Element {
		super.render();
		this.currentElement!.style.textAlign = "center";
		this.currentElement!.style.display = "flex";
		this.currentElement!.style.flexDirection = "column";
		this.currentElement!.style.maxWidth = "400px";
		this.currentElement!.style.margin = "auto";
		this.currentElement!.prepend("Todo list:");
		return this.currentElement!;
	}
}
