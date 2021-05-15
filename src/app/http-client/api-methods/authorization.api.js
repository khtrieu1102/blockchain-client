import httpClient from '../config/http-client';
import axios from 'axios';
import resolve from '../config/resolve';

const accessServer = async (timeStamp) => {
    return httpClient
        .post(`?${timeStamp}`)
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.resolve());
};

const logInWithEmailAndPassword = (username, password) => {
    return httpClient
        .post('/api/auth/signin', { username, password })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const verifyAccessToken = () => {
    return httpClient
        .get('/api/auth/me')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const updateUserStatus = (id, isDisabled) => {
    return httpClient
        .put('/api/auth/status', { id, isDisabled })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const updateCurrentUserInfo = (user) => {
    return httpClient
        .put('/api/auth/update-basic-info', { user })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const requestResetPassword = (email) => {
    return httpClient
        .post('/api/auth/reset-password', { email })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const verifyOtpCode = (email, code) => {
    return httpClient
        .post('/api/auth/verify-otp-reset-password', { email, code })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const resetPassword = (email, code, newPassword) => {
    return httpClient
        .post('/api/auth/verify-reset-password', { email, code, newPassword })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const changePassword = (value) => {
    return httpClient
        .put('/api/auth/change-password', {
            currentPassword: value.currentPassword,
            newPassword: value.newPassword,
        })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const register = (value) => {
    return httpClient
        .post('/api/auth/register', {
            username: value.username,
            password: value.password,
        })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

export default {
    accessServer,
    logInWithEmailAndPassword,
    verifyAccessToken,
    updateUserStatus,
    updateCurrentUserInfo,
    requestResetPassword,
    verifyOtpCode,
    resetPassword,
    changePassword,
    register,
};
