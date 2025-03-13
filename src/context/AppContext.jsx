import React, { createContext, useState, useEffect } from 'react';
import contactsData from '../data/contacts.json';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Initialize contacts from JSON file
    const [contacts, setContacts] = useState([]);

    // Initialize messages from localStorage or empty array
    const [messages, setMessages] = useState([]);

    // Load contacts and messages on component mount
    useEffect(() => {
        setContacts(contactsData);

        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    // Save messages to localStorage whenever messages state changes
    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    // Add a new message to the messages array
    const addMessage = (message) => {
        setMessages([message, ...messages]);
    };

    return (
        <AppContext.Provider value={{ contacts, messages, addMessage }}>
            {children}
        </AppContext.Provider>
    );
};