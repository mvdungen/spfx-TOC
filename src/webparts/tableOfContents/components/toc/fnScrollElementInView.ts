import { PAGE_HEADER } from '../../constants/constants';
import { DisplayMode } from '@microsoft/sp-core-library';

/**
 * scrollElementInView
 * @description this function will scroll the passed element into the view port of
 *              the document ONLY when we're in READ mode. In EDIT mode, the scroll
 *              function will not execute anyrhing and bail out immediately.
 *   IMPORTANT: since SPO will auto collapse the main header on the page when scrolling,
 *              clicking on the first item in the TOC will expand the SPO header again
 *              resulting in not showing the first item on the page. Therefor the 'index'
 *              property which will result in an alternate element to scroll to.
 *              
 * @param elementId string; id of element to scroll to
 * @param index number; identifies if user clicked on first item
 * @param displayMode DisplayMode; 1 = Read, 2 = Edit 
 */
export function scrollElementInView(props: {
	elementId: string;
	index: number;
	displayMode: DisplayMode;
}): void {
	if (props.displayMode === DisplayMode.Edit) {
		// if we're in edit mode, do nothing
	} else {
		// else, set default element to scroll to
		let _elm: HTMLElement | null = document.getElementById(props.elementId);
		// check passed index, if index = 0 then we need another ID because, the first
		// index is not that hihg up in the page that it scrolls to the right position
		if (props.index === 0) {
			_elm = document.querySelector(PAGE_HEADER);
		}
		// and scroll element into the current view
		if (_elm) {
			_elm.scrollIntoView({ behavior: 'smooth' });
		}
	}
}
