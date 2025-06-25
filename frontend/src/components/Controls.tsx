import { OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';

function Controls({ enabled }: { enabled: boolean }) {
    const controlsRef = useRef<any>();
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = enabled;
        }
    }, [enabled]);
    return <OrbitControls ref={controlsRef} />;
}

export default Controls;