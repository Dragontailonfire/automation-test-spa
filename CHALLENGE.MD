# Automation Testing Challenge

Welcome to the **Automation Testing Challenge**! This application is designed to test your skills in handling complex, real-world web automation scenarios. It mimics a modern "Customer Information Back Office" application but contains several intentional hurdles for automation scripts.

## Core Challenges

### 1. Virtualized Lists (Orders Tab)
-   **Scenario**: The "Orders" table contains 100,000 items, but only a small subset is rendered in the DOM at any time (virtualization).
-   **Challenge**: You cannot simply `findAll` rows. You must scroll the container to load target elements.
-   **Goal**: Find a specific order by ID (e.g., `Order-5500`) and verify its status.

### 2. Shadow DOM (System Status Tab)
-   **Scenario**: The "System Status" widget is encapsulated within a Shadow Root (`mode: 'open'`).
-   **Challenge**: Standard CSS/XPath selectors cannot penetrate the Shadow DOM boundary directly in some tools.
-   **Goal**: Click the "Run Diagnostics" button and verify the alert or status change.

### 3. Dynamic IDs (Support Ticket Tab)
-   **Scenario**: The "Support Ticket" form fields generate random IDs (e.g., `input_x7z91`) every time the page loads.
-   **Challenge**: ID-based locators will fail immediately.
-   **Goal**: Fill out and submit the form using robust strategies (e.g., labels, relative locators, accessibility roles).

### 4. Delayed Loading (Analytics Tab)
-   **Scenario**: The "Analytics Report" takes time to generate.
-   **Challenge**: The "View Report" button is not immediately present.
-   **Goal**: Handle the asynchronous wait explicitly (don't use hard sleeps!) and verify the report content once it appears.

### 5. Drag & Drop (Workflow Tab)
-   **Scenario**: A Kanban-style interface where items must be moved from "Pending" to "Processed".
-   **Challenge**: Automating drag-and-drop interactions can be flaky and requires precise event simulation.
-   **Goal**: Move an item from the left list to the right list and verify the counts update.

### 6. iFrame Contexts
-   **Scenario**: The main content areas are isolated inside `iframe` elements.
-   **Challenge**: Your automation script must switch contexts (frames) to interact with the elements inside.
-   **Goal**: Successfully navigate between the main app header and the content inside the active tab.

## General Guidelines
-   **Selectors**: Prefer user-facing attributes (text, role, label) over implementation details (CSS classes, random IDs).
-   **Waits**: Use explicit waits (wait for condition) rather than implicit waits or hard pauses.
-   **Robustness**: Your script should pass consistently even if the page loads slowly or the data changes (which it will!).

Good luck!
