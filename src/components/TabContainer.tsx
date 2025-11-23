import { useState } from "preact/hooks";
import { TabProps } from "../types";
import { VirtualList } from "./VirtualList";
import { DragDropList } from "./DragDropList";
import { IFrameWrapper } from "./IFrameWrapper";
import { ShadowDomWidget } from "./ShadowDomWidget";
import { DelayedLoader } from "./DelayedLoader";
import { DynamicForm } from "./DynamicForm";

interface Tab {
  id: string;
  label: string;
  ariaLabel: string;
}

export function TabContainer({
  verticalData,
  horizontalData,
  dragListA,
  dragListB,
  onDragListAChange,
  onDragListBChange,
}: TabProps) {
  const [activeTab, setActiveTab] = useState<string>("iframe1");

  const tabs: Tab[] = [
    {
      id: "iframe1",
      label: "Orders",
      ariaLabel: "Customer orders tab",
    },
    {
      id: "iframe2",
      label: "Workflow",
      ariaLabel: "Order workflow tab",
    },
    {
      id: "shadow",
      label: "System Status",
      ariaLabel: "System status tab",
    },
    {
      id: "delayed",
      label: "Analytics",
      ariaLabel: "Analytics dashboard tab",
    },
    {
      id: "dynamic",
      label: "Support Ticket",
      ariaLabel: "Support ticket tab",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "iframe1":
        return (
          <IFrameWrapper id="test-iframe-1" title="Test iFrame 1">
            <>
              <VirtualList
                data={verticalData}
                orientation="vertical"
                testId="vertical-scroll-list"
              />
              <VirtualList
                data={horizontalData}
                orientation="horizontal"
                testId="horizontal-scroll-list"
              />
            </>
          </IFrameWrapper>
        );
      case "iframe2":
        return (
          <IFrameWrapper id="test-iframe-2" title="Test iFrame 2">
            <>
              <DragDropList
                listA={dragListA}
                listB={dragListB}
                onListAChange={onDragListAChange}
                onListBChange={onDragListBChange}
              />
            </>
          </IFrameWrapper>
        );
      case "shadow":
        return <ShadowDomWidget />;
      case "delayed":
        return <DelayedLoader />;
      case "dynamic":
        return <DynamicForm />;
      default:
        return null;
    }
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
      </nav>

      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        class="tab-content"
        aria-labelledby={activeTab}
      >
        {renderContent()}
      </div>
    </div>
  );
}
