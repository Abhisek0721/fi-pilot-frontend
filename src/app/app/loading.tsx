export default function AppLoading() {
  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* Page header skeleton */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 28, width: 180, borderRadius: 8, background: 'hsl(var(--muted))', marginBottom: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 16, width: 280, borderRadius: 6, background: 'hsl(var(--muted))', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.1s' }} />
      </div>

      {/* Card row skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            height: 100, borderRadius: 14,
            background: 'hsl(var(--muted))',
            animation: `skeleton-pulse 1.5s ease-in-out infinite ${i * 0.08}s`,
          }} />
        ))}
      </div>

      {/* Content area skeleton */}
      <div style={{ borderRadius: 14, background: 'hsl(var(--muted))', height: 320, animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.3s' }} />

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
