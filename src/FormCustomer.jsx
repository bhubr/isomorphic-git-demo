import React, { useState } from 'react';

export default function FormCustomer({ onSubmit: onSubmitFn }) {
  const [customerName, setCustomerName] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    onSubmitFn({
      customerName,
    });
  };
  return (
    <>
      <h3>New Customer</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="customer"
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name"
          value={customerName}
          required
        />
        <button type="submit">new customer</button>
      </form>
    </>
  );
}
