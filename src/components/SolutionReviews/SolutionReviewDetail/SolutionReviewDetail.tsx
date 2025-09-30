import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { SolutionReview } from "../../../types/solutionReview";
import { STATE_TRANSITIONS, getStateDescription } from "../../../types/solutionReview";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "../../ui";
import { useUpdateSolutionReview } from "../../../hooks/useUpdateSolutionReview";
import { useToast } from "../../../context/ToastContext";
import { ApprovalModal } from "../../AdminPanel";
import { ReviewSubmissionModal } from "./ReviewSubmissionModal";
import { formatBoolean, formatDate, displayValue } from "../../../utils/formatters";

interface SolutionReviewDetailProps {
  review: SolutionReview;
  onClose: () => void;
}

export const SolutionReviewDetail: React.FC<SolutionReviewDetailProps> = ({
  review,
  onClose,
}) => {
  const navigate = useNavigate();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { transitionSolutionReviewState } = useUpdateSolutionReview(review.id);
  const { showSuccess, showError } = useToast();

  const handleStateTransition = async (operation: string) => {
    try {
      if (operation === "REMOVE_SUBMISSION") {
        await transitionSolutionReviewState(operation);
        showSuccess("Review moved back to draft successfully!");
        navigate(0);
      } else if (operation === "APPROVE") {
        setShowApprovalModal(true);
        return;
      } else if (operation === "SUBMIT") {
        setShowSubmissionModal(true);
        return;
      } else if (operation === "ACTIVATE") {
        await transitionSolutionReviewState(operation);
        showSuccess("Review activated successfully!");
        navigate(0);
      } else if (operation === "UNAPPROVE") {
        await transitionSolutionReviewState(operation);
        showSuccess("Review unapproved successfully!");
        navigate(0);
      } else if (operation === "MARK_OUTDATED") {
        await transitionSolutionReviewState(operation);
        showSuccess("Review marked as outdated successfully!");
        navigate(0);
      } else if (operation === "RESET_CURRENT") {
        await transitionSolutionReviewState(operation);
        showSuccess("Review reverted to current successfully!");
        navigate(0);
      }
    } catch (error) {
      console.error("State transition failed:", error);
      showError("Failed to update review status. Please try again." + (error as Error).message);
    }
  };

  const handleApprovalComplete = async () => {
    await transitionSolutionReviewState("APPROVE");
    navigate(0);
  };

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await transitionSolutionReviewState("SUBMIT");
      showSuccess("Review submitted successfully!");
      setShowSubmissionModal(false);
      navigate(0);
    } catch (error) {
      console.error("Submit failed:", error);
      showError("Failed to submit review. Please try again." + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTransitions = STATE_TRANSITIONS[review.documentState] ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Badge variant="state" state={review.documentState}>
              {review.documentState}
            </Badge>
            {review.id && (
              <span className="text-sm text-gray-500">ID {review.id}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {displayValue(review?.solutionOverview?.solutionDetails?.solutionName) || "Untitled Solution Review"}
          </h1>
          <p className="text-gray-600 mt-1">
            {getStateDescription(review.documentState)}
          </p>
        </div>
        <Button variant="ghost" onClick={onClose} aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  variant={t.to === "CURRENT"  || t.to === "ACTIVE" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleStateTransition(t.operation)}
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

      {/* Solution Overview */}
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
                    {displayValue(review.solutionOverview.valueOutcome)}
                  </p>
                </div>
                {review.solutionOverview.applicationUsers?.length && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Application Users ({review.solutionOverview.applicationUsers.length})
                    </h4>
                    <ul className="space-y-1">
                      {review.solutionOverview.applicationUsers.map((user, index) => (
                        <li key={`user-${user}-${index}`} className="text-gray-600 text-sm">• {user}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Solution Name:</span> <span className="font-medium">{displayValue(review.solutionOverview.solutionDetails?.solutionName)}</span></div>
                  <div><span className="text-gray-500">Project Name:</span> <span className="font-medium">{displayValue(review.solutionOverview.solutionDetails?.projectName)}</span></div>
                  <div><span className="text-gray-500">Review Code:</span> <span className="font-medium">{displayValue((review.solutionOverview.solutionDetails as any)?.solutionReviewCode)}</span></div>
                  <div><span className="text-gray-500">Solution Architect:</span> <span className="font-medium">{displayValue(review.solutionOverview.solutionDetails?.solutionArchitectName)}</span></div>
                  <div><span className="text-gray-500">Project Manager:</span> <span className="font-medium">{displayValue(review.solutionOverview.solutionDetails?.deliveryProjectManagerName)}</span></div>
                  <div><span className="text-gray-500">IT Business Partner:</span> <span className="font-medium">{displayValue((review.solutionOverview.solutionDetails as any)?.itBusinessPartner)}</span></div>
                  <div><span className="text-gray-500">Review Type:</span> <span className="font-medium">{displayValue(review.solutionOverview.reviewType)}</span></div>
                  <div><span className="text-gray-500">Review Status:</span> <span className="font-medium">{displayValue(review.documentState)}</span></div>
                  <div><span className="text-gray-500">Business Unit:</span> <span className="font-medium">{displayValue(review.solutionOverview.businessUnit)}</span></div>
                  <div><span className="text-gray-500">Business Driver:</span> <span className="font-medium">{displayValue(review.solutionOverview.businessDriver)}</span></div>
                </div>

                {(review.solutionOverview.concerns?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Concerns ({review.solutionOverview.concerns?.length})
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {review.solutionOverview.concerns?.map((concern: any, index: number) => (
                        <li key={`concern-${concern.type}-${concern.description?.slice(0, 10)}-${index}`}>
                          <span className="font-medium">{concern.type}</span>: {concern.description}
                          {concern.impact && <> — Impact: {concern.impact}</>}
                          {concern.disposition && <> — Disposition: {concern.disposition}</>}
                          {concern.status && <> — Status: {concern.status}</>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Sections */}
      <div className="space-y-6">
        {/* Business Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Business Capabilities ({review?.businessCapabilities?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {review.businessCapabilities?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">L1</th>
                      <th className="p-2">L2</th>
                      <th className="p-2">L3</th>
                      <th className="p-2">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.businessCapabilities.map((bc: any) => (
                      <tr key={bc.id || `bc-${bc.l1Capability}-${bc.l2Capability}-${bc.l3Capability}`} className="border-t">
                        <td className="p-2">{displayValue(bc.l1Capability)}</td>
                        <td className="p-2">{displayValue(bc.l2Capability)}</td>
                        <td className="p-2">{displayValue(bc.l3Capability)}</td>
                        <td className="p-2">{displayValue(bc.remarks)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No capabilities.</div>
            )}
          </CardContent>
        </Card>

        {/* System Components - FULL DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>System Components ({review?.systemComponents?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {review.systemComponents?.length ? review.systemComponents.map((comp: any) => {
              const s = comp.securityDetails || {};
              return (
                <div key={comp.id || `comp-${comp.name}-${comp.status}`} className="border rounded p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div><span className="text-gray-500">Name:</span> <span className="font-medium">{displayValue(comp.name)}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className="font-medium">{displayValue(comp.status)}</span></div>
                    <div><span className="text-gray-500">Role:</span> <span className="font-medium">{displayValue(comp.role)}</span></div>
                    <div><span className="text-gray-500">Hosted On:</span> <span className="font-medium">{displayValue(comp.hostedOn)}</span></div>
                    <div><span className="text-gray-500">Hosting Region:</span> <span className="font-medium">{displayValue(comp.hostingRegion)}</span></div>
                    <div><span className="text-gray-500">Solution Type:</span> <span className="font-medium">{displayValue(comp.solutionType)}</span></div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Language/Framework:</span>{" "}
                      <span className="font-medium">
                        {comp.languageFramework
                          ? `${displayValue(comp.languageFramework.language?.name)} ${displayValue(comp.languageFramework.language?.version)}` +
                            (comp.languageFramework.framework ? ` / ${displayValue(comp.languageFramework.framework?.name)} ${displayValue(comp.languageFramework.framework?.version)}` : "")
                          : "—"}
                      </span>
                    </div>
                    <div><span className="text-gray-500">Customization:</span> <span className="font-medium">{displayValue(comp.customizationLevel)}</span></div>
                    <div><span className="text-gray-500">Upgrade Strategy:</span> <span className="font-medium">{displayValue(comp.upgradeStrategy)}</span></div>
                    <div><span className="text-gray-500">Upgrade Frequency:</span> <span className="font-medium">{displayValue(comp.upgradeFrequency)}</span></div>
                    <div><span className="text-gray-500">Availability:</span> <span className="font-medium">{displayValue(comp.availabilityRequirement)}</span></div>
                    <div><span className="text-gray-500">Latency:</span> <span className="font-medium">{displayValue(comp.latencyRequirement)}</span></div>
                    <div><span className="text-gray-500">Throughput:</span> <span className="font-medium">{displayValue(comp.throughputRequirement)}</span></div>
                    <div><span className="text-gray-500">Scalability:</span> <span className="font-medium">{displayValue(comp.scalabilityMethod)}</span></div>
                    <div><span className="text-gray-500">Backup Site:</span> <span className="font-medium">{displayValue(comp.backupSite)}</span></div>

                    <div><span className="text-gray-500">Internet Facing:</span> <span className="font-medium">{formatBoolean(comp.isInternetFacing ?? comp.internetFacing)}</span></div>
                    <div><span className="text-gray-500">Subscription:</span> <span className="font-medium">{formatBoolean(comp.isSubscription ?? comp.subscription)}</span></div>
                    <div><span className="text-gray-500">Owned By Us:</span> <span className="font-medium">{formatBoolean(comp.isOwnedByUs ?? comp.ownedByUs)}</span></div>
                    <div><span className="text-gray-500">CI/CD Used:</span> <span className="font-medium">{formatBoolean(comp.isCICDUsed ?? comp.cicdused)}</span></div>
                  </div>

                  {/* Security details - FULL */}
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900 mb-2">Security Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div><span className="text-gray-500">Authentication:</span> <span className="font-medium">{displayValue(s.authenticationMethod)}</span></div>
                      <div><span className="text-gray-500">Authorization:</span> <span className="font-medium">{displayValue(s.authorizationModel)}</span></div>
                      <div><span className="text-gray-500">Sensitive Data:</span> <span className="font-medium">{displayValue(s.sensitiveDataElements)}</span></div>
                      <div><span className="text-gray-500">Data Encryption (At Rest):</span> <span className="font-medium">{displayValue(s.dataEncryptionAtRest)}</span></div>
                      <div><span className="text-gray-500">Algorithm (At Rest):</span> <span className="font-medium">{displayValue(s.encryptionAlgorithmForDataAtRest)}</span></div>
                      <div><span className="text-gray-500">IP Whitelisting:</span> <span className="font-medium">{formatBoolean(s.hasIpWhitelisting)}</span></div>
                      <div><span className="text-gray-500">SSL/TLS:</span> <span className="font-medium">{displayValue(s.ssl)}</span></div>
                      <div><span className="text-gray-500">Payload Encryption:</span> <span className="font-medium">{displayValue(s.payloadEncryptionAlgorithm)}</span></div>
                      <div><span className="text-gray-500">Digital Cert:</span> <span className="font-medium">{displayValue(s.digitalCertificate)}</span></div>
                      <div><span className="text-gray-500">Key Store:</span> <span className="font-medium">{displayValue(s.keyStore)}</span></div>
                      <div><span className="text-gray-500">Vulnerability Assessment:</span> <span className="font-medium">{displayValue(s.vulnerabilityAssessmentFrequency)}</span></div>
                      <div><span className="text-gray-500">Penetration Testing:</span> <span className="font-medium">{displayValue(s.penetrationTestingFrequency)}</span></div>
                      <div><span className="text-gray-500">Audit Logging:</span> <span className="font-medium">{formatBoolean((s as any).auditLoggingEnabled ?? (s as any).isAuditLoggingEnabled)}</span></div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-sm text-gray-500">No system components.</div>
            )}
          </CardContent>
        </Card>

        {/* Integration Flows */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Flows ({review?.integrationFlows?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {review.integrationFlows?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Component</th>
                      <th className="p-2">Counterpart (Role)</th>
                      <th className="p-2">Method</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Middleware</th>
                      <th className="p-2">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.integrationFlows.map((f: any) => (
                      <tr key={f.id || `flow-${f.componentName}-${f.counterpartSystemCode}-${f.integrationMethod}`} className="border-t">
                        <td className="p-2">{displayValue(f.componentName ?? f.bsoCodeOfExternalSystem)}</td>
                        <td className="p-2">{displayValue(f.counterpartSystemCode ?? f.externalSystemRole)}{f.counterpartSystemRole ? ` (${f.counterpartSystemRole})` : ""}</td>
                        <td className="p-2">{displayValue(f.integrationMethod)}</td>
                        <td className="p-2">{displayValue(f.frequency)}</td>
                        <td className="p-2">{displayValue(f.middleware)}</td>
                        <td className="p-2">{displayValue(f.purpose)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No integration flows.</div>
            )}
          </CardContent>
        </Card>

        {/* Data Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Data Assets ({review?.dataAssets?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {review.dataAssets?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Component</th>
                      <th className="p-2">Domain</th>
                      <th className="p-2">Classification</th>
                      <th className="p-2">Owned By</th>
                      <th className="p-2">Entities</th>
                      <th className="p-2">Mastered In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.dataAssets.map((d: any) => (
                      <tr key={d.id || `data-${d.componentName}-${d.dataDomain}-${d.dataClassification}`} className="border-t">
                        <td className="p-2">{displayValue(d.componentName)}</td>
                        <td className="p-2">{displayValue(d.dataDomain)}</td>
                        <td className="p-2">{displayValue(d.dataClassification)}</td>
                        <td className="p-2">{displayValue(d.dataOwnedBy)}</td>
                        <td className="p-2">{(d.dataEntities || []).join(", ") || "—"}</td>
                        <td className="p-2">{displayValue(d.masteredIn)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No data assets.</div>
            )}
          </CardContent>
        </Card>

        {/* Technology Components */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Components ({review?.technologyComponents?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {review.technologyComponents?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Component</th>
                      <th className="p-2">Product</th>
                      <th className="p-2">Version</th>
                      <th className="p-2">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.technologyComponents.map((t: any) => (
                      <tr key={t.id || `tech-${t.componentName}-${t.productName}-${t.productVersion}`} className="border-t">
                        <td className="p-2">{displayValue(t.componentName)}</td>
                        <td className="p-2">{displayValue(t.productName)}</td>
                        <td className="p-2">{displayValue(t.productVersion)}</td>
                        <td className="p-2">{displayValue(t.usage)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No technology components.</div>
            )}
          </CardContent>
        </Card>

        {/* Enterprise Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Tools ({review?.enterpriseTools?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {review.enterpriseTools?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Tool</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Onboarded</th>
                      <th className="p-2">Integration Details</th>
                      <th className="p-2">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.enterpriseTools.map((e: any) => (
                      <tr key={e.id || `tool-${e.tool?.name}-${e.tool?.type}-${e.onboarded}`} className="border-t">
                        <td className="p-2">{displayValue(e.tool?.name)}</td>
                        <td className="p-2">{displayValue(e.tool?.type)}</td>
                        <td className="p-2">{formatBoolean(e.onboarded)}</td>
                        <td className="p-2">{displayValue(e.integrationDetails)}</td>
                        <td className="p-2">{displayValue(e.issues)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No enterprise tools.</div>
            )}
          </CardContent>
        </Card>

        {/* Process Compliances */}
        <Card>
          <CardHeader>
            <CardTitle>Process Compliances ({review?.processCompliances?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {review.processCompliances?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Standard/Guideline</th>
                      <th className="p-2">Compliant</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.processCompliances.map((p: any) => (
                      <tr key={p.id || `compliance-${p.standardGuideline}-${p.compliant}`} className="border-t">
                        <td className="p-2">{displayValue(p.standardGuideline)}</td>
                        <td className="p-2">{displayValue(p.compliant)}</td>
                        <td className="p-2">{displayValue(p.description)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No process compliances.</div>
            )}
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
                {formatDate(review.createdAt)} by {displayValue(review.createdBy)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Last Modified:</span>
              <p className="text-gray-600">
                {formatDate(review.lastModifiedAt)} by {displayValue(review.lastModifiedBy)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        reviewId={review.id}
        onApprovalComplete={handleApprovalComplete}
        currentSolutionOverview={review.solutionOverview}
      />

      <ReviewSubmissionModal
        showReview={showSubmissionModal}
        setShowReview={setShowSubmissionModal}
        isSubmitting={isSubmitting}
        reviewId={review.id}
        confirmSubmit={confirmSubmit}
      />
    </div>
  );
};