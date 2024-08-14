import * as React from 'react';

import { TOC_ID, TOC_OBS_ID, TOC_PLACEHOLDER } from '../constants/constants';
import type { ITableOfContentsProps } from '../interfaces/ITableOfContentsProps';

import { DisplayMode } from '@microsoft/sp-core-library';
import EmptyWebPart from './emptywebpart/EmptyWebPart';
import WPTitle from './ui/WPTitle';
import WPDescription from './ui/WPDescription';
import TOC from './toc/TOC';

import styles from './TableOfContents.module.scss';
import { ITableOfContentsState } from '../interfaces/ITableOfContentsState';

export default class TableOfContents extends React.Component<
	ITableOfContentsProps,
	ITableOfContentsState
> {
	constructor(props: ITableOfContentsProps) {
		// call parent
		super(props);
		// bind this to component
		this._toggleHeader = this._toggleHeader.bind(this);
		// set initial state
		this.state = {
			isHeaderCollapsed: this.props.collapsibleHeader ? this.props.defaultCollapsed || false : false,
		};
	}

	componentDidMount(): void {
		// componentDidMount
	}

	componentDidUpdate(prevProps: Readonly<ITableOfContentsProps>, prevState: Readonly<{}>): void {
		// componentDidUpdate
	}

	public render(): React.ReactElement<ITableOfContentsProps> {
		if (this.props.canvasIds === undefined || this.props.canvasIds.length === 0) {
			// no canvas area selected, return error when in edit mode
			if (this.props.displayMode === DisplayMode.Edit) {
				return <EmptyWebPart />;
			} else {
				// in view/read mode > return nothing
				return <div>Properties not set!</div>;
			}
		}

		return (
			<>
				{/* first div is observer in the TOC and when it reaches the top, the TOC div will be fixed */}
				<div id={TOC_OBS_ID} />
				{/* title, description and toc > check collapsible headers */}
				<section className={styles.tableOfContents} id={TOC_ID}>
					<div className={styles.section_titledescription}>
						{/* web part title > allow edit on screen */}
						<WPTitle
							title={this.props.title}
							canHeaderCollapse={this.props.collapsibleHeader}
							isHeaderCollapsed={this.state.isHeaderCollapsed}
							callbackToggleHeader={this._toggleHeader}
							displayMode={this.props.displayMode}
							updateProperty={this.props.updateProperty}
						/>
						<WPDescription
							description={this.props.description}
							isHeaderCollapsed={this.state.isHeaderCollapsed}
							displayMode={this.props.displayMode}
							updateProperty={this.props.updateProperty}
						/>
					</div>
					{/* show heading in specified section on the page */}
					<TOC
						context={this.props.context}
						canvasIds={this.props.canvasIds}
						levels={this.props.levels}
						pin={this.props.pinWebpartOnScroll}
						isHeaderCollapsed={this.state.isHeaderCollapsed}
						displayMode={this.props.displayMode}
					/>
				</section>
				{/* this placeholder area will inherit the height of the toc when the observer in the component */}
				{/* is triggered, this prevents subsequent DIVs underneath the TOC shifting up.. */}
				<div id={TOC_PLACEHOLDER}>&nbsp;</div>
			</>
		);
	}

	// private methods

	private _toggleHeader(toggle: boolean): void {
		// toggle header expand/collapse
		this.setState({
			isHeaderCollapsed: toggle,
		});
	}
}
