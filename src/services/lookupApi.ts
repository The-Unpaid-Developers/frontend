import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/lookups';

export const getAllLookupsAPI = async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
};

export const getSpecificLookupAPI = async (lookupName: string) => {
    const response = await axios.get(`${API_BASE_URL}/${lookupName}`);
    return response.data;
};

export const createLookupAPI = async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getFieldDescriptionsAPI = async (lookupName: string) => {
    const response = await axios.get(`${API_BASE_URL}/${lookupName}/field-descriptions`);
    return response.data;
}

export const updateFieldDescriptionsAPI = async (lookupName: string, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/${lookupName}/field-descriptions`, data);
    return response.data;
}

export const deleteLookupAPI = async (lookupName: string) => {
    const response = await axios.delete(`${API_BASE_URL}/${lookupName}`);
    return response.data;
}

export const updateLookupAPI = async (lookupName: string, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/${lookupName}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

