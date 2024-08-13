import * as React from 'react';

import { TOC_ID, TOC_OBS_ID, TOC_PLACEHOLDER } from '../constants/constants';
import type { ITableOfContentsProps } from '../interfaces/ITableOfContentsProps';

import EmptyWebPart from './emptywebpart/EmptyWebPart';
import TitleDescriptionSection from './titledescription/TitleDescriptionSection';
import TOC from './toc/TOC';
import { DisplayMode } from '@microsoft/sp-core-library';

import styles from './TableOfContents.module.scss';

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
						{/* show title and description */}
						<TitleDescriptionSection
							showTitleDescription={this.props.showTitleDescription}
							title={this.props.title}
							description={this.props.description}
						/>
						{/* show heading in specified section on the page */}
						<TOC
							context={this.props.context}
							canvasId={this.props.canvasId}
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
