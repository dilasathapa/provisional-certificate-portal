import api from "./axios";

export const createApplication = async (data) => {
  const response = await api.post("/applications", data);

  return response.data;
};

export const submitApplication = async (applicationId) => {
  const response = await api.post(
    `/applications/${applicationId}/submit`
  );

  return response.data;
};

export const getApplications = async () => {
  const response = await api.get("/applications");

  return response.data;
};

export const getApplication = async (applicationId) => {
  const response = await api.get(
    `/applications/${applicationId}`
  );

  return response.data;
};

export const getAcknowledgmentUrl = async (applicationId) => {
  const response = await api.get(
    `/applications/${applicationId}/acknowledgment`
  );

  return response.data;
};