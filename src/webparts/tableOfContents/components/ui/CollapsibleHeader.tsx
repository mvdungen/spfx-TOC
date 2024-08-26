import * as React from 'react';

import { Icon, Text } from '@fluentui/react';

import styles from '../TableOfContents.module.scss';

export interface ICollapsibleHeaderProps {
	text: string;
	canHeaderCollapse: boolean;
	isHeaderCollapsed: boolean;
	callbackToggleHeader: (toggle: boolean) => void;
}
export interface ICollapsibleHeaderState {}

export default function CollapsibleHeader(props: ICollapsibleHeaderProps): React.ReactNode {
	//
	// state and initialisation

	const [isCollapsed, setIsCollapsed] = React.useState<boolean>(props.isHeaderCollapsed);

	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// set header state
		setIsCollapsed(props.isHeaderCollapsed);
	}, [props.isHeaderCollapsed]);

	// helper functions -------------------------------------------------------

	function _toggleHeader(): void {
		// state
		setIsCollapsed(!isCollapsed);
		// call parent handler
		props.callbackToggleHeader(!isCollapsed);
	}

	// helper components ------------------------------------------------------

	const Title = (): JSX.Element => {
		return (
			<Text role='heading' nowrap className={styles.title}>
				{props.text}
			</Text>
		);
	};

	// component render -------------------------------------------------------

	if (props.canHeaderCollapse) {
		// return collapse header
		return (
			<div onClick={_toggleHeader} className={styles.section_collapseheader}>
				<Title />
				<Icon
					iconName={isCollapsed ? 'ChevronDown' : 'ChevronUp'}
					className={styles.icon_toggle}
				/>
			</div>
		);
	} else {
		// return normal header
		return <Title />;
	}
}
