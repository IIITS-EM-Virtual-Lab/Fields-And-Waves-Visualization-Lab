import { OrbitControls } from '@react-three/drei';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      arrowHelper: any;
      primitive: any;
    }
  }
} 