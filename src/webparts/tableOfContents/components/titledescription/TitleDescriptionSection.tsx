import * as React from 'react';

import styles from '../TableOfContents.module.scss';
import { Text } from '@fluentui/react';

export interface ITitleDescriptionSectionProps {
	showTitleDescription: boolean;
	title: string;
	description: string;
}
export interface ITitleDescriptionSectionState {}

export default function TitleDescriptionSection(
	props: ITitleDescriptionSectionProps
): React.ReactNode {
	//
	// state and initialisation

	// component mount --------------------------------------------------------

	// helper functions -------------------------------------------------------

	// helper components ------------------------------------------------------

	const WPTitle = (): JSX.Element | null =>
		props.title ? (
			<div className={styles.title}>
				<Text variant='xxLarge' nowrap as='div' className={styles.text_color}>
					{props.title}
				</Text>
			</div>
		) : null;

	const WPDescription = (): JSX.Element | null =>
		props.description ? (
			<div className={styles.description}>
				<Text variant='large' as='div' className={styles.text_color}>
					{props.description}
				</Text>
			</div>
		) : null;

	// component render -------------------------------------------------------

	if (!props.showTitleDescription) {
		// do not show title and/or description > return null
		return null;
	}

	return (
		<div className={styles.section_titledescription}>
			<WPTitle />
			<WPDescription />
		</div>
	);
}
