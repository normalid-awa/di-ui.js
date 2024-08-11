import { Cached, DrawableComponent, Resolved } from "di-ui.js";
import { MarkAsCompleteDependencyKey, TodoListItem } from "./TodoListItem";

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
	protected CurrentElement?: Element | undefined;

	private todoList: string[] = ["A", "B"];

	@Cached(MarkAsCompleteDependencyKey)
	setComplete = (index: number) => {
		this.todoList.splice(index, 1);
		this.refreshTodoList();
	};

	@Cached(AddNewTodoItemDependencyKey)
	addItem = (name: string) => {
		this.todoList.push(name);
		this.refreshTodoList();
	};

	refreshTodoList() {
		this.Children.forEach((v) => v.Dispose());
		this.Children = this.todoList.map((v, k) => {
			return new TodoListItem(v, k);
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
		this.CurrentElement?.prepend("Todo list:");
		return this.CurrentElement!;
	}
}
