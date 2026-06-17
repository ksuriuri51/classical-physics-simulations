import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Slider } from '../components/Slider'
import {
  calculateRollingAcceleration,
  calculateRollingVelocity,
  calculateRollingPosition,
  calculateVelocityAtTime,
  type RollingObjectType,
} from '../lib/physics'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const INCLINE_START_X = 50
const INCLINE_START_Y = 100
const INCLINE_END_X = 750
const INCLINE_END_Y = 350

export default function RollingMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  const [angle, setAngle] = useState(30)
  const [mass, setMass] = useState(1)
  const [objectType, setObjectType] = useState<RollingObjectType>('solid-cylinder')
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [acceleration, setAcceleration] = useState(0)
  const [position, setPosition] = useState(0)

  const angleRad = (angle * Math.PI) / 180
  const acc = calculateRollingAcceleration(angleRad, objectType)
  const inclineLength = Math.sqrt(
    (INCLINE_END_X - INCLINE_START_X) ** 2 + (INCLINE_END_Y - INCLINE_START_Y) ** 2
  )

  useEffect(() => {
    setAcceleration(acc)
  }, [angle, objectType, acc])

  useEffect(() => {
    if (!isRunning) return

    let lastTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTime) / 1000
      lastTime = now

      setTime((prevTime) => {
        const newTime = prevTime + deltaTime
        const pos = calculateRollingPosition(acc, newTime)

        if (pos >= inclineLength) {
          setIsRunning(false)
          return prevTime
        }

        const vel = calculateVelocityAtTime(acc, newTime)
        setPosition(pos)
        setVelocity(vel)

        return newTime
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, acc, inclineLength])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#D4A96A'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.strokeStyle = '#6F4E37'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(INCLINE_START_X, INCLINE_START_Y)
    ctx.lineTo(INCLINE_END_X, INCLINE_END_Y)
    ctx.stroke()

    ctx.strokeStyle = '#708090'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(INCLINE_START_X, INCLINE_START_Y)
    ctx.lineTo(INCLINE_START_X - 30, INCLINE_START_Y)
    ctx.stroke()
    ctx.setLineDash([])

    const progress = Math.min(position / inclineLength, 1)
    const objX = INCLINE_START_X + (INCLINE_END_X - INCLINE_START_X) * progress
    const objY = INCLINE_START_Y + (INCLINE_END_Y - INCLINE_START_Y) * progress
    const radius = 15

    ctx.fillStyle = '#D4A96A'
    ctx.strokeStyle = '#1D2951'
    ctx.lineWidth = 2

    if (objectType === 'sphere') {
      ctx.beginPath()
      ctx.arc(objX, objY, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      const rotationAngle = (position / radius) % (2 * Math.PI)
      ctx.strokeStyle = '#1D2951'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(objX, objY)
      ctx.lineTo(
        objX + radius * Math.cos(rotationAngle),
        objY + radius * Math.sin(rotationAngle)
      )
      ctx.stroke()
    } else {
      ctx.fillRect(objX - radius, objY - 10, radius * 2, 20)
      ctx.strokeRect(objX - radius, objY - 10, radius * 2, 20)

      if (objectType === 'hollow-cylinder') {
        ctx.fillStyle = '#F5F3F0'
        ctx.fillRect(objX - radius + 4, objY - 6, radius * 2 - 8, 12)
      }
    }

    ctx.strokeStyle = '#708090'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(INCLINE_START_X, INCLINE_START_Y)
    ctx.lineTo(INCLINE_START_X + 60, INCLINE_START_Y)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.strokeStyle = '#708090'
    ctx.beginPath()
    ctx.arc(INCLINE_START_X, INCLINE_START_Y, 30, -angleRad, 0, true)
    ctx.stroke()

    ctx.fillStyle = '#1D2951'
    ctx.font = '12px sans-serif'
    ctx.fillText(`${angle}°`, INCLINE_START_X + 35, INCLINE_START_Y - 5)

    ctx.fillStyle = '#1D2951'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('Rolling Motion Simulation', 20, 30)
  }, [angle, angleRad, position, objectType])

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setPosition(0)
    setVelocity(0)
  }

  const objectTypeLabels = {
    'solid-cylinder': 'Solid Cylinder',
    'hollow-cylinder': 'Hollow Cylinder',
    'sphere': 'Sphere',
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ border: '2px solid #D4A96A', padding: '16px' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ width: '100%', border: '1px solid #708090', borderRadius: '8px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="card" style={{ border: '2px solid #6F4E37' }}>
          <h3 className="card-title">Controls</h3>

          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Object Type
            </label>
            <select
              value={objectType}
              onChange={(e) => {
                setObjectType(e.target.value as RollingObjectType)
                handleReset()
              }}
              style={{ borderColor: '#D4A96A', color: '#1D2951' }}
            >
              {Object.entries(objectTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Incline Angle: {angle.toFixed(1)}°
            </label>
            <Slider
              value={angle}
              onChange={(val) => {
                setAngle(val)
                handleReset()
              }}
              min={5}
              max={60}
              step={1}
            />
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Mass: {mass.toFixed(2)} kg
            </label>
            <Slider
              value={mass}
              onChange={(val) => setMass(val)}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              label={isRunning ? 'Pause' : 'Play'}
              onClick={() => setIsRunning(!isRunning)}
              style={{ flex: 1, backgroundColor: isRunning ? '#592720' : '#1D2951', color: '#D4A96A' }}
            />
            <Button
              label="Reset"
              onClick={handleReset}
              style={{ flex: 1, backgroundColor: '#708090', color: '#FFFFFF' }}
            />
          </div>
        </div>

        <div className="card" style={{ border: '2px solid #708090' }}>
          <h3 className="card-title">Physics Data</h3>

          <div className="data-grid">
            <div className="data-item">
              <div className="data-label">ACCELERATION</div>
              <div className="data-value">{acceleration.toFixed(3)}</div>
              <div className="data-unit">m/s²</div>
            </div>

            <div className="data-item">
              <div className="data-label">VELOCITY</div>
              <div className="data-value">{velocity.toFixed(3)}</div>
              <div className="data-unit">m/s</div>
            </div>

            <div className="data-item">
              <div className="data-label">DISTANCE</div>
              <div className="data-value">{position.toFixed(3)}</div>
              <div className="data-unit">m</div>
            </div>

            <div className="data-item">
              <div className="data-label">TIME</div>
              <div className="data-value">{time.toFixed(2)}</div>
              <div className="data-unit">s</div>
            </div>
          </div>

          <div className="formula-box">
            <div className="formula-label">FORMULA</div>
            <p style={{ marginBottom: '8px' }}>a = (g sin θ) / (1 + k) where k depends on object shape</p>
            <p style={{ fontSize: '12px', color: '#708090' }}>
              • Solid Cylinder: k = 0.5 • Hollow Cylinder: k = 1.0 • Sphere: k = 0.4
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
