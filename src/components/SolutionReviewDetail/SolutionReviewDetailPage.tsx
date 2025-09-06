import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSolutionReview } from '../../context/SolutionReviewContext';
import { SolutionReviewDetail } from './SolutionReviewDetail';
import { useViewSolutionReview } from '../../hooks/useViewSolutionReview';

export const SolutionReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { state } = useSolutionReview();

  // // Reviews may exist both in state.reviews and nested under systems
  // const direct = state.reviews.find(r => r.id === id);
  // const nested =
  //   direct ||
  //   state.systems.flatMap(s => s.reviews).find(r => r.id === id);

  // if (!nested) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-xl font-bold mb-4">Review Not Found</h1>
  //       <button
  //         className="text-blue-600 underline"
  //         onClick={() => navigate(-1)}
  //       >
  //         Go Back
  //       </button>
  //     </div>
  //   );
  // }
  const { solutionReviews, loadSolutionReviewById } = useViewSolutionReview();
  useEffect(() => {
    console.log('in eff');
    const fetchData = async () => {
      try {
        console.log('loading review id', id);
        await loadSolutionReviewById(id);
      } catch (error) {
        console.error("Error loading review data:", error);
      }
    };

    fetchData();
  }, []);
  console.log('solutionReviews', solutionReviews);

  if (!solutionReviews || solutionReviews.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Solution Review Not Found</h1>
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
      review={solutionReviews[0]}
      onClose={() => navigate(-1)}
    />
  );
};

// export default SolutionReviewDetailPage;