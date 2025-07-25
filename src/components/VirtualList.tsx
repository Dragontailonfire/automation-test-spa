import { useState, useRef, useCallback } from "preact/hooks";
import ReactList from "react-list";
import { ListProps } from "../types";

interface VisibleRange {
  start: number;
  end: number;
}

export function VirtualList({ data, orientation, testId }: ListProps) {
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    start: 0,
    end: 10,
  });
  const listRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === "horizontal";

  const renderItem = useCallback(
    (index: number, key: string | number) => {
      const item = data[index];
      if (!item) return null;

      const hasGoodLocator = index % 3 !== 0;

      return (
        <div
          key={key}
          class="list-item"
          data-testid={`${testId}-item-${index}`}
          data-item-index={index}
          {...(hasGoodLocator ? { "data-item-id": item.id } : {})}
        >
          <div class="item-content">
            <span class="item-text">{item.text}</span>
            <span class="item-value">Value: {item.value}</span>
          </div>
        </div>
      );
    },
    [data, testId]
  );

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const indices = listRef.current.getVisibleRange();
      if (indices) {
        setVisibleRange({ start: indices[0], end: indices[1] });
      }
    }
  }, []);

  return (
    <div class="list-container">
      <div class="list-header">
        <h3 class="list-title">
          {isHorizontal ? "Horizontal" : "Vertical"} List
        </h3>
        <span class="item-count" aria-label="Total items">
          Total: {data.length} items
        </span>
      </div>

      <div
        ref={containerRef}
        class={isHorizontal ? "horizontal-list" : "vertical-list"}
        data-testid={testId}
        role="list"
        aria-label={`${orientation} scrollable list`}
        onScroll={handleScroll}
        style={{
          height: isHorizontal ? "140px" : "400px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <ReactList
          ref={listRef}
          axis={isHorizontal ? "x" : "y"}
          itemRenderer={renderItem}
          length={data.length}
          type="uniform"
          useStaticSize={true}
          minSize={10}
          pageSize={10}
        />
      </div>

      <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#666" }}>
        <span>Visible range: </span>
        <span id="range-start">{visibleRange.start}</span>
        <span> - </span>
        <span>{visibleRange.end}</span>
      </div>
    </div>
  );
}
