import React from "react";
import type { SolutionReview } from "../../../types/solutionReview";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from "../../ui";

interface SolutionReviewCardProps {
  review: SolutionReview;
  onView: (review: SolutionReview) => void;
  onTransition?: (review: SolutionReview, to: string) => void; // optional
  viewLabel?: string; // optional button text override
}

export const SolutionReviewCard: React.FC<SolutionReviewCardProps> = ({
  review,
  onView,
  onTransition,
  viewLabel = "View Details",
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          {review.solutionOverview.solutionDetails.solutionName ??
            "Untitled Solution Review"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {review.solutionOverview.solutionDetails.projectName ??
            "No description available"}
        </p>

        {review.solutionOverview && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Business Unit:</span>
              <span className="font-medium">
                {review.solutionOverview.businessUnit ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Review Status:</span>
              {review.documentState ?? "N/A"}
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
            onClick={() => onView(review)}
            className="w-full"
          >
            {viewLabel}
          </Button>
        </div>
        
      </CardFooter>
    </Card>
    
  );
};



