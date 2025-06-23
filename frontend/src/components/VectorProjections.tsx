import { Line } from '@react-three/drei';

type Props = {
  vector: [number, number, number];
};

export default function VectorProjections({ vector }: Props) {
  const [x, y, z] = vector;
  return (
    <>
      <Line points={[[x, y, z], [x, 0, 0]]} color="red" dashed dashSize={0.2} gapSize={0.1} />
      <Line points={[[x, y, z], [0, y, 0]]} color="green" dashed dashSize={0.2} gapSize={0.1} />
      <Line points={[[x, y, z], [0, 0, z]]} color="blue" dashed dashSize={0.2} gapSize={0.1} />
    </>
  );
}