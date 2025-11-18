import { useState } from "react";
import { createQueryAPI, deleteQueryAPI, executeQueryAPI, generateQueryAPI, generateQueryStreamAPI, getAllQueriesAPI, getSpecificQueryAPI, updateQueryAPI } from "../services/queryApi";

export const useQuery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllQueries = async () => {
    setIsLoading(true);
    try {
      const responseData = await getAllQueriesAPI();
      return responseData;
    } 
    catch (error) {
      setError(error.message);
      console.error("Error loading query data:", error);
      throw error;
    } 
    finally {
      setIsLoading(false);
    }
  };

  const loadSpecificQuery = async (queryName: string) => {
    setIsLoading(true);
    try {
      const responseData = await getSpecificQueryAPI(queryName);
      console.log("specific query data ", responseData);
      return responseData;
    } catch (error) {
      setError(error.message);
      console.error("Error loading query data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async (queryName: string, payload: any) => {
    setIsLoading(true);
    try {
      const responseData = await executeQueryAPI(queryName, payload);
      return responseData;
    } catch (error) {
      setError(error.message);
      console.error("Error executing query:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createQuery = async (queryData: any) => {
    setIsLoading(true);
    try {
      const responseData = await createQueryAPI(queryData);
      return responseData;
    } catch (error) {
      setError(error.message);
      console.error("Error creating query:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuery = async (queryName: string, queryData: any) => {
    setIsLoading(true);
    try {
      const responseData = await updateQueryAPI(queryName, queryData);
      return responseData;
    } catch (error) {
      setError(error.message);
      console.error("Error updating query:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuery = async (queryName: string) => {
    setIsLoading(true);
    try {
      const responseData = await deleteQueryAPI(queryName);
      return responseData;
    } catch (error) {
      setError(error.message);
      console.error("Error deleting query:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuery = async (data: any) => {
    setIsLoading(true);
    try {
      const responseData = await generateQueryAPI(data);
      return responseData;
    } catch (error) {
      setError(error.message);
      console.error("Error generating query:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateQueryStream = async (
    data: any,
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ) => {
    setIsLoading(true);
    setError(null);

    return generateQueryStreamAPI(
      data,
      onChunk,
      () => {
        setIsLoading(false);
        onComplete();
      },
      (err) => {
        setIsLoading(false);
        setError(err.message);
        console.error("Error generating query:", err);
        throw err;
      }
    );
  };

  return {
    loadAllQueries,
    loadSpecificQuery,
    executeQuery,
    createQuery,
    updateQuery,
    deleteQuery,
    generateQuery,
    generateQueryStream,
    isLoading,
    error,
  };
};
