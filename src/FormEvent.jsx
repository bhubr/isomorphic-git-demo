import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createEvent } from './store/actions/events';

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
  onSubmit,
  customers,
  data,
  setProp,
  customerId,
  setCustomerId,
  customer,
  groupId,
  setGroupId,
}) {
  const autoPopulate = () => {
    setCustomerId(customers[0].id);

    setProp('name')({ target: { value: 'TypeScript' } });
    setProp('date')({ target: { value: '2021-09-25' } });
    setProp('fullDay')({ target: { type: 'checkbox', checked: false } });
    setProp('startTime')({ target: { value: '08:30' } });
    setProp('endTime')({ target: { value: '12:00' } });

    setTimeout(() => setGroupId(customers[0].groups[0].id), 200);
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
          name="name"
          onChange={setProp('name')}
          placeholder="Event name"
          value={data.name}
          required
        />
        <input
          type="date"
          name="date"
          onChange={setProp('date')}
          value={data.date}
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
        <button type="button" onClick={autoPopulate}>
          autopop
        </button>
      </form>
    </>
  );
}

export default function FormEventContainer({ dir, event, onCancel }) {
  const initialData = {
    name: '',
    date: '',
    fullDay: true,
    startTime: '',
    endTime: '',
  };
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState('');
  const [groupId, setGroupId] = useState('');
  const { data, setData, setProp } = useForm({ ...initialData });

  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers);

  useEffect(() => {
    console.log('customer change effect', customerId);
    setGroupId('');
    setCustomer(customers.find((c) => c.id === customerId));
  }, [customerId]);

  const onAddEvent = () =>
    dispatch(createEvent(dir, { customerId, groupId, ...data }));

  const onReset = () => {
    onCancel();
    setCustomerId('');
    setGroupId('');
    setData({ ...initialData });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // const submitFn = event ? onUpdateEvent : onAddEvent;
    const submitFn = event ? (d) => console.warn('update N/A', d) : onAddEvent;
    submitFn();
    onReset();
  };

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
      onSubmit={onSubmit}
    />
  );
}
