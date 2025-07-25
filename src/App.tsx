import { useState, useEffect } from "preact/hooks";
import { TabContainer } from "./components/TabContainer";
import { Item } from "./types";

const generateData = (count: number, prefix: string): Item[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    text: `${prefix} Item ${i}`,
    value: Math.floor(Math.random() * 1000),
  }));
};

export function App() {
  const [verticalData, setVerticalData] = useState<Item[]>([]);
  const [horizontalData, setHorizontalData] = useState<Item[]>([]);
  const [dragListA, setDragListA] = useState<Item[]>([]);
  const [dragListB, setDragListB] = useState<Item[]>([]);

  useEffect(() => {
    setVerticalData(generateData(10000, "Vertical"));
    setHorizontalData(generateData(10000, "Horizontal"));
    setDragListA(generateData(20, "Drag-A"));
    setDragListB(generateData(20, "Drag-B"));
  }, []);

  return (
    <div class="app-container" role="application">
      <header class="app-header" data-testid="app-header">
        <h1 aria-label="Application Title">Automation Testing Challenge</h1>
      </header>

      <main class="main-content">
        <TabContainer
          verticalData={verticalData}
          horizontalData={horizontalData}
          dragListA={dragListA}
          dragListB={dragListB}
          onDragListAChange={setDragListA}
          onDragListBChange={setDragListB}
        />
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
