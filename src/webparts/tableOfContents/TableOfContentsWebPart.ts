import * as React from 'react';
import * as ReactDom from 'react-dom';

import { CANVAS_ID } from './constants/constants';

import { ITableOfContentsProps } from './interfaces/ITableOfContentsProps';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import {
	IPropertyPaneChoiceGroupOption,
	type IPropertyPaneConfiguration,
	IPropertyPaneDropdownOption,
	PropertyPaneButton,
	PropertyPaneChoiceGroup,
	PropertyPaneHorizontalRule,
	PropertyPaneLabel,
	PropertyPaneToggle,
} from '@microsoft/sp-property-pane';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
// import {
// 	IPropertyFieldSwatchColorOption,
// 	PropertyFieldSwatchColorPicker,
// 	PropertyFieldSwatchColorPickerStyle,
// } from '@pnp/spfx-property-controls/lib/PropertyFieldSwatchColorPicker';

import TableOfContents from './components/TableOfContents';

import { getCanvasNode } from './components/toc/fnGetCanvasNodeText';

import styles from './components/TableOfContents.module.scss';

export default class TableOfContentsWebPart extends BaseClientSideWebPart<ITableOfContentsProps> {
	private _isDarkTheme: boolean = false;
	private _isMarked: boolean = false; // used as flag for marking areas when clicking buttons
	private _sectionAreas: number[] = []; // used for referencing when marking/unmarking areas

	public render(): void {
		const element: React.ReactElement<ITableOfContentsProps> = React.createElement(
			TableOfContents,
			{
				title: this.properties.title,
				description: this.properties.description,
				canvasIds: this.properties.canvasIds,
				pinWebpartOnScroll: this.properties.pinWebpartOnScroll,
				levels: this.properties.levels,
				collapsibleHeader: this.properties.collapsibleHeader,
				defaultCollapsed: this.properties.defaultCollapsed,
				bgColor: this.properties.bgColor,
				displayMode: this.displayMode,
				// method to update property
				updateProperty: (property: keyof ITableOfContentsProps, value: unknown) => {
					switch (property) {
						case 'title':
							this.properties.title = value as string;
							break;
						case 'description':
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
							groupName: 'Content Area(s) and Levels',
							groupFields: [
								PropertyPaneLabel('', {
									text: 'You can change the title and description directly in the web part on the page.',
								}),
								PropertyPaneHorizontalRule(),
								PropertyFieldMultiSelect('canvasIds', {
									key: 'canvasIds',
									label: 'Choose content area(s)',
									options: this.getCanvasSections(),
									selectedKeys: this.properties.canvasIds,
								}),
								PropertyPaneButton('', {
									text: this._isMarked
										? 'Hide selected area'
										: 'Show selected area',
									disabled: this.properties.canvasIds === undefined,
									icon: this._isMarked ? 'Hide3' : 'View',
									onClick: () => {
										// toggle marked area
										this._toggleMarkedArea(
											this.properties.canvasIds,
											!this._isMarked
										);
									},
								}),
								PropertyPaneHorizontalRule(),
								PropertyPaneChoiceGroup('levels', {
									label: 'Levels to show',
									options: this.getLevels(),
								}),
								PropertyPaneHorizontalRule(),
								PropertyPaneToggle('pinWebpartOnScroll', {
									label: 'Pin web part on scroll',
									onText: 'Yes',
									offText: 'No',
								}),
								PropertyPaneToggle('collapsibleHeader', {
									label: 'Expand/Collapse header',
									onText: 'Yes',
									offText: 'No',
								}),
								PropertyPaneToggle('defaultCollapsed', {
									label: 'By default, collapse header',
									onText: 'Yes',
									offText: 'No',
									disabled: this.properties.collapsibleHeader === false,
								}),
								// PropertyFieldSwatchColorPicker('bgColor', {
								// 	key: 'colorFieldId',
								// 	label: 'Choose alternate background color',
								// 	selectedColor: this.properties.bgColor,
								// 	colors: this.getAlternateBGColors(),
								// 	onPropertyChange: this.onPropertyPaneFieldChanged,
								// 	properties: this.properties,
								// 	showAsCircles: false,
								// 	style: PropertyFieldSwatchColorPickerStyle.Full,
								// }),
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
		let _orderedAreas: number[] = [];
		switch (propertyPath) {
			case 'canvasId':
				// switch off old area
				this._toggleMarkedArea(oldValue as number, false);
				// switch on new area
				this._toggleMarkedArea(newValue as number, true);
				break;
			case 'canvasIds':
				// make sure the selected areas are in order of appearance > sort the array
				_orderedAreas = [...(newValue as number[])];
				_orderedAreas.sort((a, b) => a - b);
				// set property
				this.properties.canvasIds = _orderedAreas;
				// check if areas are marked
				if (this._isMarked) {
					this._toggleMarkedArea(this.properties.canvasIds, this._isMarked);
				}
				break;
			default:
			// do nothing > future use...
		}
	}

	// private methods

	private getCanvasSections(): IPropertyPaneDropdownOption[] {
		const _results: IPropertyPaneDropdownOption[] = [];
		const _elms = document.querySelectorAll(CANVAS_ID);

		if (_elms && _elms.length > 0) {
			// return canvas section areas as property pane choice groups
			_elms.forEach((_elm, _index: number) => {
				if (_elm) {
					_results.push({
						key: _index,
						text: `Section ${_index + 1}`,
					});
					this._sectionAreas.push(_index);
				}
			});
		}
		// return areas
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

	// private getAlternateBGColors(): IPropertyFieldSwatchColorOption[] {
	// 	const _results: IPropertyFieldSwatchColorOption[] = [];

	// 	// get element where fluid UI defines all colors
	// 	const _fluidElm: HTMLElement | null = document.querySelector(COLOR_DEFINITION_ELM);
	// 	if (_fluidElm) {
	// 		// iterate through each color and set result
	// 		COLOR_VAR_LIST.forEach(_color => {
	// 			// get the css color value
	// 			const _colorVal: string = getComputedStyle(_fluidElm).getPropertyValue(_color);
	// 			// add result to color array
	// 			_results.push({
	// 				color: _colorVal,
	// 			});
	// 		});
	// 	}
	// 	return _results;
	// }

	private _toggleMarkedArea(canvasId: number | number[], toggle: boolean): void {
		// initialize
		let _areasNrs: number[] = [];
		// check parameter: number or number[]
		if (typeof canvasId === 'object') {
			_areasNrs = canvasId;
		} else {
			_areasNrs = [canvasId];
		}
		// iterate through all areas and toggle the marking
		this._sectionAreas.forEach((_areasNr: number) => {
			// get area
			const _canvasItem: HTMLElement | undefined = getCanvasNode({
				canvasId: _areasNr,
			});
			if (_canvasItem) {
				const _toggleOn: boolean = toggle ? _areasNrs.indexOf(_areasNr) > -1 : false;
				if (_toggleOn) {
					// mark
					_canvasItem.classList.add(styles.mark_area);
				} else {
					// unmark
					_canvasItem.classList.remove(styles.mark_area);
				}
			}
		});
		// set flag
		this._isMarked = toggle;
	}
}
