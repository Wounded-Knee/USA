'use client'

import { useRef, useEffect } from 'react'
import Matter from 'matter-js'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine and renderer
    const engine = Matter.Engine.create()
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
        wireframes: false,
        background: '#f0f0f0'
      }
    })

    // Store references for cleanup
    engineRef.current = engine
    renderRef.current = render

    // Start the engine and renderer
    Matter.Engine.run(engine)
    Matter.Render.run(render)

    // Cleanup function
    return () => {
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current)
        renderRef.current.canvas.remove()
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current)
      }
    }
  }, [])

  return (
    <div style={{ width, height }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{title}</h1>
          <h2 style={{ fontSize: '16px', color: '#666' }}>{subtitle}</h2>
        </div>
        <div style={{ 
          flex: 1, 
          position: 'relative',
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <canvas 
            ref={canvasRef}
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block'
            }}
          />
        </div>
        <div id="controls">
            
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Matter.js World - Size: {width} × {height}
        </div>
      </div>
    </div>
  )
} 