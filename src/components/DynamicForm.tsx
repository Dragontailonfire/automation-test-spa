import { useState, useMemo } from "preact/hooks";

export function DynamicForm() {
  // Generate random IDs that change on every mount/refresh
  const fieldIds = useMemo(() => ({
    username: `input_${Math.random().toString(36).substring(2, 7)}`,
    password: `input_${Math.random().toString(36).substring(2, 7)}`,
    submit: `btn_${Math.random().toString(36).substring(2, 7)}`
  }), []);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="dynamic-form-container">
      <h2>Support Ticket System</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Agent Login Required
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor={fieldIds.username} className="form-label">
              Agent ID
            </label>
            <input
              type="text"
              id={fieldIds.username}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={fieldIds.password} className="form-label">
              Secure Key
            </label>
            <input
              type="password"
              id={fieldIds.password}
              className="form-input"
              required
            />
          </div>

          <button type="submit" id={fieldIds.submit} className="submit-button">
            Access Dashboard
          </button>
        </form>
      ) : (
        <div className="success-message-container">
          <h3>Access Granted</h3>
          <p>Redirecting to ticket dashboard...</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="reset-button"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
