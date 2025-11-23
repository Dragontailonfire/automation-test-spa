export interface Item {
  id: string;
  text: string;
  value: number;
  // Realistic Data Fields
  customer?: string;
  email?: string;
  status?: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  amount?: string;
}

export interface ListProps {
  data: Item[];
  orientation: "vertical" | "horizontal";
  testId: string;
}

export interface DragDropProps {
  listA: Item[];
  listB: Item[];
  onListAChange: (items: Item[]) => void;
  onListBChange: (items: Item[]) => void;
}

export interface TabProps {
  verticalData: Item[];
  horizontalData: Item[];
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
