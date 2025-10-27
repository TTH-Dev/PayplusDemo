import axios from "axios";
import { API_URL } from "../config";

export const getEmployeeinfo = async (endpoint: string): Promise<any> => {
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

export const getSalaryDetails = async (endpoint: string): Promise<any> => {
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

export const getSingleEmployee = async (endpoint: string,industryId:any): Promise<any> => {
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


export const editSingleEmployee = async (endpoint: string, id: any, data: any): Promise<any> => {
  try {
    const response = await axios.post(new URL(endpoint + `/${id}`, API_URL).toString(), data, {
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
