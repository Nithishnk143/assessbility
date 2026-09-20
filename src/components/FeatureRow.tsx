import type { AccessibilityFeature } from '../lib/types';
import { statusColor, statusBg, statusLabel, featureIcon } from '../lib/utils';

interface Props {
  feature: AccessibilityFeature;
}

export default function FeatureRow({ feature }: Props) {
  const color = statusColor(feature.status);
  const bg = statusBg(feature.status);

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-lg shrink-0">{featureIcon(feature.name)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 text-sm">{feature.label}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ color, background: bg }}
          >
            {statusLabel(feature.status)}
          </span>
        </div>
        {feature.note && (
          <p className="text-sm text-gray-500 mt-0.5 leading-snug">{feature.note}</p>
        )}
      </div>
    </div>
  );
}
