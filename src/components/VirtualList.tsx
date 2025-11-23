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
  // react-list doesn't export types, so we use any to avoid compilation errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === "horizontal";

  // Memoize formatter to prevent recreation on every render
  const numberFormatter = useRef(new Intl.NumberFormat());

  const renderItem = useCallback(
    (index: number, key: string | number) => {
      const item = data[index];
      if (!item) return null;

      const hasGoodLocator = index % 3 !== 0;

      // Vertical list uses the new Table Layout
      if (!isHorizontal) {
        return (
          <div
            key={key}
            class="list-item table-row"
            data-testid={`${testId}-item-${index}`}
            data-item-index={index}
            {...(hasGoodLocator ? { "data-item-id": item.id } : {})}
          >
            <div class="table-cell col-customer">
              <span class="item-text">{item.customer || item.text}</span>
            </div>
            <div class="table-cell col-email">
              <span class="item-value">{item.email || "N/A"}</span>
            </div>
            <div class="table-cell col-status">
              {item.status ? (
                <span class={`status-badge status-${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              ) : (
                <span class="item-value">-</span>
              )}
            </div>
            <div class="table-cell col-amount">
              <span class="item-text">{item.amount || item.value}</span>
            </div>
          </div>
        );
      }

      // Horizontal list keeps the card layout
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
            <span class="item-value">{item.value}</span>
          </div>
        </div>
      );
    },
    [data, testId, isHorizontal]
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
          {isHorizontal ? "Product Gallery" : "Customer Orders"}
        </h3>
        <span class="item-count" aria-label="Total items">
          Total: {numberFormatter.current.format(data.length)} items
        </span>
      </div>

      {/* Header is now OUTSIDE the scroll container for proper sticky behavior */}
      {!isHorizontal && (
        <div class="virtual-table-header">
          <div class="header-cell">Customer</div>
          <div class="header-cell col-email">Email</div>
          <div class="header-cell col-status">Status</div>
          <div class="header-cell col-amount">Amount</div>
        </div>
      )}

      <div
        ref={containerRef}
        class={`${isHorizontal ? "horizontal-list" : "vertical-list"} virtual-scroll-container ${isHorizontal ? "horizontal" : "vertical"}`}
        data-testid={testId}
        role="list"
        aria-label={`${orientation} scrollable list`}
        onScroll={handleScroll}
      >
        <ReactList
          ref={listRef}
          axis={isHorizontal ? "x" : "y"}
          itemRenderer={renderItem}
          length={data.length}
          type="uniform"
          useStaticSize={true}
          minSize={isHorizontal ? 10 : 50} // Fixed row height for better performance
          pageSize={25} // Reduced page size as requested
          threshold={300} // Lower threshold to render fewer items
        />
      </div>

      <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        <span>Visible range: </span>
        <span id="range-start">{visibleRange.start}</span>
        <span> - </span>
        <span>{visibleRange.end}</span>
      </div>
    </div>
  );
}
