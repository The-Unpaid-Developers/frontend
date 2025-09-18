import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { SolutionReview } from "../../types/solutionReview";
import { DocumentState, STATE_TRANSITIONS, getStateColor, getStateDescription } from "../../types/solutionReview";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Modal } from "../ui";
import { useUpdateSolutionReview } from "../../hooks/useUpdateSolutionReview";
// import { useSolutionReview } from "../../context/SolutionReviewContext";
import { useToast } from "../../context/ToastContext";

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
  const { showSuccess, showError } = useToast();

  const handleStateTransition = async (newState: string) => {
    try {
      if (newState === "DRAFT") {
        await updateReviewState("REMOVE_SUBMISSION");
        showSuccess("Review moved back to draft successfully!");
      } else if (newState === "CURRENT") {
        await updateReviewState("APPROVE");
        showSuccess("Review approved successfully!");
      } else if (newState === "SUBMITTED") {
        setShowSubmitModal(true);
        return; // Don't show toast yet, wait for modal confirmation
      }
      navigate(0); // Refresh the current route
    } catch (error) {
      console.error("State transition failed:", error);
      showError("Failed to update review status. Please try again." + error.message);
    }
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
    if (hasMissing) {
      showError("Please complete all sections before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateReviewState("SUBMIT");
      showSuccess("Review submitted successfully!");
      setShowSubmitModal(false);
      navigate(0); // Refresh the current route
    } catch (error) {
      console.error("Submit failed:", error);
      showError("Failed to submit review. Please try again." + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span className="text-sm text-gray-500">
                ID {review.id}
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

              {/* Detailed overview fields */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Solution Name:</span> <span className="font-medium">{review.solutionOverview.solutionDetails?.solutionName || "—"}</span></div>
                  <div><span className="text-gray-500">Project Name:</span> <span className="font-medium">{review.solutionOverview.solutionDetails?.projectName || "—"}</span></div>
                  <div><span className="text-gray-500">Review Code:</span> <span className="font-medium">{(review.solutionOverview.solutionDetails as any)?.solutionReviewCode || "—"}</span></div>
                  <div><span className="text-gray-500">Solution Architect:</span> <span className="font-medium">{review.solutionOverview.solutionDetails?.solutionArchitectName || "—"}</span></div>
                  <div><span className="text-gray-500">Project Manager:</span> <span className="font-medium">{review.solutionOverview.solutionDetails?.deliveryProjectManagerName || "—"}</span></div>
                  <div><span className="text-gray-500">IT Business Partner:</span> <span className="font-medium">{(review.solutionOverview.solutionDetails as any)?.itBusinessPartner || "—"}</span></div>

                  <div><span className="text-gray-500">Review Type:</span> <span className="font-medium">{review.solutionOverview.reviewType || "—"}</span></div>
                  {/* <div><span className="text-gray-500">Approval Status:</span> <span className="font-medium">{review.solutionOverview.approvalStatus || "—"}</span></div> */}
                  <div><span className="text-gray-500">Review Status:</span> <span className="font-medium">{review.documentState || "—"}</span></div>
                  <div><span className="text-gray-500">Business Unit:</span> <span className="font-medium">{review.solutionOverview.businessUnit || "—"}</span></div>
                  <div><span className="text-gray-500">Business Driver:</span> <span className="font-medium">{review.solutionOverview.businessDriver || "—"}</span></div>
                  {/* <div className="sm:col-span-2"><span className="text-gray-500">Concerns:</span> <span className="font-medium">{review.solutionOverview.concerns || "—"}</span></div> */}
                </div>

                {(review.solutionOverview.concerns?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Concerns ({review.solutionOverview.concerns?.length})</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {review.solutionOverview.concerns?.map((c: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-medium">{c.type}</span>: {c.description}
                          {c.impact ? <> — Impact: {c.impact}</> : null}
                          {c.disposition ? <> — Disposition: {c.disposition}</> : null}
                          {c.status ? <> — Status: {c.status}</> : null}
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
          <CardHeader><CardTitle>Business Capabilities ({review?.businessCapabilities?.length || 0})</CardTitle></CardHeader>
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
                      <tr key={bc.id} className="border-t">
                        <td className="p-2">{bc.l1Capability || "—"}</td>
                        <td className="p-2">{bc.l2Capability || "—"}</td>
                        <td className="p-2">{bc.l3Capability || "—"}</td>
                        <td className="p-2">{bc.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-sm text-gray-500">No capabilities.</div>}
          </CardContent>
        </Card>

        {/* System Components */}
        <Card>
          <CardHeader><CardTitle>System Components ({review?.systemComponents?.length || 0})</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {review.systemComponents?.length ? review.systemComponents.map((comp: any) => {
              const s = comp.securityDetails || {};
              const yesNo = (v: any) => (v === true || v === "TRUE") ? "Yes" : (v === false || v === "FALSE") ? "No" : v ?? "—";
              return (
                <div key={comp.id} className="border rounded p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div><span className="text-gray-500">Name:</span> <span className="font-medium">{comp.name || "—"}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className="font-medium">{comp.status || "—"}</span></div>
                    <div><span className="text-gray-500">Role:</span> <span className="font-medium">{comp.role || "—"}</span></div>
                    <div><span className="text-gray-500">Hosted On:</span> <span className="font-medium">{comp.hostedOn || "—"}</span></div>
                    <div><span className="text-gray-500">Hosting Region:</span> <span className="font-medium">{comp.hostingRegion || "—"}</span></div>
                    <div><span className="text-gray-500">Solution Type:</span> <span className="font-medium">{comp.solutionType || "—"}</span></div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Language/Framework:</span>{" "}
                      <span className="font-medium">
                        {comp.languageFramework
                          ? `${comp.languageFramework.language?.name ?? "?"} ${comp.languageFramework.language?.version ?? ""}` +
                            (comp.languageFramework.framework ? ` / ${comp.languageFramework.framework?.name ?? "?"} ${comp.languageFramework.framework?.version ?? ""}` : "")
                          : "—"}
                      </span>
                    </div>
                    <div><span className="text-gray-500">Customization:</span> <span className="font-medium">{comp.customizationLevel || "—"}</span></div>
                    <div><span className="text-gray-500">Upgrade Strategy:</span> <span className="font-medium">{comp.upgradeStrategy || "—"}</span></div>
                    <div><span className="text-gray-500">Upgrade Frequency:</span> <span className="font-medium">{comp.upgradeFrequency || "—"}</span></div>
                    <div><span className="text-gray-500">Availability:</span> <span className="font-medium">{comp.availabilityRequirement || "—"}</span></div>
                    <div><span className="text-gray-500">Latency:</span> <span className="font-medium">{comp.latencyRequirement ?? "—"}</span></div>
                    <div><span className="text-gray-500">Throughput:</span> <span className="font-medium">{comp.throughputRequirement ?? "—"}</span></div>
                    <div><span className="text-gray-500">Scalability:</span> <span className="font-medium">{comp.scalabilityMethod || "—"}</span></div>
                    <div><span className="text-gray-500">Backup Site:</span> <span className="font-medium">{comp.backupSite || "—"}</span></div>

                    {/* booleans with backend/FE naming tolerance */}
                    <div><span className="text-gray-500">Internet Facing:</span> <span className="font-medium">{yesNo(comp.isInternetFacing ?? comp.internetFacing)}</span></div>
                    <div><span className="text-gray-500">Subscription:</span> <span className="font-medium">{yesNo(comp.isSubscription ?? comp.subscription)}</span></div>
                    <div><span className="text-gray-500">Owned By Us:</span> <span className="font-medium">{yesNo(comp.isOwnedByUs ?? comp.ownedByUs)}</span></div>
                    <div><span className="text-gray-500">CI/CD Used:</span> <span className="font-medium">{yesNo(comp.isCICDUsed ?? comp.cicdused)}</span></div>
                  </div>

                  {/* Security details */}
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900 mb-2">Security Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div><span className="text-gray-500">Authentication:</span> <span className="font-medium">{s.authenticationMethod || "—"}</span></div>
                      <div><span className="text-gray-500">Authorization:</span> <span className="font-medium">{s.authorizationModel || "—"}</span></div>
                      <div><span className="text-gray-500">Sensitive Data:</span> <span className="font-medium">{s.sensitiveDataElements || "—"}</span></div>
                      <div><span className="text-gray-500">Data Encryption (At Rest):</span> <span className="font-medium">{s.dataEncryptionAtRest || "—"}</span></div>
                      <div><span className="text-gray-500">Algorithm (At Rest):</span> <span className="font-medium">{s.encryptionAlgorithmForDataAtRest || "—"}</span></div>
                      <div><span className="text-gray-500">IP Whitelisting:</span> <span className="font-medium">{yesNo(s.hasIpWhitelisting)}</span></div>
                      <div><span className="text-gray-500">SSL/TLS:</span> <span className="font-medium">{s.ssl || "—"}</span></div>
                      <div><span className="text-gray-500">Payload Encryption:</span> <span className="font-medium">{s.payloadEncryptionAlgorithm || "—"}</span></div>
                      <div><span className="text-gray-500">Digital Cert:</span> <span className="font-medium">{s.digitalCertificate || "—"}</span></div>
                      <div><span className="text-gray-500">Key Store:</span> <span className="font-medium">{s.keyStore || "—"}</span></div>
                      <div><span className="text-gray-500">Vulnerability Assessment:</span> <span className="font-medium">{s.vulnerabilityAssessmentFrequency || "—"}</span></div>
                      <div><span className="text-gray-500">Penetration Testing:</span> <span className="font-medium">{s.penetrationTestingFrequency || "—"}</span></div>
                      <div><span className="text-gray-500">Audit Logging:</span> <span className="font-medium">{yesNo((s as any).auditLoggingEnabled ?? (s as any).isAuditLoggingEnabled)}</span></div>
                    </div>
                  </div>
                </div>
              );
            }) : <div className="text-sm text-gray-500">No system components.</div>}
          </CardContent>
        </Card>

        {/* Integration Flows */}
        <Card>
          <CardHeader><CardTitle>Integration Flows ({review?.integrationFlows?.length || 0})</CardTitle></CardHeader>
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
                      <th className="p-2">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.integrationFlows.map((f: any) => (
                      <tr key={f.id} className="border-t">
                        <td className="p-2">{f.componentName ?? f.bsoCodeOfExternalSystem ?? "—"}</td>
                        <td className="p-2">{f.counterpartSystemCode ?? f.externalSystemRole ?? "—"}{f.counterpartSystemRole ? ` (${f.counterpartSystemRole})` : ""}</td>
                        <td className="p-2">{f.integrationMethod || "—"}</td>
                        <td className="p-2">{f.frequency || "—"}</td>
                        <td className="p-2">{f.purpose || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-sm text-gray-500">No integration flows.</div>}
          </CardContent>
        </Card>

        {/* Data Assets */}
        <Card>
          <CardHeader><CardTitle>Data Assets ({review?.dataAssets?.length || 0})</CardTitle></CardHeader>
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
                      <tr key={d.id} className="border-t">
                        <td className="p-2">{d.componentName || "—"}</td>
                        <td className="p-2">{d.dataDomain || "—"}</td>
                        <td className="p-2">{d.dataClassification || "—"}</td>
                        <td className="p-2">{d.dataOwnedBy || "—"}</td>
                        <td className="p-2">{(d.dataEntities || []).join(", ") || "—"}</td>
                        <td className="p-2">{d.masteredIn || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-sm text-gray-500">No data assets.</div>}
          </CardContent>
        </Card>

        {/* Technology Components */}
        <Card>
          <CardHeader><CardTitle>Technology Components ({review?.technologyComponents?.length || 0})</CardTitle></CardHeader>
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
                      <tr key={t.id} className="border-t">
                        <td className="p-2">{t.componentName || "—"}</td>
                        <td className="p-2">{t.productName || "—"}</td>
                        <td className="p-2">{t.productVersion || "—"}</td>
                        <td className="p-2">{t.usage || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-sm text-gray-500">No technology components.</div>}
          </CardContent>
        </Card>

        {/* Enterprise Tools */}
        <Card>
          <CardHeader><CardTitle>Enterprise Tools ({review?.enterpriseTools?.length || 0})</CardTitle></CardHeader>
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
                      <tr key={e.id} className="border-t">
                        <td className="p-2">{e.tool?.name || "—"}</td>
                        <td className="p-2">{e.tool?.type || "—"}</td>
                        <td className="p-2">{(e.onboarded === true || e.onboarded === "TRUE") ? "Yes" : (e.onboarded === false || e.onboarded === "FALSE") ? "No" : (e.onboarded ?? "—")}</td>
                        <td className="p-2">{e.integrationDetails || "—"}</td>
                        <td className="p-2">{e.issues || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-sm text-gray-500">No enterprise tools.</div>}
          </CardContent>
        </Card>

        {/* Process Compliances */}
        <Card>
          <CardHeader><CardTitle>Process Compliances ({review?.processCompliances?.length || 0})</CardTitle></CardHeader>
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
                      <tr key={p.id} className="border-t">
                        <td className="p-2">{p.standardGuideline || "—"}</td>
                        <td className="p-2">{p.compliant || "—"}</td>
                        <td className="p-2">{p.description || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-sm text-gray-500">No process compliances.</div>}
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