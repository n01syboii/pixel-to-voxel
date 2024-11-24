// Import required Vue and Three.js dependencies
import { ref, reactive } from "vue";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as THREE from "three";

// Array to store all registered shape definitions
const shapes = reactive([]);

/**
 * Register a new shape type with its rendering attributes
 * @param {string} type - SVG element type (rect, circle, path etc)
 * @param {Function} buildAttributes - Function that returns SVG attributes for the shape
 */
const registerShape = (type, buildAttributes) => {
  const loader = new SVGLoader();
  // Create SVG markup string from shape attributes
  const html = `<${type} ${Object.entries(buildAttributes(0, 0, 1))
    .map((entry) => `${entry[0]}="${entry[1]}"`)
    .join(" ")} />`;
  const svgData = loader.parse(html);

  // Add shape definition to shapes array
  shapes.push({
    type,
    buildAttributes,
    // Create 3D geometry from SVG path
    buildGeometry: () =>
      new THREE.ExtrudeGeometry(svgData.paths[0].toShapes()[0], {
        depth: 1,
        bevelEnabled: false,
      }),
  });
};

// Register basic rectangle shape
registerShape("rect", (x, y, size) => ({
  x: x,
  y: y,
  width: size,
  height: size,
}));

// Default shape used for initialization
const defaultShape = {
  type: "rect",
  buildAttributes: (x, y, size) => ({
    x: x,
    y: y,
    width: size,
    height: size,
  }),
  buildGeometry: () => null,
};

// Register circle shape
registerShape("circle", (x, y, size) => ({
  cx: x + size / 2,
  cy: y + size / 2,
  r: size / 2,
}));

// Register various path-based shapes for different corner styles

// Rounded corner
registerShape("path", (x, y, size) => ({
  d: "M0 1C0 0.447715 0.447715 0 1 0V0V1H0V1Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Triangle corner
registerShape("path", (x, y, size) => ({
  d: "M0.5 0L0.496774 0.00645187L1 1H0L0.5 0Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Diagonal corner (bottom-left to top-right)
registerShape("path", (x, y, size) => ({
  d: "M1 0V1H0L1 0Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Diagonal corner (top-left to bottom-right)
registerShape("path", (x, y, size) => ({
  d: "M0 0V1H1L0 0Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Curved corner (top-left)
registerShape("path", (x, y, size) => ({
  d: "M0 0V1H1V1C1 0.447715 0.552285 0 0 0V0Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Curved corner (top-right)
registerShape("path", (x, y, size) => ({
  d: "M1 0V1H0V1C0 0.447715 0.447715 0 1 0V0Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Half block (bottom)
registerShape("path", (x, y, size) => ({
  d: "M1 0.5V1H0V0.5H1Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Half block (top)
registerShape("path", (x, y, size) => ({
  d: "M1 0.5V0H0V0.5H1Z",
  transform: `translate(${x},${y}) scale(${size})`,
}));

// Reference to currently selected shape, initialized to first shape
const selectedShape = ref(shapes[0]);

/**
 * Composable that provides shape-related functionality
 * @returns {Object} Object containing selectedShape, defaultShape and shapes array
 */
const useShapes = () => {
  return {
    selectedShape,
    defaultShape,
    shapes,
  };
};

export default useShapes;
