import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createCustomer, updateCustomer } from './store/actions/metadata';

function FormCustomer({
  formTitle,
  btnTitle,
  onSubmit,
  customerName,
  setCustomerName,
  onCancel,
}) {
  return (
    <>
      <h3>{formTitle}</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="customer"
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name"
          value={customerName}
          required
        />
        <button type="submit">{btnTitle}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </>
  );
}

export default function FormCustomerContainer({ dir, customer, onCancel }) {
  const [customerName, setCustomerName] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    if (customer) {
      setCustomerName(customer.name);
    }
  }, [customer]);

  const onAddCustomer = () =>
    dispatch(createCustomer(dir, { name: customerName }));
  const onUpdateCustomer = () =>
    dispatch(updateCustomer(dir, { id: customer?.id, name: customerName }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const submitFn = customer ? onUpdateCustomer : onAddCustomer;
    submitFn();
    onCancel();
    setCustomerName('');
  };

  return customer ? (
    <FormCustomer
      formTitle={`Edit customer "${customer.name}"`}
      btnTitle="Update"
      onSubmit={onSubmit}
      customerName={customerName}
      setCustomerName={setCustomerName}
      onCancel={onCancel}
    />
  ) : (
    <FormCustomer
      formTitle="New customer"
      btnTitle="Create"
      onSubmit={onSubmit}
      customerName={customerName}
      setCustomerName={setCustomerName}
    />
  );
}
