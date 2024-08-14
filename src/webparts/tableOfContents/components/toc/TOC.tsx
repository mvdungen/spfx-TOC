import * as React from 'react';

import { CANVAS_ID, TOC_ID, TOC_OBS_ID, TOC_PLACEHOLDER } from '../../constants/constants';
import { ITOCItem } from '../../interfaces/ITOCItem';

import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import TOCItem from './TOCItem';

import { getTOCItemsFromContent } from './fnGetTOCItemFromContent';
import { setTOCPosition } from './fnSetTOCPosition';

import styles from '../TableOfContents.module.scss';

export interface ITOCProps {
	context: WebPartContext;
	// canvasId: number;
	canvasIds: number[];
	levels: string;
	pin: boolean;
	isHeaderCollapsed: boolean;
	displayMode: DisplayMode;
}
export interface ITOCState {}

export default function TOC(props: ITOCProps): React.ReactNode {
	//
	// state and initialisation

	const refTOCTop = React.useRef<ITOCItem | null>(null);

	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// useEffect > initialise observer to fix position of web part at the top
		// 			   of the page when scrolling
		//
		const obs = new IntersectionObserver(([es]) => {
			if (es) {
				// get element which we're observing
				const _tocObsElm: IntersectionObserverEntry = es;
				const _toc: HTMLElement | null = document.getElementById(TOC_ID);
				const _tocPlaceholder: HTMLElement | null =
					document.getElementById(TOC_PLACEHOLDER);
				// take action based on the intersection (visible or not)
				if (_toc && _tocPlaceholder) {
					setTOCPosition({
						type: _tocObsElm.isIntersecting ? 'reset' : 'set',
						elmTOC: _toc,
						elmPlaceholder: _tocPlaceholder,
						dimensions: _tocObsElm.boundingClientRect,
					});
				}
			}
		});

		// get toc element to observe (small div above the actual TOC)
		const elm: HTMLElement | null = document.getElementById(TOC_OBS_ID);
		// observe when not in edit mode
		if (elm && props.pin) {
			if (props.displayMode === DisplayMode.Read) {
				obs.observe(elm);
			}
		}

		// clear observer -----------------
		return () => {
			obs.disconnect();
		};
	}, [props]);

	React.useEffect(() => {
		// useEffect > initialize observer to mark headings when heading are in
		// 			   the visual viewport of the page
		//
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
		if (props.canvasIds !== undefined && props.canvasIds.length > 0) {
			// get all canvas content elements
			const _elms = document.querySelectorAll(CANVAS_ID);
			if (_elms && _elms.length > 0) {
				// iterate all canvas content element and observe selected elements
				props.canvasIds.forEach((_canvasId: number) => {
					// get element containing all content
					const _elm = _elms[_canvasId];
					// check element > we need to check, because the web part could be moved or
					// a section could be removed, the selected section will not update in this
					// web part, therefor check the element
					if (_elm) {
						// start observing
						_elm.querySelectorAll('h1, h2, h3, h4, h5').forEach(_heading => {
							observer.observe(_heading);
						});
					}
				});
			}
		}

		// clear observer -----------------
		return () => {
			observer.disconnect();
		};
	}, []);

	// React.useEffect(() => {
	// 	if (props.pin && props.displayMode === DisplayMode.Read) {
	// 		// first check if we already added the element
	// 		const _top: HTMLElement | null = document.getElementById(TOC_TOP);
	// 		if (_top === null && refTOCTop.current) {
	// 			// then check if we can find the first TOC element
	// 			const _elmBefore: HTMLElement | undefined = getCanvasNode({
	// 				canvasId: props.canvasId,
	// 			});
	// 			if (_elmBefore) {
	// 				// create the new TOP element and insert it before the selected canvas node
	// 				const _elmToInsert: HTMLElement = document.createElement('div');
	// 				_elmToInsert.id = TOC_TOP;
	// 				_elmBefore.insertBefore(_elmToInsert, null);
	// 			}
	// 		}
	// 	}
	// }, [refTOCTop.current]);

	// helper components ------------------------------------------------------

	const TOCHeadings = (): JSX.Element => {
		// extract all heading from HTML content
		const _results: JSX.Element[] = [];
		// and iterate each toc item to create a JSX element from it
		getTOCItemsFromContent({ canvasIds: props.canvasIds, levels: props.levels }).forEach(
			(_tocItem: ITOCItem, _index: number) => {
				if (_index === 0 && props.pin && props.displayMode === DisplayMode.Read) {
					// we're pinning the toc and this is the first element > callback to add top element
					refTOCTop.current = _tocItem;
				}
				_results.push(<TOCItem item={_tocItem} displayMode={props.displayMode} />);
			}
		);
		// and return the table of contents
		return <div>{_results.map(_elm => _elm)}</div>;
	};

	// helper functions -------------------------------------------------------

	// component render -------------------------------------------------------

	return (
		<div
			className={styles.section_toc}
			// do not show TOC if header is collapsed; we need do to that here because we need
			// the observer to make the TOC sticky; we cannot do this in the parent component!
			style={{ display: props.isHeaderCollapsed ? 'none' : 'block' }}
		>
			<TOCHeadings />
		</div>
	);
}
