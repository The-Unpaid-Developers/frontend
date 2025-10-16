import { useState } from "react";
import { getOverallSystemsFlowAPI, getSystemFlowAPI, getSystemPaths, getBusinessCapabilities } from "../services/diagramApi";

export const useFetchDiagramData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSystemFlows = async (systemCode: string) => {
    setIsLoading(true);
    try {
      const responseData = await getSystemFlowAPI(systemCode); // Import or define mock data
      console.log("flow data ", responseData);
      // if (responseData) {
      //   setSystems(responseData);
      // }
      return responseData;
    } 
    catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
      throw error;
    } 
    finally {
      setIsLoading(false);
    }
  };

  const loadOverallSystemFlows = async () => {
    setIsLoading(true);
    try {
      const responseData = await getOverallSystemsFlowAPI();
      console.log("overall flow data ", responseData);
      return responseData;
    } 
    catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
      throw error;
    } 
    finally {
      setIsLoading(false);
    }
  };

  const loadSystemsPaths = async (producerSystemCode: string, consumerSystemCode: string) => {
    setIsLoading(true);
    try {
      const responseData = await getSystemPaths(producerSystemCode, consumerSystemCode); // Import or define mock data
      console.log("flow data ", responseData);
      // if (responseData) {
      //   setSystems(responseData);
      // }
      return responseData;
    } 
    catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
      throw error;
    } 
    finally {
      setIsLoading(false);
    }
  };

  const loadBusinessCapabilities = async () => {
    setIsLoading(true);
    try {
      const responseData = await getBusinessCapabilities();
      console.log("business capabilities data ", responseData);
      return responseData;
    } 
    catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
      throw error;
    } 
    finally {
      setIsLoading(false);
    }
  };

  return {
    loadSystemFlows,
    loadOverallSystemFlows,
    loadSystemsPaths,
    loadBusinessCapabilities,
    isLoading,
    error,
  };
};
