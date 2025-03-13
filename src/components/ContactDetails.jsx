import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ContactDetails = () => {
    const { id } = useParams();
    const { contacts } = useContext(AppContext);
    const navigate = useNavigate();

    // Find the contact with the matching id
    const contact = contacts.find(c => c.id === parseInt(id));

    // Get background color based on first letter of name for visual variety
    const getAvatarColor = (name) => {
        const colors = [
            'bg-blue-100 text-blue-800',
            'bg-green-100 text-green-800',
            'bg-purple-100 text-purple-800',
            'bg-yellow-100 text-yellow-800',
            'bg-pink-100 text-pink-800'
        ];
        const index = name?.charCodeAt(0) % colors.length || 0;
        return colors[index];
    };

    // If no contact found, show an error
    if (!contact) {
        return (
            <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Contact Not Found</h3>
                <p className="text-gray-600 mb-6">The contact you're looking for doesn't exist or may have been deleted.</p>
                <Link to="/" className="btn btn-primary">Back to Contacts</Link>
            </div>
        );
    }

    const avatarColor = getAvatarColor(contact.firstName);

    return (
        <div>
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Back</span>
                </button>
                <h2 className="text-xl font-bold text-gray-800 ml-4">Contact Details</h2>
            </div>

            <div className="card p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center">
                    <div className={`avatar avatar-lg ${avatarColor} mb-4 sm:mb-0 sm:mr-6`}>
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">{contact.firstName} {contact.lastName}</h1>
                        <div className="flex items-center justify-center sm:justify-start text-gray-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span>{contact.phoneNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-5 mt-5">
                    <h3 className="text-sm uppercase text-gray-500 mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Full Name</div>
                            <div className="font-medium">{`${contact.firstName} ${contact.lastName}`}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                            <div className="font-medium">{contact.phoneNumber}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Link
                to={`/compose/${contact.id}`}
                className="btn btn-primary block w-full py-3 text-center"
            >
                <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    Send Message
                </div>
            </Link>
        </div>
    );
};

export default ContactDetails;