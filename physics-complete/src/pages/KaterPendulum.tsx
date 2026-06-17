import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Slider } from '../components/Slider'
import {
  calculateRodMomentOfInertia,
  calculateMomentOfInertiaAboutPivot,
  calculateCompoundPendulumPeriod,
  calculateEffectiveLength,
  calculateGravitationalAcceleration,
  calculatePendulumAngle,
} from '../lib/physics'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const CANVAS_CENTER_X = CANVAS_WIDTH / 2
const CANVAS_CENTER_Y = 100

export default function KaterPendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  const [pivotDistance, setPivotDistance] = useState(0.5)
  const [mass, setMass] = useState(1)
  const [centerOfMassOffset, setCenterOfMassOffset] = useState(0.1)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [currentPivot, setCurrentPivot] = useState<1 | 2>(1)

  const rodMomentOfInertia = calculateRodMomentOfInertia(mass, pivotDistance)

  const distToCOMFromPivot1 = centerOfMassOffset
  const distToCOMFromPivot2 = pivotDistance - centerOfMassOffset

  const momentAboutPivot1 = calculateMomentOfInertiaAboutPivot(
    rodMomentOfInertia,
    mass,
    distToCOMFromPivot1
  )
  const momentAboutPivot2 = calculateMomentOfInertiaAboutPivot(
    rodMomentOfInertia,
    mass,
    distToCOMFromPivot2
  )

  const period1 = calculateCompoundPendulumPeriod(momentAboutPivot1, mass, distToCOMFromPivot1)
  const period2 = calculateCompoundPendulumPeriod(momentAboutPivot2, mass, distToCOMFromPivot2)

  const effectiveLength1 = calculateEffectiveLength(momentAboutPivot1, mass, distToCOMFromPivot1)
  const effectiveLength2 = calculateEffectiveLength(momentAboutPivot2, mass, distToCOMFromPivot2)

  const avgEffectiveLength = (effectiveLength1 + effectiveLength2) / 2
  const avgPeriod = (period1 + period2) / 2

  const calculatedG = calculateGravitationalAcceleration(avgEffectiveLength, avgPeriod)

  useEffect(() => {
    if (!isRunning) return

    let lastTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTime) / 1000
      lastTime = now

      setTime((prevTime) => {
        const newTime = prevTime + deltaTime

        const toggleTime = currentPivot === 1 ? period1 / 2 : period2 / 2
        if (newTime > toggleTime) {
          setCurrentPivot(currentPivot === 1 ? 2 : 1)
          return 0
        }

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
  }, [isRunning, currentPivot, period1, period2, pivotDistance, centerOfMassOffset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#D4A96A'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const scale = 150

    const pivot1X = CANVAS_CENTER_X - (pivotDistance / 2) * scale
    const pivot2X = CANVAS_CENTER_X + (pivotDistance / 2) * scale
    const pivotY = CANVAS_CENTER_Y

    const comX = pivot1X + centerOfMassOffset * scale
    const comY = CANVAS_CENTER_Y

    const currentPeriod = currentPivot === 1 ? period1 : period2
    const maxAngle = 0.3
    const angle = calculatePendulumAngle(maxAngle, time, currentPeriod)

    let rodEndX, rodEndY
    if (currentPivot === 1) {
      const rodLength = pivotDistance * scale
      rodEndX = pivot1X + rodLength * Math.sin(angle)
      rodEndY = pivotY + rodLength * Math.cos(angle)
    } else {
      const rodLength = pivotDistance * scale
      rodEndX = pivot2X - rodLength * Math.sin(angle)
      rodEndY = pivotY + rodLength * Math.cos(angle)
    }

    ctx.strokeStyle = '#6F4E37'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(pivot1X - 30, pivotY)
    ctx.lineTo(pivot2X + 30, pivotY)
    ctx.stroke()

    ctx.fillStyle = currentPivot === 1 ? '#D4A96A' : '#708090'
    ctx.beginPath()
    ctx.arc(pivot1X, pivotY, 8, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = currentPivot === 2 ? '#D4A96A' : '#708090'
    ctx.beginPath()
    ctx.arc(pivot2X, pivotY, 8, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = '#1D2951'
    ctx.lineWidth = 4
    ctx.beginPath()
    if (currentPivot === 1) {
      ctx.moveTo(pivot1X, pivotY)
      ctx.lineTo(rodEndX, rodEndY)
    } else {
      ctx.moveTo(pivot2X, pivotY)
      ctx.lineTo(rodEndX, rodEndY)
    }
    ctx.stroke()

    const comOffsetX = centerOfMassOffset * scale * Math.sin(angle)
    const comOffsetY = centerOfMassOffset * scale * Math.cos(angle)
    const movingComX = pivot1X + comOffsetX
    const movingComY = pivotY + comOffsetY

    ctx.fillStyle = '#592720'
    ctx.beginPath()
    ctx.arc(movingComX, movingComY, 6, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = '#708090'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    if (currentPivot === 1) {
      ctx.beginPath()
      ctx.moveTo(pivot1X, pivotY)
      ctx.lineTo(pivot1X, pivotY + pivotDistance * scale)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(pivot2X, pivotY)
      ctx.lineTo(pivot2X, pivotY + pivotDistance * scale)
      ctx.stroke()
    }
    ctx.setLineDash([])

    ctx.strokeStyle = '#708090'
    ctx.beginPath()
    const arcRadius = 50
    if (currentPivot === 1) {
      ctx.arc(pivot1X, pivotY, arcRadius, -Math.PI / 2, -Math.PI / 2 + angle, angle < 0)
    } else {
      ctx.arc(pivot2X, pivotY, arcRadius, -Math.PI / 2 - angle, -Math.PI / 2, angle < 0)
    }
    ctx.stroke()

    ctx.fillStyle = '#1D2951'
    ctx.font = '12px sans-serif'
    ctx.fillText(`${(angle * (180 / Math.PI)).toFixed(1)}°`, CANVAS_CENTER_X + 30, 60)

    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('Kater Pendulum Simulation', 20, 30)

    ctx.font = '11px sans-serif'
    ctx.fillStyle = '#6F4E37'
    ctx.fillText('Pivot 1', pivot1X - 20, pivotY + 25)
    ctx.fillText('Pivot 2', pivot2X - 20, pivotY + 25)
    ctx.fillText(`Active: Pivot ${currentPivot}`, CANVAS_CENTER_X - 50, CANVAS_HEIGHT - 20)
  }, [time, currentPivot, pivotDistance, centerOfMassOffset, period1, period2])

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setCurrentPivot(1)
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

          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Pivot Distance: {pivotDistance.toFixed(2)} m
            </label>
            <Slider
              value={pivotDistance}
              onChange={(val) => {
                setPivotDistance(val)
                handleReset()
              }}
              min={0.3}
              max={1.5}
              step={0.05}
            />
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Mass: {mass.toFixed(2)} kg
            </label>
            <Slider
              value={mass}
              onChange={(val) => {
                setMass(val)
                handleReset()
              }}
              min={0.5}
              max={3}
              step={0.1}
            />
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              COM Offset: {centerOfMassOffset.toFixed(2)} m
            </label>
            <Slider
              value={centerOfMassOffset}
              onChange={(val) => {
                setCenterOfMassOffset(Math.min(val, pivotDistance - 0.05))
                handleReset()
              }}
              min={0.05}
              max={pivotDistance - 0.05}
              step={0.05}
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
              <div className="data-label">PERIOD (PIVOT 1)</div>
              <div className="data-value">{period1.toFixed(3)}</div>
              <div className="data-unit">seconds</div>
            </div>

            <div className="data-item">
              <div className="data-label">PERIOD (PIVOT 2)</div>
              <div className="data-value">{period2.toFixed(3)}</div>
              <div className="data-unit">seconds</div>
            </div>

            <div className="data-item">
              <div className="data-label">EFF. LENGTH (PIVOT 1)</div>
              <div className="data-value">{effectiveLength1.toFixed(3)}</div>
              <div className="data-unit">m</div>
            </div>

            <div className="data-item">
              <div className="data-label">EFF. LENGTH (PIVOT 2)</div>
              <div className="data-value">{effectiveLength2.toFixed(3)}</div>
              <div className="data-unit">m</div>
            </div>

            <div className="data-item">
              <div className="data-label">CALCULATED g</div>
              <div className="data-value">{calculatedG.toFixed(3)}</div>
              <div className="data-unit">m/s²</div>
            </div>

            <div className="data-item">
              <div className="data-label">ERROR</div>
              <div className="data-value">{Math.abs(calculatedG - 9.81).toFixed(3)}</div>
              <div className="data-unit">m/s²</div>
            </div>
          </div>

          <div className="formula-box">
            <div className="formula-label">KATER PENDULUM PRINCIPLE</div>
            <p style={{ marginBottom: '8px' }}>
              Reversible pendulum with equal periods at both pivots measures gravitational acceleration
            </p>
            <p style={{ fontSize: '12px', color: '#708090' }}>
              g = (4π² L_eff) / T²
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
