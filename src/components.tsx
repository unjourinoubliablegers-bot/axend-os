import { PropsWithChildren } from 'react';

export function Panel({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Badge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const cls = ['badge'];
  if (normalized === 'validated' || normalized === 'validé') cls.push('success');
  if (normalized === 'blocked' || normalized === 'bloqué') cls.push('danger');
  if (normalized === 'clear' || normalized === 'clair') cls.push('info');
  if (normalized === 'ready_for_validation') cls.push('warning');
  if (normalized === 'in_progress') cls.push('neutral');
  return <span className={cls.join(' ')}>{value}</span>;
}
