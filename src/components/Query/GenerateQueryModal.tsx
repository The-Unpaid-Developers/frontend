import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { useLookup } from '../../hooks/useLookup';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../context/ToastContext';

interface GenerateQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQueryGenerated: (query: string) => void;
}

const SOLUTION_REVIEW_STEPS = [
  { value: '1', label: 'Step 1: Solution Overview' },
  { value: '2', label: 'Step 2: Business Capabilities' },
  { value: '3', label: 'Step 3: Technology Components' },
  { value: '4', label: 'Step 4: Integration Points' },
  { value: '5', label: 'Step 5: Data Flow' },
  { value: '6', label: 'Step 6: Security & Compliance' },
  { value: '7', label: 'Step 7: Deployment & Operations' },
  { value: '8', label: 'Step 8: Review & Approval' },
];

export const GenerateQueryModal: React.FC<GenerateQueryModalProps> = ({
  isOpen,
  onClose,
  onQueryGenerated,
}) => {
  const { loadAllLookups } = useLookup();
  const { generateQuery, isLoading: isGenerating } = useQuery();
  const { showSuccess, showError } = useToast();

  const [lookups, setLookups] = useState<string[]>([]);
  const [selectedLookup, setSelectedLookup] = useState('');
  const [selectedStep, setSelectedStep] = useState('1');
  const [description, setDescription] = useState('');
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLookups();
    }
  }, [isOpen]);

  const loadLookups = async () => {
    setIsLoadingLookups(true);
    try {
      const data = await loadAllLookups();
      console.log('Loaded lookups:', data);
      /* data:
        [
            {
                "id": "techCompEOL",
                "lookupName": "techCompEOL",
                "uploadedAt": "2025-11-15T15:04:07.267+00:00",
                "recordCount": 114,
                "description": "end of life dates of tech comps"
            }
        ]
      */
      let lookupNames = (data || []).map((lookup: any) => lookup.lookupName);
      // add a none option to lookup names
      lookupNames = ['None', ...lookupNames];
      setLookups(lookupNames);
      setSelectedLookup('None');
    } catch (error) {
      console.error('Failed to load lookups:', error);
      showError('Failed to load lookups');
    } finally {
      setIsLoadingLookups(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedLookup || !description.trim()) {
      showError('Please select a lookup and provide a description');
      return;
    }

    try {
      const payload = {
        lookupName: selectedLookup,
        step: selectedStep,
        description: description.trim(),
      };

      const response = await generateQuery(payload);

      if (response.query) {
        onQueryGenerated(response.query);
        showSuccess('Query generated successfully!');
        handleClose();
      } else {
        showError('No query returned from the API');
      }
    } catch (error) {
      console.error('Failed to generate query:', error);
      showError(
        `Failed to generate query: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleClose = () => {
    setDescription('');
    setSelectedStep('1');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generate Query with AI" maxWidth="xl">
      <div className="space-y-4">
        {/* Lookup Dropdown */}
        <div className="w-full">
          <label
            htmlFor="lookup-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Lookup
          </label>
          <select
            id="lookup-select"
            value={selectedLookup}
            onChange={(e) => setSelectedLookup(e.target.value)}
            disabled={isLoadingLookups || isGenerating}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {isLoadingLookups ? (
              <option value="">Loading lookups...</option>
            ) : (
              <>
                {lookups.length === 1 ? (
                  <option disabled>No lookups available</option>
                ) : (
                  lookups.map((lookupName) => (
                    <option key={lookupName} value={lookupName}>
                      {lookupName}
                    </option>
                  ))
                )}
              </>
            )}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            The lookup table to query data from
          </p>
        </div>

        {/* Step Dropdown */}
        <div className="w-full">
          <label
            htmlFor="step-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Solution Review Step
          </label>
          <select
            id="step-select"
            value={selectedStep}
            onChange={(e) => setSelectedStep(e.target.value)}
            disabled={isGenerating}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {SOLUTION_REVIEW_STEPS.map((step) => (
              <option key={step.value} value={step.value}>
                {step.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Which step of the solution review to target
          </p>
        </div>

        {/* Description */}
        <Textarea
          label="Query Description"
          placeholder="Describe what data you want to retrieve... (e.g., 'Get all active solutions with high business value')"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          helpText="Provide a clear description of what you want to query"
          disabled={isGenerating}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!selectedLookup || !description.trim() || isGenerating || isLoadingLookups}
            isLoading={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Query'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
