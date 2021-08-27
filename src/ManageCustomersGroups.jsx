/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormCustomer from './FormCustomer';
import FormGroup from './FormGroup';
import { cloneRepo } from './helpers/git';
import {
  readMetadata,
  deleteCustomer,
  deleteGroup,
} from './store/actions/metadata';

export default function ManageCustomersGroups() {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  const { repo: { dir }, customers, groups } = useSelector((state) => ({
    repo: state.repo,
    customers: state.customers,
    groups: state.metadata?.groups,
  }));
  const dispatch = useDispatch();


  const onDeleteCustomer = (customerId) =>
    dispatch(deleteCustomer(dir, customerId));

  const onDeleteGroup = (groupId) => dispatch(deleteGroup(dir, groupId));

  return (
    <main>
      <h3>Customers</h3>
      <ul>
        {customers.map((item) => (
          <li key={item.id}>
            {item.name}{' '}
            <button type="button" onClick={() => setEditingCustomer(item)}>
              edit
            </button>{' '}
            <button type="button" onClick={() => onDeleteCustomer(item.id)}>
              x
            </button>
            <ul>
              {(item.groups || []).map((g) => (
                <li key={g.id}>{g.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h3>Groups</h3>
      <ul>
        {(groups || []).map((item) => (
          <li key={item.id}>
            {item.name}{' '}
            <button type="button" onClick={() => setEditingGroup(item)}>
              edit
            </button>{' '}
            <button type="button" onClick={() => onDeleteGroup(item.id)}>
              x
            </button>
          </li>
        ))}
      </ul>
      <FormCustomer
        dir={dir}
        customer={editingCustomer}
        onCancel={() => setEditingCustomer(null)}
      />
      <FormGroup
        dir={dir}
        group={editingGroup}
        onCancel={() => setEditingGroup(null)}
      />
    </main>
  );
}
