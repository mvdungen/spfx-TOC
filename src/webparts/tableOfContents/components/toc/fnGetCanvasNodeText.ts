import { CANVAS_ID } from '../../constants/constants';

/**
 * getCanvasNodeText
 * @description retrieves the canvas node element inner text from the current page
 * @param canvasId number; id of canvasNode in document
 * @returns string; text from desired canvas node
 */
export function getCanvasNodeText(props: { canvasId: number }): string {
	//
	let _result: string = '';

	try {
		const _elms = document.querySelectorAll(CANVAS_ID);
		if (_elms && _elms.length > 0) {
			const _textNode = _elms[props.canvasId];
			_result = _textNode.innerHTML;
		}
	} catch (error) {
		// error occured while retrieving canvas section > return empty string
		_result = '';
	}
	return _result;
}
