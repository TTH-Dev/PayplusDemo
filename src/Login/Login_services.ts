import axios from "axios";
import { API_URL } from "../config";

export const signup = async (endpoint: string, data: any): Promise<any> => {
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