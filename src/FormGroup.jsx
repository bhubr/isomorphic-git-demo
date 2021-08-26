import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createGroup, updateGroup } from './store/actions/metadata';

function FormGroup({
  formTitle,
  btnTitle,
  onSubmit,
  customers,
  customerId,
  groupName,
  setCustomerId,
  setGroupName,
  onCancel,
}) {
  return (
    <>
      <h3>{formTitle}</h3>
      <form onSubmit={onSubmit}>
        <select
          name="customerId"
          onChange={(e) => setCustomerId(e.target.value)}
          value={customerId}
          required
        >
          <option value="">&mdash;</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="group"
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          value={groupName}
          required
        />
        <button type="submit" disabled={!customerId || !groupName}>
          {btnTitle}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </>
  );
}

export default function FormGroupContainer({ dir, group, onCancel }) {
  const [groupName, setGroupName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers);

  useEffect(() => {
    if (group) {
      setCustomerId(group.customerId);
      setGroupName(group.name);
    }
  }, [group]);

  const onAddGroup = () =>
    dispatch(createGroup(dir, { customerId, name: groupName }));
  const onUpdateGroup = () =>
    dispatch(updateGroup(dir, { id: group?.id, customerId, name: groupName }));

  const onReset = () => {
    onCancel();
    setCustomerId('');
    setGroupName('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const submitFn = group ? onUpdateGroup : onAddGroup;
    submitFn();
    onReset();
  };

  return group ? (
    <FormGroup
      formTitle={`Edit group "${group.name}"`}
      btnTitle="Update"
      onSubmit={onSubmit}
      customers={customers}
      customerId={customerId}
      setCustomerId={setCustomerId}
      groupName={groupName}
      setGroupName={setGroupName}
      onCancel={onReset}
    />
  ) : (
    <FormGroup
      formTitle="New group"
      btnTitle="Create"
      onSubmit={onSubmit}
      customers={customers}
      customerId={customerId}
      setCustomerId={setCustomerId}
      groupName={groupName}
      setGroupName={setGroupName}
      onCancel={onReset}
    />
  );
}
