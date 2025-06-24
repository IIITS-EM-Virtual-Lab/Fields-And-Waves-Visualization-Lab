import { Line, Text, Html } from '@react-three/drei';

type AxisProps = {
  axis: 'x' | 'y' | 'z';
  length: number;
  interval: number;
  color: string;
};

function AxisTicks({ axis, length, interval, color }: AxisProps) {
  const ticks = [];
  for (let i = -length; i <= length; i += interval) {
    if (i === 0) continue;

    let pos = [0, 0, 0];
    let tickStart: [number, number, number] = [0, 0, 0];
    let tickEnd: [number, number, number] = [0, 0, 0];

    if (axis === 'x') {
      pos = [i, 0.2, 0];
      tickStart = [i, -0.1, 0];
      tickEnd = [i, 0.1, 0];
    } else if (axis === 'y') {
      pos = [-0.2, i, 0];
      tickStart = [-0.1, i, 0];
      tickEnd = [0.1, i, 0];
    } else if (axis === 'z') {
      pos = [0, 0.2, i];
      tickStart = [0, -0.1, i];
      tickEnd = [0, +0.1, i];
    }

    ticks.push(
      <group key={`${axis}-${i}`}>
        <Line points={[tickStart, tickEnd]} color={color} lineWidth={1} />
        <Html position={pos as [number, number, number]} center distanceFactor={8}>
          <div style={{ color, fontSize: '20px', userSelect: 'none', whiteSpace: 'nowrap' }}>{i}</div>
        </Html>
      </group>
    );
  }

  return <>{ticks}</>;
}

type AxesProps = {
  length?: number;
  width?: number;
  fontPosition?: number;
  interval?: number;
  xcolor?: string;
  ycolor?: string;
  zcolor?: string;
};

function Axes({ length=20, width=3, fontPosition=5.5, interval=1, xcolor="black", ycolor="black", zcolor="black" }: AxesProps) {
  return (
    <>
      {/* Axis lines */}
      <Line points={[[-length, 0, 0], [length, 0, 0]]} color={xcolor} lineWidth={width} />
      <Line points={[[0, -length, 0], [0, length, 0]]} color={ycolor} lineWidth={width} />
      <Line points={[[0, 0, -length], [0, 0, length]]} color={zcolor} lineWidth={width} />

      {/* Ticks */}
      <AxisTicks axis='x' length={length} interval={interval} color={xcolor} />
      <AxisTicks axis='y' length={length} interval={interval} color={ycolor} />
      <AxisTicks axis='z' length={length} interval={interval} color={zcolor} />

      {/* Labels */}
      <Html position={[fontPosition, 0.3, 0]} center distanceFactor={8}>
        <div style={{ color: xcolor, fontSize: '30px', userSelect: 'none', whiteSpace: 'nowrap' }}>X</div>
      </Html>
      <Html position={[-fontPosition, 0.3, 0]} center distanceFactor={8}>
        <div style={{ color: xcolor, fontSize: '30px', userSelect: 'none', whiteSpace: 'nowrap' }}>-X</div>
      </Html>
      <Html position={[0.3, fontPosition, 0]} center distanceFactor={8}>
        <div style={{ color: ycolor, fontSize: '30px', userSelect: 'none', whiteSpace: 'nowrap' }}>Y</div>
      </Html>
      <Html position={[0.3, -fontPosition, 0]} center distanceFactor={8}>
        <div style={{ color: ycolor, fontSize: '30px', userSelect: 'none', whiteSpace: 'nowrap' }}>-Y</div>
      </Html>
      <Html position={[0, 0.3, fontPosition]} center distanceFactor={8}>
        <div style={{ color: zcolor, fontSize: '30px', userSelect: 'none', whiteSpace: 'nowrap' }}>Z</div>
      </Html>
      <Html position={[0, 0.3, -fontPosition]} center distanceFactor={8}>
        <div style={{ color: zcolor, fontSize: '30px', userSelect: 'none', whiteSpace: 'nowrap' }}>-Z</div>
      </Html>
    </>
  );
}

export default Axes;