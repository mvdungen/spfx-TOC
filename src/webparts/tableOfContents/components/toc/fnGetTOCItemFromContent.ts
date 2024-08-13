import { ITOCItem } from '../../interfaces/ITOCItem';

import { getCanvasNodeText } from './fnGetCanvasNodeText';

/**
 * getTOCItemsFromContent
 * @description extracts the header elements (h1, h2, ...) from the canvas node element
 * @param canvasId number; id of canvasNode in document
 * @returns ITOCItems[]; array of all h1, h2, h3... elements found in the canvas node text
 */
export function getTOCItemsFromContent(props: { canvasId: number }): ITOCItem[] {
	// extract text from select canvas node
	const _tocItems: ITOCItem[] = [];
	const _text: string = getCanvasNodeText({ canvasId: props.canvasId });
	// and process the text for each heading found
	if (_text) {
		const _parser: DOMParser = new DOMParser();
		const _htmlDoc: Document = _parser.parseFromString(_text, 'text/html');
		// iterate all heading in parser
		_htmlDoc.querySelectorAll('h1, h2, h3, h4, h5').forEach((_h, _i: number) => {
			_tocItems.push({
				title: _h.textContent?.trim() as string,
				level: parseInt(_h.tagName.toString().substring(1, 2)) - 2,
				elementId: _h.id,
				index: _i,
			});
		});
	}
	return _tocItems;
}
