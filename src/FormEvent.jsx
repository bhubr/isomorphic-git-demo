import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const useForm = (initialData) => {
  const [data, setData] = useState(initialData);

  const setProp =
    (k) =>
    ({ target }) =>
      setData((prevData) => ({
        ...prevData,
        [k]: target.type === 'checkbox' ? target.checked : target.value,
      }));

  return {
    data,
    setData,
    setProp,
  };
};

const Select = ({ id, name, label, options, value, onChange }) => (
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

function FormEvent({
  onSubmit: onSubmitFn,
  customers,
  data,
  setProp,
  customerId,
  setCustomerId,
  customer,
  groupId,
  setGroupId,
}) {
  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...data, customerId, groupId };
    onSubmitFn(payload);
  };
  return (
    <>
      <h3>New event</h3>
      <form onSubmit={onSubmit}>
        <Select
          id="event-customer-dropdown"
          name="customerId"
          label="Customer"
          options={customers}
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <Select
          id="event-group-dropdown"
          name="groupId"
          label="Group"
          options={customer?.groups || []}
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <input
          type="text"
          name="course"
          onChange={setProp('eventName')}
          placeholder="Event name"
          value={data.eventName}
          required
        />
        <input
          type="date"
          name="date"
          onChange={setProp('eventDate')}
          value={data.eventDate}
          required
        />
        <input
          type="checkbox"
          name="fullDay"
          checked={data.fullDay}
          onChange={setProp('fullDay')}
        />
        {!data.fullDay && (
          <>
            <input
              type="time"
              name="startTime"
              onChange={setProp('startTime')}
              value={data.startTime}
            />
            <input
              type="time"
              name="endTime"
              onChange={setProp('endTime')}
              value={data.endTime}
            />
          </>
        )}
        <button type="submit">new event</button>
      </form>
    </>
  );
}

export default function FormEventContainer({ dir, event, onCancel }) {
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState('');
  const [groupId, setGroupId] = useState('');
  const { data, setProp } = useForm({
    eventName: '',
    eventDate: '',
    fullDay: true,
    startTime: '',
    endTime: '',
  });

  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers);

  useEffect(() => {
    setGroupId('');
    setCustomer(customers.find((c) => c.id === customerId));
  }, [customerId]);

  return (
    <FormEvent
      customers={customers}
      data={data}
      customerId={customerId}
      setCustomerId={setCustomerId}
      customer={customer}
      groupId={groupId}
      setGroupId={setGroupId}
      setProp={setProp}
    />
  );
}
