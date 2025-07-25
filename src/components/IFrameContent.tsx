import { useState } from "preact/hooks";

export function IFrameHeader1() {
  const handleValidation = (e: Event) => {
    e.preventDefault();
    window.alert("Validate this label");
  };

  return (
    <div class="frame-header">
      <h2 data-testid="iframe-title">Challenge 1</h2>
      <div role="list" aria-label="Items in frame 1">
        <div class="frame-item" data-item-id="frame1-1">
          Item 1
        </div>
        <div class="frame-item" data-item-id="frame1-2">
          Item 2
        </div>
        <button
          type="button"
          aria-label="Action button in frame 1"
          onClick={handleValidation}
        >
          Click Me
        </button>
      </div>
    </div>
  );
}

export function IFrameHeader2() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ text: "", option: "opt1" });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    setFormData({ ...formData, text: input.value });
  };

  const handleSelectChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setFormData({ ...formData, option: select.value });
  };

  return (
    <>
      <div class="frame-header">
        <h2>Challenge 2</h2>
        <form onSubmit={handleSubmit}>
          <label for="input-field">Enter text:</label>
          <input
            type="text"
            id="input-field"
            name="testInput"
            value={formData.text}
            onInput={handleInputChange}
          />
          <select
            id="dropdown"
            aria-label="Options"
            value={formData.option}
            onChange={handleSelectChange}
          >
            <option value="opt1">Option 1</option>
            <option value="opt2">Option 2</option>
            <option value="opt3">Option 3</option>
          </select>
          <button
            type="submit"
            style={{ marginLeft: "10px" }}
            aria-label="Submit form"
          >
            Submit
          </button>
        </form>

        <div class="nested-div" style={{ marginTop: "2rem" }}>
          <div>
            <div>
              <span id="deeply-nested">
                Very important value:{" "}
                {Math.floor(10000000 + Math.random() * 90000000)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          class="modal-backdrop"
          onClick={() => setShowModal(false)}
          data-testid="modal-backdrop"
        >
          <div
            class="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3>Form Data Submitted</h3>
            <p>
              Text: <strong>{formData.text || "(empty)"}</strong>
            </p>
            <p>
              Selected Option: <strong>{formData.option}</strong>
            </p>
            <button
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
