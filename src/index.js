import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes/App';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


