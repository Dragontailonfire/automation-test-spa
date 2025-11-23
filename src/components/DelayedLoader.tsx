import { useState, useEffect } from "preact/hooks";

export function DelayedLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    // Random delay between 3 and 5 seconds
    const delay = Math.floor(Math.random() * 2000) + 3000;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="delayed-loader-container">
      <h2>Customer Analytics</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        {isLoading ? "Generating Report..." : "Report Generated"}
      </p>

      {isLoading ? (
        <div className="loader-spinner" role="status" aria-label="Loading"></div>
      ) : (
        <div className="loaded-content">
          {!showSecret ? (
            <button 
              className="reveal-button" 
              onClick={() => setShowSecret(true)}
              data-testid="delayed-button"
            >
              View Report
            </button>
          ) : (
            <div 
              className="secret-message" 
              data-testid="secret-message"
              style={{ 
                padding: '1rem', 
                background: 'rgba(16, 185, 129, 0.2)', 
                border: '1px solid #10b981', 
                borderRadius: '8px',
                color: '#6ee7b7'
              }}
            >
              📊 Q4 Revenue: $1.2M (Up 15%)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
