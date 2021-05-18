import httpClient from '../config/http-client';
import axios from 'axios';

const getAllBlocks = () => {
    return httpClient
        .get('/blocks')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const getCurrentBalance = () => {
    return httpClient
        .get('/balance')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const getAlluTxOs = () => {
    return httpClient
        .get('/unspentTransactionOutputs')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const mineBlock = () => {
    return httpClient
        .post('/mineBlock')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const mineRawBlock = () => {
    return httpClient
        .post('/mineRawBlock')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const sendTransaction = (address, amount) => {
    return httpClient
        .post('/sendTransaction', { address, amount })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const getAlluTxOsAddress = (address) => {
    return httpClient
        .get(`/address/${address}`)
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};

const getTransactionPool = (address) => {
    return httpClient
        .get(`/transactionPool`)
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => Promise.reject(err));
};
export default {
    getAllBlocks,
    mineRawBlock,
    mineBlock,
    getAlluTxOs,
    getCurrentBalance,
    sendTransaction,
    getAlluTxOsAddress,
    getTransactionPool,
};
