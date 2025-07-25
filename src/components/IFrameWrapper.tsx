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
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
              padding: 20px; 
              margin: 0;
              background: ${id === "test-iframe-2" ? "#f0f0f0" : "white"};
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            .frame-header { 
              margin-bottom: 20px;
              flex-shrink: 0;
            }
            .frame-header form {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }
            .frame-header input {
              padding: 5px 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
            .frame-header select {
              padding: 5px 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
            .frame-header button {
              padding: 5px 15px;
              background: #3498db;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            .frame-header button:hover {
              background: #2980b9;
            }
              
            .modal-backdrop {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .modal-content {
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
              max-width: 400px;
              width: 90%;
            }
            .modal-content h3 {
              margin-top: 0;
            }
            .modal-content button {
              padding: 8px 20px;
              background: #e74c3c;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 1rem;
            }
              
            .list-container {
              flex: 1;
              display: flex;
              flex-direction: column;
              margin-bottom: 1rem;
            }
              
            .drag-drop-container {
              flex: 1;
              display: flex;
              gap: 2rem;
            }
            .drag-drop-container > div {
              flex: 1;
            }
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
        style={{
          width: "100%",
          height: "600px",
          border: "2px solid #e0e0e0",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
