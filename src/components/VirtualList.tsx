import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import ReactList from "react-list";
import { ListProps } from "../types";
import { Loader } from "./Loader";

interface VisibleRange {
  start: number;
  end: number;
}

interface ApiResponse {
  items: any[];
  start: number;
  end: number;
  total: number;
  visibleRange: number;
}

export function VirtualList({ orientation, testId, visibleRange: configVisibleRange }: ListProps) {
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({ start: 0, end: 10 });
  const [totalCount, setTotalCount] = useState<number>(0);
  const listRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === "horizontal";
  const listType = isHorizontal ? "horizontal" : "vertical";

  // item cache when using API-backed lists: null means not loaded yet
  const [itemsCache, setItemsCache] = useState<(any | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetchId, setFetchId] = useState(0);

  const renderItem = useCallback(
    (index: number, key: string | number) => {
      const item = itemsCache[index];
      if (!item) {
        return (
          <div key={key} class="list-item placeholder" data-testid={`${testId}-item-${index}`} data-item-index={index}>
            <div class="item-content">
              <span class="item-text">Loading...</span>
            </div>
          </div>
        );
      }

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
    [itemsCache, testId]
  );

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const indices = listRef.current.getVisibleRange();
      if (indices) {
        setVisibleRange({ start: indices[0], end: indices[1] });
        // trigger fetch for the visible range
        setFetchId((id) => id + 1);
      }
    }
  }, []);

  // fetch items from API when visibleRange changes
  useEffect(() => {
    let mounted = true;
    const currentFetch = fetchId;

    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || '';
    const itemsUrl = `${apiUrl}/api/${listType}?start=${visibleRange.start}&end=${visibleRange.end}&visibleRange=${configVisibleRange}`;

    fetch(itemsUrl)
      .then((r) => r.json())
      .then((json: ApiResponse) => {
        if (!mounted) return;
        if (currentFetch !== fetchId) return;
        
        const { items, start: s, total } = json;
        setTotalCount(total);
        setItemsCache((prev) => {
          // Initialize or resize array if needed
          if (prev.length !== total) {
            prev = Array.from({ length: total }, () => null);
          }
          
          const next = prev.slice();
          for (let i = 0; i < items.length; i++) {
            next[s + i] = items[i];
          }
          return next;
        });
      })
      .catch((error) => {
        console.error('Failed to fetch items:', error);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [visibleRange, fetchId, configVisibleRange, listType]);

  return (
    <div class="list-container">
      <div class="list-header">
        <h3 class="list-title">
          {isHorizontal ? "Horizontal" : "Vertical"} List
        </h3>
        <span class="item-count" aria-label="Total items">
          Total: {totalCount} items
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
        {loading && <Loader />}
        <ReactList
          ref={listRef}
          axis={isHorizontal ? "x" : "y"}
          itemRenderer={renderItem}
          length={totalCount}
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
