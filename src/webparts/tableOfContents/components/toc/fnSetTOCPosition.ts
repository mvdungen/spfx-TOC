/**
 * setTOCPosition
 * @description sets or resets the position of the TOC element on the page, used to
 *              fix the position when the web part should be pinned to the page
 * @param type; 'set' = set position, 'reset' = reset position
 * @param elmTOC HTMLElement; TOC element reference
 * @param elmPlaceholder HTMLElement; placeholder used for setting height
 * @param dimensions DOMRect; dimensions of the intersection object (observer)
 * @returns nothing
 */
export function setTOCPosition(props: {
	type: 'set' | 'reset';
	elmTOC: HTMLElement;
	elmPlaceholder: HTMLElement;
	dimensions: DOMRectReadOnly | undefined;
}): void {
	// set properties depending on type of action; by default we initialize
	// the values with reset options
	let _position: string = '';
	let _zIndex: string = '0';
	let _top: string = '';
	let _width: string = '';
	let _height: string = '0px';
	switch (props.type) {
		case 'set':
			if (props.dimensions) {
				_position = 'fixed';
				_zIndex = '100';
				_top = `${props.dimensions.top}px`;
				_width = `${props.dimensions.width}px`;
				_height = `${props.elmTOC.clientHeight}px`;
			}
			break;
		default:
		// default = reset; use the default values set above
	}
	// set values
	props.elmTOC.style.position = _position;
	props.elmTOC.style.zIndex = _zIndex;
	props.elmTOC.style.top = _top;
	props.elmTOC.style.width = _width;
	props.elmPlaceholder.style.height = _height;
}
