import { Cached, DrawableComponent } from "di-ui.js";
import { MarkAsCompleteDependencyKey, TodoListItem } from "./TodoListItem";

export class TodoListContainer extends DrawableComponent {
	ComponentName: string = "TodoListContainer";
	protected ElementTag: keyof HTMLElementTagNameMap = "div";
	protected CurrentElement?: Element | undefined;

	private todoList: string[] = ["A", "B"];

	@Cached(MarkAsCompleteDependencyKey)
	setComplete = (index: number) => {
		this.todoList.splice(index, 1);
		console.log(index, this.todoList);
		this.updateTodoList();
		this.CurrentElement = this.Render();
	};

	updateTodoList() {
		this.Children.forEach((v) => v.Dispose());
		this.todoList.forEach((v, k) => {
			this.Add(new TodoListItem(v, k));
		});
	}

	constructor() {
		super();
		this.updateTodoList();
	}

	Render(): Element {
		super.Render();
		this.CurrentElement?.prepend("Todo list:");
		return this.CurrentElement!;
	}
}
