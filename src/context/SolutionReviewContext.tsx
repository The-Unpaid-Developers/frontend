/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { DocumentState } from "../types";
import type { SolutionReview, SolutionOverview, SystemGroup } from "../types";
import { mockApiService } from "../services/mockApi";

interface SolutionReviewState {
  reviews: SolutionReview[];
  systems: SystemGroup[];
  selectedReview: SolutionReview | null;
  selectedSystem: SystemGroup | null;
  viewMode: "systems" | "reviews";
  loading: boolean;
  error: string | null;
  filter: {
    state?: DocumentState;
    search?: string;
    systemId?: string;
  };
}

type SolutionReviewAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_REVIEWS"; payload: SolutionReview[] }
  | { type: "SET_SYSTEMS"; payload: SystemGroup[] }
  | { type: "SET_SELECTED_REVIEW"; payload: SolutionReview | null }
  | { type: "SET_SELECTED_SYSTEM"; payload: SystemGroup | null }
  | { type: "SET_VIEW_MODE"; payload: "systems" | "reviews" }
  | { type: "ADD_REVIEW"; payload: SolutionReview }
  | { type: "UPDATE_REVIEW"; payload: SolutionReview }
  | { type: "DELETE_REVIEW"; payload: string }
  | {
      type: "SET_FILTER";
      payload: { state?: DocumentState; search?: string; systemId?: string };
    };

const initialState: SolutionReviewState = {
  reviews: [],
  systems: [],
  selectedReview: null,
  selectedSystem: null,
  viewMode: "systems",
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
    case "SET_SYSTEMS":
      return { ...state, systems: action.payload, loading: false, error: null };
    case "SET_SELECTED_REVIEW":
      return { ...state, selectedReview: action.payload };
    case "SET_SELECTED_SYSTEM":
      return { ...state, selectedSystem: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
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
    loadSystems: () => Promise<void>;
    loadReview: (id: string) => Promise<void>;
    loadSystem: (systemId: string) => Promise<void>;
    loadSystemReviews: (systemId: string) => Promise<void>;
    createReview: (
      solutionOverview: SolutionOverview
    ) => Promise<SolutionReview>;
    updateReview: (
      id: string,
      updates: Partial<SolutionReview>
    ) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
    transitionState: (id: string, newState: DocumentState) => Promise<void>;
    setFilter: (filter: {
      state?: DocumentState;
      search?: string;
      systemId?: string;
    }) => void;
    setViewMode: (mode: "systems" | "reviews") => void;
    clearSelectedReview: () => void;
    clearSelectedSystem: () => void;
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

  const loadReviews = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const reviews = await mockApiService.getSolutionReviews();
      dispatch({ type: "SET_REVIEWS", payload: reviews });
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load solution reviews",
      });
    }
  }, []);

  const loadSystems = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const systems = await mockApiService.getSystems();
      dispatch({ type: "SET_SYSTEMS", payload: systems });
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load systems",
      });
    }
  }, []);

  const actions = {
    loadReviews,
    loadSystems,

    loadReview: async (id: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const review = await mockApiService.getSolutionReview(id);
        if (review) {
          dispatch({ type: "SET_SELECTED_REVIEW", payload: review });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Solution review not found" });
        }
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load solution review",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    loadSystem: async (systemId: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const system = await mockApiService.getSystem(systemId);
        if (system) {
          dispatch({ type: "SET_SELECTED_SYSTEM", payload: system });
        } else {
          dispatch({ type: "SET_ERROR", payload: "System not found" });
        }
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load system",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    loadSystemReviews: async (systemId: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const reviews = await mockApiService.getSystemReviews(systemId);
        dispatch({ type: "SET_REVIEWS", payload: reviews });
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load system reviews",
        });
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
      } catch {
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
      } catch {
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
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to transition document state",
        });
      }
    },

    setFilter: (filter: {
      state?: DocumentState;
      search?: string;
      systemId?: string;
    }) => {
      dispatch({ type: "SET_FILTER", payload: filter });
    },

    setViewMode: (mode: "systems" | "reviews") => {
      dispatch({ type: "SET_VIEW_MODE", payload: mode });
    },

    clearSelectedReview: () => {
      dispatch({ type: "SET_SELECTED_REVIEW", payload: null });
    },

    clearSelectedSystem: () => {
      dispatch({ type: "SET_SELECTED_SYSTEM", payload: null });
    },
  };

  useEffect(() => {
    if (state.viewMode === "systems") {
      loadSystems();
    } else {
      loadReviews();
    }
  }, [state.viewMode, loadSystems, loadReviews]);

  return (
    <SolutionReviewContext.Provider value={{ state, actions }}>
      {children}
    </SolutionReviewContext.Provider>
  );
};
