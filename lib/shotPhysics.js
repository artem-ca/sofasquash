// lib/shotPhysics.js
// Баллистика мяча на официальном корте (метры, СИ).
// Центр мяча: касание поверхности = плоскость ± BALL_R.

import { courtDimensions as C } from '@/data/courtDimensions'

/**
 * WSF Standard Double Yellow Dot (Competition) / Dunlop Pro:
 * диаметр 40.0 ± 0.5 мм, масса 24.0 ± 1.0 г, материал — резина.
 * @see https://www.worldsquash.sport/ball-specification/
 */
export const BALL_R = 0.02
/** Масса мяча, кг (на траекторию в полёте не влияет — только g; нужна для модели отскока/энергии) */
export const BALL_MASS = 0.024
/** Ускорение свободного падения, м/с² */
export const G = 9.81

/** Скорость мяча сразу после удара (у головки ракетки), км/ч.
 * Порядок величин реальный: жёсткий килл — самый быстрый, свеча/дроп — самые
 * медленные (мягкое касание). Значения подобраны так, чтобы дуги и тайминги
 * читались на модели, оставаясь в реалистичных пропорциях между ударами.
 */
export const SHOT_SPEED_KMH = {
  drive: 80,
  crosscourt: 80,
  boast: 60,
  reverse_boast: 58,
  lob: 34,
  lob_cross: 34,
  drop: 20,
  drop_cross: 20,
  killshot: 100,
}

/**
 * Коэффициент сохранения скорости после отскока (≈ COR по скорости).
 * По спецификации WSF прогретый (45 °C) double-yellow отскакивает на 26–33 %
 * высоты падения → COR ≈ √0.26…0.33 ≈ 0.50–0.57 на умеренной скорости.
 * Важный нюанс: COR ПАДАЕТ с ростом скорости удара — поэтому жёсткий килл
 * теряет больше энергии за контакт, чем мягкая свеча/дроп.
 * @see https://www.worldsquash.sport/ball-specification/
 */
export const BOUNCE_RESTITUTION = {
  length: 0.52, // драйв / кросс — средняя скорость
  boast: 0.5,
  soft: 0.46, // дроп — медленный мяч, гасится о пол/ник
  lob: 0.6, // свеча: мягкий контакт → высокий COR, скорость почти сохраняется
  kill: 0.38, // быстрый мяч → низкий COR, гаснет в нике
}

export function kmhToMs(kmh) {
  return kmh / 3.6
}

export function resolveShotSpeedMs(spec) {
  if (spec?.speedKmh != null) return kmhToMs(spec.speedKmh)
  if (spec?.speed != null) return spec.speed
  return kmhToMs(SHOT_SPEED_KMH.drive)
}

const halfW = C.width / 2
const halfL = C.length / 2

/** Рабочие плоскости касания (центр мяча) */
export const SURF = {
  left: -halfW + BALL_R,
  right: halfW - BALL_R,
  front: -halfL + BALL_R,
  back: halfL - BALL_R + 0.012,
  floor: BALL_R,
  /** Короткая (центральная поперечная) линия */
  shortLine: -halfL + C.shortLineDistance,
  /** Чуть выше тина — легальный контакт с передней стеной */
  aboveTin: C.tinHeight + BALL_R + 0.02,
}

/**
 * @param {object} e
 * @returns {{ x: number, y: number, z: number }}
 */
export function resolveEvent(e) {
  if (e.wall === 'front') {
    return { x: e.x, y: e.y, z: SURF.front }
  }
  if (e.wall === 'back') {
    return { x: e.x, y: e.y, z: SURF.back }
  }
  if (e.wall === 'left') {
    return { x: SURF.left, y: e.y, z: e.z }
  }
  if (e.wall === 'right') {
    return { x: SURF.right, y: e.y, z: e.z }
  }
  if (e.floor) {
    return { x: e.x, y: SURF.floor, z: e.z }
  }
  return { x: e.x, y: e.y, z: e.z }
}

/**
 * Дуга свободного полёта A→B под g: равномерно в XZ, парабола по Y.
 * `speed` — горизонтальная составляющая после удара/отскока, м/с.
 */
function sampleArc(a, b, speed, samples = 20) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  const horiz = Math.hypot(dx, dz)
  const T = Math.max(horiz / Math.max(speed, 0.5), 0.02)
  const vy0 = dy / T + 0.5 * G * T
  const pts = []
  for (let i = 0; i <= samples; i++) {
    const u = i / samples
    const t = u * T
    pts.push({
      x: a.x + dx * u,
      y: a.y + vy0 * t - 0.5 * G * t * t,
      z: a.z + dz * u,
      t: 0,
    })
  }
  return { pts, T }
}

/**
 * @param {{
 *   events: object[],
 *   speedKmh?: number,
 *   speed?: number,
 *   damping?: number,
 *   samples?: number,
 * }} spec
 * @returns {{ points: {x,y,z,t}[], duration: number }}
 */
export function buildTrajectory(spec) {
  const {
    events,
    damping = BOUNCE_RESTITUTION.length,
    samples = 22,
  } = spec

  const positions = events.map(resolveEvent)
  if (positions.length < 2) {
    return { points: [], duration: 1 }
  }

  let speed = resolveShotSpeedMs(spec)
  let tAcc = 0
  const points = []

  for (let i = 0; i < positions.length - 1; i++) {
    const { pts, T } = sampleArc(positions[i], positions[i + 1], speed, samples)
    const start = i === 0 ? 0 : 1
    for (let j = start; j < pts.length; j++) {
      const u = j / (pts.length - 1)
      points.push({
        x: pts[j].x,
        y: pts[j].y,
        z: pts[j].z,
        t: tAcc + u * T,
      })
    }
    tAcc += T

    // После стены/пола — потеря скорости (резина 24 г)
    const landed = events[i + 1]
    if (landed?.wall || landed?.floor) {
      speed *= damping
    }
  }

  return { points, duration: Math.max(tAcc, 0.35) }
}

export function lerpTrajectory(points, time) {
  if (!points.length) return { x: 0, y: BALL_R, z: 0 }
  const dur = points[points.length - 1].t
  const t = ((time % dur) + dur) % dur
  if (t <= points[0].t) return points[0]
  for (let i = 1; i < points.length; i++) {
    if (t <= points[i].t) {
      const a = points[i - 1]
      const b = points[i]
      const span = b.t - a.t || 1e-6
      const u = (t - a.t) / span
      return {
        x: a.x + (b.x - a.x) * u,
        y: a.y + (b.y - a.y) * u,
        z: a.z + (b.z - a.z) * u,
      }
    }
  }
  return points[points.length - 1]
}
