import { useState, useCallback, useRef } from "react";

interface OptimisticAction<T> {
  id: string;
  optimisticUpdate: (current: T) => T;
  revertUpdate: (current: T) => T;
  apiCall: () => Promise<T>;
}

interface UseOptimisticUpdatesReturn<T> {
  data: T;
  isLoading: boolean;
  pendingActions: string[];
  executeOptimistic: (action: Omit<OptimisticAction<T>, "id">) => Promise<T>;
  revertAll: () => void;
}

/**
 * Custom hook for implementing optimistic UI updates
 * Applies changes immediately to the UI while API calls are in progress,
 * and reverts changes if the API call fails.
 *
 * @param initialData - The initial state data
 * @returns Optimistic update utilities and current state
 */
export const useOptimisticUpdates = <T>(
  initialData: T
): UseOptimisticUpdatesReturn<T> => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingActions, setPendingActions] = useState<string[]>([]);

  // Keep track of revert functions for failed operations
  const revertStack = useRef<Array<() => void>>([]);

  /**
   * Execute an optimistic update
   * @param action - The optimistic action configuration
   * @returns Promise that resolves with the final data
   */
  const executeOptimistic = useCallback(
    async (action: Omit<OptimisticAction<T>, "id">): Promise<T> => {
      const actionId = `action_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Store the current state for potential revert (unused but kept for potential future use)
      // const previousData = data;

      // Apply optimistic update immediately
      const optimisticData = action.optimisticUpdate(data);
      setData(optimisticData);

      // Track this pending action
      setPendingActions((prev) => [...prev, actionId]);
      setIsLoading(true);

      // Create revert function
      const revertFunction = () => {
        setData(action.revertUpdate(optimisticData));
      };
      revertStack.current.push(revertFunction);

      try {
        // Execute the actual API call
        const result = await action.apiCall();

        // Success: update with real data
        setData(result);

        // Remove revert function since we succeeded
        revertStack.current = revertStack.current.filter(
          (fn) => fn !== revertFunction
        );

        return result;
      } catch (error) {
        // Failure: revert the optimistic update
        revertFunction();
        revertStack.current = revertStack.current.filter(
          (fn) => fn !== revertFunction
        );

        // Re-throw the error for the caller to handle
        throw error;
      } finally {
        // Clean up tracking
        setPendingActions((prev) => prev.filter((id) => id !== actionId));
        setIsLoading((prev) => (pendingActions.length <= 1 ? false : prev));
      }
    },
    [data, pendingActions]
  );

  /**
   * Revert all pending optimistic updates
   */
  const revertAll = useCallback(() => {
    // Execute all revert functions in reverse order (LIFO)
    while (revertStack.current.length > 0) {
      const revertFn = revertStack.current.pop();
      if (revertFn) {
        revertFn();
      }
    }

    setPendingActions([]);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    pendingActions,
    executeOptimistic,
    revertAll,
  };
};

/**
 * Utility function to create optimistic update configurations for common operations
 */
export const createOptimisticActions = {
  /**
   * Create an optimistic action for adding an item to an array
   */
  addItem: <T>(item: T, apiCall: () => Promise<T[]>) => ({
    optimisticUpdate: (current: T[]) => [...current, item],
    revertUpdate: (current: T[]) => current.slice(0, -1),
    apiCall,
  }),

  /**
   * Create an optimistic action for updating an item in an array
   */
  updateItem: <T extends { id: string }>(
    updatedItem: T,
    apiCall: () => Promise<T[]>
  ) => ({
    optimisticUpdate: (current: T[]) =>
      current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    revertUpdate: (current: T[]) => current, // This would need the original item
    apiCall,
  }),

  /**
   * Create an optimistic action for deleting an item from an array
   */
  deleteItem: <T extends { id: string }>(
    itemId: string,
    apiCall: () => Promise<T[]>
  ) => ({
    optimisticUpdate: (current: T[]) =>
      current.filter((item) => item.id !== itemId),
    revertUpdate: (current: T[], deletedItem: T) => [...current, deletedItem],
    apiCall,
  }),
};
