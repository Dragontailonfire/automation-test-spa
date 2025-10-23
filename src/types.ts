export interface Item {
  id: string;
  text: string;
  value: number;
}

export interface ListProps {
  orientation: "vertical" | "horizontal";
  testId: string;
  // number of items to show in the viewport
  visibleRange?: number;
}

export interface DragDropProps {
  listA: Item[];
  listB: Item[];
  onListAChange: (items: Item[]) => void;
  onListBChange: (items: Item[]) => void;
}

export interface TabProps {
  dragListA: Item[];
  dragListB: Item[];
  onDragListAChange: (items: Item[]) => void;
  onDragListBChange: (items: Item[]) => void;
}

export interface IFrameProps {
  id: string;
  title: string;
  children: preact.ComponentChildren;
}

export interface ListConfig {
  total: number;
  visibleRange: number;
  prefix: string;
}

export interface Config {
  tabs: {
    showVertical: boolean;
    showHorizontal: boolean;
  };
  lists: {
    vertical: ListConfig;
    horizontal: ListConfig;
  };
}
