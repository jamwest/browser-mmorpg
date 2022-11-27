import './App.css'
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Color } from 'three';

function useGameTime() {
  const [time, setTime] = useState(0);
  useFrame(({ clock }) => setTime(clock.getElapsedTime()));
  const timeSpeed = 5
  const gameTime = time * timeSpeed
  let minute = Math.floor(gameTime % 60);
  let hour = Math.floor((gameTime % 3600) / 60);
  let day = Math.floor(gameTime % (24 * 60 * 60) / (60 * 60));
  return { gameTime, day, hour, minute };
}

function SkyBox() {
  const { scene } = useThree()
  const { hour , minute} = useGameTime()
  const sunrise = 6
  const sunset = 18

  // Set the background based on the hour of the day going from midnight to noon
  if (hour < sunrise || hour > sunset) {
    scene.background = new Color(`hsl(210, 0%, 0%)`)
  }
  else if (hour > sunrise + 1 && hour < sunset - 1) {
    scene.background = new Color(`hsl(210, 100%, 80%)`)
  }
  else if (hour < sunrise + 1) {
    scene.background = new Color(`hsl(210, 100%, ${Math.floor((minute / 60) * 80)}%)`)
  }
  else if (hour > sunset - 1) {
    scene.background = new Color(`hsl(210, 100%, ${Math.floor(((60 - minute) / 60) * 80)}%)`)
  }
  return null
}

function GroundPlane() {
  return (
    <mesh
      receiveShadow
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color='green' />
    </mesh>
  )
}

function Box(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
    ref.current.rotation.z += 0.01
  })
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5  : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function App() {
  return (
    <div className="App">
      <h1>Browser MMORPG</h1>
      <div className="CanvasContainer">
        <Canvas shadows camera={{ position: [0, 1, 5], fov: 90 }}>
          <SkyBox />
          <GroundPlane />
          <ambientLight intensity={0.1} />
          <directionalLight
            castShadow
            intensity={0.1}
            shadow-mapSize-height={512}
            shadow-mapSize-width={512}
            position={[3, 5, 0]}/>
          <Box position={[0, 0.5, 0]} />
        </Canvas>
      </div>
    </div>
  )
}

export default App
