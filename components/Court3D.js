'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import { useTheme } from './ThemeContext'
import { courtDimensions as C } from '@/data/courtDimensions'
import { courtData } from '@/data/court'
import { tacticsData, SHOT_LABELS } from '@/data/tactics'
import ShotTrajectories3D from './ShotTrajectories3D'
import TacticsPlanView from './TacticsPlanView'

const MARK_COLOR = '#ef4444'
const MARK_ACTIVE = '#f59e0b'
const halfWidth = C.width / 2
const halfLength = C.length / 2
const shortLineZ = -halfLength + C.shortLineDistance

/** Стартовый ракурс 3D-корта (сзади по центру) */
const INITIAL_CAMERA = [0, 3.6, halfLength + 7.5]
const INITIAL_TARGET = [0, 1.4, 0]

// Значение селектора ударов, при котором корт просто в режиме осмотра/разметки
const NO_SHOT = 'none'

// Визуальные (не официальные WSF) константы
const FRONT_SOLID_ABOVE_OUT = 0.4
const WALL_THICKNESS = 0.2 // толщина стен наружу

// Дверь в задней стеклянной стене
const DOOR_WIDTH = 1.2
const DOOR_HEIGHT = 2.1

const LIGHT = {
  wall: '#F9FAFC',
  floor: '#F9FAFC',
  tin: '#e2e8f1',
  stroke: '#e2e8f1',
  // Торцы толщины снаружи — чуть серее стен
  endCap: '#E2E5EA',
  glass: '#94a3b8',
  hardware: '#64748b',
  // Как у SVG-пола при наведении: мягкий янтарь (amber-400/25 поверх светлой стены),
  // непрозрачный — иначе через стену «светится» весь объём короба
  highlightWall: '#FAEBC6',
  highlightTin: '#F5E0A8',
  highlightFloor: '#FAEBC6',
  highlightOpacity: 1,
  highlightTinOpacity: 1,
}
const DARK = {
  wall: '#16161a',
  floor: '#0a0a0c',
  tin: '#25252b',
  stroke: '#222227',
  endCap: '#2a2a30',
  glass: '#3f3f46',
  hardware: '#a1a1aa',
  // Как у SVG: dark:fill-[#352418]
  highlightWall: '#352418',
  highlightTin: '#4a3216',
  highlightFloor: '#352418',
  highlightOpacity: 1,
  highlightTinOpacity: 1,
}

const GLASS_OPACITY = 0.35
// Отступ красных линий на стенах от плоскости стены (z-fight).
const Z_EPS = 0.004
const FLOOR_Y = 0.01
const STROKE_WIDTH = 2
const HIT_LINE_WIDTH = 14

const DEFAULT_INFO = {
  title: 'Полнообъёмный 3D-корт',
  dims: 'Справочник описаний и размеров',
  desc: 'Наведите курсор, коснитесь или кликните по любой линии или зоне корта выше, чтобы изучить правила, размеры и особенности разметки.',
}

const frontSolidTopY = C.frontWallHeight + FRONT_SOLID_ABOVE_OUT

// Внешние границы с толщиной наружу.
const outerHalfWidth = halfWidth + WALL_THICKNESS
const zFrontOuter = -halfLength - WALL_THICKNESS

// Границы игровой зоны — общие для контура и красной разметки на полу
const courtLeft = -halfWidth
const courtRight = halfWidth
const courtFront = -halfLength
const courtBack = halfLength

const outLinePoints = [
  [courtLeft, C.frontWallHeight, courtFront + Z_EPS],
  [courtRight, C.frontWallHeight, courtFront + Z_EPS],
  [courtRight, C.backWallHeight, courtBack - Z_EPS],
  [courtLeft, C.backWallHeight, courtBack - Z_EPS],
  [courtLeft, C.frontWallHeight, courtFront + Z_EPS],
]

const tinLinePoints = [
  [courtLeft, C.tinHeight, courtFront + Z_EPS],
  [courtRight, C.tinHeight, courtFront + Z_EPS],
]

const serviceLinePoints = [
  [courtLeft, C.serviceLineHeight, courtFront + Z_EPS],
  [courtRight, C.serviceLineHeight, courtFront + Z_EPS],
]

const shortLinePoints = [
  [courtLeft, FLOOR_Y, shortLineZ],
  [courtRight, FLOOR_Y, shortLineZ],
]

const halfCourtLinePoints = [
  [0, FLOOR_Y, shortLineZ],
  [0, FLOOR_Y, courtBack],
]

function serviceBoxLPoints(xWall, xInner) {
  const zNear = shortLineZ
  const zFar = shortLineZ + C.serviceBoxSize
  return [
    [xWall, FLOOR_Y, zFar],
    [xInner, FLOOR_Y, zFar],
    [xInner, FLOOR_Y, zNear],
  ]
}

const leftBoxPoints = serviceBoxLPoints(courtLeft, courtLeft + C.serviceBoxSize)
const rightBoxPoints = serviceBoxLPoints(courtRight, courtRight - C.serviceBoxSize)

function quad(verts, a, b, c, d) {
  verts.push(...a, ...b, ...c, ...a, ...c, ...d)
}

function geometryFromVerts(verts) {
  const geom = new THREE.BufferGeometry()
  geom.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(verts), 3),
  )
  geom.computeVertexNormals()
  return geom
}

/** Pointer-handlers зоны — как mouseEnter/Leave/Click у SVG-корта */
function zoneHandlers(zone, setActiveId, setCursor) {
  return {
    onPointerOver: (e) => {
      e.stopPropagation()
      setActiveId(zone)
      setCursor?.('pointer')
    },
    onPointerOut: (e) => {
      e.stopPropagation()
      setActiveId((id) => (id === zone ? null : id))
      setCursor?.('grab')
    },
    onClick: (e) => {
      e.stopPropagation()
      setActiveId(zone)
    },
  }
}

function Face({
  geometry,
  color,
  opacity = 1,
  transparent = false,
  doubleSide = false,
  ...events
}) {
  return (
    <mesh geometry={geometry} {...events}>
      <meshBasicMaterial
        color={color}
        side={doubleSide ? THREE.DoubleSide : THREE.FrontSide}
        transparent={transparent}
        opacity={opacity}
        depthWrite={!transparent}
      />
    </mesh>
  )
}

/** Контур стены — явные линии (читаемее, чем EdgesGeometry на box) */
function Stroke({ points, color }) {
  return (
    <Line
      points={points}
      color={color}
      lineWidth={STROKE_WIDTH}
      renderOrder={15}
      onUpdate={(line) => {
        line.renderOrder = 15
        if (line.material) line.material.depthWrite = false
      }}
    />
  )
}

// ——— Глухой U-короб: передняя + боковые.
// Передняя стена — короб на внешнюю ширину (углы), но внутренняя игровая грань
// только ±halfWidth: стыкуется с боковыми и там заканчивается.
// Задний край боковых вровень со стеклом. ———
function buildSolidWallShell() {
  const frontOutY = C.frontWallHeight
  const backOutY = C.backWallHeight
  const solidTop = frontSolidTopY
  const zBack = halfLength
  const zFront = -halfLength

  // Внутренние углы игровой зоны (для боковых и контура корта)
  const iFLB = [-halfWidth, 0, zFront]
  const iFLT = [-halfWidth, frontOutY, zFront]
  const iFRB = [halfWidth, 0, zFront]
  const iFRT = [halfWidth, frontOutY, zFront]
  const iBLB = [-halfWidth, 0, zBack]
  const iBLT = [-halfWidth, backOutY, zBack]
  const iBRB = [halfWidth, 0, zBack]
  const iBRT = [halfWidth, backOutY, zBack]

  // Внешние углы боковых (Z: zFront → zBack)
  const sFLB = [-outerHalfWidth, 0, zFront]
  const sFLT = [-outerHalfWidth, frontOutY, zFront]
  const sFRB = [outerHalfWidth, 0, zFront]
  const sFRT = [outerHalfWidth, frontOutY, zFront]
  const sBLB = [-outerHalfWidth, 0, zBack]
  const sBLT = [-outerHalfWidth, backOutY, zBack]
  const sBRB = [outerHalfWidth, 0, zBack]
  const sBRT = [outerHalfWidth, backOutY, zBack]

  // Передняя стена — внешний короб на всю внешнюю ширину
  const fILB = [-outerHalfWidth, 0, zFront]
  const fIRB = [outerHalfWidth, 0, zFront]
  const fILM = [-outerHalfWidth, frontOutY, zFront]
  const fIRM = [outerHalfWidth, frontOutY, zFront]
  const fILT = [-outerHalfWidth, solidTop, zFront]
  const fIRT = [outerHalfWidth, solidTop, zFront]
  // Внутренняя игровая грань — только ширина корта
  const pILB = [-halfWidth, 0, zFront]
  const pIRB = [halfWidth, 0, zFront]
  const pILM = [-halfWidth, frontOutY, zFront]
  const pIRM = [halfWidth, frontOutY, zFront]
  const fOLB = [-outerHalfWidth, 0, zFrontOuter]
  const fORB = [outerHalfWidth, 0, zFrontOuter]
  const fOLM = [-outerHalfWidth, frontOutY, zFrontOuter]
  const fORM = [outerHalfWidth, frontOutY, zFrontOuter]
  const fOLT = [-outerHalfWidth, solidTop, zFrontOuter]
  const fORT = [outerHalfWidth, solidTop, zFrontOuter]

  // ——— Передняя стена ———
  const innerFrontPlay = []
  const innerFrontAbove = []
  const outerFrontPlay = []
  const outerFrontAbove = []
  const frontSidesPlay = []
  const frontSidesAbove = []
  const frontTop = []
  // Внутренняя грань до боковых — без продолжения в объём боковых стен
  quad(innerFrontPlay, pILB, pIRB, pIRM, pILM)
  // Выше аута — полный внешний пролёт (не игровая зона)
  quad(innerFrontAbove, fILM, fIRM, fIRT, fILT)
  quad(outerFrontPlay, fOLB, fOLM, fORM, fORB)
  quad(outerFrontAbove, fOLM, fOLT, fORT, fORM)
  quad(frontSidesPlay, fILB, fILM, fOLM, fOLB)
  quad(frontSidesPlay, fIRB, fORB, fORM, fIRM)
  quad(frontSidesAbove, fILM, fILT, fOLT, fOLM)
  quad(frontSidesAbove, fIRM, fORM, fORT, fIRT)
  quad(frontTop, fILT, fIRT, fORT, fOLT)

  // ——— Боковые ———
  const innerLeft = []
  const innerRight = []
  const outerLeft = []
  const outerRight = []
  quad(innerLeft, iFLB, iFLT, iBLT, iBLB)
  quad(innerRight, iFRB, iBRB, iBRT, iFRT)
  quad(outerLeft, sFLB, sBLB, sBLT, sFLT)
  quad(outerRight, sFRB, sFRT, sBRT, sBRB)

  // ——— Торцы боковых: спереди закрывают толщину (вместо продолжения внутренней фронтальной грани) ———
  const sideEndCaps = []
  quad(sideEndCaps, iFLB, sFLB, sFLT, iFLT)
  quad(sideEndCaps, iFRB, iFRT, sFRT, sFRB)
  quad(sideEndCaps, iBLB, sBLB, sBLT, iBLT)
  quad(sideEndCaps, iBRB, iBRT, sBRT, sBRB)
  quad(sideEndCaps, iFLT, iBLT, sBLT, sFLT)
  quad(sideEndCaps, iFRT, sFRT, sBRT, iBRT)

  // ——— Нижние торцы ———
  const bottomCaps = []
  quad(bottomCaps, iFLB, sFLB, sBLB, iBLB)
  quad(bottomCaps, iFRB, iBRB, sBRB, sFRB)
  quad(bottomCaps, fILB, fOLB, fORB, fIRB)

  // Нижние точки контура чуть выше y=0 — иначе z-fight с торцами/полом.
  // Задние торцы чуть снаружи стекла (+Z), иначе ребро толщины пропадает в плоскости торца.
  const yB = FLOOR_Y
  const zBackStroke = zBack + Z_EPS
  const sBLBb = [sBLB[0], yB, sBLB[2]]
  const sFLBb = [sFLB[0], yB, sFLB[2]]
  const fOLBb = [fOLB[0], yB, fOLB[2]]
  const fORBb = [fORB[0], yB, fORB[2]]
  const sFRBb = [sFRB[0], yB, sFRB[2]]
  const sBRBb = [sBRB[0], yB, sBRB[2]]
  const iBLBb = [iBLB[0], yB, zBackStroke]
  const sBLBbEnd = [sBLB[0], yB, zBackStroke]
  const iBRBb = [iBRB[0], yB, zBackStroke]
  const sBRBbEnd = [sBRB[0], yB, zBackStroke]

  // Один цельный внешний контур U-короба (передняя + боковые).
  // Ступенька у передней — осевая: верх боковой (out) → solidTop → верх передней.
  const shellStroke = [
    sFLT,
    sBLT,
    sBLBb,
    sFLBb,
    fOLBb,
    fOLT,
    fORT,
    fORBb,
    sFRBb,
    sBRBb,
    sBRT,
    sFRT,
    fIRT,
    fILT,
    sFLT,
  ]

  // Контур верхнего торца передней стены (толщина сверху)
  const frontTopStroke = [fILT, fIRT, fORT, fOLT, fILT]

  // Нижний внешний контур U + нижние рёбра задних торцов
  const shellBottomStroke = [
    iBLBb,
    sBLBbEnd,
    sFLBb,
    fOLBb,
    fORBb,
    sFRBb,
    sBRBbEnd,
    iBRBb,
  ]

  return {
    innerFrontPlay: geometryFromVerts(innerFrontPlay),
    innerFrontAbove: geometryFromVerts(innerFrontAbove),
    outerFrontPlay: geometryFromVerts(outerFrontPlay),
    outerFrontAbove: geometryFromVerts(outerFrontAbove),
    frontSidesPlay: geometryFromVerts(frontSidesPlay),
    frontSidesAbove: geometryFromVerts(frontSidesAbove),
    frontTop: geometryFromVerts(frontTop),
    innerLeft: geometryFromVerts(innerLeft),
    innerRight: geometryFromVerts(innerRight),
    outerLeft: geometryFromVerts(outerLeft),
    outerRight: geometryFromVerts(outerRight),
    sideEndCaps: geometryFromVerts(sideEndCaps),
    bottomCaps: geometryFromVerts(bottomCaps),
    shellStroke,
    frontTopStroke,
    shellBottomStroke,
  }
}

function SolidWallShell({ colors, activeId, setActiveId, setCursor }) {
  const parts = useMemo(() => buildSolidWallShell(), [])

  useEffect(() => {
    return () => {
      ;[
        parts.innerFrontPlay,
        parts.innerFrontAbove,
        parts.outerFrontPlay,
        parts.outerFrontAbove,
        parts.frontSidesPlay,
        parts.frontSidesAbove,
        parts.frontTop,
        parts.innerLeft,
        parts.innerRight,
        parts.outerLeft,
        parts.outerRight,
        parts.sideEndCaps,
        parts.bottomCaps,
      ].forEach((g) => g?.dispose?.())
    }
  }, [parts])

  const wallSeeThrough = {
    transparent: true,
    opacity: GLASS_OPACITY,
    doubleSide: true,
  }

  const frontActive = activeId === 'frontWall'
  const leftActive = activeId === 'leftWall'
  const rightActive = activeId === 'rightWall'
  const front = frontActive ? colors.highlightWall : colors.wall
  const left = leftActive ? colors.highlightWall : colors.wall
  const right = rightActive ? colors.highlightWall : colors.wall
  const frontOp = frontActive ? colors.highlightOpacity : 1
  const leftOp = leftActive ? colors.highlightOpacity : 1
  const rightOp = rightActive ? colors.highlightOpacity : 1
  const frontH = zoneHandlers('frontWall', setActiveId, setCursor)
  const leftH = zoneHandlers('leftWall', setActiveId, setCursor)
  const rightH = zoneHandlers('rightWall', setActiveId, setCursor)

  return (
    <group>
      {/* Подсветка и ховер — только внутренняя игровая грань (до аута) */}
      <Face
        geometry={parts.innerFrontPlay}
        color={front}
        opacity={frontOp}
        transparent={frontActive && frontOp < 1}
        {...frontH}
      />
      <Face geometry={parts.outerFrontPlay} color={colors.wall} {...wallSeeThrough} />
      <Face geometry={parts.frontSidesPlay} color={colors.wall} {...wallSeeThrough} />
      {/* Нарощение выше аута — без подсветки frontWall */}
      <Face geometry={parts.innerFrontAbove} color={colors.wall} />
      <Face geometry={parts.outerFrontAbove} color={colors.wall} {...wallSeeThrough} />
      <Face geometry={parts.frontSidesAbove} color={colors.wall} {...wallSeeThrough} />
      <Face geometry={parts.frontTop} color={colors.wall} {...wallSeeThrough} />

      <Face
        geometry={parts.innerLeft}
        color={left}
        opacity={leftOp}
        transparent={leftActive && leftOp < 1}
        {...leftH}
      />
      <Face
        geometry={parts.innerRight}
        color={right}
        opacity={rightOp}
        transparent={rightActive && rightOp < 1}
        {...rightH}
      />
      <Face geometry={parts.outerLeft} color={colors.wall} {...wallSeeThrough} />
      <Face geometry={parts.outerRight} color={colors.wall} {...wallSeeThrough} />
      <Face geometry={parts.sideEndCaps} color={colors.wall} {...wallSeeThrough} />
      <Face geometry={parts.bottomCaps} color={colors.endCap} {...wallSeeThrough} />

      <Stroke points={parts.shellStroke} color={colors.stroke} />
      <Stroke points={parts.shellBottomStroke} color={colors.stroke} />
      <Stroke points={parts.frontTopStroke} color={colors.stroke} />
    </group>
  )
}

/** Контур игровой зоны — вплотную к внутренним поверхностям стен.
 *  Красная разметка на полу использует те же courtLeft/Right/Front/Back. */
function InteriorJoints({ colors }) {
  const y0 = FLOOR_Y
  const yOut = C.frontWallHeight
  // Чуть от плоскости стены только по нормали передней (как у красных линий на ней)
  const zF = courtFront + Z_EPS

  return (
    <group>
      <Stroke
        color={colors.stroke}
        points={[
          [courtLeft, y0, courtBack],
          [courtLeft, y0, zF],
          [courtRight, y0, zF],
          [courtRight, y0, courtBack],
        ]}
      />
      <Stroke
        color={colors.stroke}
        points={[
          [courtLeft, y0, zF],
          [courtLeft, yOut, zF],
        ]}
      />
      <Stroke
        color={colors.stroke}
        points={[
          [courtRight, y0, zF],
          [courtRight, yOut, zF],
        ]}
      />
    </group>
  )
}

// ——— Задняя стеклянная стена + дверь (без толщины — она стеклянная, тонкая) ———
function BackGlassWall({ colors, activeId, setActiveId, setCursor }) {
  const z = halfLength
  const h = C.backWallHeight
  const zDoor = z + 0.02
  const hingeX = DOOR_WIDTH / 2
  const handleX = -DOOR_WIDTH / 2 + 0.08
  const hw = colors.hardware
  const active = activeId === 'backWall'
  const backH = zoneHandlers('backWall', setActiveId, setCursor)

  return (
    <group>
      {/* Базовое стекло — видно с обеих сторон, без подсветки */}
      <mesh position={[0, h / 2, z]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[C.width, h]} />
        <meshBasicMaterial
          color={colors.glass}
          side={THREE.DoubleSide}
          transparent
          opacity={GLASS_OPACITY}
          depthWrite={false}
        />
      </mesh>
      {/* Ховер и подсветка — только внутренняя грань */}
      <mesh position={[0, h / 2, z - 0.001]} rotation={[0, Math.PI, 0]} {...backH}>
        <planeGeometry args={[C.width, h]} />
        <meshBasicMaterial
          color={colors.highlightWall}
          side={THREE.FrontSide}
          transparent={active ? colors.highlightOpacity < 1 : true}
          opacity={active ? colors.highlightOpacity : 0}
          depthWrite={false}
        />
      </mesh>

      {/* Внешний контур задней стены */}
      <Stroke
        color={colors.stroke}
        points={[
          [-halfWidth, FLOOR_Y, z + Z_EPS],
          [halfWidth, FLOOR_Y, z + Z_EPS],
          [halfWidth, h, z + Z_EPS],
          [-halfWidth, h, z + Z_EPS],
          [-halfWidth, FLOOR_Y, z + Z_EPS],
        ]}
      />

      {/* Контур двери */}
      <Line
        points={[
          [-DOOR_WIDTH / 2, 0, zDoor],
          [DOOR_WIDTH / 2, 0, zDoor],
          [DOOR_WIDTH / 2, DOOR_HEIGHT, zDoor],
          [-DOOR_WIDTH / 2, DOOR_HEIGHT, zDoor],
          [-DOOR_WIDTH / 2, 0, zDoor],
        ]}
        color={colors.stroke}
        lineWidth={2}
      />

      {/* Петли (3 шт. на правом краю) */}
      {[0.35, DOOR_HEIGHT / 2, DOOR_HEIGHT - 0.35].map((y) => (
        <group key={y} position={[hingeX, y, zDoor]}>
          <mesh>
            <boxGeometry args={[0.06, 0.14, 0.03]} />
            <meshBasicMaterial color={hw} />
          </mesh>
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.03]} />
            <meshBasicMaterial color={hw} />
          </mesh>
        </group>
      ))}

      {/* Ручка слева */}
      <mesh position={[handleX, DOOR_HEIGHT / 2, zDoor + 0.02]}>
        <boxGeometry args={[0.04, 0.18, 0.04]} />
        <meshBasicMaterial color={hw} />
      </mesh>
      <mesh position={[handleX + 0.06, DOOR_HEIGHT / 2, zDoor + 0.02]}>
        <boxGeometry args={[0.1, 0.03, 0.03]} />
        <meshBasicMaterial color={hw} />
      </mesh>
    </group>
  )
}

function ForceRender({ dep }) {
  const invalidate = useThree((state) => state.invalidate)
  const { gl, scene } = useThree()

  useEffect(() => {
    // Прозрачный фон Canvas — видна подложка карточки, цвета стен не «съедает» sceneBg.
    // scene/gl — императивные объекты three.js из r3f, а не React-стейт: мутация штатна.
    // eslint-disable-next-line react-hooks/immutability
    scene.background = null
    gl.setClearColor(0x000000, 0)
    // eslint-disable-next-line react-hooks/immutability
    gl.domElement.style.cursor = 'grab'
    invalidate()
  }, [invalidate, dep, gl, scene])

  return null
}

function InvalidateOnHover({ activeId }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    invalidate()
  }, [activeId, invalidate])
  return null
}

/** Невидимая «толстая» линия для удобного наведения (как strokeWidth=16 у SVG) */
function MarkLine({ points, zone, activeId, setActiveId, setCursor }) {
  const active = activeId === zone
  const handlers = zoneHandlers(zone, setActiveId, setCursor)
  return (
    <group>
      <Line
        points={points}
        color={active ? MARK_ACTIVE : MARK_COLOR}
        lineWidth={active ? 4 : 2}
        renderOrder={20}
        depthTest
        onUpdate={(line) => {
          line.renderOrder = 20
          if (line.material) line.material.depthWrite = false
        }}
      />
      {/* Хитбокс: opacity 0, но visible — иначе raycast не срабатывает */}
      <Line
        points={points}
        color={MARK_COLOR}
        lineWidth={HIT_LINE_WIDTH}
        transparent
        opacity={0}
        depthWrite={false}
        renderOrder={25}
        {...handlers}
      />
    </group>
  )
}

/** Плоский хитбокс на передней стене (тин / подача / аут) */
function FrontStripHit({ y, height = 0.28, zone, setActiveId, setCursor }) {
  return (
    <mesh
      position={[0, y, courtFront + 0.03]}
      {...zoneHandlers(zone, setActiveId, setCursor)}
    >
      <planeGeometry args={[C.width, height]} />
      <meshBasicMaterial
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function CourtMeshes({ colors, activeId, setActiveId, zonesEnabled = true }) {
  const gl = useThree((s) => s.gl)
  const setCursor = (c) => {
    // gl — императивный объект three.js из r3f, а не React-стейт: мутация штатна.
    // eslint-disable-next-line react-hooks/immutability
    gl.domElement.style.cursor = c
  }

  const noop = () => {}
  const setZone = zonesEnabled ? setActiveId : noop
  const cursor = zonesEnabled ? setCursor : noop

  const floorH = zoneHandlers('floor', setZone, cursor)
  const tinH = zoneHandlers('tin', setZone, cursor)
  const boxH = zoneHandlers('box', setZone, cursor)
  const tZoneH = zoneHandlers('tZone', setZone, cursor)

  const tinActive = activeId === 'tin'
  const floorActive = activeId === 'floor'
  const tinColor = tinActive ? colors.highlightTin : colors.tin
  const floorColor = floorActive ? colors.highlightFloor : colors.floor
  const boxFillOp = activeId === 'box' ? colors.highlightOpacity : 0

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} {...floorH}>
        <planeGeometry args={[C.width, C.length]} />
        <meshBasicMaterial
          color={floorColor}
          side={THREE.DoubleSide}
          transparent={floorActive && colors.highlightOpacity < 1}
          opacity={floorActive ? colors.highlightOpacity : 1}
          depthWrite={!(floorActive && colors.highlightOpacity < 1)}
        />
      </mesh>

      {/* Подсветка квадратов подачи (как fill у SVG) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[
          courtLeft + C.serviceBoxSize / 2,
          FLOOR_Y + 0.002,
          shortLineZ + C.serviceBoxSize / 2,
        ]}
        {...boxH}
      >
        <planeGeometry args={[C.serviceBoxSize, C.serviceBoxSize]} />
        <meshBasicMaterial
          color={colors.highlightFloor}
          transparent
          opacity={boxFillOp}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[
          courtRight - C.serviceBoxSize / 2,
          FLOOR_Y + 0.002,
          shortLineZ + C.serviceBoxSize / 2,
        ]}
        {...boxH}
      >
        <planeGeometry args={[C.serviceBoxSize, C.serviceBoxSize]} />
        <meshBasicMaterial
          color={colors.highlightFloor}
          transparent
          opacity={boxFillOp}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Хитбоксы Т-зоны на полу */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, FLOOR_Y + 0.003, shortLineZ]}
        {...tZoneH}
      >
        <planeGeometry args={[C.width, 0.28]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[
          0,
          FLOOR_Y + 0.003,
          (shortLineZ + courtBack) / 2,
        ]}
        {...tZoneH}
      >
        <planeGeometry args={[0.28, courtBack - shortLineZ]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <SolidWallShell
        colors={colors}
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <BackGlassWall
        colors={colors}
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <InteriorJoints colors={colors} />

      <mesh position={[0, C.tinHeight / 2, courtFront + Z_EPS]} {...tinH}>
        <planeGeometry args={[C.width, C.tinHeight]} />
        <meshBasicMaterial
          color={tinColor}
          side={THREE.DoubleSide}
          transparent={tinActive && colors.highlightTinOpacity < 1}
          opacity={tinActive ? colors.highlightTinOpacity : 1}
          depthWrite={!(tinActive && colors.highlightTinOpacity < 1)}
        />
      </mesh>

      <FrontStripHit
        y={C.serviceLineHeight}
        zone='service'
        setActiveId={setZone}
        setCursor={cursor}
      />
      <FrontStripHit
        y={C.frontWallHeight}
        zone='out'
        setActiveId={setZone}
        setCursor={cursor}
      />

      <MarkLine
        points={outLinePoints}
        zone='out'
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <MarkLine
        points={tinLinePoints}
        zone='tin'
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <MarkLine
        points={serviceLinePoints}
        zone='service'
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <MarkLine
        points={shortLinePoints}
        zone='tZone'
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <MarkLine
        points={halfCourtLinePoints}
        zone='tZone'
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <MarkLine
        points={leftBoxPoints}
        zone='box'
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
      <MarkLine
        points={rightBoxPoints}
        zone='box'
        activeId={zonesEnabled ? activeId : null}
        setActiveId={setZone}
        setCursor={cursor}
      />
    </group>
  )
}

export default function Court3D() {
  const theme = useTheme()
  const isDarkMode = theme?.isDarkMode ?? true
  const colors = isDarkMode ? DARK : LIGHT
  const [activeId, setActiveId] = useState(null)
  const [activeShot, setActiveShot] = useState(NO_SHOT)
  // При системной настройке «уменьшить движение» анимация мяча стартует на паузе
  // (Court3D грузится через dynamic ssr:false — matchMedia доступен сразу).
  const [animPaused, setAnimPaused] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  )
  const [showLeft, setShowLeft] = useState(true)
  const [showRight, setShowRight] = useState(true)
  const [isShotMenuOpen, setIsShotMenuOpen] = useState(false)
  const controlsRef = useRef(null)
  const cardRef = useRef(null)
  const shotMenuRef = useRef(null)
  const hideTimerRef = useRef(null)
  // true, только пока полноэкранный режим держится через нативный Fullscreen API —
  // отличаем от CSS-фолбэка, где нет document.fullscreenElement и своя логика выхода.
  const usingNativeFsRef = useRef(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Видимость плавающей панели в fullscreen (прячется через паузу бездействия)
  const [controlsVisible, setControlsVisible] = useState(true)
  // Канвас на секунду прячется при входе в fullscreen — маскирует «прыжок» кадра,
  // который даёт нативный анимированный переход браузера/ОС в fullscreen (viewport
  // меняется постепенно, наш канвас пересчитывает размер вслед за ним каждый кадр).
  const [canvasReady, setCanvasReady] = useState(true)
  // Бамп → ForceRender/invalidate после сброса камеры (frameloop: demand)
  const [viewTick, setViewTick] = useState(0)

  const resetCourtView = () => {
    const controls = controlsRef.current
    if (!controls) return
    controls.object.position.set(...INITIAL_CAMERA)
    controls.target.set(...INITIAL_TARGET)
    controls.update()
    setViewTick((n) => n + 1)
  }

  const bumpViewTick = () => {
    setViewTick((n) => n + 1)
    // Resize при входе/выходе из fullscreen иногда завершается уже после первого
    // инвалидейта (демо-режим frameloop) — добиваем вторым бампом с задержкой.
    setTimeout(() => setViewTick((n) => n + 1), 120)
  }

  // Восстанавливаем удар и стороны из ?shot=/&left=0&right=0 при загрузке —
  // так поделённая ссылка сразу открывает нужную траекторию.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shot = params.get('shot')
    if (shot && (shot === NO_SHOT || tacticsData[shot])) setActiveShot(shot)
    if (params.get('left') === '0') setShowLeft(false)
    if (params.get('right') === '0') setShowRight(false)
  }, [])

  // Синхронизируем выбор обратно в URL, чтобы текущий вид можно было скопировать и переслать
  useEffect(() => {
    const url = new URL(window.location.href)
    if (activeShot !== NO_SHOT) {
      url.searchParams.set('shot', activeShot)
      if (!showLeft) url.searchParams.set('left', '0')
      else url.searchParams.delete('left')
      if (!showRight) url.searchParams.set('right', '0')
      else url.searchParams.delete('right')
    } else {
      url.searchParams.delete('shot')
      url.searchParams.delete('left')
      url.searchParams.delete('right')
    }
    window.history.replaceState({}, '', url)
  }, [activeShot, showLeft, showRight])

  // При входе в fullscreen — НЕ трогаем камеру и ракурс: раньше здесь стоял
  // автосброс вида, и именно он читался как «дёрганье» (мгновенный снап позиции
  // сразу же после клика). Состояние корта (ракурс, выбранный удар и т.д.)
  // теперь полностью сохраняется при переходе туда и обратно — меняем только
  // размер канваса, и то маскируем эту смену коротким фейдом.
  useEffect(() => {
    if (!isFullscreen) return
    setCanvasReady(false)
    const t = setTimeout(() => setCanvasReady(true), 380)
    return () => clearTimeout(t)
  }, [isFullscreen])

  useEffect(() => {
    const onFsChange = () => {
      if (!usingNativeFsRef.current) return
      const active = !!(document.fullscreenElement || document.webkitFullscreenElement)
      setIsFullscreen(active)
      if (!active) usingNativeFsRef.current = false
      bumpViewTick()
    }
    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
    }
  }, [])

  useEffect(() => {
    if (!isFullscreen || usingNativeFsRef.current) return
    // CSS-фолбэк (нет Fullscreen API, напр. Safari iOS) — сами обрабатываем Escape.
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isFullscreen])

  // Закрываем список ударов по клику/тапу вне него и по Escape
  useEffect(() => {
    if (!isShotMenuOpen) return
    const handleOutside = (e) => {
      if (shotMenuRef.current && !shotMenuRef.current.contains(e.target)) {
        setIsShotMenuOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsShotMenuOpen(false)
    }
    document.addEventListener('pointerdown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isShotMenuOpen])

  // Горячие клавиши: Space — пауза/пуск анимации удара, R — сбросить ракурс.
  // Игнорируем поля ввода, чтобы не мешать вводу текста в других частях страницы.
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.code === 'Space') {
        if (activeShot === NO_SHOT) return
        e.preventDefault()
        setAnimPaused((p) => !p)
      } else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // code, а не key — физическая позиция клавиши, работает в любой раскладке
        resetCourtView()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeShot])

  // В fullscreen прячем панель через паузу бездействия — как в видеоплеерах;
  // движение курсора/тач/клавиша возвращают её. Пока открыт список ударов — не прячем.
  useEffect(() => {
    if (!isFullscreen || isShotMenuOpen) {
      setControlsVisible(true)
      return
    }
    const scheduleHide = () => {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2600)
    }
    const onActivity = () => {
      setControlsVisible(true)
      scheduleHide()
    }
    scheduleHide()
    // capture: true — OrbitControls гасит всплытие pointer-событий на канвасе
    // (stopPropagation), иначе движение/клик по самому корту не засчитывались бы.
    window.addEventListener('pointermove', onActivity, true)
    window.addEventListener('pointerdown', onActivity, true)
    window.addEventListener('keydown', onActivity, true)
    return () => {
      clearTimeout(hideTimerRef.current)
      window.removeEventListener('pointermove', onActivity, true)
      window.removeEventListener('pointerdown', onActivity, true)
      window.removeEventListener('keydown', onActivity, true)
    }
  }, [isFullscreen, isShotMenuOpen])

  const fallbackToOverlay = () => {
    usingNativeFsRef.current = false
    setIsFullscreen(true)
    bumpViewTick()
  }

  const toggleFullscreen = () => {
    const el = cardRef.current
    if (!el) return
    const fsActive = document.fullscreenElement || document.webkitFullscreenElement
    if (!isFullscreen && !fsActive) {
      const request = el.requestFullscreen?.bind(el) || el.webkitRequestFullscreen?.bind(el)
      if (request) {
        usingNativeFsRef.current = true
        let settled = false
        Promise.resolve(request())
          .then(() => {
            settled = true
          })
          .catch(() => {
            settled = true
            fallbackToOverlay()
          })
        // Permissions Policy (напр. встроенный iframe без allow="fullscreen") может
        // не отклонять промис явно, а просто никогда его не разрешать — подстраховываемся.
        setTimeout(() => {
          if (!settled && !document.fullscreenElement) fallbackToOverlay()
        }, 1200)
      } else {
        fallbackToOverlay()
      }
    } else if (usingNativeFsRef.current) {
      const exit = document.exitFullscreen?.bind(document) || document.webkitExitFullscreen?.bind(document)
      exit?.()
    } else {
      setIsFullscreen(false)
      bumpViewTick()
    }
  }

  const zoneInfo =
    activeId && courtData[activeId] ? courtData[activeId] : DEFAULT_INFO
  const shotsMode = activeShot !== NO_SHOT
  const shotInfo = shotsMode ? tacticsData[activeShot] : null
  const shotSides = (shotInfo?.paths3d ?? []).map((p) => p.side)
  const hasLeftPath = shotSides.includes('left')
  const hasRightPath = shotSides.includes('right')

  const shotOptions = [
    { value: NO_SHOT, label: 'Обзор корта' },
    ...Object.keys(tacticsData).map((key) => ({
      value: key,
      label: SHOT_LABELS[key] ?? key,
    })),
  ]
  const currentShotLabel =
    shotOptions.find((o) => o.value === activeShot)?.label ?? 'Обзор корта'

  return (
    <div
      ref={cardRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen overflow-hidden border-0 rounded-none bg-white dark:bg-neutral-950 text-slate-900 dark:text-slate-100'
          : 'p-6 rounded-xl border transition-all duration-300 my-8 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 text-slate-900 dark:text-slate-100'
      }
    >
      {!isFullscreen && (
        <div className='mb-4 w-full'>
          <span className='text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest block'>
            Масштаб 1:1 по размерам WSF
          </span>
          <p className='text-xs mt-1 text-slate-500 dark:text-slate-400'>
            {shotsMode
              ? 'Выберите сторону — мяч полетит по траектории на корте и на плане сверху.'
              : 'Вращайте корт мышью или пальцем. Наведите или коснитесь линии либо зоны, чтобы изучить правила и размеры разметки.'}
          </p>
        </div>
      )}

      {/* Единая панель управления: выбор удара/стороны и вид всегда доступны, без вкладок.
          В fullscreen — плавающий оверлей, зафиксированный относительно экрана (не относительно
          прокрутки канвы), с небольшим отступом от края и автоскрытием по паузе бездействия. */}
      <div
        className={
          isFullscreen
            ? `fixed top-4 inset-x-4 sm:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-slate-200/70 dark:border-neutral-800/70 bg-white/90 dark:bg-neutral-900/85 backdrop-blur-md shadow-lg px-3 py-2 transition-opacity duration-300 ${
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`
            : 'mb-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-900/30 px-3 py-2'
        }
      >
        <div className='flex flex-wrap items-center gap-2'>
          <div className='relative' ref={shotMenuRef}>
            <button
              type='button'
              onClick={() => setIsShotMenuOpen((o) => !o)}
              aria-haspopup='listbox'
              aria-expanded={isShotMenuOpen}
              aria-label='Показать траекторию удара'
              className='flex items-center justify-between gap-2 w-36 shrink-0 rounded-md border px-3 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-neutral-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500'
            >
              <span className='truncate'>{currentShotLabel}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                className={`w-2.5 h-2.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isShotMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m19.5 8.25-7.5 7.5-7.5-7.5'
                />
              </svg>
            </button>

            <div
              className={`absolute left-0 top-full pt-2 z-20 transition-all duration-150 ${
                isShotMenuOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-1'
              }`}
            >
              <div
                role='listbox'
                aria-label='Тип удара'
                className='w-52 max-h-72 overflow-y-auto p-1.5 rounded-xl border shadow-xl bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
              >
                {shotOptions.map((opt) => {
                  const isActive = opt.value === activeShot
                  return (
                    <button
                      key={opt.value}
                      type='button'
                      role='option'
                      aria-selected={isActive}
                      onClick={() => {
                        setActiveShot(opt.value)
                        setActiveId(null)
                        setIsShotMenuOpen(false)
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-1.5' role='group' aria-label='Сторона показа траектории'>
            <button
              type='button'
              aria-pressed={showLeft}
              disabled={!shotsMode || !hasLeftPath}
              onClick={() => setShowLeft((v) => !v)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default ${
                showLeft && hasLeftPath
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                className='w-3 h-3'
                aria-hidden='true'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15 18l-6-6 6-6' />
              </svg>
              Слева
            </button>
            <button
              type='button'
              aria-pressed={showRight}
              disabled={!shotsMode || !hasRightPath}
              onClick={() => setShowRight((v) => !v)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default ${
                showRight && hasRightPath
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
              }`}
            >
              Справа
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                className='w-3 h-3'
                aria-hidden='true'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 6l6 6-6 6' />
              </svg>
            </button>
          </div>
        </div>

        <div className='flex items-center gap-0.5'>
          <button
            type='button'
            onClick={() => setAnimPaused((p) => !p)}
            disabled={!shotsMode}
            aria-label={animPaused ? 'Воспроизвести анимацию' : 'Пауза'}
            title={animPaused ? 'Воспроизвести (Space)' : 'Пауза (Space)'}
            className='p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-default transition-colors cursor-pointer'
          >
            {animPaused ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-5 h-5'
                aria-hidden='true'
              >
                <path d='M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-5 h-5'
                aria-hidden='true'
              >
                <path d='M6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5Zm8 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5Z' />
              </svg>
            )}
          </button>

          <div className='h-5 w-px bg-slate-200 dark:bg-neutral-800 mx-1' aria-hidden='true' />

          <button
            type='button'
            onClick={resetCourtView}
            aria-label='Вернуть корт в исходное положение'
            title='Сбросить ракурс (R)'
            className='p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-5 h-5'
              aria-hidden='true'
            >
              <circle cx='12' cy='12' r='3' />
              <path d='M12 2v3M12 19v3M2 12h3M19 12h3' />
            </svg>
          </button>

          <button
            type='button'
            onClick={toggleFullscreen}
            aria-pressed={isFullscreen}
            aria-label={isFullscreen ? 'Свернуть из полноэкранного режима' : 'Развернуть на весь экран'}
            title={isFullscreen ? 'Свернуть' : 'На весь экран'}
            className='p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer'
          >
            {isFullscreen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-5 h-5'
                aria-hidden='true'
              >
                <path d='M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-5 h-5'
                aria-hidden='true'
              >
                <path d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 15' />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        {/* В fullscreen панель управления и описание — плавающие оверлеи поверх канваса
            (см. ниже), прокрутка страницы отключена полностью — канвас занимает ровно весь
            экран. Размер — чистый CSS, без JS-измерений. На короткое время после входа канвас
            скрыт (canvasReady) — маскирует «прыжок» кадра от нативного анимированного
            перехода браузера/ОС в fullscreen. */}
        <div
          className={
            isFullscreen
              ? `w-full h-screen touch-none bg-transparent transition-opacity duration-300 ${
                  canvasReady ? 'opacity-100' : 'opacity-0'
                }`
              : 'aspect-[4/3] sm:aspect-[16/10] w-full rounded-lg overflow-hidden touch-none bg-transparent'
          }
        >
            <Canvas
              // На паузе непрерывный рендер не нужен — сцена статична
              frameloop={shotsMode && !animPaused ? 'always' : 'demand'}
              dpr={[1, 2]}
              // Стартовый ракурс: ровно сзади по центру; выше и дальше — чтобы пол не обрезался
              camera={{ position: INITIAL_CAMERA, fov: 40 }}
              // flat = NoToneMapping: иначе ACES «съедает» светлые цвета
              // (#F9FAFC → ~#E1E1E1)
              flat
              gl={{ antialias: true, alpha: true }}
              onPointerMissed={() => {
                if (!shotsMode) setActiveId(null)
              }}
            >
              <ForceRender
                dep={`${isDarkMode}-${activeShot}-${animPaused}-${showLeft}-${showRight}-${viewTick}`}
              />
              <InvalidateOnHover activeId={activeId} />
              <CourtMeshes
                colors={colors}
                activeId={activeId}
                setActiveId={setActiveId}
                zonesEnabled={!shotsMode}
              />
              {shotsMode ? (
                <ShotTrajectories3D
                  shotKey={activeShot}
                  paused={animPaused}
                  showLeft={showLeft}
                  showRight={showRight}
                />
              ) : null}
              <OrbitControls
                ref={controlsRef}
                makeDefault
                enableDamping
                dampingFactor={0.08}
                target={INITIAL_TARGET}
                minDistance={0.6}
                maxDistance={22}
                minPolarAngle={0.15}
                maxPolarAngle={Math.PI / 2 - 0.02}
              />
            </Canvas>
          </div>

      {isFullscreen ? (
        // Описание — плавающий оверлей поверх канваса снизу, с тем же автоскрытием
        // по паузе бездействия, что и панель управления сверху (controlsVisible общий).
        // Прокрутки в fullscreen больше нет вообще, поэтому план сверху (отдельная
        // проекция) здесь не дублируем — только текстовый разбор, компактно.
        <div
          className={`fixed bottom-4 inset-x-4 sm:inset-x-6 z-20 max-h-[42vh] overflow-y-auto rounded-lg border border-slate-200/70 dark:border-neutral-800/70 bg-white/90 dark:bg-neutral-900/85 backdrop-blur-md shadow-lg p-4 transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {shotsMode ? (
            <>
              <h2 className='font-extrabold text-base text-slate-900 dark:text-slate-100'>
                {shotInfo.title}
              </h2>
              <p className='text-xs mt-2 leading-relaxed text-slate-500 dark:text-slate-400'>
                {shotInfo.desc}
              </p>
              <div className='mt-3 pt-3 border-t border-slate-200 dark:border-neutral-800/40'>
                <span className='text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider block mb-1'>
                  Когда применять:
                </span>
                <p className='text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
                  {shotInfo.when}
                </p>
              </div>
              <div className='mt-3 pt-3 border-t border-slate-200 dark:border-neutral-800/40'>
                <span className='text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1'>
                  Частая ошибка новичков:
                </span>
                <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                  {shotInfo.mistake}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className='font-bold text-sm text-slate-800 dark:text-slate-200'>
                {zoneInfo.title}
              </div>
              <div className='text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider mt-1'>
                {zoneInfo.dims}
              </div>
              <p className='text-xs mt-2 leading-relaxed text-slate-500 dark:text-slate-400'>
                {zoneInfo.desc}
              </p>
            </>
          )}
        </div>
      ) : shotsMode ? (
        // Две проекции одного удара: перспектива выше, план сверху — рядом с разбором.
        // Отдельная строка грида под подпись, чтобы на десктопе она стояла точно над
        // планом, а карточка разбора начиналась вровень с самим планом (не с подписью).
        <div className='mt-6 grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr] md:grid-rows-[auto_1fr]'>
          <span className='md:col-start-1 md:row-start-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            Вид сверху
          </span>

          <div className='mx-auto w-full max-w-[18rem] md:max-w-none md:col-start-1 md:row-start-2'>
            <TacticsPlanView
              activeShot={activeShot}
              showLeft={showLeft}
              showRight={showRight}
              paused={animPaused}
            />
          </div>

          <div className='md:col-start-2 md:row-start-2 p-5 rounded-lg border transition-all duration-300 bg-slate-50 dark:bg-neutral-950/40 border-slate-200 dark:border-neutral-800'>
            <h2 className='font-extrabold text-base text-slate-900 dark:text-slate-100'>
              {shotInfo.title}
            </h2>
            <p className='text-xs mt-2 leading-relaxed text-slate-500 dark:text-slate-400'>
              {shotInfo.desc}
            </p>
            <div className='mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800/40'>
              <span className='text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider block mb-1'>
                Когда применять:
              </span>
              <p className='text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
                {shotInfo.when}
              </p>
            </div>
            <div className='mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800/40'>
              <span className='text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1'>
                Частая ошибка новичков:
              </span>
              <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                {shotInfo.mistake}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className='mt-6 p-4 rounded-lg border transition-all duration-300 bg-slate-50 dark:bg-neutral-950/40 border-slate-200 dark:border-neutral-800'>
          <div className='font-bold text-sm text-slate-800 dark:text-slate-200'>
            {zoneInfo.title}
          </div>
          <div className='text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider mt-1'>
            {zoneInfo.dims}
          </div>
          <p className='min-h-10 text-xs mt-2 leading-relaxed text-slate-500 dark:text-slate-400'>
            {zoneInfo.desc}
          </p>
        </div>
      )}
      </div>
    </div>
  )
}
