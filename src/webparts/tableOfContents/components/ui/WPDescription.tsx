import * as React from 'react';

import { EMPTY_DESCRIPTION } from '../../constants/constants';
import { ITableOfContentsProps } from '../../interfaces/ITableOfContentsProps';

import { DisplayMode } from '@microsoft/sp-core-library';
import { Text, TextField } from '@fluentui/react';

import styles from '../TableOfContents.module.scss';

export interface IWPDescriptionProps {
	description: string;
	isHeaderCollapsed: boolean;
	displayMode: DisplayMode;
	updateProperty: (property: keyof ITableOfContentsProps, value: unknown) => void;
}
export interface IWPDescriptionState {}

export default function WPDescription(props: IWPDescriptionProps): React.ReactNode {
	//
	// state and initialisation

	// component mount --------------------------------------------------------

	// helper functions -------------------------------------------------------

	// helper components ------------------------------------------------------

	// component render -------------------------------------------------------

	if (props.displayMode === DisplayMode.Edit) {
		// edit mode > render a textbox to allow direct editing of title
		return (
			<TextField
				role='textbox'
				as='p'
				styles={{
					root: { marginLeft: '-8px', marginBottom: '8px' },
					field: { fontSize: '18px', lineHeight: '1.3' },
				}}
				borderless
				placeholder={EMPTY_DESCRIPTION}
				autoAdjustHeight
				resizable={false}
				multiline
				defaultValue={props.description}
				onChange={(e, value: string | undefined) => {
					if (typeof value === 'string') {
						props.updateProperty('description', value);
					}
				}}
			/>
		);
	}

	if (props.description === undefined || props.description.trim() === '') {
		return null;
	} else {
		return (
			<Text
				variant='large'
				className={styles.description}
				// do not show description if header is collapsed
				style={{ display: props.isHeaderCollapsed ? 'none' : 'block' }}
			>
				{props.description}
			</Text>
		);
	}
}
