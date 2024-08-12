import { Cached, DrawableComponent, Resolved } from "di-ui.js";
import {
	DeleteItemDependencyKey,
	ToggleItemCompleteDependencyKey,
	TodoListItem,
} from "./TodoListItem";

const AddNewTodoItemDependencyKey = Symbol("AddNewTodoItemDependencyKey");

export class TodoListAddButton extends DrawableComponent {
	ComponentName: string = "TodoListAddButton";
	protected ElementTag: keyof HTMLElementTagNameMap = "button";
	protected CurrentElement?: HTMLButtonElement | undefined;

	@Resolved(AddNewTodoItemDependencyKey)
	private addItem!: (name: string) => void;

	Render(): Element {
		super.Render();
		this.CurrentElement!.textContent = "Add new todo item";
		this.CurrentElement!.onclick = () => {
			const result = prompt("Todo item:", "name");
			if (!result) return;
			this.addItem(result);
		};
		return this.CurrentElement!;
	}
}

export class TodoListContainer extends DrawableComponent {
	ComponentName: string = "TodoListContainer";
	protected ElementTag: keyof HTMLElementTagNameMap = "div";
	protected CurrentElement?: HTMLDivElement | undefined;

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
		this.Children.forEach((v) => v.Dispose());
		this.Children = this.todoList.map((v, k) => {
			return new TodoListItem(v.text, v.completed, k);
		});
		this.Add(new TodoListAddButton());
		this.Update();
	}

	constructor() {
		super();
		this.refreshTodoList();
	}

	Render(): Element {
		super.Render();
		this.CurrentElement!.style.textAlign = "center";
		this.CurrentElement!.style.display = "flex";
		this.CurrentElement!.style.flexDirection = "column";
		this.CurrentElement!.style.maxWidth = "400px";
		this.CurrentElement!.style.margin = "auto";
		this.CurrentElement!.prepend("Todo list:");
		return this.CurrentElement!;
	}
}
