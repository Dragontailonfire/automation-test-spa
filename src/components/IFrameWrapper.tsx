import { useEffect, useRef } from "preact/hooks";
import { IFrameProps } from "../types";

export function IFrameWrapper({ id, title, children }: IFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            :root {
              --primary: #6366f1;
              --primary-dark: #4f46e5;
              --primary-light: #818cf8;
              --secondary: #ec4899;
              --text-main: #f8fafc;
              --text-muted: #94a3b8;
              --bg-body: #0f172a;
              --bg-card: rgba(30, 41, 59, 0.7);
              --border-glass: rgba(255, 255, 255, 0.1);
              --radius-lg: 16px;
              --radius-md: 8px;
              --radius-sm: 4px;
            }
            * { box-sizing: border-box; }
            body { 
              font-family: 'Outfit', sans-serif; 
              padding: 20px; 
              margin: 0;
              background: var(--bg-body);
              color: var(--text-main);
              display: flex;
              flex-direction: column;
              min-height: 100vh;
              background-image: 
                radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
              background-attachment: fixed;
            }
            /* Scrollbar styling */
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

            /* Lists & Scroll Styles */
            .list-container { margin-bottom: 2rem; flex: 1; display: flex; flex-direction: column; }
            .list-header { display: flex; justify-content: space-between; margin-bottom: 1rem; align-items: center; }
            .list-title { font-size: 1.25rem; font-weight: 600; color: var(--text-main); margin: 0; }
            .item-count { color: var(--text-muted); font-size: 0.9rem; }

            .vertical-list { 
              height: 400px; 
              border: 1px solid var(--border-glass); 
              border-top: none;
              border-radius: 0 0 var(--radius-lg) var(--radius-lg);
              overflow: auto; 
              background: rgba(0, 0, 0, 0.2); 
            }

            .horizontal-list { 
              height: 140px; 
              border: 1px solid var(--border-glass); 
              border-radius: var(--radius-lg);
              overflow-x: auto; 
              overflow-y: hidden; 
              background: rgba(0, 0, 0, 0.2); 
              white-space: nowrap; 
              padding: 1rem 0;
            }

            .virtual-scroll-container { overflow: auto; position: relative; }
            .virtual-scroll-container.vertical { height: 400px; }
            .virtual-scroll-container.horizontal { height: 140px; }

            .list-item { 
              padding: 1rem; 
              border-bottom: 1px solid var(--border-glass); 
              transition: background 0.2s; 
              cursor: pointer; 
              color: var(--text-main);
            }
            .list-item:hover { background: rgba(255, 255, 255, 0.05); }

            .horizontal-list .list-item { 
              display: inline-block; 
              width: 200px; 
              vertical-align: top; 
              white-space: normal; 
              margin: 0 0.5rem;
              border: 1px solid var(--border-glass);
              border-radius: var(--radius-md);
              background: rgba(255, 255, 255, 0.02);
            }

            .item-content { display: flex; justify-content: space-between; align-items: center; }
            .item-text { font-weight: 500; color: var(--text-main); }
            .item-value { color: var(--text-muted); font-size: 0.9rem; }

            /* Table Layout Styles */
            .virtual-table-header {
              display: grid;
              grid-template-columns: 2fr 2fr 1.5fr 1fr;
              background: rgba(15, 23, 42, 0.8);
              border: 1px solid var(--border-glass);
              border-radius: var(--radius-lg) var(--radius-lg) 0 0;
              font-weight: 600;
              color: var(--text-muted);
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .header-cell {
              padding: 1rem;
              display: flex;
              align-items: center;
            }

            .table-row {
              display: grid;
              grid-template-columns: 2fr 2fr 1.5fr 1fr;
              align-items: center;
              width: 100%;
              height: 50px; 
              border-bottom: 1px solid var(--border-glass);
              transition: background 0.2s;
            }

            .table-row:hover { background: rgba(255, 255, 255, 0.03); }

            .table-cell {
              padding: 0 1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: 100%;
              display: flex;
              align-items: center;
              border-right: 1px solid transparent;
            }

            /* Status Badges */
            .status-badge {
              padding: 0.25rem 0.75rem;
              border-radius: 999px;
              font-size: 0.75rem;
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-width: 80px;
              text-transform: uppercase;
            }

            .status-pending { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
            .status-shipped { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
            .status-delivered { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
            .status-cancelled { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

            /* Drag & Drop Styles */
            .drag-drop-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; flex: 1; }
            .drag-list {
              border: 2px dashed var(--primary-light);
              border-radius: var(--radius-lg);
              padding: 1rem;
              min-height: 300px;
              background: rgba(99, 102, 241, 0.05);
            }
            .drag-list-header {
              text-align: center;
              font-weight: 600;
              color: var(--text-main);
              margin-bottom: 1rem;
              font-size: 1.1rem;
            }
            .drag-item {
              background: var(--bg-card);
              border: 1px solid var(--border-glass);
              border-radius: var(--radius-md);
              padding: 1rem;
              margin-bottom: 0.75rem;
              cursor: move;
              transition: all 0.2s;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: var(--text-main);
            }
            .drag-item:hover {
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              transform: translateY(-2px);
              border-color: var(--primary-light);
            }
            .drag-item.dragging {
              opacity: 0.5;
              transform: rotate(2deg);
              border-color: var(--secondary);
            }
            .drag-handle { color: var(--text-muted); margin-right: 0.75rem; cursor: grab; }
          </style>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
    iframeDoc.close();

    const root = iframeDoc.getElementById("root");
    if (root && children) {
      import("preact").then(({ render }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(children as any, root);
      });
    }
  }, [children, id]);

  return (
    <div
      class="iframe-container"
      data-testid={`iframe-container-${id.split("-").pop()}`}
    >
      <iframe
        ref={iframeRef}
        id={id}
        class="iframe-content"
        title={title}
      />
    </div>
  );
}
