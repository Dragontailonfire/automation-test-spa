import { useEffect, useState } from "preact/hooks";
import { TabProps } from "../types";
import { VirtualList } from "./VirtualList";
import { DragDropList } from "./DragDropList";
import { IFrameWrapper } from "./IFrameWrapper";
import { IFrameHeader1, IFrameHeader2 } from "./IFrameContent";

interface Tab {
  id: string;
  label: string;
  ariaLabel: string;
}

export function TabContainer({
  dragListA,
  dragListB,
  onDragListAChange,
  onDragListBChange,
}: TabProps) {
  const [activeTab, setActiveTab] = useState<string>("iframe1");

  // Read configuration from localStorage or environment defaults
  const [config, setConfig] = useState<any>(() => {
    const CONFIG_LOCAL_KEY = 'app_config';
    // default values (match ConfigPage defaults)
    const defaults = {
      tabs: {
        showVertical: true,
        showHorizontal: true
      },
      lists: {
        vertical: {
          total: import.meta.env.VITE_VERTICAL_LIST_TOTAL ? parseInt(import.meta.env.VITE_VERTICAL_LIST_TOTAL) : 10000,
          visibleRange: import.meta.env.VITE_VERTICAL_LIST_RANGE ? parseInt(import.meta.env.VITE_VERTICAL_LIST_RANGE) : 50
        },
        horizontal: {
          total: import.meta.env.VITE_HORIZONTAL_LIST_TOTAL ? parseInt(import.meta.env.VITE_HORIZONTAL_LIST_TOTAL) : 100,
          visibleRange: import.meta.env.VITE_HORIZONTAL_LIST_RANGE ? parseInt(import.meta.env.VITE_HORIZONTAL_LIST_RANGE) : 20
        }
      }
    };

    try {
      const stored = localStorage.getItem(CONFIG_LOCAL_KEY);
      return stored ? JSON.parse(stored) : defaults;
    } catch {
      return defaults;
    }
  });

  // Listen for storage changes so the app reacts when ConfigPage saves
  useEffect(() => {
    const onStorage = () => {
      try {
        const stored = localStorage.getItem('app_config');
        if (stored) setConfig(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Ensure activeTab is always one of the visible tabs; switch if it's hidden
  useEffect(() => {
    const visible = [] as string[];
    if (config?.tabs?.showVertical) visible.push('iframe1');
    if (config?.tabs?.showHorizontal) visible.push('iframe2');

    if (visible.length === 0) {
      // no tabs visible; keep activeTab but render a helpful message
      return;
    }

    if (!visible.includes(activeTab)) {
      setActiveTab(visible[0]);
    }
  }, [config, activeTab]);

  const tabs: Tab[] = [
    {
      id: "iframe1",
      label: "Lists & Scroll",
      ariaLabel: "Virtual lists and scrolling tab",
    },
    {
      id: "iframe2",
      label: "Drag & Drop",
      ariaLabel: "Drag and drop interface tab",
    },
  ];

  const tabContent = {
    iframe1: (
      <IFrameWrapper id="test-iframe-1" title="Test iFrame 1">
        <>
          <style>{`
            .list-container { margin-bottom: 2rem; }
            .list-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
            .vertical-list { height: 400px; border: 2px solid #e0e0e0; overflow: auto; background: #fafafa; }
            .horizontal-list { height: 120px; border: 2px solid #e0e0e0; overflow-x: auto; overflow-y: hidden; background: #fafafa; white-space: nowrap; }
            .list-item { padding: 1rem; border-bottom: 1px solid #e0e0e0; transition: background 0.2s; cursor: pointer; }
            .list-item:hover { background: #e8f4f8; }
            .horizontal-list .list-item { display: inline-block; width: 200px; vertical-align: top; white-space: normal; }
            .item-content { display: flex; justify-content: space-between; align-items: center; }
            .item-text { font-weight: 500; color: #333; }
            .item-value { color: #666; font-size: 0.9rem; }
            .load-more-button { display: block; margin: 2rem auto; padding: 0.75rem 2rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
            .load-more-button:hover { background: #2980b9; }
          `}</style>
          <IFrameHeader1 />
          {config?.tabs?.showVertical && (
            <VirtualList
              orientation="vertical"
              testId="vertical-scroll-list"
              visibleRange={config?.lists?.vertical?.visibleRange}
            />
          )}
          {config?.tabs?.showHorizontal && (
            <VirtualList
              orientation="horizontal"
              testId="horizontal-scroll-list"
              visibleRange={config?.lists?.horizontal?.visibleRange}
            />
          )}
        </>
      </IFrameWrapper>
    ),
    iframe2: (
      <IFrameWrapper id="test-iframe-2" title="Test iFrame 2">
        <>
          <style>{`
            .drag-drop-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
            .drag-list { border: 2px dashed #3498db; border-radius: 8px; padding: 1rem; min-height: 300px; background: #f8f9fa; }
            .drag-list-header { text-align: center; font-weight: 600; color: #2c3e50; margin-bottom: 1rem; font-size: 1.1rem; }
            .drag-item { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem; cursor: move; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
            .drag-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); transform: translateY(-2px); }
            .drag-item.dragging { opacity: 0.5; transform: rotate(5deg); }
            .drag-handle { color: #999; margin-right: 0.5rem; }
            .nested-div { margin-top: 2rem; }
          `}</style>
          <IFrameHeader2 />
          <DragDropList
            listA={dragListA}
            listB={dragListB}
            onListAChange={onDragListAChange}
            onListBChange={onDragListBChange}
          />
        </>
      </IFrameWrapper>
    ),
  };

  return (
    <div class="tab-container">
      <nav class="tab-navigation" role="tablist" aria-label="Main navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            aria-label={tab.ariaLabel}
            class={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            data-tab-id={tab.id}
          >
            {tab.label}
          </button>
        ))}
        {/* Config link removed; now a modal in App */}
      </nav>

      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        class="tab-content"
        aria-labelledby={activeTab}
      >
        {tabContent[activeTab as keyof typeof tabContent]}
      </div>
    </div>
  );
}
