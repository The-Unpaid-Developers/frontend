import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { useLookup } from '../../hooks/useLookup';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../context/ToastContext';
import { formatQueryJSON } from '../../utils/queryValidation';

interface GenerateQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQueryGenerated: (query: string) => void;
  onGenerationStart?: (params: { lookup: string; fields: string[]; description: string }) => void;
  initialLookup?: string;
  initialFields?: string[];
  initialDescription?: string;
}

export const GenerateQueryModal: React.FC<GenerateQueryModalProps> = ({
  isOpen,
  onClose,
  onQueryGenerated,
  onGenerationStart,
  initialLookup,
  initialFields,
  initialDescription,
}) => {
  const { loadAllLookups, loadFieldDescriptions } = useLookup();
  const { generateQueryStream, isLoading: isGenerating } = useQuery();
  const { showSuccess, showError } = useToast();

  const [lookups, setLookups] = useState<string[]>([]);
  const [selectedLookup, setSelectedLookup] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);
  const [lookupFields, setLookupFields] = useState<string[]>([]);
  const [fieldDescriptions, setFieldDescriptions] = useState<Record<string, string>>({});
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [streamedQuery, setStreamedQuery] = useState('');

  // Check if this is a regeneration (initial values provided)
  const isRegeneration = Boolean(initialLookup || initialDescription);

  useEffect(() => {
    if (isOpen) {
      loadLookups();
      // Populate with initial values if provided (for regeneration)
      if (initialDescription) {
        setDescription(initialDescription);
      }
    }
  }, [isOpen, initialDescription]);

  useEffect(() => {
    // Set initial lookup after lookups are loaded
    if (lookups.length > 0 && initialLookup && lookups.includes(initialLookup)) {
      setSelectedLookup(initialLookup);
    }
  }, [lookups, initialLookup]);

  useEffect(() => {
    // Set initial fields after fields are loaded
    if (lookupFields.length > 0 && initialFields && initialFields.length > 0) {
      const validFields = initialFields.filter(f => lookupFields.includes(f));
      setSelectedFields(validFields);
    }
  }, [lookupFields, initialFields]);

  useEffect(() => {
    if (selectedLookup && selectedLookup !== 'None') {
      loadFields();
    } else {
      setLookupFields([]);
      setFieldDescriptions({});
      setSelectedFields([]);
    }
  }, [selectedLookup]);

  const loadLookups = async () => {
    setIsLoadingLookups(true);
    try {
      const data = await loadAllLookups();
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

  const loadFields = async () => {
    setIsLoadingFields(true);
    try {
      const data = await loadFieldDescriptions(selectedLookup);
      const descriptions = data.fieldDescriptions || {};
      const fieldNames = Object.keys(descriptions);
      setLookupFields(fieldNames);
      setFieldDescriptions(descriptions);
      setSelectedFields([]);
    } catch (error) {
      console.error('Failed to load lookup fields:', error);
      showError('Failed to load lookup fields');
      setLookupFields([]);
      setFieldDescriptions({});
    } finally {
      setIsLoadingFields(false);
    }
  };

  const handleFieldToggle = (fieldName: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldName)
        ? prev.filter((f) => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  const handleGenerate = async () => {
    if (!selectedLookup || !description.trim()) {
      showError('Please select a lookup and provide a description');
      return;
    }

    try {
      const payload = {
        lookupName: selectedLookup,
        lookupFieldsUsed: selectedFields,
        userPrompt: description.trim(),
      };

      // Notify parent of generation parameters for regeneration feature
      if (onGenerationStart) {
        onGenerationStart({
          lookup: selectedLookup,
          fields: selectedFields,
          description: description.trim(),
        });
      }

      setStreamedQuery('');
      let accumulatedQuery = '';
      let hasReceivedFirstChunk = false;

      await generateQueryStream(
        payload,
        (chunk) => {
          // Close modal after receiving first chunk
          if (!hasReceivedFirstChunk) {
            hasReceivedFirstChunk = true;
            onClose();
          }

          // Accumulate chunks
          accumulatedQuery += chunk;
          setStreamedQuery(accumulatedQuery);
          // Send partial result to parent component
          onQueryGenerated(accumulatedQuery);
        },
        () => {
          // On complete - format the final query
          try {
            const formattedQuery = formatQueryJSON(accumulatedQuery);
            onQueryGenerated(formattedQuery);
          } catch (error) {
            console.warn('Failed to format generated query:', error);
            // Keep the unformatted version
          }
          showSuccess('Query generated successfully!');
        }
      );
    } catch (error) {
      console.error('Failed to generate query:', error);
      showError(
        `Failed to generate query: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleClose = () => {
    setDescription('');
    setSelectedFields([]);
    setLookupFields([]);
    setFieldDescriptions({});
    setStreamedQuery('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isRegeneration ? "Regenerate Query with AI" : "Generate Query with AI"} maxWidth="xl">
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

        {/* Lookup Fields Checklist */}
        {selectedLookup && selectedLookup !== 'None' && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lookup Fields Used
            </label>
            {isLoadingFields ? (
              <div className="text-sm text-gray-500 italic">Loading fields...</div>
            ) : lookupFields.length > 0 ? (
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-gray-50">
                <div className="space-y-2">
                  {lookupFields.map((field) => (
                    <div key={field} className="group relative">
                      <label className="flex items-start space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field)}
                          onChange={() => handleFieldToggle(field)}
                          disabled={isGenerating}
                          className="h-4 w-4 mt-0.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700">{field}</div>
                          {fieldDescriptions[field] && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {fieldDescriptions[field]}
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No fields available</div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Select the fields you want to use in the query (optional)
            </p>
          </div>
        )}

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
            {isGenerating ? 'Generating...' : isRegeneration ? 'Regenerate Query' : 'Generate Query'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
