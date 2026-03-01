/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { MotionProps } from '../../motion/types';
import type { ResolvedValues } from '../types';
import type { HTMLElements } from './supported-elements';
import type { Component } from 'svelte';
import type { PropsWithoutRef, RefAttributes } from '../../utils/safe-react-types';

export interface TransformOrigin {
	originX?: number | string;
	originY?: number | string;
	originZ?: number | string;
}
export interface HTMLRenderState {
	/**
	 * A mutable record of transforms we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	transform: ResolvedValues;
	/**
	 * A mutable record of transform keys we want to apply to the rendered Element. We order
	 * this to order transforms in the desired order. We use a mutable data structure to reduce GC during animations.
	 */
	transformKeys: string[];
	/**
	 * A mutable record of transform origins we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	transformOrigin: TransformOrigin;
	/**
	 * A mutable record of styles we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	style: ResolvedValues;
	/**
	 * A mutable record of CSS variables we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	vars: ResolvedValues;
}
/**
 * @public
 */
export type ForwardRefComponent<T, P extends Record<string, any>> = Component<PropsWithoutRef<P> & RefAttributes<T>>;

type AttributesWithoutMotionProps<Attributes> = Omit<Attributes, keyof MotionProps>;

/**
 * @public
 */
export type HTMLMotionProps<Tag extends keyof HTMLElements> = AttributesWithoutMotionProps<SvelteHTMLElements[Tag]> &
	MotionProps;

/**
 * Motion-optimised versions of React's HTML components.
 *
 * @public
 */
// prettier-ignore
export type HTMLMotionComponents = {
	// Split into smaller groups to avoid type complexity
	// Common elements
	a: ForwardRefComponent<HTMLElements['a'], HTMLMotionProps<'a'>>;
	abbr: ForwardRefComponent<HTMLElements['abbr'], HTMLMotionProps<'abbr'>>;
	address: ForwardRefComponent<HTMLElements['address'], HTMLMotionProps<'address'>>;
	area: ForwardRefComponent<HTMLElements['area'], HTMLMotionProps<'area'>>;
	article: ForwardRefComponent<HTMLElements['article'], HTMLMotionProps<'article'>>;
	aside: ForwardRefComponent<HTMLElements['aside'], HTMLMotionProps<'aside'>>;
	audio: ForwardRefComponent<HTMLElements['audio'], HTMLMotionProps<'audio'>>;
	b: ForwardRefComponent<HTMLElements['b'], HTMLMotionProps<'b'>>;
	base: ForwardRefComponent<HTMLElements['base'], HTMLMotionProps<'base'>>;
	bdi: ForwardRefComponent<HTMLElements['bdi'], HTMLMotionProps<'bdi'>>;
	bdo: ForwardRefComponent<HTMLElements['bdo'], HTMLMotionProps<'bdo'>>;
	blockquote: ForwardRefComponent<HTMLElements['blockquote'], HTMLMotionProps<'blockquote'>>;
	body: ForwardRefComponent<HTMLElements['body'], HTMLMotionProps<'body'>>;
	br: ForwardRefComponent<HTMLElements['br'], HTMLMotionProps<'br'>>;
	button: ForwardRefComponent<HTMLElements['button'], HTMLMotionProps<'button'>>;
	canvas: ForwardRefComponent<HTMLElements['canvas'], HTMLMotionProps<'canvas'>>;
	caption: ForwardRefComponent<HTMLElements['caption'], HTMLMotionProps<'caption'>>;
	cite: ForwardRefComponent<HTMLElements['cite'], HTMLMotionProps<'cite'>>;
	code: ForwardRefComponent<HTMLElements['code'], HTMLMotionProps<'code'>>;
	col: ForwardRefComponent<HTMLElements['col'], HTMLMotionProps<'col'>>;
	colgroup: ForwardRefComponent<HTMLElements['colgroup'], HTMLMotionProps<'colgroup'>>;
	data: ForwardRefComponent<HTMLElements['data'], HTMLMotionProps<'data'>>;
	datalist: ForwardRefComponent<HTMLElements['datalist'], HTMLMotionProps<'datalist'>>;
	dd: ForwardRefComponent<HTMLElements['dd'], HTMLMotionProps<'dd'>>;
	del: ForwardRefComponent<HTMLElements['del'], HTMLMotionProps<'del'>>;
	details: ForwardRefComponent<HTMLElements['details'], HTMLMotionProps<'details'>>;
	dfn: ForwardRefComponent<HTMLElements['dfn'], HTMLMotionProps<'dfn'>>;
	dialog: ForwardRefComponent<HTMLElements['dialog'], HTMLMotionProps<'dialog'>>;
	div: ForwardRefComponent<HTMLElements['div'], HTMLMotionProps<'div'>>;
	dl: ForwardRefComponent<HTMLElements['dl'], HTMLMotionProps<'dl'>>;
	dt: ForwardRefComponent<HTMLElements['dt'], HTMLMotionProps<'dt'>>;
	em: ForwardRefComponent<HTMLElements['em'], HTMLMotionProps<'em'>>;
	embed: ForwardRefComponent<HTMLElements['embed'], HTMLMotionProps<'embed'>>;
	fieldset: ForwardRefComponent<HTMLElements['fieldset'], HTMLMotionProps<'fieldset'>>;
	figcaption: ForwardRefComponent<HTMLElements['figcaption'], HTMLMotionProps<'figcaption'>>;
	figure: ForwardRefComponent<HTMLElements['figure'], HTMLMotionProps<'figure'>>;
	footer: ForwardRefComponent<HTMLElements['footer'], HTMLMotionProps<'footer'>>;
	form: ForwardRefComponent<HTMLElements['form'], HTMLMotionProps<'form'>>;
	h1: ForwardRefComponent<HTMLElements['h1'], HTMLMotionProps<'h1'>>;
	h2: ForwardRefComponent<HTMLElements['h2'], HTMLMotionProps<'h2'>>;
	h3: ForwardRefComponent<HTMLElements['h3'], HTMLMotionProps<'h3'>>;
	h4: ForwardRefComponent<HTMLElements['h4'], HTMLMotionProps<'h4'>>;
	h5: ForwardRefComponent<HTMLElements['h5'], HTMLMotionProps<'h5'>>;
	h6: ForwardRefComponent<HTMLElements['h6'], HTMLMotionProps<'h6'>>;
	head: ForwardRefComponent<HTMLElements['head'], HTMLMotionProps<'head'>>;
	header: ForwardRefComponent<HTMLElements['header'], HTMLMotionProps<'header'>>;
	hgroup: ForwardRefComponent<HTMLElements['hgroup'], HTMLMotionProps<'hgroup'>>;
	hr: ForwardRefComponent<HTMLElements['hr'], HTMLMotionProps<'hr'>>;
	html: ForwardRefComponent<HTMLElements['html'], HTMLMotionProps<'html'>>;
	i: ForwardRefComponent<HTMLElements['i'], HTMLMotionProps<'i'>>;
	iframe: ForwardRefComponent<HTMLElements['iframe'], HTMLMotionProps<'iframe'>>;
	img: ForwardRefComponent<HTMLElements['img'], HTMLMotionProps<'img'>>;
	input: ForwardRefComponent<HTMLElements['input'], HTMLMotionProps<'input'>>;
	ins: ForwardRefComponent<HTMLElements['ins'], HTMLMotionProps<'ins'>>;
	kbd: ForwardRefComponent<HTMLElements['kbd'], HTMLMotionProps<'kbd'>>;
	label: ForwardRefComponent<HTMLElements['label'], HTMLMotionProps<'label'>>;
	legend: ForwardRefComponent<HTMLElements['legend'], HTMLMotionProps<'legend'>>;
	li: ForwardRefComponent<HTMLElements['li'], HTMLMotionProps<'li'>>;
	link: ForwardRefComponent<HTMLElements['link'], HTMLMotionProps<'link'>>;
	main: ForwardRefComponent<HTMLElements['main'], HTMLMotionProps<'main'>>;
	map: ForwardRefComponent<HTMLElements['map'], HTMLMotionProps<'map'>>;
	mark: ForwardRefComponent<HTMLElements['mark'], HTMLMotionProps<'mark'>>;
	menu: ForwardRefComponent<HTMLElements['menu'], HTMLMotionProps<'menu'>>;
	meta: ForwardRefComponent<HTMLElements['meta'], HTMLMotionProps<'meta'>>;
	meter: ForwardRefComponent<HTMLElements['meter'], HTMLMotionProps<'meter'>>;
	nav: ForwardRefComponent<HTMLElements['nav'], HTMLMotionProps<'nav'>>;
	noscript: ForwardRefComponent<HTMLElements['noscript'], HTMLMotionProps<'noscript'>>;
	object: ForwardRefComponent<HTMLElements['object'], HTMLMotionProps<'object'>>;
	ol: ForwardRefComponent<HTMLElements['ol'], HTMLMotionProps<'ol'>>;
	optgroup: ForwardRefComponent<HTMLElements['optgroup'], HTMLMotionProps<'optgroup'>>;
	option: ForwardRefComponent<HTMLElements['option'], HTMLMotionProps<'option'>>;
	output: ForwardRefComponent<HTMLElements['output'], HTMLMotionProps<'output'>>;
	p: ForwardRefComponent<HTMLElements['p'], HTMLMotionProps<'p'>>;
	param: ForwardRefComponent<HTMLElements['param'], HTMLMotionProps<'param'>>;
	picture: ForwardRefComponent<HTMLElements['picture'], HTMLMotionProps<'picture'>>;
	pre: ForwardRefComponent<HTMLElements['pre'], HTMLMotionProps<'pre'>>;
	progress: ForwardRefComponent<HTMLElements['progress'], HTMLMotionProps<'progress'>>;
	q: ForwardRefComponent<HTMLElements['q'], HTMLMotionProps<'q'>>;
	rp: ForwardRefComponent<HTMLElements['rp'], HTMLMotionProps<'rp'>>;
	rt: ForwardRefComponent<HTMLElements['rt'], HTMLMotionProps<'rt'>>;
	ruby: ForwardRefComponent<HTMLElements['ruby'], HTMLMotionProps<'ruby'>>;
	s: ForwardRefComponent<HTMLElements['s'], HTMLMotionProps<'s'>>;
	samp: ForwardRefComponent<HTMLElements['samp'], HTMLMotionProps<'samp'>>;
	script: ForwardRefComponent<HTMLElements['script'], HTMLMotionProps<'script'>>;
	section: ForwardRefComponent<HTMLElements['section'], HTMLMotionProps<'section'>>;
	select: ForwardRefComponent<HTMLElements['select'], HTMLMotionProps<'select'>>;
	small: ForwardRefComponent<HTMLElements['small'], HTMLMotionProps<'small'>>;
	source: ForwardRefComponent<HTMLElements['source'], HTMLMotionProps<'source'>>;
	span: ForwardRefComponent<HTMLElements['span'], HTMLMotionProps<'span'>>;
	strong: ForwardRefComponent<HTMLElements['strong'], HTMLMotionProps<'strong'>>;
	style: ForwardRefComponent<HTMLElements['style'], HTMLMotionProps<'style'>>;
	sub: ForwardRefComponent<HTMLElements['sub'], HTMLMotionProps<'sub'>>;
	summary: ForwardRefComponent<HTMLElements['summary'], HTMLMotionProps<'summary'>>;
	sup: ForwardRefComponent<HTMLElements['sup'], HTMLMotionProps<'sup'>>;
	table: ForwardRefComponent<HTMLElements['table'], HTMLMotionProps<'table'>>;
	tbody: ForwardRefComponent<HTMLElements['tbody'], HTMLMotionProps<'tbody'>>;
	td: ForwardRefComponent<HTMLElements['td'], HTMLMotionProps<'td'>>;
	textarea: ForwardRefComponent<HTMLElements['textarea'], HTMLMotionProps<'textarea'>>;
	tfoot: ForwardRefComponent<HTMLElements['tfoot'], HTMLMotionProps<'tfoot'>>;
	th: ForwardRefComponent<HTMLElements['th'], HTMLMotionProps<'th'>>;
	thead: ForwardRefComponent<HTMLElements['thead'], HTMLMotionProps<'thead'>>;
	time: ForwardRefComponent<HTMLElements['time'], HTMLMotionProps<'time'>>;
	title: ForwardRefComponent<HTMLElements['title'], HTMLMotionProps<'title'>>;
	tr: ForwardRefComponent<HTMLElements['tr'], HTMLMotionProps<'tr'>>;
	track: ForwardRefComponent<HTMLElements['track'], HTMLMotionProps<'track'>>;
	u: ForwardRefComponent<HTMLElements['u'], HTMLMotionProps<'u'>>;
	ul: ForwardRefComponent<HTMLElements['ul'], HTMLMotionProps<'ul'>>;
	var: ForwardRefComponent<HTMLElements['var'], HTMLMotionProps<'var'>>;
	video: ForwardRefComponent<HTMLElements['video'], HTMLMotionProps<'video'>>;
	wbr: ForwardRefComponent<HTMLElements['wbr'], HTMLMotionProps<'wbr'>>;
};
