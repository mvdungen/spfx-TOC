import * as React from 'react';

import { TOC_ID, TOC_OBS_ID } from '../constants/constants';
import type { ITableOfContentsProps } from '../interfaces/ITableOfContentsProps';

import TitleDescriptionSection from './titledescription/TitleDescriptionSection';
import TOC from './toc/TOC';

import styles from './TableOfContents.module.scss';

export default class TableOfContents extends React.Component<ITableOfContentsProps, {}> {
	public render(): React.ReactElement<ITableOfContentsProps> {
		return (
			<>
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
							showButtonBackToTop={this.props.showButtonBackToTop}
							displayMode={this.props.displayMode}
						/>
					</div>
				</section>
			</>
		);
	}
}
