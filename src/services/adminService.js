import axios from "../api/axios";

// Fetch analytics data
export const getAnalytics = () => axios.get("/admin/analytics");

// Fetch all users
export const getUsers = () => axios.get("/admin/users");

// Fetch reports
export const getReports = () => axios.get("/reports");

// Fetch verification requests
export const getVerificationRequests = () => axios.get("/verifications");