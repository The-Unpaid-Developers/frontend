import React, { createContext, useContext, useReducer, useEffect } from "react";
import { DocumentState } from "../types";
import type { SolutionReview, SolutionOverview } from "../types";
import { mockApiService } from "../services/mockApi";

interface SolutionReviewState {
  reviews: SolutionReview[];
  selectedReview: SolutionReview | null;
  loading: boolean;
  error: string | null;
  filter: {
    state?: DocumentState;
    search?: string;
  };
}

type SolutionReviewAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_REVIEWS"; payload: SolutionReview[] }
  | { type: "SET_SELECTED_REVIEW"; payload: SolutionReview | null }
  | { type: "ADD_REVIEW"; payload: SolutionReview }
  | { type: "UPDATE_REVIEW"; payload: SolutionReview }
  | { type: "DELETE_REVIEW"; payload: string }
  | { type: "SET_FILTER"; payload: { state?: DocumentState; search?: string } };

const initialState: SolutionReviewState = {
  reviews: [],
  selectedReview: null,
  loading: false,
  error: null,
  filter: {},
};

const solutionReviewReducer = (
  state: SolutionReviewState,
  action: SolutionReviewAction
): SolutionReviewState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_REVIEWS":
      return { ...state, reviews: action.payload, loading: false, error: null };
    case "SET_SELECTED_REVIEW":
      return { ...state, selectedReview: action.payload };
    case "ADD_REVIEW":
      return { ...state, reviews: [...state.reviews, action.payload] };
    case "UPDATE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.payload.id ? action.payload : review
        ),
        selectedReview:
          state.selectedReview?.id === action.payload.id
            ? action.payload
            : state.selectedReview,
      };
    case "DELETE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.payload),
        selectedReview:
          state.selectedReview?.id === action.payload
            ? null
            : state.selectedReview,
      };
    case "SET_FILTER":
      return { ...state, filter: { ...state.filter, ...action.payload } };
    default:
      return state;
  }
};

interface SolutionReviewContextType {
  state: SolutionReviewState;
  actions: {
    loadReviews: () => Promise<void>;
    loadReview: (id: string) => Promise<void>;
    createReview: (
      solutionOverview: SolutionOverview
    ) => Promise<SolutionReview>;
    updateReview: (
      id: string,
      updates: Partial<SolutionReview>
    ) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
    transitionState: (id: string, newState: DocumentState) => Promise<void>;
    setFilter: (filter: { state?: DocumentState; search?: string }) => void;
    clearSelectedReview: () => void;
  };
}

const SolutionReviewContext = createContext<
  SolutionReviewContextType | undefined
>(undefined);

export const useSolutionReview = () => {
  const context = useContext(SolutionReviewContext);
  if (!context) {
    throw new Error(
      "useSolutionReview must be used within a SolutionReviewProvider"
    );
  }
  return context;
};

interface SolutionReviewProviderProps {
  children: React.ReactNode;
}

export const SolutionReviewProvider: React.FC<SolutionReviewProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(solutionReviewReducer, initialState);

  const actions = {
    loadReviews: async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const reviews = await mockApiService.getSolutionReviews();
        dispatch({ type: "SET_REVIEWS", payload: reviews });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load solution reviews",
        });
      }
    },

    loadReview: async (id: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const review = await mockApiService.getSolutionReview(id);
        if (review) {
          dispatch({ type: "SET_SELECTED_REVIEW", payload: review });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Solution review not found" });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load solution review",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    createReview: async (
      solutionOverview: SolutionOverview
    ): Promise<SolutionReview> => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const newReview = await mockApiService.createSolutionReview(
          solutionOverview
        );
        dispatch({ type: "ADD_REVIEW", payload: newReview });
        dispatch({ type: "SET_LOADING", payload: false });
        return newReview;
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to create solution review",
        });
        throw error;
      }
    },

    updateReview: async (id: string, updates: Partial<SolutionReview>) => {
      try {
        const updatedReview = await mockApiService.updateSolutionReview(
          id,
          updates
        );
        if (updatedReview) {
          dispatch({ type: "UPDATE_REVIEW", payload: updatedReview });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to update solution review",
        });
      }
    },

    deleteReview: async (id: string) => {
      try {
        const success = await mockApiService.deleteSolutionReview(id);
        if (success) {
          dispatch({ type: "DELETE_REVIEW", payload: id });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to delete solution review",
        });
      }
    },

    transitionState: async (id: string, newState: DocumentState) => {
      try {
        const updatedReview = await mockApiService.transitionDocumentState(
          id,
          newState
        );
        if (updatedReview) {
          dispatch({ type: "UPDATE_REVIEW", payload: updatedReview });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to transition document state",
        });
      }
    },

    setFilter: (filter: { state?: DocumentState; search?: string }) => {
      dispatch({ type: "SET_FILTER", payload: filter });
    },

    clearSelectedReview: () => {
      dispatch({ type: "SET_SELECTED_REVIEW", payload: null });
    },
  };

  useEffect(() => {
    actions.loadReviews();
  }, []);

  return (
    <SolutionReviewContext.Provider value={{ state, actions }}>
      {children}
    </SolutionReviewContext.Provider>
  );
};
