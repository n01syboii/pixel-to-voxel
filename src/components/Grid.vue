<template>
  <!-- Main grid container with spacing and styling -->
  <div class="space-y-4 overflow-hidden rounded-md shadow-md Editor">
    <!-- SVG canvas for drawing the interactive grid -->
    <svg
      @contextmenu.prevent
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp" 
      @mouseleave="handleMouseLeave"
      width="100%"
      height="100%"
      :viewBox="`0 0 ${size * ratio} ${size * ratio}`"
      style="background-color: #6EACDA"
    >
      <!-- Iterate through each row and column of the voxel grid -->
      <template v-for="(row, y) in voxelGrid" :key="y">
        <template v-for="(voxel, x) in row" :key="x">
          <!-- Render dynamic voxel shape component based on selected type -->
          <component
            :is="voxel.shape.type"
            v-bind="voxel.shape.buildAttributes(x * ratio, y * ratio + 1, ratio - 1)"
            class="cell"
            @mouseover="handleMouseOver(voxel)"
            :fill="getVoxelFill(voxel)"
          />
          <!-- Display height number for non-transparent voxels -->
          <text
            v-if="!voxel.mesh.material.transparent"
            :x="x * ratio + ratio/2"
            :y="y * ratio + ratio/2"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#ffffff"
            font-size="20"
            class="pointer-events-none"
          >
            {{ voxel.mesh.scale.z }}
          </text>
        </template>
      </template>

      <!-- Define reusable grid pattern -->
      <defs>
        <pattern id="grid" :width="ratio" :height="ratio" patternUnits="userSpaceOnUse">
          <path stroke="#03346E" :d="`M 0 0 H ${ratio} V ${ratio}`" stroke-width="2" fill="none" />
        </pattern>
      </defs>

      <!-- Apply grid pattern overlay -->
      <rect
        class="pointer-events-none"
        :width="size * ratio"
        :height="size * ratio"
        fill="url(#grid)"
      />

      <!-- Draw grid border outline -->
      <path
        stroke="#03346E"
        :d="`M 0 0 V ${size * ratio} H ${size * ratio}`"
        stroke-width="2"
        fill="none"
      />

      <!-- Draw center guidelines with optional dashed style -->
      <path
        :d="`M ${(size * ratio) / 2 - 0.5} 0 V ${size * ratio} M 0 ${(size * ratio) / 2 + 0.5} H ${size * ratio}`"
        stroke-width="1"
        :stroke-dasharray="size % 2 === 0 ? '0' : '7, 2'"
        stroke="#03346E"
        fill="none"
      />
    </svg>
  </div>
</template>

<script setup>
import useShapes from '@/composables/useShapes.js'

// Import shape selection composable
const { selectedShape } = useShapes()

// Define component props interface
const props = defineProps({
  voxelGrid: Array,  // 2D array representing the voxel grid
  size: Number,      // Grid dimensions
  color: String      // Current voxel color
})

// Define grid cell size in pixels
const ratio = 50

// Track mouse interaction states
let rightClick = false    // Right mouse button pressed
let mouseDown = false     // Any mouse button pressed
let hoveredVoxel = undefined  // Currently hovered voxel

/**
 * Get the fill color for a voxel
 * @param {Object} voxel - The voxel object to get color for
 * @returns {string} CSS color string or 'transparent'
 */
const getVoxelFill = (voxel) => {
  return voxel.mesh.material.transparent ? 'transparent' : voxel.mesh.material.color.getStyle()
}

/**
 * Update voxel material properties
 * @param {Object} voxel - The voxel to update
 * @param {boolean} transparent - Whether voxel should be transparent
 * @param {number} opacity - Opacity value between 0 and 1
 */
const updateVoxelMaterial = (voxel, transparent = false, opacity = 1) => {
  voxel.mesh.material.transparent = transparent
  voxel.mesh.material.opacity = opacity
  if (!transparent) {
    voxel.mesh.material.color.set(props.color)
  }
}

/**
 * Add new voxel or increase height of existing voxel
 */
const add = () => {
  if (!hoveredVoxel) return

  updateVoxelMaterial(hoveredVoxel, false)

  if (hoveredVoxel.shape === selectedShape.value) {
    // Increase height if same shape
    hoveredVoxel.mesh.scale.z++
    hoveredVoxel.mesh.position.z -= 0.5
  } else {
    // Create new voxel with selected shape
    hoveredVoxel.shape = selectedShape.value
    hoveredVoxel.mesh.geometry = selectedShape.value.buildGeometry()
  }
}

/**
 * Remove voxel or decrease height of existing voxel
 */
const remove = () => {
  if (!hoveredVoxel) return

  if (hoveredVoxel.mesh.scale.z > 1) {
    // Decrease height if greater than 1
    hoveredVoxel.mesh.scale.z--
    hoveredVoxel.mesh.position.z += 0.5
  } else {
    // Remove voxel completely
    updateVoxelMaterial(hoveredVoxel, true, 0)
    hoveredVoxel.mesh.scale.z = 0
    hoveredVoxel.mesh.position.z = 0
  }
}

// Mouse event handlers
/**
 * Handle mouse over event for voxel interaction
 * @param {Object} voxel - The voxel being hovered over
 */
const handleMouseOver = (voxel) => {
  hoveredVoxel = voxel
  if (!mouseDown) return
  rightClick ? remove() : add()
}

/**
 * Handle mouse up event to reset click states
 */
const handleMouseUp = () => {
  rightClick = false
  mouseDown = false
}

/**
 * Handle mouse down event to initiate voxel placement/removal
 * @param {MouseEvent} event - The mouse event object
 */
const handleMouseDown = (event) => {
  mouseDown = true
  if (event.button === 0) {
    add()
  } else if (event.button === 2) {
    rightClick = true
    remove()
  }
}

/**
 * Handle mouse leave event to reset all states
 */
const handleMouseLeave = () => {
  hoveredVoxel = undefined
  rightClick = false
  mouseDown = false
}
</script>

<style>
</style>
