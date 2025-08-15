import React, { useState } from "react";
import { Modal, Button, Input, Textarea } from "./ui";
import type { SolutionOverview } from "../types";
import { useSolutionReview } from "../context/SolutionReviewContext";

interface CreateSolutionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSolutionReviewModal: React.FC<
  CreateSolutionReviewModalProps
> = ({ isOpen, onClose }) => {
  const { actions } = useSolutionReview();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    businessValue: "",
    estimatedCost: "",
    estimatedDuration: "",
    stakeholders: "",
    risksAndChallenges: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const solutionOverview: SolutionOverview = {
        id: Date.now().toString(), // Temporary ID - backend will generate real one
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        businessValue: formData.businessValue,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        estimatedDuration: formData.estimatedDuration,
        stakeholders: formData.stakeholders.split("\n").filter((s) => s.trim()),
        risksAndChallenges: formData.risksAndChallenges
          .split("\n")
          .filter((r) => r.trim()),
      };

      await actions.createReview(solutionOverview);
      onClose();
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Medium",
        businessValue: "",
        estimatedCost: "",
        estimatedDuration: "",
        stakeholders: "",
        risksAndChallenges: "",
      });
    } catch (error) {
      console.error("Failed to create solution review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Solution Review"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter solution title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select category</option>
              <option value="Data Management">Data Management</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Architecture">Architecture</option>
              <option value="Security">Security</option>
              <option value="Integration">Integration</option>
              <option value="Modernization">Modernization</option>
            </select>
          </div>
        </div>

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          placeholder="Describe the solution"
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <Input
            label="Estimated Cost ($)"
            name="estimatedCost"
            type="number"
            value={formData.estimatedCost}
            onChange={handleInputChange}
            placeholder="0"
          />

          <Input
            label="Estimated Duration"
            name="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={handleInputChange}
            placeholder="e.g., 6 months"
          />
        </div>

        <Textarea
          label="Business Value"
          name="businessValue"
          value={formData.businessValue}
          onChange={handleInputChange}
          placeholder="Describe the business value and benefits"
          rows={2}
        />

        <Textarea
          label="Stakeholders"
          name="stakeholders"
          value={formData.stakeholders}
          onChange={handleInputChange}
          placeholder="Enter stakeholders (one per line)"
          helpText="Enter each stakeholder on a new line"
          rows={3}
        />

        <Textarea
          label="Risks and Challenges"
          name="risksAndChallenges"
          value={formData.risksAndChallenges}
          onChange={handleInputChange}
          placeholder="Enter risks and challenges (one per line)"
          helpText="Enter each risk or challenge on a new line"
          rows={3}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Solution Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
