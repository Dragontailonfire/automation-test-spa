import { useState, useRef, useCallback, useEffect } from "preact/hooks";
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
  const [loading, setLoading] = useState(false);
  const refreshIdRef = useRef(0);

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
        // increment refresh id to trigger simulated API load for this "page"/range
        refreshIdRef.current += 1;
      }
    }
  }, []);

  // whenever refreshIdRef changes, simulate a random 2-5s delay
  useEffect(() => {
    let mounted = true;
    const currentId = refreshIdRef.current;

    // start loader
    setLoading(true);

    // random delay between 2000 and 5000 ms
    const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

    const timer = setTimeout(() => {
      if (!mounted) return;
      // only stop loader if this effect corresponds to the latest refresh id
      if (currentId === refreshIdRef.current) {
        setLoading(false);
      }
    }, delay);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
    // We intentionally only depend on refreshIdRef.current by reading its value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* intentionally empty - effect triggered via refreshIdRef mutation above */]);

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
        {loading && (
          <div
            class="loading-overlay"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.7)",
              zIndex: 5,
            }}
            aria-hidden={!loading}
          >
            <div>
              <div class="spinner" aria-hidden="true"></div>
              <div style={{ marginTop: "0.5rem", color: "#666" }}>Loading...</div>
            </div>
          </div>
        )}
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
