import axios from 'axios';
import {API_URL} from "../config"

export const getScheduleemployee = async (endpoint: string,industryId:any): Promise<any> => {
  try {
    const response = await axios.get(new URL(endpoint+`/${industryId}`,API_URL).toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};

export const postDepartmentSchedule = async (endpoint: string, data: any): Promise<any> => {
  try {
    const response = await axios.post(new URL(endpoint,API_URL).toString(), data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};

export const getAllEmpId = async (endpoint: string): Promise<any> => {
  try {
    const response = await axios.get(new URL(endpoint,API_URL).toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};


export const getAllEmpScheduleData = async (endpoint: string): Promise<any> => {
  try {
    const response = await axios.get(new URL(endpoint,API_URL).toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};


export const deleteSchedule = async (endpoint: string,industryId:any): Promise<any> => {
  try {
    const response = await axios.delete(new URL(endpoint+`/${industryId}`,API_URL).toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};
