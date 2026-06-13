import api from "../api/axios";

// Fetch list of businesses
export const getBusinesses = async () => {
  try {
    const response = await api.get("/business");
    return response.data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
};

// Create a new business
export const createBusiness = async (data) => {
  try {
    const response = await api.post("/business", data);
    return response.data;
  } catch (error) {
    console.error("Error creating business:", error);
    throw error;
  }
};

// Fetch list of campaigns
export const getCampaigns = async () => {
  try {
    const response = await api.get("/campaigns");
    return response.data;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

// Create a new campaign
export const createCampaign = async (data) => {
  try {
    const response = await api.post("/campaigns", data);
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

// Fetch list of advertisements
export const getAds = async () => {
  try {
    const response = await api.get("/advertisements");
    return response.data;
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
};

// Fetch list of sponsorships
export const getSponsorships = async () => {
  try {
    const response = await api.get("/sponsorships");
    return response.data;
  } catch (error) {
    console.error("Error fetching sponsorships:", error);
    throw error;
  }
};