import { OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';

type ControlsProps = {
    enabled: boolean
};

function Controls({ enabled }: ControlsProps) {
    const controlsRef = useRef<any>();
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = enabled;
        }
    }, [enabled]);
    return <OrbitControls ref={controlsRef} />;
}

export default Controls;