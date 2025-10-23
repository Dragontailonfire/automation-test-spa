import { useState } from "preact/hooks";
import { Config } from "../types";

const CONFIG_LOCAL_KEY = "app_config";

// Default configuration from environment variables with fallbacks
const defaultConfig: Config = {
  tabs: {
    showVertical: true,
    showHorizontal: true
  },
  lists: {
    vertical: {
      total: import.meta.env.VITE_VERTICAL_LIST_TOTAL ? parseInt(import.meta.env.VITE_VERTICAL_LIST_TOTAL) : 10000,
      visibleRange: import.meta.env.VITE_VERTICAL_LIST_RANGE ? parseInt(import.meta.env.VITE_VERTICAL_LIST_RANGE) : 50,
      prefix: import.meta.env.VITE_VERTICAL_LIST_PREFIX || 'Vertical'
    },
    horizontal: {
      total: import.meta.env.VITE_HORIZONTAL_LIST_TOTAL ? parseInt(import.meta.env.VITE_HORIZONTAL_LIST_TOTAL) : 100,
      visibleRange: import.meta.env.VITE_HORIZONTAL_LIST_RANGE ? parseInt(import.meta.env.VITE_HORIZONTAL_LIST_RANGE) : 20,
      prefix: import.meta.env.VITE_HORIZONTAL_LIST_PREFIX || 'Horizontal'
    }
  }
};

export function ConfigPage() {
  const [config, setConfig] = useState<Config>(() => {
    // Try to get config from localStorage, fall back to default
    try {
      const stored = localStorage.getItem(CONFIG_LOCAL_KEY);
      return stored ? JSON.parse(stored) : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  const [pendingConfig, setPendingConfig] = useState<Config>(config);
  const [saved, setSaved] = useState(false);

  const saveConfig = () => {
    setConfig(pendingConfig);
    localStorage.setItem(CONFIG_LOCAL_KEY, JSON.stringify(pendingConfig));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
    window.dispatchEvent(new Event('storage'));
  };

  const updateVisibility = (listType: 'vertical' | 'horizontal', visible: boolean) => {
    setPendingConfig((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [listType === 'vertical' ? 'showVertical' : 'showHorizontal']: visible
      }
    }));
  };

  const updateRange = (listType: 'vertical' | 'horizontal', range: number) => {
    setPendingConfig((prev) => ({
      ...prev,
      lists: {
        ...prev.lists,
        [listType]: {
          ...prev.lists[listType],
          visibleRange: range
        }
      }
    }));
  };

  const updateTotal = (listType: 'vertical' | 'horizontal', total: number) => {
    setPendingConfig((prev) => ({
      ...prev,
      lists: {
        ...prev.lists,
        [listType]: {
          ...prev.lists[listType],
          total
        }
      }
    }));
  };

  if (!pendingConfig) {
    return <div class="error-message">Failed to load configuration</div>;
  }

  return (
    <div class="config-page">
      <h2 style={{ margin: 0, marginBottom: '1rem' }}>List Configuration</h2>
      <section class="config-section">
        <h3>Tab Visibility</h3>
        <div class="config-group">
          <label>
            <input
              type="checkbox"
              checked={pendingConfig.tabs.showVertical}
              onChange={(e) => updateVisibility('vertical', (e.target as HTMLInputElement).checked)}
            />
            Show List & Scroll Tab
          </label>
          <label>
            <input
              type="checkbox"
              checked={pendingConfig.tabs.showHorizontal}
              onChange={(e) => updateVisibility('horizontal', (e.target as HTMLInputElement).checked)}
            />
            Show Drag & Drop Tab
          </label>
        </div>
      </section>

      <section class="config-section">
        <h3>List Settings</h3>
        <div class="config-group">
          <div class="range-input">
            <label>
              Vertical List Total Items
              <input
                type="number"
                min="1"
                value={pendingConfig.lists.vertical.total}
                onChange={(e) => updateTotal('vertical', parseInt((e.target as HTMLInputElement).value) || 1)}
              />
            </label>
            <label>
              Vertical List Visible Range
              <input
                type="number"
                min="1"
                max={pendingConfig.lists.vertical.total}
                value={pendingConfig.lists.vertical.visibleRange}
                onChange={(e) => updateRange('vertical', parseInt((e.target as HTMLInputElement).value) || 1)}
              />
            </label>
          </div>
          <div class="range-input">
            <label>
              Horizontal List Total Items
              <input
                type="number"
                min="1"
                value={pendingConfig.lists.horizontal.total}
                onChange={(e) => updateTotal('horizontal', parseInt((e.target as HTMLInputElement).value) || 1)}
              />
            </label>
            <label>
              Horizontal List Visible Range
              <input
                type="number"
                min="1"
                max={pendingConfig.lists.horizontal.total}
                value={pendingConfig.lists.horizontal.visibleRange}
                onChange={(e) => updateRange('horizontal', parseInt((e.target as HTMLInputElement).value) || 1)}
              />
            </label>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={saveConfig} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Save
        </button>
        {saved && <span style={{ color: 'green', marginLeft: 8 }}>Saved!</span>}
      </div>

      <style>{`
        .config-page {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .config-section {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .config-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .range-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .help-text {
          font-size: 0.9rem;
          color: #666;
        }
        label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        input[type="number"] {
          width: 120px;
          padding: 0.25rem;
        }
        .error-message {
          color: #dc3545;
          padding: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}