import { Line, Text } from '@react-three/drei';

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
      pos = [i, 0, 0];
      tickStart = [i, -0.1, 0];
      tickEnd = [i, 0.1, 0];
    } else if (axis === 'y') {
      pos = [0, i, 0];
      tickStart = [-0.1, i, 0];
      tickEnd = [0.1, i, 0];
    } else if (axis === 'z') {
      pos = [0, 0, i];
      tickStart = [0, 0, i - 0.1];
      tickEnd = [0, 0, i + 0.1];
    }

    ticks.push(
      <group key={`${axis}-${i}`}>
        <Line points={[tickStart, tickEnd]} color={color} lineWidth={1} />
        <Text position={pos as [number, number, number]} fontSize={0.25} color={color}>
          {i}
        </Text>
      </group>
    );
  }

  return <>{ticks}</>;
}

type AxesProps = {
  length?: number;
  interval?: number;
};

export default function Axes({ length = 20, interval = 1 }: AxesProps) {
  return (
    <>
      {/* Axis lines */}
      <Line points={[[-length, 0, 0], [length, 0, 0]]} color="red" />
      <Line points={[[0, -length, 0], [0, length, 0]]} color="green" />
      <Line points={[[0, 0, -length], [0, 0, length]]} color="blue" />

      {/* Ticks */}
      <AxisTicks axis="x" length={length} interval={interval} color="red" />
      <AxisTicks axis="y" length={length} interval={interval} color="green" />
      <AxisTicks axis="z" length={length} interval={interval} color="blue" />

      {/* Labels */}
      <Text position={[5.5, 0, 0]} color="red" fontSize={0.5}>X</Text>
      <Text position={[-5.5, 0, 0]} color="red" fontSize={0.5}>-X</Text>
      <Text position={[0, 5.5, 0]} color="green" fontSize={0.5}>Y</Text>
      <Text position={[0, -5.5, 0]} color="green" fontSize={0.5}>-Y</Text>
      <Text position={[0, 0, 5.5]} color="blue" fontSize={0.5}>Z</Text>
      <Text position={[0, 0, -5.5]} color="blue" fontSize={0.5}>-Z</Text>
    </>
  );
}