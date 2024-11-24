<template>
  <!-- SVG icon component that dynamically loads and displays an icon -->
  <svg class="Icon" :style="style" v-bind="params" v-html="content" />
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue'

// Props definition
const props = defineProps({
  // Required name of the icon to load
  name: {
    type: String,
    required: true
  },
  // Optional fill color override
  fill: {
    type: String,
    default: null
  }
})

// Default SVG parameters
const params = reactive({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24'
})

// Stores the SVG content loaded from the icon file
const content = ref('')

// Computed style to set fill color CSS variable if provided
const style = computed(() => props.fill ? `--fill-icon: ${props.fill}` : '')

// Watch for icon name changes to dynamically load icon content
watch(
  () => props.name,
  async (value) => {
    // Dynamically import the icon file based on name
    const icon = await import(`../assets/icons/${value}.js`)
    // Update SVG parameters from loaded icon
    params.width = icon.default.width
    params.height = icon.default.height 
    params.viewBox = `0 0 ${icon.default.width} ${icon.default.height}`
    // Set the icon SVG content
    content.value = icon.default.content
  },
  { immediate: true } // Run immediately on component creation
)
</script>

<style scoped>
/* Icon styling - uses CSS variable for fill color with currentColor fallback */
.Icon {
  fill: var(--fill-icon, currentColor);
}
</style>
