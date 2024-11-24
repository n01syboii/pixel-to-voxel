<template>
  <!-- Main container with flex layout, full height and padding -->
  <div class="flex h-full p-4 m-auto">
    <!-- Editor component for creating voxel art -->
    <Editor :size="size" :voxelGrid="voxelGrid"></Editor>
    <!-- Preview component for 3D visualization -->
    <Preview :size="size" :voxelGrid="voxelGrid" />
  </div>
</template>

<script setup>
// Import required components and Vue composition API functions
import Preview from '@/components/Preview.vue'
import Editor from '@/components/Editor.vue'
import { ref, reactive } from 'vue'

// Define grid size as a reactive reference (16x16)
const size = ref(16)
// Initialize empty reactive array to store voxel grid data
const voxelGrid = reactive([])
</script>

<style>
/* Apply full height to root elements */
html,
body {
  @apply h-full;
}

/* Set dark blue background color for body */
body {
  background-color: #021526;
}

/* Ensure app container takes full height */
#app {
  @apply h-full;
}
</style>
