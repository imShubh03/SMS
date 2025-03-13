import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname === '/messages' ? 'messages' : 'contacts');

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 max-w-2xl flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600">ContactSync</h1>
                    <div className="text-sm text-gray-500">OTP Messaging System</div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6 max-w-2xl">
                <div className="card mb-6">
                    {/* Navigation Tabs */}
                    <div className="flex border-b">
                        <Link
                            to="/"
                            className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${
                                activeTab === 'contacts' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('contacts')}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Contacts
                            </div>
                        </Link>
                        <Link
                            to="/messages"
                            className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${
                                activeTab === 'messages' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                </svg>
                                Messages
                            </div>
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="p-5">
                        <Outlet />
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 py-4">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2025 ContactSync - OTP Messaging System</p>
                        <div className="mt-2 md:mt-0">
                            <span className="px-2">Privacy Policy</span>
                            <span className="px-2 border-l border-gray-300">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;