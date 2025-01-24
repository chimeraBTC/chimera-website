import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Constants for bubble generation and distribution
const BUBBLE_COUNT = 13
const ORBIT_RADIUS = 1.2
const ORBIT_SPEED_RANGE = { min: 0.5, max: 1.5 }
const BASE_SCALE = 0.15
const SCALE_VARIATION = 0.01
const SCALE_SPEED = 0.5

// Generate initial positions for bubbles
const generatePositions = (): THREE.Vector3[] => {
  return Array.from({ length: BUBBLE_COUNT }, (_, i) => {
    const phi = Math.acos(-1 + (2 * i) / BUBBLE_COUNT)
    const theta = Math.sqrt(BUBBLE_COUNT * Math.PI) * phi

    return new THREE.Vector3(
      ORBIT_RADIUS * Math.cos(theta) * Math.sin(phi),
      ORBIT_RADIUS * Math.sin(theta) * Math.sin(phi),
      ORBIT_RADIUS * Math.cos(phi)
    )
  })
}

// Studio-quality chrome material with gold color and glow
const chromeMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0.6,
  roughness: 0.4,
  clearcoat: 0.7,
  clearcoatRoughness: 0.1,
  color: new THREE.Color('#FFAA00'),
  emissive: new THREE.Color('#FF6600'),
  emissiveIntensity: 0.5,
  envMapIntensity: 1
})

export function BitcoinModel() {
  const bubblesRef = useRef<THREE.Group>(null)
  const positions = useRef<THREE.Vector3[]>(generatePositions())

  useFrame((state, delta) => {
    if (!bubblesRef.current?.children) return
    const time = Date.now() / 1000
    
    bubblesRef.current.children.forEach((bubble3D: THREE.Object3D, i) => {
      if (!bubble3D || !positions.current[i]) return

      const orbitTime = time * (ORBIT_SPEED_RANGE.min + (i / BUBBLE_COUNT) * (ORBIT_SPEED_RANGE.max - ORBIT_SPEED_RANGE.min))
      const phase = i * Math.PI * 2 / BUBBLE_COUNT
      
      // Apply orbital rotation and wobble
      const orbitPosition = positions.current[i].clone()
      const wobble = Math.sin(time * 2 + phase) * 0.1
      orbitPosition.multiplyScalar(1 + wobble)
      
      const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.makeRotationY(orbitTime * 0.5)
      orbitPosition.applyMatrix4(rotationMatrix)
      
      // Update mesh position
      bubble3D.position.copy(orbitPosition)
      
      // Gentle scale animation
      const scalePhase = time * SCALE_SPEED + phase
      const scale = BASE_SCALE + Math.sin(scalePhase) * SCALE_VARIATION
      bubble3D.scale.setScalar(scale)
      
      // Gentle rotation
      bubble3D.rotation.x += 0.01 * delta
      bubble3D.rotation.y += 0.01 * delta
    })
  })

  return (
    <group scale={1} rotation={[-Math.PI, 0, 0]}>
      <group ref={bubblesRef}>
        {Array.from({ length: BUBBLE_COUNT }).map((_, index) => (
          <mesh
            key={index}
            material={chromeMaterial}
            position={positions.current[index].clone()}
          >
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
