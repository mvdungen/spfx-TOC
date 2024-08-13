import * as React from 'react';

import { TOC_ID, TOC_OBS_ID, TOC_PLACEHOLDER } from '../constants/constants';
import type { ITableOfContentsProps } from '../interfaces/ITableOfContentsProps';

import EmptyWebPart from './emptywebpart/EmptyWebPart';
import TOC from './toc/TOC';
import { DisplayMode } from '@microsoft/sp-core-library';

import styles from './TableOfContents.module.scss';

import WPTitle from './ui/WPTitle';
import WPDescription from './ui/WPDescription';

export default class TableOfContents extends React.Component<ITableOfContentsProps, {}> {
	constructor(props: ITableOfContentsProps) {
		super(props);
	}

	componentDidMount(): void {
		// componentDidMount
	}

	componentDidUpdate(prevProps: Readonly<ITableOfContentsProps>, prevState: Readonly<{}>): void {
		// componentDidUpdate
	}

	public render(): React.ReactElement<ITableOfContentsProps> {
		if (this.props.canvasId === undefined) {
			// no canvas area selected, return error when in edit mode
			if (this.props.displayMode === DisplayMode.Edit) {
				return <EmptyWebPart />;
			}
		}

		return (
			<>
				{/* first div is observer in the TOC and when it reaches the top, the TOC div will be fixed */}
				<div id={TOC_OBS_ID} />
				<section className={styles.tableOfContents} id={TOC_ID}>
					<div>
						<div className={styles.section_titledescription}>
							{/* web part title > allow edit on screen */}
							<WPTitle
								title={this.props.title}
								displayMode={this.props.displayMode}
								updateProperty={this.props.updateProperty}
							/>
							<WPDescription
								description={this.props.description}
								displayMode={this.props.displayMode}
								updateProperty={this.props.updateProperty}
							/>
						</div>
						{/* show heading in specified section on the page */}
						<TOC
							context={this.props.context}
							canvasId={this.props.canvasId}
							levels={this.props.levels}
							pin={this.props.pinWebpartOnScroll}
							displayMode={this.props.displayMode}
						/>
					</div>
				</section>
				{/* this placeholder area will inherit the height of the toc when the observer in the component */}
				{/* is triggered, this prevents subsequent DIVs underneath the TOC shifting up.. */}
				<div id={TOC_PLACEHOLDER}>&nbsp;</div>
			</>
		);
	}

	// private methods
}
