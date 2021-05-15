import httpClient from '../config/http-client';

const getAllBlocks = () => {
    return httpClient
        .get('/blocks')
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

export default {
    getAllBlocks,
    mineRawBlock,
    mineBlock,
};
