import { useState } from 'react';

export default function useForm(initialData) {
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

