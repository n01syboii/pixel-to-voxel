<template>
  <!-- Container div that takes up 60% width and aligns content to bottom-right -->
  <div ref="parent" class="flex items-end justify-end w-3/5">
    <!-- Canvas element for Three.js rendering -->
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Import Vue composition API functions
import * as THREE from 'three' // Import Three.js library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' // Import camera controls
import useShapes from '@/composables/useShapes.js' // Import custom shapes composable

// Template refs for accessing DOM elements
const canvas = ref() // Reference to canvas element
const parent = ref() // Reference to parent container

// Component props definition
const props = defineProps({
  color: String, // Color for voxels
  voxelGrid: Array, // 2D array storing voxel data
  size: Number // Grid dimensions
})

onMounted(() => {
  // Initialize Three.js scene and set dark blue background
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#021526')

  // Setup perspective camera with 75° FOV, aspect ratio 1:1, and view frustum
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100)
  camera.position.set(0, 0, 21) // Position camera back from scene
  scene.add(camera)

  // Add directional light for shadows and depth
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // Add ambient light for overall scene illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // Initialize WebGL renderer with antialiasing
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true
  })

  // Function to handle canvas resizing and device pixel ratio
  const updateSize = () => {
    const min = Math.min(parent.value.clientWidth, parent.value.clientHeight)
    renderer.setSize(min, min) // Make canvas square
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
  }

  updateSize()
  window.addEventListener('resize', updateSize)

  // Create container for voxel grid
  const grid = new THREE.Object3D()
  const { defaultShape } = useShapes()

  // Initialize empty voxel grid with transparent placeholder cubes
  for (let y = 0; y < props.size; y++) {
    props.voxelGrid.push([])
    for (let x = 0; x < props.size; x++) {
      // Create cube geometry and transparent material
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ 
        opacity: 0, 
        transparent: true, 
        wireframe: true 
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(x, y, 0) // Position cube in grid
      grid.add(cube)
      props.voxelGrid[y].push({ mesh: cube, shape: defaultShape })
    }
  }

  // Position and rotate grid in scene
  grid.rotation.set(0, Math.PI, Math.PI) // Flip grid to match editor view
  grid.position.set(-props.size / 2, props.size / 2, 0) // Center grid in scene
  scene.add(grid)

  // Add wireframe bounding box to show grid boundaries
  const boundingBox = new THREE.BoxGeometry(props.size, props.size, props.size)
  const edges = new THREE.EdgesGeometry(boundingBox)
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial())
  scene.add(line)

  // Setup orbital camera controls
  const controls = new OrbitControls(camera, canvas.value)
  controls.enableDamping = true // Add smooth camera movement
  controls.autoRotate = true // Enable automatic rotation
  controls.autoRotateSpeed = 0.5 // Set slow rotation speed
  controls.enablePan = false // Disable camera panning
  controls.enableZoom = true // Enable camera zoom

  // Animation loop for continuous rendering
  const animate = () => {
    controls.update() // Update camera controls
    renderer.render(scene, camera) // Render scene
    requestAnimationFrame(animate) // Queue next frame
  }

  animate() // Start animation loop
})
</script>

<style>
</style>
