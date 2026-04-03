export function LoadingPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      color: '#9CA3AF',
      fontSize: 14,
    }}>
      Loading…
    </div>
  )
}

export function ErrorPage({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: 8,
    }}>
      <div style={{ fontSize: 32 }}>⚠️</div>
      <div style={{ color: '#DC2626', fontWeight: 600 }}>Failed to load report</div>
      <div style={{ color: '#6B7280', fontSize: 12 }}>{message}</div>
    </div>
  )
}
