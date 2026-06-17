const G = 9.81

export type RollingObjectType = 'solid-cylinder' | 'hollow-cylinder' | 'sphere'

export function calculateMomentOfInertia(
  type: RollingObjectType,
  mass: number,
  radius: number
): number {
  const k = {
    'solid-cylinder': 0.5,
    'hollow-cylinder': 1.0,
    'sphere': 0.4,
  }
  return k[type] * mass * radius * radius
}

export function calculateRollingAcceleration(
  angle: number,
  objectType: RollingObjectType
): number {
  const k = {
    'solid-cylinder': 0.5,
    'hollow-cylinder': 1.0,
    'sphere': 0.4,
  }
  return (G * Math.sin(angle)) / (1 + k[objectType])
}

export function calculateRollingVelocity(
  acceleration: number,
  distance: number
): number {
  return Math.sqrt(2 * acceleration * distance)
}

export function calculateVelocityAfterCollision(
  projectileMass: number,
  projectileVelocity: number,
  pendulumMass: number
): number {
  return (projectileMass * projectileVelocity) / (projectileMass + pendulumMass)
}

export function calculateMaxSwingAngle(
  velocityAfterCollision: number,
  pendulumLength: number
): number {
  const cosTheta = 1 - (velocityAfterCollision * velocityAfterCollision) / (2 * G * pendulumLength)
  const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta))
  return Math.acos(clampedCosTheta)
}

export function calculateMaxHeight(
  pendulumLength: number,
  maxAngle: number
): number {
  return pendulumLength * (1 - Math.cos(maxAngle))
}

export function calculateMomentumBefore(
  projectileMass: number,
  projectileVelocity: number
): number {
  return projectileMass * projectileVelocity
}

export function calculateMomentumAfter(
  totalMass: number,
  velocityAfterCollision: number
): number {
  return totalMass * velocityAfterCollision
}

export function calculateKEBefore(
  projectileMass: number,
  projectileVelocity: number
): number {
  return 0.5 * projectileMass * projectileVelocity * projectileVelocity
}

export function calculateKEAfter(
  totalMass: number,
  velocityAfterCollision: number
): number {
  return 0.5 * totalMass * velocityAfterCollision * velocityAfterCollision
}

export function calculateRodMomentOfInertia(mass: number, length: number): number {
  return (1 / 12) * mass * length * length
}

export function calculateMomentOfInertiaAboutPivot(
  momentOfInertiaAboutCOM: number,
  mass: number,
  distanceToCOM: number
): number {
  return momentOfInertiaAboutCOM + mass * distanceToCOM * distanceToCOM
}

export function calculateCompoundPendulumPeriod(
  momentOfInertia: number,
  mass: number,
  distanceToCOM: number
): number {
  return 2 * Math.PI * Math.sqrt(momentOfInertia / (mass * G * distanceToCOM))
}

export function calculateEffectiveLength(
  momentOfInertia: number,
  mass: number,
  distanceToCOM: number
): number {
  return momentOfInertia / (mass * distanceToCOM)
}

export function calculateGravitationalAcceleration(
  effectiveLength: number,
  period: number
): number {
  if (period === 0) return 0
  return (4 * Math.PI * Math.PI * effectiveLength) / (period * period)
}

export function calculatePendulumAngle(
  maxAngle: number,
  time: number,
  period: number
): number {
  const omega = (2 * Math.PI) / period
  return maxAngle * Math.cos(omega * time)
}

export function calculateRollingPosition(
  acceleration: number,
  time: number
): number {
  return 0.5 * acceleration * time * time
}

export function calculateVelocityAtTime(
  acceleration: number,
  time: number
): number {
  return acceleration * time
}
