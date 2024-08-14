import { CANVAS_ID } from '../../constants/constants';

/**
 * getCanvasNodeHTML
 * @description retrieves the canvas node element inner HTML from the current page
 * @param canvasId number; id of canvasNode in document
 * @returns string; HTML from desired canvas node
 */
export function getCanvasNodeHTML(props: { canvasId: number }): string {
	let _result: string = '';

	try {
		const _elm: HTMLElement | undefined = getCanvasNode({ ...props });
		if (_elm) {
			_result = _elm.innerHTML;
		}
	} catch (error) {
		// error occured while retrieving canvas section > return empty string
		_result = '';
	}
	return _result;
}

/**
 * getCanvasNode
 * @description retrieves the canvas node element 
 * @param canvasId number; id of canvasNode in document
 * @returns HTMLElement | undefined; HTML canvas node element (or undefined when not found)
 */
export function getCanvasNode(props: { canvasId: number }): HTMLElement | undefined {
	let _result: HTMLElement | undefined = undefined;

	try {
		const _elms: NodeList = document.querySelectorAll<HTMLElement>(CANVAS_ID);
		if (_elms && _elms.length > 0) {
			_result = _elms[props.canvasId] as HTMLElement;
		}
	} catch (error) {
		// error occured while retrieving canvas section
		_result = undefined;
	}
	return _result;
}
