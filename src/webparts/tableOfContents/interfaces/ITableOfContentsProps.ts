import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITableOfContentsProps {
  // web part specific properties
  title: string;
  description: string;
  canvasIds: number[];
  pinWebpartOnScroll: boolean;
  levels: string;
  collapsibleHeader: boolean;
  defaultCollapsed: boolean;
  displayMode: DisplayMode;
  // update method to update properties from web part directly
  updateProperty: (propery: keyof ITableOfContentsProps, value: unknown) => void;
  // standard SPO SPFx web part properties
  context: WebPartContext;
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
}
