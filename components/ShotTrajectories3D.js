'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { tacticsData } from '@/data/tactics'
import { BALL_R, buildTrajectory, lerpTrajectory } from '@/lib/shotPhysics'

const PATH_COLOR = '#f59e0b'
const BALL_BODY = '#141414'
/** Яркий жёлтый Dunlop-точки */
const BALL_DOT = '#fde047'

/** Плоская слегка утопленная точка на поверхности мяча */
function BallDot({ dir }) {
  // Чуть под поверхностью (не внутри объёма) + polygonOffset — без «пупырышков»
  const nest = BALL_R * 0.992
  const [nx, ny, nz] = dir
  const len = Math.hypot(nx, ny, nz) || 1
  const px = (nx / len) * nest
  const py = (ny / len) * nest
  const pz = (nz / len) * nest
  // ~8–9 мм на мяче Ø40 мм
  const dotR = BALL_R * 0.22

  return (
    <mesh
      position={[px, py, pz]}
      renderOrder={36}
      onUpdate={(m) => {
        m.lookAt(px * 2, py * 2, pz * 2)
      }}
    >
      <circleGeometry args={[dotR, 24]} />
      <meshBasicMaterial
        color={BALL_DOT}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-4}
        polygonOffsetUnits={-4}
        depthWrite={false}
      />
    </mesh>
  )
}

/**
 * Dunlop Pro / WSF double yellow: чёрная резина, две плоские жёлтые точки.
 * Диаметр 40 мм (R=20 мм), масса 24 г. Центры точек — 1,5 см друг от друга.
 */
function SquashBall({ meshRef }) {
  // Хорда 1,5 см на сфере R=20 мм → угол θ = 2·asin(chord/(2R))
  const chord = 0.015
  const halfAngle = Math.asin(Math.min(1, chord / (2 * BALL_R)))
  const s = Math.sin(halfAngle)
  const c = Math.cos(halfAngle)

  return (
    <group ref={meshRef} renderOrder={35}>
      <mesh>
        <sphereGeometry args={[BALL_R, 28, 28]} />
        <meshBasicMaterial color={BALL_BODY} toneMapped={false} />
      </mesh>
      <BallDot dir={[s, 0, c]} />
      <BallDot dir={[-s, 0, c]} />
    </group>
  )
}

function ShotPath({ spec, delay = 0, paused = false }) {
  const ballRef = useRef(null)
  const elapsedRef = useRef(0)

  const { points, linePoints } = useMemo(() => {
    const built = buildTrajectory(spec)
    return {
      points: built.points,
      linePoints: built.points.map((p) => [p.x, p.y, p.z]),
    }
  }, [spec])

  // Сброс времени при смене траектории
  useEffect(() => {
    elapsedRef.current = 0
  }, [spec])

  useFrame((_, delta) => {
    if (!ballRef.current || !points.length) return

    if (!paused) {
      elapsedRef.current += delta
    }

    const elapsed = elapsedRef.current - delay
    if (elapsed < 0) {
      ballRef.current.visible = false
      return
    }
    ballRef.current.visible = true

    const pos = lerpTrajectory(points, elapsed)
    ballRef.current.position.set(pos.x, pos.y, pos.z)
    ballRef.current.rotation.x = elapsed * 9
    ballRef.current.rotation.y = elapsed * 5
  })

  if (!linePoints.length) return null

  return (
    <group>
      <Line
        points={linePoints}
        color={PATH_COLOR}
        lineWidth={2}
        transparent
        opacity={0.7}
        depthTest
        renderOrder={30}
        onUpdate={(line) => {
          line.renderOrder = 30
          if (line.material) {
            line.material.depthWrite = false
            line.material.transparent = true
            line.material.opacity = 0.7
          }
        }}
      />
      <SquashBall meshRef={ballRef} />
    </group>
  )
}

/** Анимация траекторий выбранного удара на метрическом 3D-корте */
export default function ShotTrajectories3D({
  shotKey,
  paused = false,
  showLeft = true,
  showRight = true,
}) {
  const shot = tacticsData[shotKey]
  const paths = (shot?.paths3d ?? []).filter((spec) => {
    if (spec.side === 'left') return showLeft
    if (spec.side === 'right') return showRight
    return showLeft || showRight
  })

  if (!paths.length) return null

  return (
    <group>
      {paths.map((spec, i) => (
        <ShotPath
          key={`${shotKey}-${spec.side ?? i}`}
          spec={spec}
          delay={i * 0.18}
          paused={paused}
        />
      ))}
    </group>
  )
}
