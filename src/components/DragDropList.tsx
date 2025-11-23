import { useEffect, useRef } from "preact/hooks";
import Sortable from "sortablejs";
import { DragDropProps, Item } from "../types";

export function DragDropList({
  listA,
  listB,
  onListAChange,
  onListBChange,
}: DragDropProps) {
  const listARef = useRef<HTMLDivElement>(null);
  const listBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listARef.current || !listBRef.current) return;

    const createSortable = (
      element: HTMLElement,
      currentList: Item[],
      otherList: Item[],
      onCurrentChange: (items: Item[]) => void,
      onOtherChange: (items: Item[]) => void
    ) => {
      return Sortable.create(element, {
        group: "shared",
        animation: 150,
        dragClass: "dragging",
        ghostClass: "ghost",
        chosenClass: "chosen",
        dataIdAttr: "data-item-id",

        onEnd: (evt) => {
          if (evt.oldIndex === undefined || evt.newIndex === undefined) return;

          const newCurrentList = [...currentList];
          const newOtherList = [...otherList];

          // Moving within the same list
          if (evt.from === evt.to) {
            const [removed] = newCurrentList.splice(evt.oldIndex, 1);
            newCurrentList.splice(evt.newIndex, 0, removed);
            onCurrentChange(newCurrentList);
          } 
          // Moving to the other list
          else {
            const [removed] = newCurrentList.splice(evt.oldIndex, 1);
            newOtherList.splice(evt.newIndex, 0, removed);
            onCurrentChange(newCurrentList);
            onOtherChange(newOtherList);
          }
        },
      });
    };

    const sortableA = createSortable(
      listARef.current,
      listA,
      listB,
      onListAChange,
      onListBChange
    );

    const sortableB = createSortable(
      listBRef.current,
      listB,
      listA,
      onListBChange,
      onListAChange
    );

    return () => {
      sortableA.destroy();
      sortableB.destroy();
    };
  }, [listA, listB, onListAChange, onListBChange]);

  const renderDragItem = (item: Item, index: number, listType: "a" | "b") => {
    // CHALLENGE: These attributes are conditionally applied to test robust locators
    const hasTestId = index % 2 === 0;
    const hasIdAttribute = index % 3 === 0;

    return (
      <div
        key={item.id}
        class="drag-item"
        data-item-id={item.id}
        {...(hasTestId
          ? { "data-testid": `drag-item-${listType}-${index}` }
          : {})}
        {...(hasIdAttribute ? { id: `item-${index}` } : {})}
      >
        <span class="drag-handle" aria-hidden="true">
          ⋮⋮
        </span>
        <span class="item-text">{item.text}</span>
        <span class="item-value">{item.value}</span>
      </div>
    );
  };

  return (
    <div class="drag-drop-container">
      <div class="drag-list-wrapper">
        <h3 class="drag-list-header" id="list-a-header">
          Pending Orders
          <span aria-label="List A item count"> ({listA.length})</span>
        </h3>
        <div
          ref={listARef}
          class="drag-list"
          role="list"
          aria-labelledby="list-a-header"
          data-testid="drag-list-a"
          id="drag-list-a"
        >
          {listA.map((item, index) => renderDragItem(item, index, "a"))}
        </div>
      </div>

      <div class="drag-list-wrapper">
        <h3 class="drag-list-header" id="list-b-header">
          Processed Orders
          <span>
            <span> ({listB.length})</span>
          </span>
        </h3>
        <div
          ref={listBRef}
          class="drag-list"
          role="list"
          aria-labelledby="list-b-header"
          data-testid="drag-list-b"
          id="drag-list-b"
        >
          {listB.map((item, index) => renderDragItem(item, index, "b"))}
        </div>
      </div>
    </div>
  );
}
