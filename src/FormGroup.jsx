import React, { useState } from 'react';

export default function FormGroup({ customers, onSubmit: onSubmitFn }) {
  const [groupName, setGroupName] = useState('');
  const [customerId, setCustomerId] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    onSubmitFn({
      customerId,
      groupName,
    });
  };
  return (
    <>
      <h3>New Group</h3>
      <form onSubmit={onSubmit}>
        <select
          name="customerId"
          onChange={(e) => setCustomerId(e.target.value)}
          value={customerId}
          required
        >
          <option value="">&mdash;</option>
          {
            customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))
          }
        </select>
        <input
          type="text"
          name="group"
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          value={groupName}
          required
        />
        <button type="submit" disabled={!customerId || !groupName}>new group</button>
      </form>
    </>
  );
}
