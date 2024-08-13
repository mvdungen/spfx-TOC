import * as React from 'react';
import * as ReactDom from 'react-dom';

import { CANVAS_ID } from './constants/constants';

import { ITableOfContentsProps } from './interfaces/ITableOfContentsProps';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import {
	IPropertyPaneChoiceGroupOption,
	type IPropertyPaneConfiguration,
	PropertyPaneButton,
	PropertyPaneChoiceGroup,
	PropertyPaneHorizontalRule,
	PropertyPaneLabel,
	PropertyPaneToggle,
} from '@microsoft/sp-property-pane';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import TableOfContents from './components/TableOfContents';

import styles from './components/TableOfContents.module.scss';
import { getCanvasNode } from './components/toc/fnGetCanvasNodeText';

export default class TableOfContentsWebPart extends BaseClientSideWebPart<ITableOfContentsProps> {
	private _isDarkTheme: boolean = false;
	private _isMarked: boolean = false;

	public render(): void {
		const element: React.ReactElement<ITableOfContentsProps> = React.createElement(
			TableOfContents,
			{
				title: this.properties.title,
				description: this.properties.description,
				canvasId: this.properties.canvasId,
				pinWebpartOnScroll: this.properties.pinWebpartOnScroll,
				levels: this.properties.levels,
				displayMode: this.displayMode,
				// method to update property
				updateProperty: (property: keyof ITableOfContentsProps, value: unknown) => {
					switch (property) {
						case 'title':
							this.properties.title = value as string;
							break;
						case 'description':
							console.log('value=', value)
							this.properties.description = value as string;
							break;
						default:
						// do nothing, action for other properties not required...
					}
				},
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
								PropertyPaneLabel('', {
									text: 'Note: you can change the title and description directly in the web part on the page.',
								}),
								PropertyPaneChoiceGroup('levels', {
									label: 'Levels to show',
									options: this.getLevels(),
								}),
								PropertyPaneToggle('pinWebpartOnScroll', {
									label: 'Pin web part on scroll',
									onText: 'Yes',
									offText: 'No',
								}),
								PropertyPaneHorizontalRule(),
								PropertyPaneChoiceGroup('canvasId', {
									label: 'Choose content area',
									options: this.getCanvasSections(),
								}),
								PropertyPaneButton('', {
									text: this._isMarked
										? 'Hide selected area'
										: 'Show selected area',
									disabled: this.properties.canvasId === undefined,
									onClick: () => {
										// toggle marked area
										this._toggleMarkedArea(
											this.properties.canvasId,
											!this._isMarked
										);
									},
								}),
							],
						},
					],
				},
			],
		};
	}

	protected onPropertyPaneFieldChanged(
		propertyPath: string,
		oldValue: unknown,
		newValue: unknown
	): void {
		switch (propertyPath) {
			case 'canvasId':
				// switch off old area
				this._toggleMarkedArea(oldValue as number, false);
				// switch on new area
				this._toggleMarkedArea(newValue as number, true);
				break;
			default:
			// do nothing > future use...
		}
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

	private getLevels(): IPropertyPaneChoiceGroupOption[] {
		return [
			{ key: 'h1, h2, h3, h4, h5', text: 'H1, H2, H3, H4, H5' },
			{ key: 'h1, h2, h3, h4', text: 'H1, H2, H3, H4' },
			{ key: 'h1, h2, h3', text: 'H1, H2, H3' },
			{ key: 'h1, h2', text: 'H1, H2' },
		];
	}

	private _toggleMarkedArea(canvasId: number, toggle: boolean): void {
		// get area
		const _canvasItem: HTMLElement | undefined = getCanvasNode({
			canvasId: canvasId,
		});
		if (_canvasItem) {
			if (toggle) {
				// mark
				_canvasItem.classList.add(styles.mark_area);
			} else {
				// unmark
				_canvasItem.classList.remove(styles.mark_area);
			}
		}
		// set flag
		this._isMarked = toggle;
	}
}
