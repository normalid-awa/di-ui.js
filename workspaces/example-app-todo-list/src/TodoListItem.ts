import { Cached, DrawableComponent, IInjectable, Resolved } from "di-ui.js";

const ToggleCompleteCallbackDependencyKey = Symbol(
	"CompleteCallbackDependencyKey"
);
const DeleteCallbackDependencyKey = Symbol("DeleteCallbackDependencyKey");
export const ToggleItemCompleteDependencyKey = Symbol(
	"MarkAsCompleteDependencyKey"
);
export const DeleteItemDependencyKey = Symbol("DeleteItemDependencyKey");

const IsCompletedDependencyKey = Symbol("IsCompletedDependencyKey");

abstract class TodoListActionButton extends DrawableComponent {
	ComponentName: string = "TodoListActionButton";
	protected ElementTag: keyof HTMLElementTagNameMap = "button";
	protected CurrentElement?: HTMLButtonElement | undefined;

	abstract displayText: string;
	abstract onClick(): void;

	Render(): Element {
		super.Render();
		this.CurrentElement!.title = this.displayText;
		this.CurrentElement!.innerHTML = this.displayText;
		this.CurrentElement!.style.float = "right";
		this.CurrentElement!.onclick = () => this.onClick();
		return this.CurrentElement!;
	}
}

class CompleteButton extends TodoListActionButton implements IInjectable {
	ComponentName: string = "CompleteButton";
	displayText: string = "Complete";

	@Resolved(ToggleCompleteCallbackDependencyKey)
	private toggleComplete!: () => void;

	@Resolved(IsCompletedDependencyKey)
	private isCompleted!: boolean;

	LoadCompleted(): void {
		this.displayText = this.isCompleted ? "De-complete" : "Complete";
	}

	onClick(): void {
		this.toggleComplete();
	}
}

class DeleteButton extends TodoListActionButton {
	ComponentName: string = "DeleteButton";
	displayText: string = "Delete";

	@Resolved(DeleteCallbackDependencyKey)
	private delete!: () => void;

	onClick(): void {
		this.delete();
	}
}

export class TodoListItem extends DrawableComponent {
	ComponentName: string = "TodoListItem";
	protected ElementTag: keyof HTMLElementTagNameMap = "div";
	protected CurrentElement?: HTMLDivElement | undefined;

	index: number;

	@Cached(ToggleCompleteCallbackDependencyKey)
	complete = (): void => {
		this.toggleItemComplete(this.index);
	};

	@Cached(DeleteCallbackDependencyKey)
	delete = (): void => {
		this.deleteItem(this.index);
	};

	@Cached(IsCompletedDependencyKey)
	private isCompleted: boolean;

	@Resolved(DeleteItemDependencyKey)
	deleteItem!: (index: number) => void;

	@Resolved(ToggleItemCompleteDependencyKey)
	toggleItemComplete!: (index: number) => void;

	constructor(
		private readonly text: string,
		isCompleted: boolean,
		index: number
	) {
		super();
		this.index = index;
		this.Add(new CompleteButton()).Add(new DeleteButton());
		this.isCompleted = isCompleted;
	}

	Render(): Element {
		super.Render();
		this.CurrentElement!.style.width = "100%";
		this.CurrentElement!.style.textDecorationLine = this.isCompleted
			? "line-through"
			: "none";
		this.CurrentElement!.prepend(this.text);
		return this.CurrentElement!;
	}
}
