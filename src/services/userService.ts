import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface VerificationResponse {
    success: boolean;
    message: string;
}



export const userService = {
    // Verify user email with token
    verifyEmail: async (token: string): Promise<VerificationResponse> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/verify?token=${token}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    message: error.response?.data?.message || error.message
                };
            }
            return {
                success: false,
                message: 'Verification failed'
            };
        }
    },

    // Resend verification email
    resendVerificationEmail: async (email: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/resend-verification`, {
                email
            });
            return {
                success: true,
                message: response.data || 'Verification email sent successfully'
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    message: error.response?.data || error.message
                };
            }
            return {
                success: false,
                message: 'Failed to resend verification email'
            };
        }
    },

    // // Check if user is verified
    // checkUserVerification: async (email: string): Promise<{ isVerified: boolean; message?: string }> => {
    //     try {
    //         // This would need to be implemented in the backend if needed
    //         // For now, we'll rely on the login attempt to tell us verification status
    //         return { isVerified: true };
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     } catch (error) {
    //         return { isVerified: false, message: 'Failed to check verification status' };
    //     }
    // }
};

export default userService;