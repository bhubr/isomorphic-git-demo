import React from 'react';
import { Route, Link } from 'react-router-dom';

export default function LayoutRoute({
  user,
  ghAccessToken,
  onLogout,
  component: Component,
  routerProps,
}) {
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
        <span>Logged in as {user.name}</span>{' '}
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>
      <Route render={() => <Component {...routerProps} user={user} ghAccessToken={ghAccessToken} />} />
    </div>
  );
}