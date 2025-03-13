import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ContactList from './components/ContactList';
import ContactDetails from './components/ContactDetails';
import Compose from './components/Compose';
import MessageList from './components/MessageList';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ContactList />} />
            <Route path="contact/:id" element={<ContactDetails />} />
            <Route path="compose/:id" element={<Compose />} />
            <Route path="messages" element={<MessageList />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;