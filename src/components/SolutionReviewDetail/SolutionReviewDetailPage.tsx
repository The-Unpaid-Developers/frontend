import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSolutionReview } from '../../context/SolutionReviewContext';
import { SolutionReviewDetail } from './SolutionReviewDetail';

export const SolutionReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useSolutionReview();

  // Reviews may exist both in state.reviews and nested under systems
  const direct = state.reviews.find(r => r.id === id);
  const nested =
    direct ||
    state.systems.flatMap(s => s.reviews).find(r => r.id === id);

  if (!nested) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Review Not Found</h1>
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
    <SolutionReviewDetail
      review={nested}
      onClose={() => navigate(-1)}
    />
  );
};

// export default SolutionReviewDetailPage;