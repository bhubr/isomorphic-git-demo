import React from 'react';

export default function Select({ id, name, label, options, value, onChange }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} onChange={onChange} value={value} required>
        <option value="">&mdash;</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </>
  );
}
