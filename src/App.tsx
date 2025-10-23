import { useState } from "preact/hooks";
import { TabContainer } from "./components/TabContainer";
import { ConfigPage } from "./components/ConfigPage";
import { Item } from "./types";
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

const initialDragLists: Record<string, Item[]> = {
  listA: Array.from({ length: 20 }, (_, i) => ({
    id: `Drag-A-${i}`,
    text: `Drag-A Item ${i}`,
    value: Math.floor(Math.random() * 1000),
  })),
  listB: Array.from({ length: 20 }, (_, i) => ({
    id: `Drag-B-${i}`,
    text: `Drag-B Item ${i}`,
    value: Math.floor(Math.random() * 1000),
  }))
};

inject();
injectSpeedInsights();

export function App() {
  const [dragListA, setDragListA] = useState<Item[]>(initialDragLists.listA);
  const [dragListB, setDragListB] = useState<Item[]>(initialDragLists.listB);

  return (
    <div class="app-container" role="application">
      <header class="app-header" data-testid="app-header">
        <h1 aria-label="Application Title">Automation Testing Challenge</h1>
      </header>

      <main class="main-content">
        {location.pathname === "/config" ? (
          <ConfigPage />
        ) : (
          <TabContainer
            dragListA={dragListA}
            dragListB={dragListB}
            onDragListAChange={setDragListA}
            onDragListBChange={setDragListB}
          />
        )}
      </main>

      <footer class="footer">
        <div>
          <div>
            <span>© 2025 NVK</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
