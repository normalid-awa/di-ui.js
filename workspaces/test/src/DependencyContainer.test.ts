import { expect, test, vi } from "vitest";
import { Cached, DependencyContainer, IInjectable, Resolved } from "di-ui.js";
import { DummyDivContainer } from "./helper";

test("Test Dependency Container Provide/Resolved", () => {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root);

	expect(dic).instanceOf(DependencyContainer);
	expect(dic.provide("Something", "Hello")).instanceOf(DependencyContainer);

	class DummyContainerNeedsSomeInjection extends DummyDivContainer {
		componentName: string = "DummyContainer";
		@Resolved("Something")
		public readonly dependSomething!: string;
	}

	const dummy_instance = new DummyContainerNeedsSomeInjection();
	root.add(dummy_instance);

	dic.resolveDependencyFromRoot();

	expect(dummy_instance.dependSomething).eq("Hello");
});

test("Test Dependency Container Cached/Resolved", () => {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root);

	expect(dic).instanceOf(DependencyContainer);

	class DummyContainerNeedsToCache extends DummyDivContainer {
		componentName: string = "DummyContainer";
		@Cached("Something")
		public readonly dependSomething: string = "Hello";
	}

	class DummyContainerNeedsSomeInjection extends DummyDivContainer {
		componentName: string = "DummyContainer";
		@Resolved("Something")
		public readonly dependSomething!: string;
	}

	const root_dummy_instance = new DummyContainerNeedsToCache();
	const injuect_dummy_instance = new DummyContainerNeedsSomeInjection();

	root_dummy_instance.add(injuect_dummy_instance);
	root.add(root_dummy_instance);

	dic.resolveDependencyFromRoot();

	expect(injuect_dummy_instance.dependSomething).eq("Hello");
});

test("Test `LoadCompleted` method", () => {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root).provide("SomeValue", "Hello");

	expect(dic).instanceOf(DependencyContainer);

	class DummyDiTarget extends DummyDivContainer implements IInjectable {
		componentName: string = "DummyContainer";
		@Resolved("SomeValue")
		private readonly someValue!: string;

		loadCompleted(): void {
			expect(this.someValue).toBe("Hello");
		}
	}

	const dummy_instance = new DummyDiTarget();

	vi.spyOn(dummy_instance, "loadCompleted");

	root.add(dummy_instance);

	dic.resolveDependencyFromRoot();

	expect(dummy_instance.loadCompleted).toBeCalledTimes(1);
});
