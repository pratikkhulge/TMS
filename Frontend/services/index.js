
export const register_user = async (formData) => {
    try {
        const res = await fetch('http://localhost:5000/user', { // Changed the endpoint to match the backend
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formData),
        });
        const data = res.json();
        return data;
    } catch (error) {
        console.log('Error in register_user (service) => ', error);
        return error.message
    }
};

export const resendOtp = async (email) => {
    try {
        const res = await fetch('http://localhost:5000/user/resendotp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in resendOtp service:', error);
        return { success: false, message: await res.text() };
    }
};



export const verifyOtp = async (email, otp) => {
    try {
        const res = await fetch(`http://localhost:5000/user/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error in verifyOtp (service) => ', error);
        return { success: false, message: error.message };
    }
};

export const login_user = async (formData) => {
    try {
        const res = await fetch('http://localhost:5000/user/login', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
            const token = data.token;
            localStorage.setItem('token', token);
            return { success: true, message: data.message, token };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error in login_user service:', error);
        return { success: false, message: 'Failed to login. Please try again later.' };
    }
};
