import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITableOfContentsProps {
  // web part specific properties
  showTitleDescription: boolean;
  title: string;
  description: string;
  canvasId: number;
  pinWebpartOnScroll: boolean;
  displayMode: DisplayMode;
  // standard SPO SPFx web part properties
  context: WebPartContext;
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
}
