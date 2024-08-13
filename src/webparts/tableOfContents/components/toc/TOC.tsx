import * as React from 'react';

import { CANVAS_ID, TOC_ID, TOC_OBS_ID, TOC_PLACEHOLDER } from '../../constants/constants';
import { ITOCItem } from '../../interfaces/ITOCItem';

import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { getTOCItemsFromContent } from './fnGetTOCItemFromContent';
import { setTOCPosition } from './fnSetTOCPosition';

import styles from '../TableOfContents.module.scss';
import TOCItem from './TOCItem';

export interface ITOCProps {
	context: WebPartContext;
	canvasId: number;
	pin: boolean;
	displayMode: DisplayMode;
}
export interface ITOCState {}

export default function TOC(props: ITOCProps): React.ReactNode {
	//
	// state and initialisation

	// component mount --------------------------------------------------------

	React.useEffect(() => {
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
			// clean up
			obs.disconnect();
		};
	}, [props]);

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
		const _results: JSX.Element[] = [];
		// and iterate each toc item to create a JSX element from it
		getTOCItemsFromContent({ canvasId: props.canvasId }).forEach((_tocItem: ITOCItem) => {
			_results.push(<TOCItem item={_tocItem} displayMode={props.displayMode} />);
		});
		// and return the table of contents
		return <div>{_results.map(_elm => _elm)}</div>;
	};

	// helper functions -------------------------------------------------------

	// component render -------------------------------------------------------

	return (
		<div className={styles.section_toc}>
			<TOCHeadings />
		</div>
	);
}
