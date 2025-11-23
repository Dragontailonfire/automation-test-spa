import { useState, useEffect } from "preact/hooks";
import { TabContainer } from "./components/TabContainer";
import { Item } from "./types";
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { generateData } from "./utils/dataUtils";

inject();
injectSpeedInsights();

export function App() {
  const [verticalData, setVerticalData] = useState<Item[]>([]);
  const [horizontalData, setHorizontalData] = useState<Item[]>([]);
  const [dragListA, setDragListA] = useState<Item[]>([]);
  const [dragListB, setDragListB] = useState<Item[]>([]);
  const [appTitle, setAppTitle] = useState("Challenger Office Management");

  useEffect(() => {
    // Randomize Title
    const titles = [
      "SkyNet Admin Portal",
      "Cyberdyne Systems CRM",
      "Initech Global Dashboard",
      "Massive Dynamic Intranet",
      "Wayne Enterprises Ops",
      "Aperture Science Testing",
      "Black Mesa Research DB",
      "Umbrella Corp Secure Net",
      "Stark Industries Mainframe"
    ];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    setAppTitle(randomTitle);
    document.title = randomTitle;

    setVerticalData(generateData(100000, "Order"));
    setHorizontalData(generateData(10000, "Gallery"));
    setDragListA(generateData(20, "Pending"));
    setDragListB(generateData(20, "Processed"));
  }, []);

  return (
    <div class="app-container" role="application">
      <header class="app-header" data-testid="app-header">
        <h1 aria-label="Application Title">{appTitle}</h1>
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
            <span>© 2025 NVK | Automation Playground</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
