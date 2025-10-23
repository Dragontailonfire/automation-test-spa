import { memo } from 'preact/compat';

interface LoaderProps {
  isLoading?: boolean;
  fullscreen?: boolean;
}

export const Loader = memo(function Loader({ isLoading = true, fullscreen = false }: LoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: fullscreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

Loader.displayName = 'Loader';