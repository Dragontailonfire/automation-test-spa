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

  const updateConfig = (newConfig: Config) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_LOCAL_KEY, JSON.stringify(newConfig));
    // Trigger a refresh for components listening to storage events
    window.dispatchEvent(new Event('storage'));
  };

  const updateVisibility = (listType: 'vertical' | 'horizontal', visible: boolean) => {
    if (!config) return;
    const newConfig = {
      ...config,
      tabs: {
        ...config.tabs,
        [listType === 'vertical' ? 'showVertical' : 'showHorizontal']: visible
      }
    };
    updateConfig(newConfig);
  };

  const updateRange = (listType: 'vertical' | 'horizontal', range: number) => {
    if (!config) return;
    const newConfig = {
      ...config,
      lists: {
        ...config.lists,
        [listType]: {
          ...config.lists[listType],
          visibleRange: range
        }
      }
    };
    updateConfig(newConfig);
  };

  if (!config) {
    return <div class="error-message">Failed to load configuration</div>;
  }

  return (
    <div class="config-page">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          onClick={() => {
            try {
              if (history && history.length > 1) history.back();
              else window.location.href = "/";
            } catch {
              window.location.href = "/";
            }
          }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0 }}>List Configuration</h2>
      </div>
      
      <section class="config-section">
        <h3>Tab Visibility</h3>
        <div class="config-group">
          <label>
            <input
              type="checkbox"
              checked={config.tabs.showVertical}
              onChange={(e) => updateVisibility('vertical', (e.target as HTMLInputElement).checked)}
            />
            Show Vertical List
          </label>
          <label>
            <input
              type="checkbox"
              checked={config.tabs.showHorizontal}
              onChange={(e) => updateVisibility('horizontal', (e.target as HTMLInputElement).checked)}
            />
            Show Horizontal List
          </label>
        </div>
      </section>

      <section class="config-section">
        <h3>List Settings</h3>
        <div class="config-group">
          <div class="range-input">
            <label>
              Vertical List Visible Range
              <input
                type="number"
                min="1"
                max={config.lists.vertical.total}
                value={config.lists.vertical.visibleRange}
                onChange={(e) => updateRange('vertical', parseInt((e.target as HTMLInputElement).value) || 1)}
              />
            </label>
            <span class="help-text">Total items: {config.lists.vertical.total}</span>
          </div>
          <div class="range-input">
            <label>
              Horizontal List Visible Range
              <input
                type="number"
                min="1"
                max={config.lists.horizontal.total}
                value={config.lists.horizontal.visibleRange}
                onChange={(e) => updateRange('horizontal', parseInt((e.target as HTMLInputElement).value) || 1)}
              />
            </label>
            <span class="help-text">Total items: {config.lists.horizontal.total}</span>
          </div>
        </div>
      </section>

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
          width: 100px;
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