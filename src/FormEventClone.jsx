import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createEvent, updateEvent } from './store/actions/events';
import useForm from './hooks/useForm';
import { generateId } from './helpers/utils';
import { TYPE_EVENT } from './constants';

function FormEventClone({ onSubmit, onCancel, data, setProp }) {
  return (
    <>
      <form onSubmit={onSubmit}>
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
        <button type="submit">Clone</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </>
  );
}

export default function FormEventCloneContainer({ dir, event, onCancel }) {
  const { data, setProp } = useForm({ ...event });

  const dispatch = useDispatch();

  const onCloneEvent = () =>
    dispatch(createEvent(dir, { id: generateId(TYPE_EVENT), ...data }));

  const onSubmit = async (e) => {
    e.preventDefault();
    onCloneEvent();
    onCancel();
  };

  return (
    <FormEventClone
      data={data}
      setProp={setProp}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
