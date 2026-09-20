import { scoreLabel } from '../lib/utils';

interface Props {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreRing({ score, size = 80, label }: Props) {
  const r = (size / 2) * 0.8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const { label: scoreText, color } = scoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Score: ${score} out of 100`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={size * 0.1}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.1}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.22}
          fontWeight="700"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
        >
          {score}
        </text>
      </svg>
      {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
      <span className="text-xs font-semibold" style={{ color }}>{scoreText}</span>
    </div>
  );
}
