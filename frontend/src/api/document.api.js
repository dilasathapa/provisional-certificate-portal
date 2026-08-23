import api from "./axios";

export const uploadApplicationDocument = async ({
  applicationId,
  file,
  type,
}) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("type", type);

  const response = await api.post(
    `/documents/applications/${applicationId}`,
    formData
  );

  return response.data;
};

export const getDocumentDownloadUrl = async (documentId) => {
  const response = await api.get(
    `/documents/${documentId}/download`
  );

  return response.data;
};