import { useState } from 'react';

export default function useStateStorage(storageKey, defaultValue) {
  const storedDataJSON = localStorage.getItem(storageKey);
  const initialValue = storedDataJSON
    ? JSON.parse(storedDataJSON)
    : defaultValue;
  const [data, setData] = useState(initialValue);

  const setAndStore = (updatedData) => {
    const json = JSON.stringify(updatedData);
    localStorage.setItem(storageKey, json);
    setData(updatedData);
  };

  return [data, setAndStore];
}
