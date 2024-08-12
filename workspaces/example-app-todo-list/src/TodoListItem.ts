import { Cached, DrawableComponent, IInjectable, Resolved } from "@di-ui.js/core";

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
	componentName: string = "TodoListActionButton";
	protected elementTag: keyof HTMLElementTagNameMap = "button";
	protected currentElement?: HTMLButtonElement | undefined;

	abstract displayText: string;
	abstract onClick(): void;

	render(): Element {
		super.render();
		this.currentElement!.title = this.displayText;
		this.currentElement!.innerHTML = this.displayText;
		this.currentElement!.style.float = "right";
		this.currentElement!.onclick = () => this.onClick();
		return this.currentElement!;
	}
}

class CompleteButton extends TodoListActionButton implements IInjectable {
	componentName: string = "CompleteButton";
	displayText: string = "Complete";

	@Resolved(ToggleCompleteCallbackDependencyKey)
	private toggleComplete!: () => void;

	@Resolved(IsCompletedDependencyKey)
	private isCompleted!: boolean;

	loadCompleted(): void {
		this.displayText = this.isCompleted ? "De-complete" : "Complete";
	}

	onClick(): void {
		this.toggleComplete();
	}
}

class DeleteButton extends TodoListActionButton {
	componentName: string = "DeleteButton";
	displayText: string = "Delete";

	@Resolved(DeleteCallbackDependencyKey)
	private delete!: () => void;

	onClick(): void {
		this.delete();
	}
}

export class TodoListItem extends DrawableComponent {
	componentName: string = "TodoListItem";
	protected elementTag: keyof HTMLElementTagNameMap = "div";
	protected currentElement?: HTMLDivElement | undefined;

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
		this.add(new CompleteButton()).add(new DeleteButton());
		this.isCompleted = isCompleted;
	}

	render(): Element {
		super.render();
		this.currentElement!.style.width = "100%";
		this.currentElement!.style.textDecorationLine = this.isCompleted
			? "line-through"
			: "none";
		this.currentElement!.prepend(this.text);
		return this.currentElement!;
	}
}
