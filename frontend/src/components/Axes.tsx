import { Line, Html } from '@react-three/drei';

type AxisProps = {
  axis: 'x' | 'y' | 'z';
  realLength: number;
  realInterval: number;
  color: string;
  scaleFactor: number;
};

function AxisTicks({ axis, realLength, realInterval, color, scaleFactor }: AxisProps) {
  const ticks = [];
  
  // Failsafe to prevent infinite loops if interval is somehow 0
  const safeInterval = Math.max(1, realInterval);

  for (let val = -realLength; val <= realLength; val += safeInterval) {
    if (val === 0) continue;

    // The physical position on the screen is scaled down, but the label 'val' stays true
    const posVal = val / scaleFactor;

    let pos: [number, number, number] = [0, 0, 0];
    let tickStart: [number, number, number] = [0, 0, 0];
    let tickEnd: [number, number, number] = [0, 0, 0];

    if (axis === 'x') {
      pos = [posVal, 0.2, 0];
      tickStart = [posVal, -0.1, 0];
      tickEnd = [posVal, 0.1, 0];
    } else if (axis === 'y') {
      pos = [-0.2, posVal, 0];
      tickStart = [-0.1, posVal, 0];
      tickEnd = [0.1, posVal, 0];
    } else {
      pos = [0, 0.2, posVal];
      tickStart = [0, -0.1, posVal];
      tickEnd = [0, 0.1, posVal];
    }

    ticks.push(
      <group key={`${axis}-${val}`}>
        <Line points={[tickStart, tickEnd]} color={color} lineWidth={1} />
        <Html position={pos} center distanceFactor={8}>
          <div style={{
            color,
            fontSize: '18px',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}>
            {val}
          </div>
        </Html>
      </group>
    );
  }

  return <>{ticks}</>;
}

type AxesProps = {
  length?: number;
  xLength?: number;
  yLength?: number;
  zLength?: number;
  interval?: number;
  xInterval?: number;
  yInterval?: number;
  zInterval?: number;
  width?: number;
  xcolor?: string;
  ycolor?: string;
  zcolor?: string;
  scaleFactor?: number;
  fontPosition?: number;
};

function Axes({
  length,
  xLength = length ?? 100,
  yLength = length ?? 100,
  zLength = length ?? 100,
  interval,
  xInterval = interval ?? 1,
  yInterval = interval ?? 1,
  zInterval = interval ?? 1,
  width = 1,
  xcolor = "#ef4444",
  ycolor = "#22c55e",
  zcolor = "#3b82f6",
  scaleFactor = 1,
  fontPosition,
}: AxesProps) {
  
  // Scale down the physical length of the axis lines
  const visXL = xLength / scaleFactor;
  const visYL = yLength / scaleFactor;
  const visZL = zLength / scaleFactor;

  return (
    <>
      <Line points={[[-visXL, 0, 0], [visXL, 0, 0]]} color={xcolor} lineWidth={width} />
      <Line points={[[0, -visYL, 0], [0, visYL, 0]]} color={ycolor} lineWidth={width} />
      <Line points={[[0, 0, -visZL], [0, 0, visZL]]} color={zcolor} lineWidth={width} />

      <AxisTicks axis='x' realLength={xLength} realInterval={xInterval} color={xcolor} scaleFactor={scaleFactor} />
      <AxisTicks axis='y' realLength={yLength} realInterval={yInterval} color={ycolor} scaleFactor={scaleFactor} />
      <AxisTicks axis='z' realLength={zLength} realInterval={zInterval} color={zcolor} scaleFactor={scaleFactor} />
    </>
  );
}

export default Axes;