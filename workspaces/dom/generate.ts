import fs from "fs/promises";

const TAG_ELEMENT = {
	a: "HTMLAnchorElement",
	abbr: "HTMLElement",
	address: "HTMLElement",
	area: "HTMLAreaElement",
	article: "HTMLElement",
	aside: "HTMLElement",
	audio: "HTMLAudioElement",
	b: "HTMLElement",
	base: "HTMLBaseElement",
	bdi: "HTMLElement",
	bdo: "HTMLElement",
	blockquote: "HTMLQuoteElement",
	body: "HTMLBodyElement",
	br: "HTMLBRElement",
	button: "HTMLButtonElement",
	canvas: "HTMLCanvasElement",
	caption: "HTMLTableCaptionElement",
	cite: "HTMLElement",
	code: "HTMLElement",
	col: "HTMLTableColElement",
	colgroup: "HTMLTableColElement",
	data: "HTMLDataElement",
	datalist: "HTMLDataListElement",
	dd: "HTMLElement",
	del: "HTMLModElement",
	details: "HTMLDetailsElement",
	dfn: "HTMLElement",
	dialog: "HTMLDialogElement",
	div: "HTMLDivElement",
	dl: "HTMLDListElement",
	dt: "HTMLElement",
	em: "HTMLElement",
	embed: "HTMLEmbedElement",
	fieldset: "HTMLFieldSetElement",
	figcaption: "HTMLElement",
	figure: "HTMLElement",
	footer: "HTMLElement",
	form: "HTMLFormElement",
	h1: "HTMLHeadingElement",
	h2: "HTMLHeadingElement",
	h3: "HTMLHeadingElement",
	h4: "HTMLHeadingElement",
	h5: "HTMLHeadingElement",
	h6: "HTMLHeadingElement",
	head: "HTMLHeadElement",
	header: "HTMLElement",
	hgroup: "HTMLElement",
	hr: "HTMLHRElement",
	html: "HTMLHtmlElement",
	i: "HTMLElement",
	iframe: "HTMLIFrameElement",
	img: "HTMLImageElement",
	input: "HTMLInputElement",
	ins: "HTMLModElement",
	kbd: "HTMLElement",
	label: "HTMLLabelElement",
	legend: "HTMLLegendElement",
	li: "HTMLLIElement",
	link: "HTMLLinkElement",
	main: "HTMLElement",
	map: "HTMLMapElement",
	mark: "HTMLElement",
	menu: "HTMLMenuElement",
	meta: "HTMLMetaElement",
	meter: "HTMLMeterElement",
	nav: "HTMLElement",
	noscript: "HTMLElement",
	object: "HTMLObjectElement",
	ol: "HTMLOListElement",
	optgroup: "HTMLOptGroupElement",
	option: "HTMLOptionElement",
	output: "HTMLOutputElement",
	p: "HTMLParagraphElement",
	picture: "HTMLPictureElement",
	pre: "HTMLPreElement",
	progress: "HTMLProgressElement",
	q: "HTMLQuoteElement",
	rp: "HTMLElement",
	rt: "HTMLElement",
	ruby: "HTMLElement",
	s: "HTMLElement",
	samp: "HTMLElement",
	script: "HTMLScriptElement",
	search: "HTMLElement",
	section: "HTMLElement",
	select: "HTMLSelectElement",
	slot: "HTMLSlotElement",
	small: "HTMLElement",
	source: "HTMLSourceElement",
	span: "HTMLSpanElement",
	strong: "HTMLElement",
	style: "HTMLStyleElement",
	sub: "HTMLElement",
	summary: "HTMLElement",
	sup: "HTMLElement",
	table: "HTMLTableElement",
	tbody: "HTMLTableSectionElement",
	td: "HTMLTableCellElement",
	template: "HTMLTemplateElement",
	textarea: "HTMLTextAreaElement",
	tfoot: "HTMLTableSectionElement",
	th: "HTMLTableCellElement",
	thead: "HTMLTableSectionElement",
	time: "HTMLTimeElement",
	title: "HTMLTitleElement",
	tr: "HTMLTableRowElement",
	track: "HTMLTrackElement",
	u: "HTMLElement",
	ul: "HTMLUListElement",
	var: "HTMLElement",
	video: "HTMLVideoElement",
	wbr: "HTMLElement",
};

const KEYS = Object.keys(TAG_ELEMENT);

const CLASSNAME_PREFIX = "Drawable";
const CLASSNAME_SUFFIX = "HtmlComponent";

let result = KEYS.map((k) => {
	const classname = `${CLASSNAME_PREFIX}${k[0].toUpperCase()}${k.slice(
		1,
		k.length
	)}${CLASSNAME_SUFFIX}`;

	return `export class ${classname} extends DrawableComponent {
	public override componentName: string = "${classname}";
	protected override elementTag: keyof HTMLElementTagNameMap = "${k}";
	protected override currentElement?: ${
		//@ts-ignore
		TAG_ELEMENT[k] as string
	};
}

`;
});

result.unshift(`/* eslint-disable @typescript-eslint/naming-convention */
import { DrawableComponent } from "@di-ui.js/core";

`);

fs.mkdir("./dist", {
	recursive: true,
})
fs.writeFile("./dist/index.ts", result, );

console.log(result);
