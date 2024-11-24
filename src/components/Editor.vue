<template>
  <!-- Main editor container with flex column layout and width of 40% -->
  <div class="flex flex-col w-2/5 space-y-4">
    <!-- Toolbox component for color selection, using v-model for two-way binding -->
    <Toolbox v-model:color="color" />
    <!-- Grid component that displays the voxel grid with selected color -->
    <Grid :color="color" :voxel-grid="voxelGrid" :size="size" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Grid from '@/components/Grid.vue'
import Toolbox from '@/components/Toolbox.vue'

// Props definition for the editor component
defineProps({
  // voxelGrid prop - 2D array representing the grid of voxels
  voxelGrid: {
    type: Array,
    required: true
  },
  // size prop - number defining dimensions of the grid
  size: {
    type: Number, 
    required: true
  }
})

// Reactive reference for the currently selected color
// Initialized to red (#ff0000) as default
const color = ref('#ff0000')
</script>
