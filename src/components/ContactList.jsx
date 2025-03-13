import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ContactList = () => {
    const { contacts } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter contacts based on search term
    const filteredContacts = contacts.filter((contact) => {
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    // Get background color based on first letter of name for visual variety
    const getAvatarColor = (name) => {
        const colors = [
            'bg-blue-100 text-blue-800',
            'bg-green-100 text-green-800',
            'bg-purple-100 text-purple-800',
            'bg-yellow-100 text-yellow-800',
            'bg-pink-100 text-pink-800'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
                <div className="text-sm text-gray-500">{contacts.length} total</div>
            </div>

            {/* Search bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="input pl-10"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredContacts.length === 0 ? (
                <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-500">No contacts found matching "{searchTerm}"</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredContacts.map((contact) => {
                        const avatarColor = getAvatarColor(contact.firstName);
                        return (
                            <Link
                                key={contact.id}
                                to={`/contact/${contact.id}`}
                                className="block rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition duration-150 overflow-hidden"
                            >
                                <div className="flex items-center p-3">
                                    <div className={`avatar avatar-md rounded-lg mr-4 ${avatarColor}`}>
                                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                                        <div className="text-sm text-gray-500">{contact.phoneNumber}</div>
                                    </div>
                                    <div className="ml-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ContactList;