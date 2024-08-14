import * as React from 'react';

import { EMPTY_TITLE } from '../../constants/constants';
import { ITableOfContentsProps } from '../../interfaces/ITableOfContentsProps';

import { DisplayMode } from '@microsoft/sp-core-library';
import { TextField } from '@fluentui/react';

import CollapsibleHeader from './CollapsibleHeader';

export interface IWPTitleProps {
	title: string;
	canHeaderCollapse: boolean;
	isHeaderCollapsed: boolean;
	callbackToggleHeader: (toggle: boolean) => void;
	displayMode: DisplayMode;
	updateProperty: (property: keyof ITableOfContentsProps, value: unknown) => void;
}
export interface IWPTitleState {}

export default function WPTitle(props: IWPTitleProps): React.ReactNode {
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
				role='heading'
				as='h2'
				styles={{
					root: { marginLeft: '-8px', paddingBottom: '8px' },
					field: { fontWeight: 600, fontSize: '28px', height: '40px' },
				}}
				borderless
				placeholder={EMPTY_TITLE}
				defaultValue={props.title}
				onChange={(e, value: string | undefined) => {
					if (typeof value === 'string') {
						props.updateProperty('title', value);
					}
				}}
			/>
		);
	}

	if (props.title === undefined || props.title.trim() === '') {
		return null;
	} else {
		return (
			<CollapsibleHeader
				text={props.title}
				canHeaderCollapse={props.canHeaderCollapse}
				isHeaderCollapsed={props.isHeaderCollapsed}
				callbackToggleHeader={props.callbackToggleHeader}
			/>
		);
	}
}
