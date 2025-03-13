import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const MessageList = () => {
    const { messages } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter messages based on search term
    const filteredMessages = messages.filter((message) => {
        const searchString = `${message.contactName} ${message.otp}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Calculate how long ago the message was sent
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const messageDate = new Date(dateString);
        const diffMs = now - messageDate;
        
        const diffSecs = Math.floor(diffMs / 1000);
        if (diffSecs < 60) return `${diffSecs} seconds ago`;
        
        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) return `${diffMins} minutes ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 30) return `${diffDays} days ago`;
        
        return formatDate(dateString);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sent Messages</h2>
                <div className="text-sm text-gray-500">{messages.length} total</div>
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
                    placeholder="Search by name or OTP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredMessages.length === 0 ? (
                <div className="text-center py-10">
                    {messages.length === 0 ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No Messages Yet</h3>
                            <p className="text-gray-500 mb-6">When you send messages to contacts, they will appear here.</p>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-gray-500">No messages found matching "{searchTerm}"</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredMessages.map((message) => (
                        <div key={message.id} className="card p-4 hover:shadow-md transition-shadow duration-150">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-medium text-gray-900">{message.contactName}</h3>
                                    <div className="text-sm text-gray-500">{message.phoneNumber}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 block">{getTimeAgo(message.timestamp)}</span>
                                    <div className="mt-1 inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                        OTP: {message.otp}
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
                                {message.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageList;