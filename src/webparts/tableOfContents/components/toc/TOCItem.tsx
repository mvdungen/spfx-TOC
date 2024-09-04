import * as React from 'react';

import { INDENT_HEADER } from '../../constants/constants';
import { ITOCItem } from '../../interfaces/ITOCItem';

import { DisplayMode } from '@microsoft/sp-core-library';
import { Text } from '@fluentui/react';

import { scrollElementInView } from './fnScrollElementInView';

import styles from '../TableOfContents.module.scss';

export interface ITOCItemProps {
	item: ITOCItem;
	displayMode: DisplayMode;
}
export interface ITOCItemState {}

export default function TOCItem(props: ITOCItemProps): React.ReactNode {
	//
	// state and initialisation

	// component mount --------------------------------------------------------

	// helper functions -------------------------------------------------------

	// helper components ------------------------------------------------------

	// component render -------------------------------------------------------

	return (
		<div
			id={`toc_${props.item.elementId}`} // used as id in useEffect to mark item active
			className={styles.toc_item}
			onClick={() => {
				scrollElementInView({
					elementId: props.item.elementId,
					index: props.item.index,
					displayMode: props.displayMode,
				});
			}}
		>
			<Text
				variant='large'
				nowrap
				className={`${styles.toc_item_text} ${styles.text_color}`}
				style={{ paddingLeft: INDENT_HEADER * props.item.level }}
			>
				{props.item.title}
			</Text>
		</div>
	);
}
