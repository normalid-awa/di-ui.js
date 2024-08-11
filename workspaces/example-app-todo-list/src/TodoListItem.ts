import { Cached, DrawableComponent, Resolved } from "di-ui.js";

const CompleteCallbackDependencyKey = Symbol("CompleteCallbackDependencyKey");
export const MarkAsCompleteDependencyKey = Symbol(
	"MarkAsCompleteDependencyKey"
);

export class CompleteButton extends DrawableComponent {
	ComponentName: string = "CompleteButton";
	protected ElementTag: keyof HTMLElementTagNameMap = "button";
	protected CurrentElement?: HTMLButtonElement | undefined;

	@Resolved(CompleteCallbackDependencyKey)
	private markComplete!: () => void;

	Render(): Element {
		super.Render();
		this.CurrentElement!.title = "Complete";
		this.CurrentElement!.innerHTML = "Complete";
		this.CurrentElement!.onclick = () => this.markComplete();
		// this.markComplete();
		return this.CurrentElement!;
	}
}

export class TodoListItem extends DrawableComponent {
	ComponentName: string = "TodoListItem";
	protected ElementTag: keyof HTMLElementTagNameMap = "div";
	protected CurrentElement?: HTMLButtonElement | undefined;

	index: number;

	@Cached(CompleteCallbackDependencyKey)
	complete = (): void => {
		this.setComplete(this.index);
	};
	
	@Resolved(MarkAsCompleteDependencyKey)
	setComplete!: (index: number) => void;

	constructor(private readonly text: string, index: number) {
		super();
		this.index = index;
		this.Add(new CompleteButton());
	}

	Render(): Element {
		super.Render();
		this.CurrentElement!.prepend(this.text);
		return this.CurrentElement!;
	}
}
