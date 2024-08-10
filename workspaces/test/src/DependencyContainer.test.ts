import { expect, test } from "vitest";
import { Cached, DependencyContainer, Resolved } from "di-ui.js";
import { DummyDivContainer } from "./helper";

test("Test Dependency Container Provide/Resolved", () => {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root);

	expect(dic).instanceOf(DependencyContainer);
	expect(dic.Provide("Something", "Hello")).instanceOf(DependencyContainer);
	
	class DummyContainerNeedsSomeInjection extends DummyDivContainer {
		@Resolved("Something")
		public readonly DependSomething!: string;
	}

	const dummy_instance = new DummyContainerNeedsSomeInjection();
	root.Add(dummy_instance);

	dic.ResolveDependencyFromRoot();

	expect(dummy_instance.DependSomething).eq("Hello")
})

test("Test Dependency Container Cached/Resolved", () => {
	const root = new DummyDivContainer();
	const dic = new DependencyContainer(root);

	expect(dic).instanceOf(DependencyContainer);
	
	class DummyContainerNeedsToCache extends DummyDivContainer {
		@Cached("Something")
		public readonly DependSomething: string = "Hello";
	}

	class DummyContainerNeedsSomeInjection extends DummyDivContainer {
		@Resolved("Something")
		public readonly DependSomething!: string;
	}

	const root_dummy_instance = new DummyContainerNeedsToCache();
	const injuect_dummy_instance = new DummyContainerNeedsSomeInjection();

	root_dummy_instance.Add(injuect_dummy_instance);
	root.Add(root_dummy_instance);

	dic.ResolveDependencyFromRoot();

	expect(injuect_dummy_instance.DependSomething).eq("Hello")
})

