import React, { useState, useEffect } from 'react';
import api from './services/api';

// eslint-disable-next-line
import logo from './logo.svg';

import './App.css';
import './global.css';

import './Sidebar.css';
import './Main.css';

import DevForm from './components/DevForm';
import DevItem from './components/DevItem';

function App() {
  // Estado
  const [devs, setDevs] = useState([]);

  // https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F693514862392143872%2F5aN1pR94.jpg&f=1&nofb=1

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');
      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post('/devs', data);

    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      { /* --- > ASIDE < ---*/ }
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      { /* --- > MAIN < ---*/ }
      <main>
        <ul>
          {devs.map(dev => (<DevItem key={dev._id} dev={dev} />))}
        </ul>
      </main>
    </div>
  );
}

export default App;
