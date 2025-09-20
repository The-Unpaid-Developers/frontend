import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useSolutionReview } from '../../context/SolutionReviewContext';
import { SystemDetail } from '../SolutionReviewDetail/SystemDetail';
// import { mockApiService } from '../../services/mockApiUpdated';

import { useViewSolutionReview } from '../../hooks/useViewSolutionReview';
import { useToast } from "../../context/ToastContext";

export const SystemDetailPage: React.FC = () => {
  const { systemCode } = useParams<{ systemCode: string }>();
  const navigate = useNavigate();
  // const { state } = useSolutionReview();
  console.log(systemCode);

  const { solutionReviews, loadSystemSolutionReviews } = useViewSolutionReview();
  // loadSystemSolutionReviews(systemCode || "");
  console.log(solutionReviews);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    console.log('in eff');
    const fetchData = async () => {
      try {
        await loadSystemSolutionReviews(systemCode);
      } catch (error) {
        console.error("Error loading review data:", error);
        showError("Failed to load data: " + error.message);
      }
    };

    fetchData();
  }, [systemCode]);

  if (!solutionReviews) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">System Not Found</h1>
        <button
          className="text-blue-600 underline"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <SystemDetail
      systemCode={systemCode}
      system={solutionReviews}
      onClose={() => navigate(-1)}
      onViewReview={r => navigate(`/view-solution-review/${r.id}`)}
    />
  );
};