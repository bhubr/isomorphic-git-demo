/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormEvent from './FormEvent';
import FormCustomer from './FormCustomer';
import FormGroup from './FormGroup';
import { cloneRepo, addCommitPush } from './helpers/git';
import { readFile, writeFile } from './helpers/fs';
import { generateId } from './helpers/utils';
import {
  readMetadata,
  deleteCustomer,
  deleteGroup,
} from './store/actions/metadata';
import { readEvents, deleteEvent } from './store/actions/events';

export default function Dashboard({ ghAccessToken, user, onLogout }) {
  const [[dir, url]] = useState([
    '/agenda-wip4',
    'https://github.com/bhubr/git-agenda',
  ]);
  console.log(dir, url);
  // const [[dir, url]]  = useState(['/git-calendar', 'https://github.com/bhubr/git-calendar']);
  const [dirContent, setDirContent] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const { customers, groups, events } = useSelector((state) => ({
    customers: state.customers,
    groups: state.metadata?.groups,
    events: state.events,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await cloneRepo({
        url,
        dir,
        accessToken: ghAccessToken,
        onSuccess: async (files) => {
          setDirContent(files);
          console.log('firing readMetadata');
          dispatch(readMetadata(dir));
          dispatch(readEvents(dir));
        },
        onFailure: (err) => console.error('clone error', err),
      });
    })();
  }, [dir, ghAccessToken]);

  const showFileContent = async (file) => {
    const content = await readFile(dir, file);
    console.log(content);
  };

  const onDeleteCustomer = (customerId) =>
    dispatch(deleteCustomer(dir, customerId));

  const onDeleteGroup = (groupId) => dispatch(deleteGroup(dir, groupId));

  const onDeleteEvent = (eventId) => dispatch(deleteEvent(dir, eventId));

  return (
    <main>
      <nav>
        <span>Logged in as {user.name}</span>{' '}
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>

      <h3>Repo content</h3>
      <ul>
        {dirContent.map((item) => (
          <li key={item} onClick={() => showFileContent(item)}>
            {item}
          </li>
        ))}
      </ul>

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

      <h3>Events</h3>
      <ul>
        {(events || []).map((item) => (
          <li key={item.id}>
            {item.date} {item.startTime}-{item.endTime} {item.summary}{' '}
            <button type="button" onClick={() => setEditingEvent(item)}>
              edit
            </button>{' '}
            <button type="button" onClick={() => onDeleteEvent(item.id)}>
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
      <FormEvent
        dir={dir}
        event={editingEvent}
        onCancel={() => setEditingEvent(null)}
      />
    </main>
  );
}
