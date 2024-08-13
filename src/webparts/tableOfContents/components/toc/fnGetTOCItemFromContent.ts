import { ITOCItem } from '../../interfaces/ITOCItem';

import { getCanvasNodeText } from './fnGetCanvasNodeText';

/**
 * getTOCItemsFromContent
 * @description extracts the header elements (h1, h2, ...) from the canvas node element
 * @param canvasId number; id of canvasNode in document
 * @returns ITOCItems[]; array of all h1, h2, h3... elements found in the canvas node text
 */
export function getTOCItemsFromContent(props: { canvasId: number; levels: string }): ITOCItem[] {
	// extract text from select canvas node
	const _tocItems: ITOCItem[] = [];
	const _text: string = getCanvasNodeText({ canvasId: props.canvasId });
	const _levels: string = props.levels || 'h1, h2, h3';
	// and process the text for each heading found
	if (_text) {
		const _parser: DOMParser = new DOMParser();
		const _htmlDoc: Document = _parser.parseFromString(_text, 'text/html');
		// iterate all heading in parser
		_htmlDoc.querySelectorAll(_levels).forEach((_header: HTMLElement, _index: number) => {
			// IMPORTANT:
			// SharePoint uses the CK Editor, this editor adds metadata to the document. That meta
			// data is parsed and will return twice the headers (that's how CK Editor is working).
			// To prevent double entries in the list, we check if we already have the title in the 
			// list and skip the item if it's found.
			//
			// get title and lookup the value in the current list of items > found, do not add...
			const _title: string = _header.textContent?.trim() as string;
			const _simularItems: ITOCItem[] | null = _tocItems.filter(_i => _i.title === _title);
			// found > do not add item to list of TOC items
			if (_simularItems.length === 0 && _title !== '') {
				_tocItems.push({
					title: _title,
					level: parseInt(_header.tagName.toString().substring(1, 2)) - 2,
					elementId: _header.id,
					index: _index,
				});
			}
		});
	}
	return _tocItems;
}
