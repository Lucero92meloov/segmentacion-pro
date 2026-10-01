import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AlertBanner({ warnings = [], contrastWarning = null }) {
  if (warnings.length === 0 && !contrastWarning) return null;

  return (
    <div className="space-y-2 mb-4">
      {contrastWarning && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
          <span>{contrastWarning}</span>
        </div>
      )}

      {warnings.map((warn, index) => (
        <div
          key={index}
          className="flex items-center gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <span>{warn}</span>
        </div>
      ))}
    </div>
  );
}
