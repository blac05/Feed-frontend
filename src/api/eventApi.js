import axios from "./axios";

export const getEvents = async () => {
  try {
    const response = await axios.get("/events");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await axios.post("/events", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const rsvpEvent = async (id) => {
  try {
    const response = await axios.post(`/events/${id}/rsvp`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
