import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, DropDown, Modal } from "../ui";
import { useAdminPanel } from "../../hooks/useAdminPanel";
import { useToast } from "../../context/ToastContext";

interface Concern {
  id: string;
  type: 'RISK' | 'DECISION' | 'DEVIATION';
  description: string;
  impact: string;
  disposition: string;
  status: 'UNKNOWN';
  followUpDate: string; // Will be converted to LocalDateTime format for backend
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  onApprovalComplete: () => void;
  title?: string;
  description?: string;
  currentSolutionOverview?: any;
}

const CONCERN_TYPE_OPTIONS = [
  { value: 'RISK', label: 'Risk' },
  { value: 'DECISION', label: 'Decision' },
  { value: 'DEVIATION', label: 'Deviation' }
];

const CONCERN_STATUS_OPTIONS = [
  { value: 'UNKNOWN', label: 'Unknown' }
];

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  reviewId,
  onApprovalComplete,
  title = "Approve Solution Review",
  description = "You are about to approve this solution review. You can optionally add concerns before approval.",
  currentSolutionOverview
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [currentConcern, setCurrentConcern] = useState<Concern>({
    id: '',
    type: 'RISK',
    description: '',
    impact: '',
    disposition: '',
    status: 'UNKNOWN',
    followUpDate: ''
  });

  const { addConcernsToSR } = useAdminPanel();
  const { showSuccess, showError } = useToast();

  // Convert date string to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Set time to 23:59:59
    date.setHours(23, 59, 59, 0);
    return date.toISOString().slice(0, 19); // Remove milliseconds and timezone
  };

  // Format date for display in the concern list
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const addConcern = () => {
    if (!currentConcern.description || !currentConcern.impact || !currentConcern.disposition || !currentConcern.followUpDate) {
      showError("Please fill in all concern fields including follow-up date");
      return;
    }

    const newConcern = {
      ...currentConcern,
      id: `concern-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`
    };

    setConcerns([...concerns, newConcern]);
    setCurrentConcern({
      id: '',
      type: 'RISK',
      description: '',
      impact: '',
      disposition: '',
      status: 'UNKNOWN',
      followUpDate: ''
    });
  };

  const removeConcern = (id: string) => {
    setConcerns(concerns.filter((concern) => concern.id !== id));
  };

  const handleApproval = async () => {
    try {
      setIsApproving(true);
      
      console.log('currentSolutionOverview:', currentSolutionOverview);
      console.log('concerns.length:', concerns.length);
      
      if (!currentSolutionOverview) {
        throw new Error('Solution overview not available for adding concerns');
      }

      // Convert concerns for backend - format dates and remove id field
      const concernsForBackend = concerns.map(({ id, followUpDate, ...concern }) => ({
        ...concern,
        followUpDate: formatDateForBackend(followUpDate)
      }));

      await addConcernsToSR(reviewId, concernsForBackend, currentSolutionOverview);
      
      // Then call the completion callback (which should handle the actual approval)
      await onApprovalComplete();
      
      showSuccess("Review approved successfully!");
      
      // Reset state
      setConcerns([]);
      setCurrentConcern({
        id: '',
        type: 'RISK',
        description: '',
        impact: '',
        disposition: '',
        status: 'UNKNOWN',
        followUpDate: ''
      });
      
      onClose();
    } catch (error) {
      console.error("Approval failed:", error);
      showError("Failed to approve review. Please try again. " + (error as Error).message);
    } finally {
      setIsApproving(false);
    }
  };

  const handleClose = () => {
    if (isApproving) return;
    
    // Reset state when closing
    setConcerns([]);
    setCurrentConcern({
      id: '',
      type: 'RISK',
      description: '',
      impact: '',
      disposition: '',
      status: 'UNKNOWN',
      followUpDate: ''
    });
    
    onClose();
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          {description}
        </p>

        {/* Add Concern Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Concerns (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concern Type <span className="text-red-500">*</span>
                    <DropDown
                      value={currentConcern.type}
                      onChange={(e) => setCurrentConcern({...currentConcern, type: e.target.value as any})}
                      options={CONCERN_TYPE_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                    <DropDown
                      value={currentConcern.status}
                      onChange={(e) => setCurrentConcern({...currentConcern, status: e.target.value as any})}
                      options={CONCERN_STATUS_OPTIONS}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                  <Input
                    value={currentConcern.description}
                    onChange={(e) => setCurrentConcern({...currentConcern, description: e.target.value})}
                    placeholder="Describe the concern"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact <span className="text-red-500">*</span>
                  <Input
                    value={currentConcern.impact}
                    onChange={(e) => setCurrentConcern({...currentConcern, impact: e.target.value})}
                    placeholder="Describe the impact"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disposition <span className="text-red-500">*</span>
                  <Input
                    value={currentConcern.disposition}
                    onChange={(e) => setCurrentConcern({...currentConcern, disposition: e.target.value})}
                    placeholder="Describe the disposition"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Date <span className="text-red-500">*</span>
                  <input
                    type="date"
                    value={currentConcern.followUpDate}
                    onChange={(e) => setCurrentConcern({...currentConcern, followUpDate: e.target.value})}
                    min={getTodayDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>
              </div>

              <Button
                onClick={addConcern}
                variant="secondary"
                size="sm"
                disabled={!currentConcern.description || !currentConcern.impact || !currentConcern.disposition || !currentConcern.followUpDate}
              >
                Add Concern
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Concerns List */}
        {concerns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Added Concerns ({concerns.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {concerns.map((concern) => (
                  <div key={concern.id} className="border rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {concern.type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {concern.status}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Due: {formatDateForDisplay(concern.followUpDate)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{concern.description}</p>
                        <p className="text-sm text-gray-600"><strong>Impact:</strong> {concern.impact}</p>
                        <p className="text-sm text-gray-600"><strong>Disposition:</strong> {concern.disposition}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConcern(concern.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="secondary"
          disabled={isApproving}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isApproving}
          onClick={handleApproval}
        >
          {isApproving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Approving...
            </>
          ) : (
            "Approve Review"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ApprovalModal;