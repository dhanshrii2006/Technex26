import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Ultra-realistic starfield with proper stellar classification
function RealisticStarfield({ count = 25000 }) {
  const ref = useRef()
  
  const [positions, colors, sizes, magnitudes] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const magnitudes = new Float32Array(count)
    
    // Realistic stellar classifications with proper color temperatures
    const stellarTypes = [
      { color: new THREE.Color(0.95, 0.8, 0.65), weight: 0.75, size: 0.3 }, // M-class red dwarfs (most common)
      { color: new THREE.Color(1.0, 0.9, 0.7), weight: 0.12, size: 0.6 },   // K-class orange dwarfs
      { color: new THREE.Color(1.0, 1.0, 0.9), weight: 0.08, size: 0.8 },   // G-class yellow (Sun-like)
      { color: new THREE.Color(1.0, 0.98, 0.85), weight: 0.03, size: 1.2 }, // F-class yellow-white
      { color: new THREE.Color(0.95, 0.98, 1.0), weight: 0.015, size: 1.8 }, // A-class white
      { color: new THREE.Color(0.9, 0.95, 1.0), weight: 0.003, size: 2.5 },  // B-class blue-white
      { color: new THREE.Color(0.85, 0.9, 1.0), weight: 0.001, size: 3.0 },  // O-class blue giants
      { color: new THREE.Color(1.0, 0.6, 0.4), weight: 0.001, size: 4.0 }    // Red giants
    ]
    
    for (let i = 0; i < count; i++) {
      // More realistic distribution - denser near galactic plane
      const galacticLatitude = (Math.random() - 0.5) * Math.PI
      const galacticDensity = Math.exp(-Math.abs(galacticLatitude) * 3) // Higher density near equator
      const shouldPlace = Math.random() < galacticDensity * 0.3 + 0.1
      
      if (!shouldPlace && Math.random() > 0.3) {
        // Skip some stars to create realistic density variation
        i--
        continue
      }
      
      // Place stars at varying distances for better 3D effect
      let radius
      if (i < count * 0.1) {
        // 10% closer stars for 3D movement perception
        radius = Math.random() * 100 + 50
      } else if (i < count * 0.3) {
        // 20% medium distance stars
        radius = Math.random() * 300 + 150
      } else {
        // 70% distant stars
        radius = Math.random() * 800 + 400
      }
      
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Select stellar type based on realistic distribution
      let selectedType = stellarTypes[0]
      let cumulative = 0
      const rand = Math.random()
      
      for (const type of stellarTypes) {
        cumulative += type.weight
        if (rand <= cumulative) {
          selectedType = type
          break
        }
      }
      
      // Realistic magnitude distribution (most stars are very faint)
      const magnitude = Math.random()
      let finalSize
      if (magnitude < 0.85) {
        finalSize = selectedType.size * (0.1 + Math.random() * 0.3) // Very faint stars
      } else if (magnitude < 0.97) {
        finalSize = selectedType.size * (0.4 + Math.random() * 0.6) // Visible stars
      } else {
        finalSize = selectedType.size * (1.0 + Math.random() * 1.5) // Bright stars
      }
      
      sizes[i] = finalSize
      magnitudes[i] = magnitude
      
      // Apply realistic color with subtle variations
      const colorVariation = 1 + (Math.random() - 0.5) * 0.1
      colors[i * 3] = Math.min(1, selectedType.color.r * colorVariation)
      colors[i * 3 + 1] = Math.min(1, selectedType.color.g * colorVariation)
      colors[i * 3 + 2] = Math.min(1, selectedType.color.b * colorVariation)
    }
    
    return [positions, colors, sizes, magnitudes]
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      // Realistic atmospheric scintillation (twinkling)
      const time = state.clock.elapsedTime
      const geometry = ref.current.geometry
      const sizeAttribute = geometry.attributes.size
      const colorAttribute = geometry.attributes.color
      
      for (let i = 0; i < count; i++) {
        // Brighter stars twinkle more noticeably
        const twinkleIntensity = Math.max(0, (sizes[i] - 0.5) * 0.3)
        const scintillation = Math.sin(time * (1 + Math.random() * 3) + i * 0.123) * twinkleIntensity + 1
        
        // Size variation
        sizeAttribute.array[i] = sizes[i] * Math.max(0.3, scintillation)
        
        // Subtle color temperature shifts during twinkling
        const colorShift = (scintillation - 1) * 0.05
        colorAttribute.array[i * 3] = Math.min(1, colors[i * 3] * (1 + colorShift))
        colorAttribute.array[i * 3 + 1] = Math.min(1, colors[i * 3 + 1] * (1 - colorShift * 0.3))
        colorAttribute.array[i * 3 + 2] = Math.min(1, colors[i * 3 + 2] * (1 - colorShift * 0.6))
      }
      
      sizeAttribute.needsUpdate = true
      colorAttribute.needsUpdate = true
    }
  })

  return (
    <Points ref={ref} positions={positions} colors={colors} sizes={sizes}>
      <PointMaterial
        size={0.8}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        alphaTest={0.01}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Ultra-realistic cosmic dust and dark nebulae
function CosmicDust({ position, scale = 1, type = 'reflection' }) {
  const ref = useRef()
  
  const dustGeometry = useMemo(() => {
    return new THREE.SphereGeometry(50 * scale, 64, 64)
  }, [scale])

  const dustMaterial = useMemo(() => {
    // More sophisticated noise generation for realistic dust structures
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    const imageData = ctx.createImageData(512, 512)
    const data = imageData.data
    
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const i = (y * 512 + x) * 4
        
        // Multi-octave noise for realistic dust filaments
        const nx = x / 512
        const ny = y / 512
        
        let noise = 0
        noise += Math.sin(nx * 12 + ny * 8) * 0.5
        noise += Math.sin(nx * 24 + ny * 16) * 0.25
        noise += Math.sin(nx * 48 + ny * 32) * 0.125
        noise += Math.sin(nx * 96 + ny * 64) * 0.0625
        
        // Add turbulence for filamentary structure
        const turbulence = Math.sin(nx * 80 + Math.cos(ny * 60) * 2) * 0.3
        noise += turbulence
        
        // Normalize and apply power function for realistic distribution
        noise = (noise + 1) * 0.5
        noise = Math.pow(Math.max(0, noise - 0.4), 2.5)
        
        const alpha = Math.min(255, noise * 80)
        
        if (type === 'dark') {
          // Dark nebula - absorbs background light
          data[i] = 20     // R
          data[i + 1] = 15 // G  
          data[i + 2] = 10 // B
        } else {
          // Reflection nebula - blue scattered light
          data[i] = 180     // R
          data[i + 1] = 200 // G
          data[i + 2] = 255 // B
        }
        data[i + 3] = alpha // A
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: type === 'dark' ? 0.3 : 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: type === 'dark' ? THREE.MultiplyBlending : THREE.AdditiveBlending
    })
  }, [type])

  useFrame((state) => {
    if (ref.current) {
      // Very slow rotation for realism
      ref.current.rotation.y += 0.00005
      ref.current.rotation.z += 0.00003
    }
  })

  return (
    <mesh ref={ref} position={position} geometry={dustGeometry} material={dustMaterial} />
  )
}

// Extremely faint distant galaxies and deep space objects
function DeepSpaceObjects() {
  const objects = useMemo(() => {
    const objectData = []
    
    // Distant galaxies
    for (let i = 0; i < 15; i++) {
      const radius = Math.random() * 600 + 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      objectData.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        type: 'galaxy',
        brightness: 0.15 + Math.random() * 0.2
      })
    }
    
    // Globular clusters
    for (let i = 0; i < 8; i++) {
      const radius = Math.random() * 500 + 300
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      objectData.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        type: 'cluster',
        brightness: 0.3 + Math.random() * 0.3
      })
    }
    
    return objectData
  }, [])

  return (
    <>
      {objects.map((obj, index) => (
        <mesh key={index} position={obj.position}>
          <sphereGeometry args={obj.type === 'galaxy' ? [0.15, 6, 6] : [0.08, 8, 8]} />
          <meshBasicMaterial 
            color={new THREE.Color(
              obj.type === 'galaxy' ? 0.95 : 1.0,
              obj.type === 'galaxy' ? 0.92 : 0.95, 
              1.0
            )} 
            transparent={true} 
            opacity={obj.brightness * 0.4} 
          />
        </mesh>
      ))}
    </>
  )
}

// Floating reference objects for depth perception
function FloatingReferenceObjects() {
  const group = useRef()
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.001
      group.current.rotation.x += 0.0005
    }
  })
  
  return (
    <group ref={group}>
      {/* Subtle reference points at various distances */}
      <mesh position={[20, 10, -40]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={new THREE.Color(0.9, 0.7, 0.5)} transparent opacity={0.4} />
      </mesh>
      <mesh position={[-25, -15, -60]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={new THREE.Color(0.7, 0.8, 1.0)} transparent opacity={0.3} />
      </mesh>
      <mesh position={[30, -20, -80]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={new THREE.Color(1.0, 0.9, 0.8)} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-35, 25, -100]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={new THREE.Color(0.8, 1.0, 0.9)} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// Immersive space scene with mouse-controlled 3D movement
function ImmersiveSpaceScene() {
  const { camera, gl } = useThree()
  
  useEffect(() => {
    // Set up camera for ultra-wide immersive view
    camera.fov = 85
    camera.near = 0.01
    camera.far = 2000
    camera.updateProjectionMatrix()
    
    // High-fidelity rendering settings
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.6 // Darker for space realism
    gl.shadowMap.enabled = false // No shadows in deep space
  }, [camera, gl])

  return (
    <>
      {/* Ultra-realistic starfield */}
      <RealisticStarfield count={25000} />
      
      {/* Floating reference objects for 3D movement perception */}
      <FloatingReferenceObjects />
      
      {/* Cosmic dust and nebulae - closer for better 3D effect */}
      <CosmicDust position={[50, 30, -80]} scale={1.2} type="reflection" />
      <CosmicDust position={[-40, -25, -60]} scale={0.8} type="dark" />
      <CosmicDust position={[25, 20, -100]} scale={0.6} type="reflection" />
      <CosmicDust position={[-20, 40, -70]} scale={1.0} type="dark" />
      <CosmicDust position={[0, -30, -50]} scale={0.7} type="reflection" />
      
      {/* Very distant deep space objects */}
      <DeepSpaceObjects />
      
      {/* Realistic cosmic microwave background radiation */}
      <ambientLight intensity={0.01} color={new THREE.Color(0.95, 0.96, 1.0)} />
      
      {/* Subtle directional lighting from distant star clusters */}
      <directionalLight 
        position={[500, 300, 200]} 
        intensity={0.05} 
        color={new THREE.Color(1.0, 0.9, 0.8)} 
      />
      <directionalLight 
        position={[-400, -200, -300]} 
        intensity={0.03} 
        color={new THREE.Color(0.9, 0.95, 1.0)} 
      />
      
      {/* Free-look camera controls with smooth mouse movement */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        rotateSpeed={1.0}
        zoomSpeed={1.2}
        panSpeed={1.0}
        minDistance={1}
        maxDistance={500}
        enableDamping={true}
        dampingFactor={0.1}
        target={[0, 0, 0]}
        makeDefault
      />
    </>
  )
}

// Ultra-immersive space background with full 3D mouse control
function SpaceBackground() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000000', // Pure black space
      position: 'relative'
    }}>
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 75,
          near: 0.1,
          far: 2000
        }}
        style={{ 
          background: 'transparent',
          display: 'block'
        }}
        onCreated={({ gl, camera }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.6
        }}
      >
        <ImmersiveSpaceScene />
      </Canvas>
      
      {/* Minimal content overlay */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 6rem)',
          fontWeight: 'bold',
          color: 'rgba(255, 255, 255, 0.85)',
          textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)',
          margin: 0,
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '0.15em',
          opacity: 0.8
        }}>
          TECHNEX 2026
        </h1>
      </div>
      
      {/* Subtle navigation hint */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        pointerEvents: 'none',
        opacity: 0.6
      }}>
        Drag to explore • Scroll to zoom
      </div>
    </div>
  )
}

export default SpaceBackground