 import { useState } from "react";
 import { getAllLookupsAPI, getSpecificLookupAPI, getFieldDescriptionsAPI, updateFieldDescriptionsAPI, createLookupAPI, deleteLookupAPI, updateLookupAPI } from "../services/lookupApi";
 
 export const useLookup = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const loadAllLookups = async () => {
     setIsLoading(true);
     try {
       const responseData = await getAllLookupsAPI();
       return responseData;
     } 
     catch (error) {
       setError(error.message);
       console.error("Error loading lookup data:", error);
       throw error;
     } 
     finally {
       setIsLoading(false);
     }
   };

   const loadSpecificLookup = async (lookupName: string) => {
     setIsLoading(true);
     try {
       const responseData = await getSpecificLookupAPI(lookupName);
       console.log("specific lookup data ", responseData);
       return responseData;
     } catch (error) {
       setError(error.message);
       console.error("Error loading lookup data:", error);
       throw error;
     } finally {
       setIsLoading(false);
     }
   };

   const createLookup = async (data: any) => {
    setIsLoading(true);
     try {
       const responseData = await createLookupAPI(data);
       return responseData;
     } catch (error) {
       setError(error.message);
       console.error("Error creating lookup:", error);
       throw error;
     } finally {
       setIsLoading(false);
     }
   };

   const updateLookup = async (lookupName: string, data: any) => {
    setIsLoading(true);
     try {
       const responseData = await updateLookupAPI(lookupName, data);
       return responseData;
     } catch (error) {
       setError(error.message);
       console.error("Error updating lookup:", error);
       throw error;
     } finally {
       setIsLoading(false);
     }
   };

   const loadFieldDescriptions = async (lookupName: string) => {
     setIsLoading(true);
     try {
       const responseData = await getFieldDescriptionsAPI(lookupName);
       return responseData;
     } catch (error) {
       setError(error.message);
       console.error("Error loading field descriptions:", error);
       throw error;
     } finally {
       setIsLoading(false);
     }
   };
 
   const updateFieldDescriptions = async (lookupName: string, data: any) => {
    setIsLoading(true);
     try {
       const responseData = await updateFieldDescriptionsAPI(lookupName, data);
       return responseData;
     } catch (error) {
       setError(error.message);
       console.error("Error loading field descriptions:", error);
       throw error;
     } finally {
       setIsLoading(false);
     }
   };

   const deleteLookup = async (lookupName: string) => {
    setIsLoading(true);
     try {
       const responseData = await deleteLookupAPI(lookupName);
       return responseData;
     } catch (error) {
       setError(error.message);
       console.error("Error deleting lookup:", error);
       throw error;
     } finally {
       setIsLoading(false);
     }
   };

   return {
     loadAllLookups,
     loadSpecificLookup,
     loadFieldDescriptions,
        updateFieldDescriptions,
        createLookup,
        deleteLookup,
        updateLookup,
     isLoading,
     error,
   };
 };
 