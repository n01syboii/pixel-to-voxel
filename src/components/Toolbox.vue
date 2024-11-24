<template>
  <!-- Main toolbox container with rounded corners and dark blue background -->
  <div class="flex flex-col overflow-hidden rounded-md" style="background-color: #03346E;">
    <!-- Tool selection buttons container -->
    <div class="relative flex">
      <!-- Shape tool button - white when selected, gray when not -->
      <button
        class="p-2 cursor-pointer"
        :class="{ 'text-white': selectedTool === 'shape', 'text-gray-400': selectedTool !== 'shape' }"
        @click="selectedTool = 'shape'"
      >
        <Icon class="w-5 h-5" name="shapes" />
      </button>
      <!-- Color tool button - white when selected, gray when not -->
      <button
        class="p-2 cursor-pointer"
        :class="{ 'text-white': selectedTool === 'color', 'text-gray-400': selectedTool !== 'color' }"
        @click="selectedTool = 'color'"
      >
        <Icon class="w-5 h-5" name="palette" />
      </button>
    </div>

    <!-- Shape selection panel - shown when shape tool is selected -->
    <div
      v-if="selectedTool === 'shape'"
      class="flex p-4 space-x-4"
      style="background-color: #6EACDA;"
    >
      <!-- Iterate through available shapes and render them as clickable SVG icons -->
      <svg
        v-for="(shape, index) in shapes"
        :key="index"
        class="w-4 h-4 cursor-pointer"
        viewBox="0 0 1 1"
        :fill="selectedShape === shape ? 'white' : 'rgba(255, 255, 255, 0.5)'"
        @click="selectedShape = shape"
      >
        <!-- Render shape using dynamic component -->
        <component :is="shape.type" v-bind="shape.buildAttributes(0, 0, 1)" />
      </svg>
    </div>

    <!-- Color selection panel - shown when color tool is selected -->
    <div
      v-if="selectedTool === 'color'"
      class="flex p-4 space-x-4"
      style="background-color: #6EACDA;"
    >
      <!-- Iterate through color options and render as clickable circles -->
      <div
        v-for="color in colors"
        :key="color"
        class="w-4 h-4 rounded-full cursor-pointer"
        :style="{ backgroundColor: color }"
        @click="emit('update:color', color)"
      />
    </div>
  </div>
</template>

<script setup>
// Import required components and composables
import Icon from '@/components/Icon.vue'
import { ref } from 'vue'
import useShapes from '@/composables/useShapes.js'

// Define emits for color updates to parent component
const emit = defineEmits(['update:color'])

// Initialize reactive state for selected tool
const selectedTool = ref('shape')

// Define available colors array
const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#fff', '#000']

// Get shapes and selected shape state from useShapes composable
const { shapes, selectedShape } = useShapes()
</script>

<style>
</style>
