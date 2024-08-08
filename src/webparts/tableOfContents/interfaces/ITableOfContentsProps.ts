import { BaseComponentContext } from "@microsoft/sp-component-base";
import { DisplayMode } from "@microsoft/sp-core-library";

export interface ITableOfContentsProps {
  // web part specific properties
  showTitleDescription: boolean;
  title: string;
  description: string;
  canvasId: number;
  pinWebpartOnScroll: boolean;
  showButtonBackToTop: boolean;
  displayMode: DisplayMode;
  // standard SPO SPFx web part properties
  context: BaseComponentContext;
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
}
