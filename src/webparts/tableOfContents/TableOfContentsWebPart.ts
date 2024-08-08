import * as React from 'react';
import * as ReactDom from 'react-dom';

import { CANVAS_ID } from './constants/constants';

import { ITableOfContentsProps } from './interfaces/ITableOfContentsProps';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import {
	IPropertyPaneChoiceGroupOption,
	type IPropertyPaneConfiguration,
	PropertyPaneChoiceGroup,
	PropertyPaneHorizontalRule,
	PropertyPaneTextField,
	PropertyPaneToggle,
} from '@microsoft/sp-property-pane';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import TableOfContents from './components/TableOfContents';

export default class TableOfContentsWebPart extends BaseClientSideWebPart<ITableOfContentsProps> {
	private _isDarkTheme: boolean = false;

	public render(): void {
		const element: React.ReactElement<ITableOfContentsProps> = React.createElement(
			TableOfContents,
			{
				showTitleDescription: this.properties.showTitleDescription,
				title: this.properties.title,
				description: this.properties.description,
				canvasId: this.properties.canvasId,
				pinWebpartOnScroll: this.properties.pinWebpartOnScroll,
				showButtonBackToTop: this.properties.showButtonBackToTop,
				displayMode: this.displayMode,
				// default SPO SPFx web part properties
				context: this.context,
				isDarkTheme: this._isDarkTheme,
				hasTeamsContext: !!this.context.sdks.microsoftTeams,
			}
		);
		ReactDom.render(element, this.domElement);
	}

	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
		if (!currentTheme) {
			return;
		}

		this._isDarkTheme = !!currentTheme.isInverted;
		const { semanticColors } = currentTheme;

		if (semanticColors) {
			this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
			this.domElement.style.setProperty('--link', semanticColors.link || null);
			this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
		}
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description:
							'Change the settings for the table of contents below. The changes are automatically saved.',
					},
					groups: [
						{
							groupName: 'Common Settings',
							groupFields: [
								PropertyPaneToggle('showTitleDescription', {
									label: 'Show Title and Description',
									onText: 'Yes',
									offText: 'No'
								}),
								PropertyPaneTextField('title', {
									label: 'Title',
									disabled: !this.properties.showTitleDescription,
								}),
								PropertyPaneTextField('description', {
									label: 'Description',
									multiline: true,
									rows: 8,
									disabled: !this.properties.showTitleDescription,
								}),
								PropertyPaneToggle('showButtonBackToTop', {
									label: 'Show back to top button',
									onText: 'Yes',
									offText: 'No'
								}),
								PropertyPaneToggle('pinWebpartOnScroll', {
									label: 'Pin web part on scroll',
									onText: 'Yes',
									offText: 'No'
								}),
								PropertyPaneHorizontalRule(),
								PropertyPaneChoiceGroup('canvasId', {
									label: 'Canvas via choices',
									options: this.getCanvasSections(),
								}),
							],
						},
					],
				},
			],
		};
	}

	// private methods

	private getCanvasSections(): IPropertyPaneChoiceGroupOption[] {
		const _results: IPropertyPaneChoiceGroupOption[] = [];
		const _elms = document.querySelectorAll(CANVAS_ID);

		if (_elms && _elms.length > 0) {
			// return canvas section areas as property pane choice groups
			_elms.forEach((_elm, _index: number) => {
				if (_elm) {
					_results.push({
						key: _index,
						text: `Section ${_index + 1}`,
					});
				}
			});
		}
		return _results;
	}
}
