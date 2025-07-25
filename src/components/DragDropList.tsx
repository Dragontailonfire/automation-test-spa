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

    const sortableA = Sortable.create(listARef.current, {
      group: "shared",
      animation: 150,
      dragClass: "dragging",
      ghostClass: "ghost",
      chosenClass: "chosen",
      dataIdAttr: "data-item-id",

      onEnd: (evt) => {
        if (evt.oldIndex === undefined || evt.newIndex === undefined) return;

        const newListA = [...listA];
        const newListB = [...listB];

        if (evt.from === evt.to && evt.from === listARef.current) {
          const [removed] = newListA.splice(evt.oldIndex, 1);
          newListA.splice(evt.newIndex, 0, removed);
          onListAChange(newListA);
        } else if (
          evt.from === listARef.current &&
          evt.to === listBRef.current
        ) {
          const [removed] = newListA.splice(evt.oldIndex, 1);
          newListB.splice(evt.newIndex, 0, removed);
          onListAChange(newListA);
          onListBChange(newListB);
        }
      },
    });

    const sortableB = Sortable.create(listBRef.current, {
      group: "shared",
      animation: 150,
      dragClass: "dragging",
      ghostClass: "ghost",
      chosenClass: "chosen",
      dataIdAttr: "data-item-id",

      onEnd: (evt) => {
        if (evt.oldIndex === undefined || evt.newIndex === undefined) return;

        const newListA = [...listA];
        const newListB = [...listB];

        if (evt.from === evt.to && evt.from === listBRef.current) {
          const [removed] = newListB.splice(evt.oldIndex, 1);
          newListB.splice(evt.newIndex, 0, removed);
          onListBChange(newListB);
        } else if (
          evt.from === listBRef.current &&
          evt.to === listARef.current
        ) {
          const [removed] = newListB.splice(evt.oldIndex, 1);
          newListA.splice(evt.newIndex, 0, removed);
          onListAChange(newListA);
          onListBChange(newListB);
        }
      },
    });

    return () => {
      sortableA.destroy();
      sortableB.destroy();
    };
  }, [listA, listB, onListAChange, onListBChange]);

  const renderDragItem = (item: Item, index: number, listType: "a" | "b") => {
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
          List A
          <span aria-label="List A item count"> ({listA.length} items)</span>
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
          List B
          <span>
            <span> ({listB.length} items)</span>
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
