import api from "../api/axios";

export const getBusinesses = () =>
  api.get("/business");

export const createBusiness = data =>
  api.post("/business", data);

export const getCampaigns = () =>
  api.get("/campaigns");

export const createCampaign = data =>
  api.post("/campaigns", data);

export const getAds = () =>
  api.get("/advertisements");

export const getSponsorships = () =>
  api.get("/sponsorships");