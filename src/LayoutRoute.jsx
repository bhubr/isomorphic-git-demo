import React, { useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { cloneRepo } from './helpers/git';
import {
  readMetadata,
} from './store/actions/metadata';
import { readEvents } from './store/actions/events';
import { setError } from './store/actions/error';

export default function LayoutRoute({
  user,
  ghAccessToken,
  onLogout,
  component: Component,
  routerProps,
}) {
  const { repo: { url, dir } } = useSelector(state => ({
    repo: state.repo,
    error: state.error,
  }));
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      await cloneRepo({
        url,
        dir,
        accessToken: ghAccessToken,
        onSuccess: async () => {
          dispatch(readMetadata(dir));
          dispatch(readEvents(dir));
        },
        onFailure: (err) => dispatch(setError(err)),
      });
    })();
  }, [dir, ghAccessToken]);
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/manage-customers-groups">Customers &amp; Groups</Link>
          </li>
        </ul>
        <div className="nav-logout">
        <span>Logged in as {user.name}</span>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
        </div>
      </nav>
      <Route render={() => <Component {...routerProps} user={user} ghAccessToken={ghAccessToken} />} />
    </div>
  );
}