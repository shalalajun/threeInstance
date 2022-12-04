 varying vec2 vUv;
 varying vec4 worldPosition;
 
 void main() {
    gl_FragColor = vec4(worldPosition.xyz * 0.5 + 0.5, 1.0); // R, G, B, A
  }