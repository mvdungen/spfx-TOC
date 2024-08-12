import * as React from 'react';

import { Text } from '@fluentui/react';

import styles from '../TableOfContents.module.scss';

export interface IEmptyWebPartProps {}
export interface IEmptyWebPartState {}

export default function EmptyWebPart(props: IEmptyWebPartProps): React.ReactNode {
	//
	// state and initialisation

	// component mount --------------------------------------------------------

	// helper functions -------------------------------------------------------

	// helper components ------------------------------------------------------

	// component render -------------------------------------------------------

	return (
		<div className={styles.tableOfContents}>
			<div className={styles.init_webpart}>
				<Text as='div' variant='xxLarge'>Table of Contents</Text>
				<Text as='div' variant='mediumPlus' style={{textAlign: 'center'}}>
					Some properties are not properly setup, change the properties by opening the
					property pane.
				</Text>
			</div>
		</div>
	);
}
