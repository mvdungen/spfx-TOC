import * as React from 'react';

import { CANVAS_ID, TOC_ID, TOC_OBS_ID } from '../../constants/constants';
import { ITOCHeading } from '../../interfaces/ITOCHeading';

import { Text } from '@fluentui/react';

import styles from '../TableOfContents.module.scss';
import { DisplayMode } from '@microsoft/sp-core-library';

export interface ITOCProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	context: any;
	canvasId: number;
	pin: boolean;
	showButtonBackToTop: boolean;
	displayMode: DisplayMode;
}
export interface ITOCState {}

export default function TOC(props: ITOCProps): React.ReactNode {
	//
	// state and initialisation

	// component mount --------------------------------------------------------

	React.useEffect(() => {
		const obs = new IntersectionObserver((es: IntersectionObserverEntry[]) => {
			if (es && es.length === 1) {
				// get element which we're observing
				const _tocObsElm: IntersectionObserverEntry = es[0];
				const _toc: HTMLElement | null = document.getElementById(TOC_ID);
				// take action based on the intersection (visible or not)
				if (_toc) {
					if (_tocObsElm.isIntersecting) {
						// visible
						_toc.style.position = '';
						_toc.style.top = '';
						_toc.style.width = '';
					} else {
						// invisible
						_toc.style.position = 'fixed';
						_toc.style.top = `${_tocObsElm.boundingClientRect.top}px`;
						_toc.style.width = `${_tocObsElm.boundingClientRect.width}px`;
					}
				}
			}
		});
		// get toc element to observe (small div above the actual TOC)
		const elm = document.getElementById(TOC_OBS_ID);
		// observe when not in edit mode
		if (elm && props.pin && props.displayMode === DisplayMode.Read) {
			obs.observe(elm);
		}
	});

	React.useEffect(() => {
		// add observer task to mark active heading in TOC
		const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry: IntersectionObserverEntry) => {
				// set entry id
				const _entryId: string = `toc_${entry.target.id}`;
				// get element
				const _elm: HTMLElement | null = document.getElementById(_entryId);
				// check elm and set (in)active
				if (_elm && _elm.firstChild) {
					if (entry.intersectionRatio > 0) {
						// active
						_elm.classList.add(styles.active);
					} else {
						// inactive
						_elm.classList.remove(styles.active);
					}
				}
			});
		});
		// get correct canvas element
		const _elms = document.querySelectorAll(CANVAS_ID);
		if (_elms && _elms.length > 0) {
			// get element containing all content
			const _elm = _elms[props.canvasId];
			// start observing
			_elm.querySelectorAll('h1, h2, h3, h4, h5').forEach(_heading => {
				observer.observe(_heading);
			});
		}
	}, []);

	// helper components ------------------------------------------------------

	const TOCHeadings = (): JSX.Element => {
		// extract all heading from HTML content
		const _results: JSX.Element[] = _extractTOCFromContent();
		// return the table of contents
		return <div>{_results.map(_h => _h)}</div>;
	};

	const TOCItem = (p: { item: ITOCHeading; elementId: string }): JSX.Element => {
		return (
			<div
				id={`toc_${p.elementId}`} // used as id in useEffect to mark item active
				className={styles.toc_item}
				onClick={() => _scrollElementInView(p.elementId)}
			>
				<Text
					variant='large'
					nowrap
					className={`${styles.toc_item_text} ${styles.text_color}`}
					style={{ paddingLeft: 12 * p.item.level }}
				>
					{p.item.title}
				</Text>
			</div>
		);
	};

	// helper functions -------------------------------------------------------

	function _getCanvasNodeText(): string {
		//
		let _result: string | null = '';

		try {
			const _elms = document.querySelectorAll(CANVAS_ID);
			if (_elms && _elms.length > 0) {
				const _textNode = _elms[props.canvasId];
				_result = _textNode.innerHTML;
			}
		} catch (error) {
			// error occured while retrieving canvas section > return empty string
		}
		return _result || '';
	}

	function _extractTOCFromContent(): JSX.Element[] {
		const _tocItems: JSX.Element[] = [];
		const _text: string = _getCanvasNodeText();

		if (_text) {
			const _parser: DOMParser = new DOMParser();
			const _htmlDoc: Document = _parser.parseFromString(_text, 'text/html');
			// iterate all heading in parser
			_htmlDoc.querySelectorAll('h1, h2, h3, h4, h5').forEach(_h => {
				// get title and level from HTML content
				const _title: string = _h.textContent?.trim() as string;
				const _level: number = parseInt(_h.tagName.toString().substring(1, 2)) - 2;
				// add toc item (depending on edit level)
				_tocItems.push(
					<TOCItem item={{ title: _title, level: _level }} elementId={_h.id} />
				);
			});
		}
		return _tocItems;
	}

	function _scrollElementInView(elementId: string): void {
		if (props.displayMode === DisplayMode.Edit) {
			// if we're in edit mode, do nothing
		} else {
			// otherise, get element to scroll to
			const _elm: HTMLElement | null = document.getElementById(elementId);
			// and scroll element into the current view
			if (_elm) {
				_elm.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}

	// component render -------------------------------------------------------

	return (
		<div className={styles.section_toc}>
			<TOCHeadings />
		</div>
	);
}
