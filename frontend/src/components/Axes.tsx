import { Line, Text } from '@react-three/drei';

type AxisProps = {
  axis: 'x' | 'y' | 'z';
  length: number;
  interval: number;
  color: string;
  fontSize: number;
};

function AxisTicks({ axis, length, interval, color, fontSize }: AxisProps) {
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
      tickStart = [0, 0, i - 0.1];
      tickEnd = [0, 0, i + 0.1];
    }

    ticks.push(
      <group key={`${axis}-${i}`}>
        <Line points={[tickStart, tickEnd]} color={color} lineWidth={1} />
        <Text position={pos as [number, number, number]} fontSize={fontSize} color={color}>
          {i}
        </Text>
      </group>
    );
  }

  return <>{ticks}</>;
}

type AxesProps = {
  length?: number;
  width?: number;
  fontPosition?: number;
  fontSize?: number;
  interval?: number;
  xcolor?: string;
  ycolor?: string;
  zcolor?: string;
};

function Axes({ length=20, width=3, fontPosition=5.5, fontSize=1, interval=1, xcolor="black", ycolor="black", zcolor="black" }: AxesProps) {
  return (
    <>
      {/* Axis lines */}
      <Line points={[[-length, 0, 0], [length, 0, 0]]} color={xcolor} lineWidth={width} />
      <Line points={[[0, -length, 0], [0, length, 0]]} color={ycolor} lineWidth={width} />
      <Line points={[[0, 0, -length], [0, 0, length]]} color={zcolor} lineWidth={width} />

      {/* Ticks */}
      <AxisTicks axis='x' length={length} interval={interval} color={xcolor} fontSize={fontSize/2} />
      <AxisTicks axis='y' length={length} interval={interval} color={ycolor} fontSize={fontSize/2} />
      <AxisTicks axis='z' length={length} interval={interval} color={zcolor} fontSize={fontSize/2} />

      {/* Labels */}
      <Text position={[fontPosition, 0.3, 0]} color={xcolor} fontSize={fontSize}>X</Text>
      <Text position={[-fontPosition, 0.3, 0]} color={xcolor} fontSize={fontSize}>-X</Text>
      <Text position={[0.3, fontPosition, 0]} color={ycolor} fontSize={fontSize}>Y</Text>
      <Text position={[0.3, -fontPosition, 0]} color={ycolor} fontSize={fontSize}>-Y</Text>
      <Text position={[0, 0.3, fontPosition]} color={zcolor} fontSize={fontSize}>Z</Text>
      <Text position={[0, 0.3, -fontPosition]} color={zcolor} fontSize={fontSize}>-Z</Text>
    </>
  );
}

export default Axes;