import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(
  API_CONFIG.CORE_BASE_URL,
  "/queries"
);

export const getAllQueriesAPI = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

export const getSpecificQueryAPI = async (queryName: string) => {
  const response = await axios.get(`${API_BASE_URL}/${queryName}`);
  return response.data;
};

export const executeQueryAPI = async (queryName: string, payload: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/${queryName}/execute`,
    payload
  );
  return response.data;
};

export const createQueryAPI = async (queryData: any) => {
  const response = await axios.post(`${API_BASE_URL}`, queryData);
  return response.data;
};

export const updateQueryAPI = async (queryName: string, queryData: any) => {
  const response = await axios.put(`${API_BASE_URL}/${queryName}`, queryData);
  return response.data;
};

export const deleteQueryAPI = async (queryName: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${queryName}`);
  return response.data;
};

const mockGenerateQueryResponse = "[{\"$lookup\": {\"from\": \"lookups\",\"pipeline\": [{\"$match\": {\"_id\": \"techCompEOL\"}},{\"$unwind\": \"$data\"},{\"$replaceRoot\": {\"newRoot\": \"$data\"}}],\"as\": \"eolLookup\"}},{\"$unwind\":  {\"path\": \"$technologyComponents\",\"preserveNullAndEmptyArrays\": false}},{\"$addFields\": {\"matchingEOL\": {\"$filter\": {\"input\": \"$eolLookup\",\"as\": \"eol\",\"cond\": {\"$and\": [{\"$eq\": [\"$$eol.Product Name\",          \"$technologyComponents.productName\"]},{\"$eq\": [\"$$eol.Product Version\", \"$technologyComponents.productVersion\"]}]}}}}},{\"$match\": {\"matchingEOL\": {\"$ne\": []}}},{\"$unwind\": \"$matchingEOL\"},{\"$addFields\":  {\"eolDate\": {\"$dateFromString\": {\"dateString\": \"$matchingEOL.End-of-Life Date\",\"format\": \"%m/%d/%Y\"}}}},{\"$match\": {\"$expr\": {\"$and\": [{\"$lte\": [\"$eolDate\", {\"$dateAdd\": {\"startDate\": \"$$NOW\",  \"unit\": \"month\", \"amount\": 1}}]}]}}},{\"$group\": {\"_id\": \"$_id\",\"systemCode\": {\"$first\": \"$systemCode\"},\"documentState\": {\"$first\": \"$documentState\"},\"solutionOverview\": {\"$first\":  \"$solutionOverview\"},\"createdAt\": {\"$first\": \"$createdAt\"},\"lastModifiedAt\": {\"$first\": \"$lastModifiedAt\"},\"lastModifiedBy\": {\"$first\": \"$lastModifiedBy\"},\"expiringComponents\": {\"$push\": {\"componentId\":       \"$technologyComponents._id\",\"componentName\": \"$technologyComponents.componentName\",\"productName\": \"$technologyComponents.productName\",\"productVersion\": \"$technologyComponents.productVersion\",\"usage\":  \"$technologyComponents.usage\",\"eolDate\": \"$matchingEOL.End-of-Life Date\",\"adoptionStatus\": \"$matchingEOL.Adoption Status\",\"productCategory\": \"$matchingEOL.Product Category\"}}}},{\"$sort\": {\"systemCode\": 1}}]";

export const generateQueryAPI = async (data: any) => {
  // const response = await axios.post(
  //   `${API_BASE_URL}/generate-query`,
  //   data
  // );
  // return response.data;
  return { query: mockGenerateQueryResponse };
};