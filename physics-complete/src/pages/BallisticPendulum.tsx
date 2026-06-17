import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Slider } from '../components/Slider'
import {
  calculateVelocityAfterCollision,
  calculateMaxSwingAngle,
  calculateMaxHeight,
  calculateMomentumBefore,
  calculateMomentumAfter,
  calculateKEBefore,
  calculateKEAfter,
  calculatePendulumAngle,
} from '../lib/physics'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const PIVOT_X = 400
const PIVOT_Y = 50
const PENDULUM_LENGTH = 150

interface SimulationPhase {
  type: 'idle' | 'projectile' | 'collision' | 'swing'
  startTime: number
}

export default function BallisticPendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  const [projectileMass, setProjectileMass] = useState(0.1)
  const [projectileVelocity, setProjectileVelocity] = useState(10)
  const [pendulumMass, setPendulumMass] = useState(1)
  const [pendulumLength, setPendulumLength] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<SimulationPhase>({ type: 'idle', startTime: 0 })
  const [elapsedTime, setElapsedTime] = useState(0)

  const velocityAfterCollision = calculateVelocityAfterCollision(
    projectileMass,
    projectileVelocity,
    pendulumMass
  )
  const maxSwingAngle = calculateMaxSwingAngle(velocityAfterCollision, pendulumLength)
  const maxHeight = calculateMaxHeight(pendulumLength, maxSwingAngle)
  const momentumBefore = calculateMomentumBefore(projectileMass, projectileVelocity)
  const momentumAfter = calculateMomentumAfter(projectileMass + pendulumMass, velocityAfterCollision)
  const keBefore = calculateKEBefore(projectileMass, projectileVelocity)
  const keAfter = calculateKEAfter(projectileMass + pendulumMass, velocityAfterCollision)
  const energyLoss = keBefore - keAfter

  useEffect(() => {
    if (!isRunning) return

    let lastTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTime) / 1000
      lastTime = now

      setElapsedTime((prev) => {
        const newTime = prev + deltaTime

        const projectileDuration = 0.5
        const collisionDuration = 0.1
        const swingDuration = 3
        const totalDuration = projectileDuration + collisionDuration + swingDuration

        if (newTime > totalDuration) {
          setIsRunning(false)
          return 0
        }

        if (newTime < projectileDuration) {
          setPhase({ type: 'projectile', startTime: newTime })
        } else if (newTime < projectileDuration + collisionDuration) {
          setPhase({ type: 'collision', startTime: newTime - projectileDuration })
        } else {
          setPhase({ type: 'swing', startTime: newTime - projectileDuration - collisionDuration })
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
  }, [isRunning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#D4A96A'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.fillStyle = '#1D2951'
    ctx.beginPath()
    ctx.arc(PIVOT_X, PIVOT_Y, 6, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = '#6F4E37'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(PIVOT_X - 50, PIVOT_Y)
    ctx.lineTo(PIVOT_X + 50, PIVOT_Y)
    ctx.stroke()

    let pendulumAngle = 0
    let projectileX = 100
    let projectileY = PIVOT_Y + PENDULUM_LENGTH

    if (phase.type === 'projectile') {
      const progress = phase.startTime / 0.5
      projectileX = 100 + progress * 250
      projectileY = PIVOT_Y + PENDULUM_LENGTH - progress * 20
    } else if (phase.type === 'collision') {
      projectileX = 350
      projectileY = PIVOT_Y + PENDULUM_LENGTH - 20
    } else if (phase.type === 'swing') {
      const swingProgress = phase.startTime / 3
      pendulumAngle = calculatePendulumAngle(maxSwingAngle, swingProgress, 2)
    }

    const bobX = PIVOT_X + PENDULUM_LENGTH * Math.sin(pendulumAngle)
    const bobY = PIVOT_Y + PENDULUM_LENGTH * Math.cos(pendulumAngle)

    ctx.strokeStyle = '#708090'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(PIVOT_X, PIVOT_Y)
    ctx.lineTo(bobX, bobY)
    ctx.stroke()

    ctx.fillStyle = '#D4A96A'
    ctx.strokeStyle = '#1D2951'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(bobX, bobY, 15, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    if (phase.type === 'projectile' || phase.type === 'collision') {
      ctx.fillStyle = '#592720'
      ctx.beginPath()
      ctx.arc(projectileX, projectileY, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      if (phase.type === 'projectile') {
        ctx.strokeStyle = '#6F4E37'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(projectileX, projectileY)
        ctx.lineTo(projectileX + 30, projectileY + 5)
        ctx.stroke()
      }
    }

    if (phase.type === 'swing' && pendulumAngle !== 0) {
      ctx.strokeStyle = '#708090'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(PIVOT_X, PIVOT_Y)
      ctx.lineTo(PIVOT_X, PIVOT_Y + PENDULUM_LENGTH)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath()
      ctx.arc(PIVOT_X, PIVOT_Y, 40, -Math.PI / 2, -Math.PI / 2 + pendulumAngle, pendulumAngle < 0)
      ctx.stroke()

      ctx.fillStyle = '#1D2951'
      ctx.font = '12px sans-serif'
      ctx.fillText(
        `${(pendulumAngle * (180 / Math.PI)).toFixed(1)}°`,
        PIVOT_X + 45,
        PIVOT_Y + 30
      )
    }

    ctx.fillStyle = '#1D2951'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('Ballistic Pendulum Simulation', 20, 30)

    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#6F4E37'
    let phaseText = 'Idle'
    if (phase.type === 'projectile') phaseText = 'Projectile in Flight'
    else if (phase.type === 'collision') phaseText = 'Collision'
    else if (phase.type === 'swing') phaseText = 'Pendulum Swinging'
    ctx.fillText(`Phase: ${phaseText}`, 20, 360)
  }, [phase, maxSwingAngle])

  const handleReset = () => {
    setIsRunning(false)
    setElapsedTime(0)
    setPhase({ type: 'idle', startTime: 0 })
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
              Projectile Mass: {projectileMass.toFixed(3)} kg
            </label>
            <Slider
              value={projectileMass}
              onChange={(val) => {
                setProjectileMass(val)
                handleReset()
              }}
              min={0.01}
              max={0.5}
              step={0.01}
            />
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Projectile Velocity: {projectileVelocity.toFixed(1)} m/s
            </label>
            <Slider
              value={projectileVelocity}
              onChange={(val) => {
                setProjectileVelocity(val)
                handleReset()
              }}
              min={1}
              max={30}
              step={0.5}
            />
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Pendulum Mass: {pendulumMass.toFixed(2)} kg
            </label>
            <Slider
              value={pendulumMass}
              onChange={(val) => {
                setPendulumMass(val)
                handleReset()
              }}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#6F4E37' }}>
              Pendulum Length: {pendulumLength.toFixed(2)} m
            </label>
            <Slider
              value={pendulumLength}
              onChange={(val) => {
                setPendulumLength(val)
                handleReset()
              }}
              min={0.5}
              max={2}
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
              <div className="data-label">MOMENTUM BEFORE</div>
              <div className="data-value">{momentumBefore.toFixed(3)}</div>
              <div className="data-unit">kg·m/s</div>
            </div>

            <div className="data-item">
              <div className="data-label">MOMENTUM AFTER</div>
              <div className="data-value">{momentumAfter.toFixed(3)}</div>
              <div className="data-unit">kg·m/s</div>
            </div>

            <div className="data-item">
              <div className="data-label">KE BEFORE</div>
              <div className="data-value">{keBefore.toFixed(3)}</div>
              <div className="data-unit">J</div>
            </div>

            <div className="data-item">
              <div className="data-label">KE AFTER</div>
              <div className="data-value">{keAfter.toFixed(3)}</div>
              <div className="data-unit">J</div>
            </div>

            <div className="data-item">
              <div className="data-label">MAX SWING ANGLE</div>
              <div className="data-value">{(maxSwingAngle * (180 / Math.PI)).toFixed(1)}</div>
              <div className="data-unit">degrees</div>
            </div>

            <div className="data-item">
              <div className="data-label">MAX HEIGHT</div>
              <div className="data-value">{maxHeight.toFixed(3)}</div>
              <div className="data-unit">m</div>
            </div>
          </div>

          <div className="formula-box">
            <div className="formula-label">ENERGY LOSS</div>
            <p style={{ marginBottom: '8px' }}>{energyLoss.toFixed(3)} J</p>
            <p style={{ fontSize: '12px', color: '#708090' }}>
              Energy lost during inelastic collision
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
