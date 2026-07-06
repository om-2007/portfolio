import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShape({ position, rotation, scale, color, speed, distort, mouse }) {
  const ref = useRef()
  const basePos = useMemo(() => position, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.x = rotation[0] + Math.sin(t * speed * 0.3) * 0.2
      ref.current.rotation.y = rotation[1] + Math.cos(t * speed * 0.2) * 0.2

      if (mouse.current) {
        const targetX = basePos[0] + mouse.current.x * 1.5
        const targetY = basePos[1] + mouse.current.y * 1.5
        ref.current.position.x += (targetX - ref.current.position.x) * 0.02
        ref.current.position.y += (targetY - ref.current.position.y) * 0.02
      }
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

function Particles({ count = 300, mouse }) {
  const ref = useRef()
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#c084fc'),
      new THREE.Color('#6366f1'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#06b6d4'),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime()
      const targetRotY = t * 0.02 + (mouse.current ? mouse.current.x * 0.3 : 0)
      const targetRotX = Math.sin(t * 0.01) * 0.1 + (mouse.current ? mouse.current.y * 0.2 : 0)
      ref.current.rotation.y += (targetRotY - ref.current.rotation.y) * 0.05
      ref.current.rotation.x += (targetRotX - ref.current.rotation.x) * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CameraController({ scroll }) {
  const cam = useRef()

  useFrame(() => {
    if (!cam.current) return
    const s = scroll.current
    const tx = Math.sin(s * Math.PI * 0.5) * 1.2
    const ty = s * 2.2
    const tz = 8 - s * 1.2
    cam.current.position.x += (tx - cam.current.position.x) * 0.03
    cam.current.position.y += (ty - cam.current.position.y) * 0.03
    cam.current.position.z += (tz - cam.current.position.z) * 0.03
    cam.current.lookAt(0, s * 0.3, 0)
  })

  return <perspectiveCamera ref={cam} position={[0, 0, 8]} fov={75} />
}

function Scene({ mouse, scroll }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#c084fc" />
      <CameraController scroll={scroll} />
      <Particles count={300} mouse={mouse} />
      <FloatingShape
        position={[-4, -2, -3]} rotation={[0.5, 0.8, 0.3]} scale={0.6}
        color="#c084fc" speed={1.2} distort={0.3} mouse={mouse}
      />
      <FloatingShape
        position={[4, 3, -4]} rotation={[0.2, 1.2, 0.5]} scale={0.4}
        color="#6366f1" speed={0.8} distort={0.5} mouse={mouse}
      />
      <FloatingShape
        position={[-3, 4, -5]} rotation={[0.8, 0.4, 0.6]} scale={0.5}
        color="#ec4899" speed={1.0} distort={0.4} mouse={mouse}
      />
      <FloatingShape
        position={[5, -3, -4]} rotation={[0.3, 0.9, 0.1]} scale={0.35}
        color="#06b6d4" speed={1.4} distort={0.6} mouse={mouse}
      />
    </>
  )
}

export default function Background3D() {
  const mouse = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)

  const handleScroll = useCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scroll.current = max > 0 ? window.scrollY / max : 0
  }, [])

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -(e.clientY / window.innerHeight) * 2 + 1
    mouse.current = { x, y }
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="background-3d" onMouseMove={handleMouseMove}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene mouse={mouse} scroll={scroll} />
      </Canvas>
    </div>
  )
}
