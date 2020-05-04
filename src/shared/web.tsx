import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { hot } from "react-hot-loader/root";
import Api from './api';


export default (api: Api) => {
  const UI = hot(() => {
    const [hello, setHello] = useState('');

    useEffect(() => {
      const getHello = async () => {
        const h = await api.hello();
        setHello(h);
      };
      getHello();
    }, []);

    return <div>{hello}</div>
  });

  ReactDOM.render(<UI />, document.getElementById('root'));
};
