import React from "react";
import { useNavigate } from 'react-router-dom';
import type { DocumentState, SolutionReview } from "../../types/solutionReview";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from "../ui";

interface SystemCardProps {
  system: SolutionReview & { reviews: SolutionReview[]; systemId: string; systemName: string; category: string; description: string; latestVersion: string; totalReviews: number; currentReview?: SolutionReview };
  onViewSystem: (system: SystemCardProps["system"]) => void;
}

export const SystemCard: React.FC<SystemCardProps> = ({
  system,
  onViewSystem,
}) => {
  const navigate = useNavigate();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLatestReview = () => {
    return system.reviews[0]; // Reviews are sorted by version descending
  };

  const getStateDistribution = () => {
    const counts = system.reviews.reduce((acc, review) => {
      acc[review.documentState] = (acc[review.documentState] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const latestReview = getLatestReview();
  const stateDistribution = getStateDistribution();

  return (
    <Card hover className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              {system.category}
            </Badge>
            <span className="text-sm text-gray-500">
              v{system.latestVersion} • {system.totalReviews} versions
            </span>
          </div>
          {system.currentReview && (
            <Badge variant="state" state={system.currentReview.documentState}>
              {system.currentReview.documentState}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl">{system.systemName}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {system.description}
        </p>

        {latestReview && (
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">
                Latest Version
              </h4>
              <p className="text-sm text-gray-600">
                {latestReview.solutionOverview?.solutionDetails?.solutionName || "Untitled Solution Review"}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                Version States
              </h4>
              <div className="flex flex-wrap gap-1">
                {Object.entries(stateDistribution).map(([state, count]) => (
                  <Badge
                    key={state}
                    variant="state"
                    state={state as DocumentState}
                    className="text-xs"
                  >
                    {count} {state.toLowerCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>
              Latest: {latestReview && formatDate(latestReview.lastModifiedAt)}
            </span>
            <span>By: {latestReview?.lastModifiedBy}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="secondary"
          size="sm"
          // onClick={() => onViewSystem(system)}
          onClick={() => navigate('/view-system-detail/' + system.systemId)}
          className="w-full"
        >
          View All Versions ({system.totalReviews})
        </Button>
      </CardFooter>
    </Card>
  );
};
