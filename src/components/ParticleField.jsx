import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Mouse-reactive camera
function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.02
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Animated particles with trails
function Particles({ count = 200, color = '#0ea5a0', size = 0.02 }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [count])

  const speeds = useMemo(() => {
    const s = []
    for (let i = 0; i < count; i++) {
      s.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.0015,
      })
    }
    return s
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position.array
    const time = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      pos[i * 3] += speeds[i].x + Math.sin(time * 0.5 + i * 0.1) * 0.001
      pos[i * 3 + 1] += speeds[i].y + Math.cos(time * 0.3 + i * 0.15) * 0.001
      pos[i * 3 + 2] += speeds[i].z
      if (Math.abs(pos[i * 3]) > 10) speeds[i].x *= -1
      if (Math.abs(pos[i * 3 + 1]) > 10) speeds[i].y *= -1
      if (Math.abs(pos[i * 3 + 2]) > 10) speeds[i].z *= -1
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Floating sphere with wireframe
function FloatingSphere({ position, color, size = 0.3, speed = 1 }) {
  const ref = useRef()
  const initialY = position[1]

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = initialY + Math.sin(clock.getElapsedTime() * speed) * 0.4
    ref.current.rotation.x += 0.003
    ref.current.rotation.y += 0.005
  })

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial color={color} transparent opacity={0.15} wireframe />
    </mesh>
  )
}

// Orbit ring with animated glow
function OrbitRing({ radius = 2, color = '#0ea5a0', speed = 0.3 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * speed) * 0.3
    ref.current.rotation.z = Math.cos(clock.getElapsedTime() * speed * 0.7) * 0.2
  })

  const curve = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return pts
  }, [radius])

  return (
    <group ref={ref}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={curve.length}
            array={new Float32Array(curve.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </line>
    </group>
  )
}

// Floating medical cross
function MedicalCross({ position, color = '#ef4444', speed = 0.5 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed) * 0.3
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
  })

  return (
    <group ref={ref} position={position}>
      {/* Horizontal bar */}
      <mesh>
        <boxGeometry args={[0.6, 0.15, 0.05]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Vertical bar */}
      <mesh>
        <boxGeometry args={[0.15, 0.6, 0.05]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// Floating DNA helix strands
function DNAHelix({ position, color = '#3b82f6', speed = 0.4 }) {
  const group = useRef()
  const nodes = useMemo(() => {
    const result = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      result.push({
        x: Math.cos(angle) * 0.3,
        y: (i / 8) * 1.6 - 0.8,
        z: Math.sin(angle) * 0.3,
        x2: Math.cos(angle + Math.PI) * 0.3,
        y2: (i / 8) * 1.6 - 0.8,
        z2: Math.sin(angle + Math.PI) * 0.3,
      })
    }
    return result
  }, [])

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.rotation.y = clock.getElapsedTime() * speed
    group.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.3) * 0.2
  })

  return (
    <group ref={group} position={position}>
      {nodes.map((n, i) => (
        <React.Fragment key={i}>
          <mesh position={[n.x, n.y, n.z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} emissive={color} emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[n.x2, n.y2, n.z2]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#0ea5a0" transparent opacity={0.6} emissive="#0ea5a0" emissiveIntensity={0.4} />
          </mesh>
          {i % 2 === 0 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([n.x, n.y, n.z, n.x2, n.y2, n.z2])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={color} transparent opacity={0.2} />
            </line>
          )}
        </React.Fragment>
      ))}
    </group>
  )
}

// Floating heart with pulse
function FloatingHeart({ position, color = '#ef4444', speed = 0.6 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * speed) * 0.25
    const scale = 1 + Math.sin(t * 3) * 0.08
    ref.current.scale.set(scale, scale, scale)
  })

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.2} wireframe />
    </mesh>
  )
}

// Floating brain-like torus
function BrainNode({ position, color = '#8b5cf6', speed = 0.35 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed) * 0.35
    ref.current.rotation.x += 0.004
    ref.current.rotation.z += 0.002
  })

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.2, 0.06, 8, 16]} />
      <meshStandardMaterial color={color} transparent opacity={0.2} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

// Animated connection lines between points
function ConnectionLines() {
  const ref = useRef()
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 12; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2
      ))
    }
    return pts
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.02
  })

  return (
    <group ref={ref}>
      {points.map((p, i) => {
        const next = points[(i + 1) % points.length]
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([p.x, p.y, p.z, next.x, next.y, next.z])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#0ea5a0" transparent opacity={0.08} />
          </line>
        )
      })}
    </group>
  )
}

// Main Medical Kiosk with enhanced visuals
function MedicalKiosk() {
  const group = useRef()
  const glowRef = useRef()

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.rotation.y = clock.getElapsedTime() * 0.15
    group.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.15
    if (glowRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1
      glowRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group ref={group}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1, 2, 6]} />
        <meshStandardMaterial color="#1e5090" transparent opacity={0.3} wireframe />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.6, 0.6]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#0ea5a0" transparent opacity={0.4} />
      </mesh>
      {/* Medical cross */}
      <mesh position={[0, 0.6, 0.65]}>
        <boxGeometry args={[0.4, 0.08, 0.02]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.6} emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0.65]}>
        <boxGeometry args={[0.08, 0.4, 0.02]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.6} emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
      {/* Base glow */}
      <mesh position={[0, -1.1, 0]} ref={glowRef}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshStandardMaterial color="#0ea5a0" transparent opacity={0.15} emissive="#0ea5a0" emissiveIntensity={0.2} />
      </mesh>
      {/* Holographic ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.01, 8, 64]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.15} emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// Floating data particles (smaller, faster)
function DataParticles({ count = 40, color = '#0ea5a0' }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position.array
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.005 + Math.sin(t + i) * 0.002
      if (pos[i * 3 + 1] > 7.5) pos[i * 3 + 1] = -7.5
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.008} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

export default function ParticleField() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#0ea5a0" />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#3b82f6" />
        <pointLight position={[0, 3, 3]} intensity={0.3} color="#8b5cf6" />

        <CameraController />

        {/* Particles */}
        <Particles count={150} color="#0ea5a0" size={0.015} />
        <Particles count={80} color="#3b82f6" size={0.01} />
        <DataParticles count={30} color="#0ea5a0" />

        {/* Floating spheres */}
        <FloatingSphere position={[-3, 1, -2]} color="#0ea5a0" size={0.4} speed={0.8} />
        <FloatingSphere position={[3.5, -0.5, -3]} color="#3b82f6" size={0.3} speed={1.2} />
        <FloatingSphere position={[2, 2, -4]} color="#8b5cf6" size={0.25} speed={0.6} />
        <FloatingSphere position={[-2.5, -1.5, -3]} color="#0ea5a0" size={0.2} speed={1} />

        {/* Orbit rings */}
        <OrbitRing radius={2.5} color="#0ea5a0" speed={0.2} />
        <OrbitRing radius={3.5} color="#3b82f6" speed={0.15} />

        {/* Medical objects */}
        <MedicalCross position={[-4, 0.5, -1]} color="#ef4444" speed={0.5} />
        <MedicalCross position={[4, -1, -2]} color="#f59e0b" speed={0.7} />
        <DNAHelix position={[3, 0, -1.5]} color="#3b82f6" speed={0.3} />
        <DNAHelix position={[-3, -0.5, -2.5]} color="#8b5cf6" speed={0.4} />
        <FloatingHeart position={[2, 1.5, -2]} color="#ef4444" speed={0.6} />
        <FloatingHeart position={[-2, -1, -3]} color="#ec4899" speed={0.4} />
        <BrainNode position={[4, 1, -3]} color="#8b5cf6" speed={0.35} />
        <BrainNode position={[-4, -0.5, -2]} color="#0ea5a0" speed={0.45} />

        {/* Connection lines */}
        <ConnectionLines />

        {/* Central kiosk */}
        <MedicalKiosk />
      </Canvas>
    </div>
  )
}
