import { Line } from '@react-three/drei';

type Props = {
  vector: [number, number, number];
  xcolor?: string;
  ycolor?: string;
  zcolor?: string;
  dashSize?: number;
  gapSize?: number;
};

function VectorProjections({ vector, xcolor="black", ycolor="black", zcolor="black", dashSize=0.2, gapSize=0.1 }: Props) {
  const [x, y, z] = vector;
  return (
    <>
      <Line points={[[x, y, z], [x, 0, 0]]} color={xcolor} dashed dashSize={dashSize} gapSize={gapSize} />
      <Line points={[[x, y, z], [0, y, 0]]} color={ycolor} dashed dashSize={dashSize} gapSize={gapSize} />
      <Line points={[[x, y, z], [0, 0, z]]} color={zcolor} dashed dashSize={dashSize} gapSize={gapSize} />
    </>
  );
}

export default VectorProjections;