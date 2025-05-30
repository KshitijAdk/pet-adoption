import React, { useContext } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../utils/firebase.js'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFail } from '../redux/slices/userSlice.js';
import { message } from 'antd';
import { AppContent } from '../context/AppContext.jsx';


const OAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { backendUrl } = useContext(AppContent)

    const handleGoogleClick = async () => {
        try {
            dispatch(signInStart());

            // Initialize Google auth provider
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' }); // Always ask account

            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const { displayName, email, photoURL } = result.user;

            if (!email) {
                throw new Error('Google authentication failed - no email provided');
            }

            const userData = {
                name: displayName || email.split('@')[0],
                email: email.toLowerCase().trim(),
                photo: photoURL || null,
            };

            console.log('Google User Data:', userData);

            const response = await fetch(`${backendUrl}/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Google authentication failed');
            }

            if (data.success) {
                dispatch(signInSuccess(data.user));
                message.success('Signed in successfully!');
                navigate("/");

                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    window.location.reload();
                }, 100);
            } else {
                throw new Error(data.message || 'Authentication failed');
            }

        } catch (error) {
            console.error('Google Sign-In Error:', error);
            dispatch(signInFail(error.message));

            let errorMessage = 'Login failed';

            if (error.response?.status === 403) {
                errorMessage = `Account is banned: ${error.response?.data?.banReason || 'No reason provided'}`;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign in process cancelled';
            } else if (error.message) {
                errorMessage = error.message;
            }
            message.error(errorMessage);
        }
    };

    return (
        <button
            onClick={handleGoogleClick}
            className="w-full bg-white border border-gray-400 text-gray-800 py-2 px-4 rounded-md font-medium transition-all duration-200 ease-in-out 
               flex items-center justify-center gap-3 h-12 shadow-sm 
               hover:bg-gray-100 hover:shadow-md hover:border-gray-600 hover:scale-[1.02] active:scale-100"
            aria-label="Sign in with Google"
            type="button"
        >

            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Continue with Google</span>
        </button>

    );
};

export default OAuth;