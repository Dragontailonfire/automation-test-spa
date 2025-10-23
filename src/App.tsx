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

  const [showConfig, setShowConfig] = useState(false);
  return (
    <div class="app-container" role="application">
      <header class="app-header" data-testid="app-header">
        <h1 aria-label="Application Title">Automation Testing Challenge</h1>
        <button
          style={{ float: 'right', margin: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
          onClick={() => setShowConfig(true)}
          aria-label="Open configuration"
        >
          ⚙️ Config
        </button>
      </header>

      <main class="main-content">
        <TabContainer
          dragListA={dragListA}
          dragListB={dragListB}
          onDragListAChange={setDragListA}
          onDragListBChange={setDragListB}
        />
      </main>

      {showConfig && (
        <div class="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 2px 16px #0002', minWidth: 320, maxWidth: 600, padding: 24, position: 'relative' }}>
            <button
              style={{ position: 'absolute', top: 8, right: 8, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Close configuration"
              onClick={() => setShowConfig(false)}
            >
              ×
            </button>
            <ConfigPage />
          </div>
        </div>
      )}

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
