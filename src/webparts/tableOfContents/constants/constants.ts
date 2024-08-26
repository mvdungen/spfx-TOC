/**
 * @constant CANVAS_ID
 * @description string; reference ID to identify different canvas/text sections on the page
 */
export const CANVAS_ID: string = '[data-automation-id="CanvasSection"]';

/**
 * @constant TOC elements
 * @description string; reference IDs to identify the main table of contents section
 */
export const TOC_ID: string = 'tableofcontents';
export const TOC_OBS_ID: string = 'toc_obs';
export const TOC_PLACEHOLDER: string = 'toc_placeholder';
export const TOC_TOP: string = 'toc_top';

/**
 * @constant INDENT_HEADER
 * @description number; number of pixels to indent h2, h3, ...
 */
export const INDENT_HEADER: number = 12;

/**
 * @constant EMPTY_...
 * @description defines placeholder for onscreen editing of title and description
 */
export const EMPTY_TITLE: string = 'Web Part Title';
export const EMPTY_DESCRIPTION: string = 'Web part description, start typing here to change...';

/**
 * @constant COLOR_VAR_LIST
 * @description return the list of Fluid UI CSS variable used for theme coloring, use
 *              for alternate background color of TOC with theme adjustments
 */
export const COLOR_DEFINITION_ELM: string = '.fui-FluentProvider1';
export const COLOR_VAR_LIST: string[] = [
	'--colorNeutralBackground1',
	'--colorNeutralBackground3',
	'--colorNeutralBackground5',
	'--colorBrandBackground',
];
