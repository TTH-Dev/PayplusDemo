import axios from 'axios';
import {API_URL} from "../config"

export const OrgpostData = async (endpoint: string, data: any): Promise<any> => {
  let token=localStorage.getItem("authtoken")
  try {
    const response = await axios.post(new URL(endpoint,API_URL).toString(), data, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization":`Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};


export const getIndustry = async (endpoint: string): Promise<any> => {
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

export const getsubIndustry = async (endpoint: string): Promise<any> => {
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

export const homeSetUp = async (endpoint: string): Promise<any> => {
  try {
    let token=localStorage.getItem("authtoken")
    const response = await axios.get(new URL(endpoint,API_URL).toString(), {
      headers: {
        'Content-Type': 'application/json',
        "Authorization":`Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};

export const getSinglesubIndustry = async (endpoint: string,industryId:any): Promise<any> => {
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



export const postScheduleData = async (endpoint: string, data: any): Promise<any> => {
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

export const addemployee = async (endpoint: string, data: any): Promise<any> => {
  try {
    //     const payload = {
    //   ...data,
    //   dailyWorkHr: data.jobInfo?.dailyWorkHr || 0,
    //   workinghrs: data.workinghrs ?? ""  
    // };
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


export const uploadFiles = async (endpoint: string, data: any): Promise<any> => {
  try {
    const response = await axios.post(new URL(endpoint,API_URL).toString(), data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};

export const updateHomesetup = async (endpoint: string, data: any): Promise<any> => {
  try {
    let token=localStorage.getItem("authtoken")
    const response = await axios.post(new URL(endpoint,API_URL).toString(), data, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization":`Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post data:', error);
    throw error;
  }
};


