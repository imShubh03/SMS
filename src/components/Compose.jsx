import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { sendSMS } from '../services/smsService';
import { generateOTP } from '../utils/helpers';

const Compose = () => {
    const { id } = useParams();
    const { contacts, addMessage } = useContext(AppContext);
    const navigate = useNavigate();

    // Find the contact with the matching id
    const contact = contacts.find(c => c.id === parseInt(id));

    // State for message content and OTP
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Generate OTP and message template on component mount
    useEffect(() => {
        const newOtp = generateOTP();
        setOtp(newOtp);
        setMessage(`Hi. Your OTP is: ${newOtp}`);
    }, []);

    // Handle countdown for redirect after success
    useEffect(() => {
        let timer;
        if (success && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (success && countdown === 0) {
            navigate('/messages');
        }
        return () => clearTimeout(timer);
    }, [success, countdown, navigate]);

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
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-primary"
                >
                    Back to Contacts
                </button>
            </div>
        );
    }

    const handleSendMessage = async () => {
        // Validate message
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }

        // Check if OTP is included in message
        if (!message.includes(otp)) {
            setError(`Your message must include the OTP: ${otp}`);
            return;
        }

        // Reset states
        setError('');
        setSending(true);

        try {
            // Send SMS
            await sendSMS(contact.phoneNumber, message);

            // Create message object
            const newMessage = {
                id: Date.now(),
                contactId: contact.id,
                contactName: `${contact.firstName} ${contact.lastName}`,
                phoneNumber: contact.phoneNumber,
                message: message,
                otp: otp,
                timestamp: new Date().toISOString()
            };

            // Add to messages
            addMessage(newMessage);

            // Show success and start countdown
            setSuccess(true);
            setCountdown(3);

        } catch (err) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const avatarColor = getAvatarColor(contact.firstName);

    return (
        <div className="animate-[fadeIn_0.3s_ease-in-out]">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    disabled={sending || success}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Back</span>
                </button>
                <h2 className="text-xl font-bold text-gray-800 ml-4">New Message</h2>
            </div>

            <div className="card mb-6">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-sm uppercase text-gray-500 mb-3">Recipient</h3>
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <div className={`avatar avatar-sm ${avatarColor} mr-3`}>
                            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </div>
                        <div>
                            <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                            <div className="text-sm text-gray-500">{contact.phoneNumber}</div>
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <label htmlFor="message" className="block text-sm uppercase text-gray-500 mb-3">Message</label>
                    <div className="relative">
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="input min-h-32 transition-all duration-200"
                            placeholder="Type your message..."
                            disabled={sending || success}
                        />
                        <div className="flex items-center justify-between mt-2 text-sm">
                            <div className="text-gray-500">
                                <span className="font-medium">OTP:</span> <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{otp}</span>
                            </div>
                            <div className="text-gray-500">{message.length} characters</div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium">Message sent successfully!</p>
                        <p className="text-sm">Redirecting to messages in {countdown} seconds...</p>
                    </div>
                </div>
            )}

            <button
                onClick={handleSendMessage}
                disabled={sending || success}
                className={`btn block w-full py-3.5 text-center ${
                    sending 
                    ? 'bg-blue-300 text-white cursor-not-allowed' 
                    : success 
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'btn-primary'
                }`}
            >
                <div className="flex items-center justify-center">
                    {sending ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </>
                    ) : success ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Sent Successfully
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            Send Message
                        </>
                    )}
                </div>
            </button>
        </div>
    );
};

export default Compose;