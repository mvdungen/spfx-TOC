import * as React from 'react';

import {
	CANVAS_ID,
	PAGE_HEADER,
	TOC_ID,
	TOC_OBS_ID,
	TOC_PLACEHOLDER,
} from '../../constants/constants';
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
				const _tocPlaceholder: HTMLElement | null =
					document.getElementById(TOC_PLACEHOLDER);
				// take action based on the intersection (visible or not)
				if (_toc && _tocPlaceholder) {
					if (_tocObsElm.isIntersecting) {
						// visible
						_resetTOC(_toc, _tocPlaceholder);
						// _toc.style.position = '';
						// _toc.style.top = '';
						// _toc.style.width = '';
						// _toc.style.zIndex = '0';
						// _tocPlaceholder.style.height = `0px`;
					} else {
						// invisible
						_toc.style.position = 'fixed';
						_toc.style.top = `${_tocObsElm.boundingClientRect.top + 24}px`;
						_toc.style.width = `${_tocObsElm.boundingClientRect.width}px`;
						_toc.style.zIndex = '100';
						_tocPlaceholder.style.height = `${_toc.clientHeight}px`;
					}
				}
			}
		});
		// get toc element to observe (small div above the actual TOC)
		const elm = document.getElementById(TOC_OBS_ID);
		// observe when not in edit mode
		if (elm && props.pin) {
			if (props.displayMode === DisplayMode.Read) {
				obs.observe(elm);
			} else {
				// stop observing
				obs.unobserve(elm);
				// reset heights and widths > get toc and toc placeholders
				const _toc: HTMLElement | null = document.getElementById(TOC_ID);
				const _tocPlaceholder: HTMLElement | null =
					document.getElementById(TOC_PLACEHOLDER);
				if (_toc && _tocPlaceholder) {
					_resetTOC(_toc, _tocPlaceholder);
				}
			}
		}
	}, []);

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
		if (props.canvasId !== undefined) {
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
		}
	}, []);

	// helper components ------------------------------------------------------

	const TOCHeadings = (): JSX.Element => {
		// extract all heading from HTML content
		const _results: JSX.Element[] = _extractTOCFromContent();
		// return the table of contents
		return <div>{_results.map(_h => _h)}</div>;
	};

	const TOCItem = (p: { item: ITOCHeading; elementId: string; index: number }): JSX.Element => {
		return (
			<div
				id={`toc_${p.elementId}`} // used as id in useEffect to mark item active
				className={styles.toc_item}
				onClick={() => {
					// scroll to element
					_scrollElementInView(p.elementId, p.index);
				}}
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
			_htmlDoc.querySelectorAll('h1, h2, h3, h4, h5').forEach((_h, _i: number) => {
				// get title and level from HTML content
				const _title: string = _h.textContent?.trim() as string;
				const _level: number = parseInt(_h.tagName.toString().substring(1, 2)) - 2;
				// add toc item (depending on edit level)
				_tocItems.push(
					<TOCItem item={{ title: _title, level: _level }} elementId={_h.id} index={_i} />
				);
			});
		}
		return _tocItems;
	}

	function _scrollElementInView(elementId: string, index: number): void {
		if (props.displayMode === DisplayMode.Edit) {
			// if we're in edit mode, do nothing
		} else {
			// else, set default element to scroll to
			let _elm: HTMLElement | null = document.getElementById(elementId);
			// check passed index, if index = 0 then we need another ID because, the first
			// index is not that hihg up in the page that it scrolls to the right position
			if (index === 0) {
				_elm = document.querySelector(PAGE_HEADER);
			}
			// and scroll element into the current view
			if (_elm) {
				_elm.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}

	function _resetTOC(elmTOC: HTMLElement, elmPlaceholder: HTMLElement): void {
		console.log('resetting toc')
		elmTOC.style.position = '';
		elmTOC.style.top = '';
		elmTOC.style.width = '';
		elmTOC.style.zIndex = '0';
		elmPlaceholder.style.height = `0px`;

	}

	// component render -------------------------------------------------------

	return (
		<div className={styles.section_toc}>
			<TOCHeadings />
		</div>
	);
}
