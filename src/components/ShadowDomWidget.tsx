import { useEffect, useRef } from "preact/hooks";

export function ShadowDomWidget() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    // Check if shadow root already exists to prevent error
    if (!hostRef.current.shadowRoot) {
      const shadow = hostRef.current.attachShadow({ mode: "open" });

      const container = document.createElement("div");
      container.innerHTML = `
        <style>
          .shadow-content {
            padding: 20px;
            background: #1e293b; /* Fallback */
            background: var(--bg-card, #1e293b);
            color: #f8fafc; /* Fallback */
            color: var(--text-main, #f8fafc);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1); /* Fallback */
            border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.1));
            font-family: 'Outfit', sans-serif;
          }
          h3 { margin-top: 0; color: #818cf8; color: var(--primary-light, #818cf8); }
          p { line-height: 1.6; }
          button {
            background: #6366f1; /* Fallback */
            background: var(--primary, #6366f1);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
          }
          button:hover { 
            background: #4f46e5; /* Fallback */
            background: var(--primary-dark, #4f46e5); 
          }
        </style>
        <div class="shadow-content">
          <h3>System Status Widget</h3>
          <p><strong>Status:</strong> Operational</p>
          <p><strong>Uptime:</strong> 99.98%</p>
          <button id="shadow-btn" onclick="alert('System diagnostics running...')">Run Diagnostics</button>
        </div>
      `;
      shadow.appendChild(container);
    }
  }, []);

  return (
    <div className="shadow-widget-container">
      <h2>System Status</h2>
      <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
        Monitor real-time system performance metrics.
      </p>
      <div ref={hostRef} className="shadow-host" data-testid="shadow-host"></div>
    </div>
  );
}
