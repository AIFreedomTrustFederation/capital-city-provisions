export type ContextRecordSource =
  | 'postgres'
  | 'memory'
  | 'ai-summary'
  | 'customer-message'
  | 'driver-note'
  | 'owner-override'
  | 'system';

export type TruthLevel =
  | 'official'
  | 'working'
  | 'inferred'
  | 'pending-review';

export type ContextTrust = {
  source: ContextRecordSource;
  truthLevel: TruthLevel;
  confidence: number;
  reason: string;
};

export type TrustedContextRecord<T = unknown> = T & {
  contextTrust: ContextTrust;
};

const sourceDefaults: Record<ContextRecordSource, ContextTrust> = {
  postgres: {
    source: 'postgres',
    truthLevel: 'official',
    confidence: 0.98,
    reason: 'Durable operational database record.',
  },
  memory: {
    source: 'memory',
    truthLevel: 'working',
    confidence: 0.72,
    reason: 'Runtime working memory; useful for AI context but not final proof.',
  },
  'ai-summary': {
    source: 'ai-summary',
    truthLevel: 'inferred',
    confidence: 0.62,
    reason: 'AI-generated synthesis; verify against official records before action.',
  },
  'customer-message': {
    source: 'customer-message',
    truthLevel: 'pending-review',
    confidence: 0.76,
    reason: 'Customer-provided information awaiting owner or system confirmation.',
  },
  'driver-note': {
    source: 'driver-note',
    truthLevel: 'pending-review',
    confidence: 0.82,
    reason: 'Driver field note; operationally important but should be reconciled with order status.',
  },
  'owner-override': {
    source: 'owner-override',
    truthLevel: 'official',
    confidence: 0.95,
    reason: 'Owner decision or override.',
  },
  system: {
    source: 'system',
    truthLevel: 'working',
    confidence: 0.7,
    reason: 'System-generated working record.',
  },
};

export function contextTrust(source: ContextRecordSource, overrides: Partial<Omit<ContextTrust, 'source'>> = {}): ContextTrust {
  return { ...sourceDefaults[source], ...overrides, source };
}

export function withContextTrust<T extends Record<string, unknown>>(record: T, source: ContextRecordSource, overrides: Partial<Omit<ContextTrust, 'source'>> = {}): TrustedContextRecord<T> {
  return { ...record, contextTrust: contextTrust(source, overrides) };
}

export function sourceFromStorage(storage?: string): ContextRecordSource {
  if (storage === 'postgres') return 'postgres';
  if (storage === 'memory') return 'memory';
  return 'system';
}

export function explainTruthLevel(trust?: Partial<ContextTrust>) {
  if (!trust) return 'Unlabeled context; verify before action.';
  if (trust.truthLevel === 'official') return 'Official record. AI may use this as the operational source of truth.';
  if (trust.truthLevel === 'working') return 'Working memory. AI may use this for context, but should verify before final action.';
  if (trust.truthLevel === 'inferred') return 'Inferred memory. AI should treat this as a suggestion, not a fact.';
  return 'Pending review. AI should surface this to owner or driver for confirmation.';
}
