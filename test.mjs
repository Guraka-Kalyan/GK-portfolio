import handler from './api/contact.js';

process.env.RESEND_API_KEY = 're_Gr1rRg3J_7wYg5YRocVQmXR3ZSXgADyw9';
process.env.ADMIN_EMAIL = 'kalyangk777@gmail.com';

const req = {
    method: 'POST',
    body: {
        firstName: 'Test',
        lastName: 'Agent',
        email: 'kalyangk777@gmail.com',
        phone: '1234567890',
        projectType: 'Website Testing',
        message: 'This is a test message from your local environment to verify the Resend connection works perfectly.'
    }
};

const res = {
    setHeader: () => { },
    status: (code) => {
        return {
            json: (data) => console.log('[Response JSON]', code, data),
            end: () => console.log('[Response End]', code)
        };
    }
};

console.log('Testing Resend execution...');
handler(req, res).catch(e => console.error(e));
