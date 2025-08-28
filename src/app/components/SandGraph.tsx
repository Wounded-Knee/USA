interface SandGraphProps {
  width?: string
  height?: string
  title?: string
  subtitle?: string
}

export default function SandGraph({ 
  width = "100%", 
  height = "400px",
  title = "Sand Graph",
  subtitle = "Interactive Visualization"
}: SandGraphProps) {
  return (
    <div style={{ width, height }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{title}</h1>
          <h2 style={{ fontSize: '16px', color: '#666' }}>{subtitle}</h2>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Size: {width} × {height}
        </div>
      </div>
    </div>
  )
} 