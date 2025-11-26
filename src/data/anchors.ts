export const GROUP_ANCHORS = {
  // Inner core (sphere center)
  os: { x: 0, y: 0, z: 0 },
  
  // Cardinal directions (equidistant from center)
  aip: { x: 0, y: -350, z: 0 },      // North
  app: { x: 0, y: 350, z: 0 },       // South
  data: { x: -350, y: 0, z: 0 },     // West
  ontology: { x: 350, y: 0, z: 0 },  // East
  
  // Outer layer (corners)
  target: { x: 300, y: -300, z: 200 },   // NE far
  source: { x: -300, y: -300, z: 200 },  // NW far
  strategy: { x: 0, y: 300, z: 200 },    // S far
};