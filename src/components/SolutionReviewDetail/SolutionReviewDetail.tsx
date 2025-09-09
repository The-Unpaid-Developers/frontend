import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { SolutionReview } from "../../types/solutionReview";
import { DocumentState, STATE_TRANSITIONS, getStateColor, getStateDescription } from "../../types/solutionReview";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Modal } from "../ui";
import { useUpdateSolutionReview } from "../../hooks/useUpdateSolutionReview";
// import { useSolutionReview } from "../../context/SolutionReviewContext";

interface SolutionReviewDetailProps {
  review: SolutionReview;
  onClose: () => void;
}

export const SolutionReviewDetail: React.FC<SolutionReviewDetailProps> = ({
  review,
  onClose,
}) => {

  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateReviewState, loadReviewData } = useUpdateSolutionReview(review.id);

  const handleStateTransition = async (newState: string) => {
    if (newState === "DRAFT") {
      await updateReviewState("REMOVE_SUBMISSION");
    } else if (newState === "CURRENT") {
      await updateReviewState("APPROVE");
    } else if (newState === "SUBMITTED") {
      // open pop up to review data 
      // await updateReviewState("SUBMIT");
      setShowSubmitModal(true);
      return;
    }
    navigate(0); // Refresh the current route
  };

  // Build a data object similar to UpdateSolutionReviewPage for validation
  const reviewData = useMemo(() => ({
    solutionOverview: review.solutionOverview,
    businessCapabilities: review.businessCapabilities,
    dataAssets: review.dataAssets,
    systemComponents: review.systemComponents,
    technologyComponents: review.technologyComponents,
    integrationFlows: review.integrationFlows,
    enterpriseTools: review.enterpriseTools,
    processCompliances: review.processCompliances
  }), [review]);

  const sectionLabels: Record<keyof typeof reviewData, string> = {
    solutionOverview: "Solution Overview",
    businessCapabilities: "Business Capabilities",
    dataAssets: "Data & Assets",
    systemComponents: "System Components",
    technologyComponents: "Technology Components",
    integrationFlows: "Integration Flows",
    enterpriseTools: "Enterprise Tools",
    processCompliances: "Process Compliances"
  };

  const missingSections = useMemo(() =>
    (Object.keys(reviewData) as (keyof typeof reviewData)[])
      .filter(key => {
        const value = reviewData[key];
        return value == null || (Array.isArray(value) && value.length === 0);
      })
      .map(key => sectionLabels[key])
  , [reviewData]);

  const hasMissing = missingSections.length > 0;

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateReviewState("SUBMIT");
      setShowSubmitModal(false);
    } finally {
      setIsSubmitting(false);
      navigate(0); // Refresh the current route
    }
  };

  // useEffect(() => {
  //   // Load initial data or perform side effects
  //   const fetchData = async () => {
  //     await loadReviewData();
  //   };

  //   fetchData();
  // }, [review.documentState]); // rerun when state is transitioned

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log('review in detail', review);

  const availableTransitions = STATE_TRANSITIONS[review.documentState] || [];

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div>
//           <div className="flex items-center space-x-3 mb-2">
//             <Badge variant="state" state={review.documentState}>
//               {review.documentState}
//             </Badge>
//             <span className="text-sm text-gray-500">
//               Version {review.version}
//             </span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             {review?.solutionOverview?.solutionDetails?.solutionName || "Untitled Solution Review"}
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {getStateDescription(review.documentState)}
//           </p>
//         </div>
//         <Button variant="ghost" onClick={onClose}>
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </Button>
//       </div>

//       {/* Actions */}
//       {availableTransitions.length > 0 && (
//         <Card>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               <span className="text-sm font-medium text-gray-700 mr-2">
//                 Available Actions:
//               </span>
//               {availableTransitions.map((transition) => (
//                 <Button
//                   key={transition.operation}
//                   variant={
//                     transition.to === "CURRENT"
//                       ? "primary"
//                       : "secondary"
//                   }
//                   size="sm"
//                   onClick={() => handleStateTransition(transition.to)}
//                   title={transition.description}
//                 >
//                   {transition.operationName}
//                 </Button>
//               ))}
//               {review.documentState==="DRAFT" && (
//                 <Button
//                   variant="primary"
//                   size="sm"
//                   onClick={() => navigate(`/update-solution-review/${review.id}`)}
//                   title="Edit Draft"
//                 >
//                   Edit Draft
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Solution Overview */}
//       {review.solutionOverview && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Solution Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium text-gray-900 mb-1">
//                     Value Outcomes
//                   </h4>
//                   <p className="text-gray-600">
//                     {review?.solutionOverview?.valueOutcomes || "Untitled value outcome"}
//                   </p>
//                 </div>

//                 {review?.solutionOverview?.applicationUsers?.length || 0 > 0 && (
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-2">
//                       Application Users
//                     </h4>
//                     <ul className="space-y-1">
//                       {review?.solutionOverview?.applicationUsers?.map(
//                         (user, index) => (
//                           <li key={index} className="text-gray-600 text-sm">
//                             • {user}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Components Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Business Capabilities</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-primary-600 mb-1">
//               {review?.businessCapabilities?.length}
//             </div>
//             <p className="text-sm text-gray-600">Capabilities defined</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">System Components</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-primary-600 mb-1">
//               {review?.systemComponents?.length}
//             </div>
//             <p className="text-sm text-gray-600">Systems involved</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Integration Flows</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-primary-600 mb-1">
//               {review?.integrationFlows?.length}
//             </div>
//             <p className="text-sm text-gray-600">Integrations planned</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Metadata */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Document Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="font-medium text-gray-900">Created:</span>
//               <p className="text-gray-600">
//                 {formatDate(review.createdAt)} by {review.createdBy}
//               </p>
//             </div>
//             <div>
//               <span className="font-medium text-gray-900">Last Modified:</span>
//               <p className="text-gray-600">
//                 {formatDate(review.lastModifiedAt)} by {review.lastModifiedBy}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     {/* </div> */}
//   {/* Submit Confirmation Modal */}
//       <Modal
//                 isOpen={showReview}
//                 onClose={() => !isSubmitting && setShowReview(false)}
//                 title="Review Solution Review"
//               >
//                 <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm">
//                   {(
//                     Object.keys(existingData) as (keyof UpdateSolutionReviewData)[]
//                   ).map((key) => {
//                     const value = existingData[key];
//                     return (
//                       <div key={key} className="border rounded p-3">
//                         <h3 className="font-semibold mb-2">{sectionLabels[key]}</h3>
//                         {value == null ? (
//                           <div className="text-red-600">Not completed</div>
//                         ) : (
//                           <pre className="bg-gray-50 p-2 rounded overflow-x-auto text-xs">
//                             {JSON.stringify(value, null, 2)}
//                           </pre>
//                         )}
//                         {value == null && (
//                           <Button
//                             variant="secondary"
//                             className="mt-2"
//                             onClick={() => {
//                               const idx = stepMeta.findIndex((s) => s.key === key);
//                               setShowReview(false);
//                               goToStep(idx);
//                             }}
//                           >
//                             Go to section
//                           </Button>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
      
//                 {hasMissing && (
//                   <div className="mt-4 text-red-600 text-sm">
//                     Complete all sections before submitting. Missing:{" "}
//                     {missingSections.join(", ")}
//                   </div>
//                 )}
      
//                 <div className="mt-6 flex justify-end gap-2">
//                   <Button
//                     variant="secondary"
//                     disabled={isSubmitting}
//                     onClick={() => setShowReview(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     disabled={hasMissing || isSubmitting}
//                     onClick={confirmSubmit}
//                   >
//                     {isSubmitting ? "Submitting..." : "Confirm Submit"}
//                   </Button>
//                 </div>
//               </Modal>
//     </div>
//   );
// };
// Helper to show counts (arrays only)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Badge variant="state" state={review.documentState}>
              {review.documentState}
            </Badge>
            {review.version && (
              <span className="text-sm text-gray-500">
                Version {review.version}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {review?.solutionOverview?.solutionDetails?.solutionName || "Untitled Solution Review"}
          </h1>
          <p className="text-gray-600 mt-1">
            {getStateDescription(review.documentState)}
          </p>
        </div>
        <Button variant="ghost" onClick={onClose} aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </Button>
      </div>

      {/* Actions */}
      {availableTransitions.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 mr-1">
                Available Actions:
              </span>
              {availableTransitions.map(t => (
                <Button
                  key={t.operation}
                  variant={t.to === "CURRENT" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleStateTransition(t.to)}
                  title={t.description}
                >
                  {t.operationName}
                </Button>
              ))}
              {review.documentState === "DRAFT" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/update-solution-review/${review.id}`)}
                >
                  Edit Draft
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Overview (basic excerpt) */}
      {review.solutionOverview && (
        <Card>
          <CardHeader>
            <CardTitle>Solution Overview</CardTitle>
          </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Value Outcomes</h4>
                    <p className="text-gray-600">
                      {review?.solutionOverview?.valueOutcome || "—"}
                    </p>
                  </div>
                  {review?.solutionOverview?.applicationUsers?.length ? (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Application Users ({review.solutionOverview.applicationUsers.length})
                      </h4>
                      <ul className="space-y-1">
                        {review.solutionOverview.applicationUsers.map((u, i) => (
                          <li key={i} className="text-gray-600 text-sm">• {u}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
        </Card>
      )}

      {/* Components Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-lg">Business Capabilities</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {review?.businessCapabilities?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Capabilities defined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">System Components</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {review?.systemComponents?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Components listed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Integration Flows</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {review?.integrationFlows?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Flows defined</p>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Created:</span>
              <p className="text-gray-600">
                {formatDate(review.createdAt)} by {review.createdBy || "—"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Last Modified:</span>
              <p className="text-gray-600">
                {formatDate(review.lastModifiedAt)} by {review.lastModifiedBy || "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Review Modal (mirrors UpdateSolutionReviewPage) */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => !isSubmitting && setShowSubmitModal(false)}
        title="Review Solution Review Before Submitting"
      >
        <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm">
          {(Object.keys(reviewData) as (keyof typeof reviewData)[]).map(key => {
            const value = reviewData[key];
            const isArray = Array.isArray(value);
            const isMissing = value == null || (isArray && value.length === 0);
            return (
              <div key={key} className="border rounded p-3">
                <h3 className="font-semibold mb-2 flex items-center">
                  {sectionLabels[key]}
                  {isArray && (
                    <span className="ml-2 text-xs font-medium text-gray-500">
                      ({value.length})
                    </span>
                  )}
                  {isMissing && (
                    <span className="ml-2 text-xs font-medium text-red-600">
                      Missing
                    </span>
                  )}
                </h3>
                {isMissing ? (
                  <div className="text-red-600 text-xs">Not completed</div>
                ) : (
                  <pre className="bg-gray-50 p-2 rounded overflow-x-auto text-xs">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
        </div>

        {hasMissing && (
          <div className="mt-4 text-red-600 text-xs">
            Complete all sections before submitting. Missing: {missingSections.join(", ")}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => setShowSubmitModal(false)}
          >
            Cancel
          </Button>
            <Button
              disabled={hasMissing || isSubmitting}
              onClick={confirmSubmit}
            >
              {isSubmitting ? "Submitting..." : "Confirm Submit"}
            </Button>
        </div>
      </Modal>
    </div>
  );
};