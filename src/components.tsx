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
  const normalized = value.toLowerCase().trim();
  const cls = ['badge'];

  if (
    normalized === 'validated' ||
    normalized === 'validé'
  ) {
    cls.push('success');
  } else if (
    normalized === 'blocked' ||
    normalized === 'bloqué'
  ) {
    cls.push('danger');
  } else if (
    normalized === 'clear' ||
    normalized === 'clair'
  ) {
    cls.push('info');
  } else if (
    normalized === 'ready_for_validation' ||
    normalized === 'prêt à valider'
  ) {
    cls.push('warning');
  } else if (
    normalized === 'in_progress' ||
    normalized === 'en cours'
  ) {
    cls.push('neutral');
  } else if (
    normalized === 'pending' ||
    normalized === 'en attente'
  ) {
    cls.push('warning');
  } else if (
    normalized === 'rejected' ||
    normalized === 'rejeté'
  ) {
    cls.push('danger');
  } else {
    cls.push('neutral');
  }

  return <span className={cls.join(' ')}>{value}</span>;
}
