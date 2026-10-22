import React, { useState } from 'react';

/* Labeled input/textarea with an inline error message */
export default function Field({ id, label, error, as: Tag = 'input', ...rest }) {
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={id} className={error ? 'bad' : ''} aria-invalid={!!error} {...rest} />
      <span className="err" role="alert">{error}</span>
    </div>
  );
}

/* Tiny form helper: values, per-field errors, and rule-based validation.
   rules: [[fieldId, value => errorMessageOrEmpty], ...] */
export function useForm(initial) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState({});
  const bind = id => ({ id, value: v[id] ?? '', error: errors[id], onChange: e => setV(s => ({ ...s, [id]: e.target.value })) });
  const run = rules => {
    const er = {};
    for (const [id, fn] of rules) { const m = fn(String(v[id] ?? '').trim()); if (m) er[id] = m; }
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) document.getElementById(first)?.focus();
    return !first;
  };
  return { v, setV, bind, run, setErrors };
}
