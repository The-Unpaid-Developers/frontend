import React from "react";
import type { SolutionReview } from "../../types";
import { DocumentState, STATE_TRANSITIONS } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from "../ui";
// import { useSolutionReview } from "../../context/SolutionReviewContext";
import { useNavigate } from 'react-router-dom';

interface SolutionReviewCardProps {
  review: SolutionReview;
  onView: (review: SolutionReview) => void;
}

export const SolutionReviewCard: React.FC<SolutionReviewCardProps> = ({
  review,
  onView,
}) => {
  // const { actions } = useSolutionReview();
  const navigate = useNavigate();

  const handleStateTransition = async (newState: DocumentState) => {
    await actions.transitionState(review.id, newState);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log('review in card', review);

  const availableTransitions = STATE_TRANSITIONS[review.documentState] || [];

  return (
    <Card hover className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="state" state={review.documentState}>
            {review.documentState}
          </Badge>
          <span className="text-sm text-gray-500">{review.systemCode}</span>
        </div>
        <CardTitle>
          {review.solutionOverview.solutionDetails.solutionName || "Untitled Solution Review"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {review.solutionOverview.solutionDetails.projectName || "No description available"}
        </p>

        {review.solutionOverview && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium">
                {review.solutionOverview.businessUnit || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Approval Status:</span>
              {/* <Badge
                className={
                  review.solutionOverview.priority === "High"
                    ? "bg-red-100 text-red-800 border-red-300"
                    : review.solutionOverview.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-green-100 text-green-800 border-green-300"
                }
              >
                {review.solutionOverview.priority}
              </Badge> */}
              {review.solutionOverview.approvalStatus || "N/A"}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Created: {formatDate(review.createdAt)}</span>
            <span>Modified: {formatDate(review.lastModifiedAt)}</span>
          </div>
          <div className="mt-1">
            <span>By: {review.lastModifiedBy}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex flex-col space-y-2 w-full">
          <Button
            variant="secondary"
            size="sm"
            // onClick={() => onView(review)}
            onClick={() => navigate('/view-solution-review/' + review.id)}
            className="w-full"
          >
            View Details
          </Button>

          {availableTransitions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {availableTransitions.map((transition) => (
                <Button
                  key={transition.operation}
                  variant={
                    transition.to === DocumentState.CURRENT
                      ? "primary"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() => handleStateTransition(transition.to)}
                  className="text-xs"
                  title={transition.description}
                >
                  {transition.operationName}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
