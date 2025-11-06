import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SystemComponentStep from '../SystemComponentStep';

vi.mock('../../../../../hooks/useTechComponents', () => ({
  useTechComponents: () => ({
    data: {
      productOptions: [{ label: 'Product1', value: 'Product1' }],
      getVersionOptionsForProduct: () => [{ label: 'v1.0', value: 'v1.0' }],
    },
    loading: false,
    error: null,
  }),
}));

describe('SystemComponentStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/System Components/i).length).toBeGreaterThan(0);
  });

  it('renders add button', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Add Component/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('renders with initial data', () => {
    const initialData = {
      systemComponents: [
        {
          id: '1',
          name: 'Test Component',
          status: 'NEW',
          role: 'BACK_END',
          hostedOn: 'CLOUD',
          hostingRegion: 'SINGAPORE',
          solutionType: 'BESPOKE',
          languageFramework: {
            language: { name: 'JAVA', version: '11' },
            framework: { name: 'SPRING_BOOT', version: '2.7' }
          },
          isOwnedByUs: true,
          isCICDUsed: true,
          customizationLevel: 'MINOR',
          upgradeStrategy: 'INTERNAL_LED',
          upgradeFrequency: 'QUARTERLY',
          isSubscription: false,
          isInternetFacing: false,
          availabilityRequirement: 'HIGH',
          latencyRequirement: 100,
          throughputRequirement: 1000,
          scalabilityMethod: 'HORIZONTAL_AUTO',
          backupSite: 'CLOUD_MULTI_AZ',
          securityDetails: {
            authenticationMethod: 'OAuth2',
            authorizationModel: 'RBAC',
            isAuditLoggingEnabled: true,
            sensitiveDataElements: 'PII',
            dataEncryptionAtRest: 'DATABASE',
            encryptionAlgorithmForDataAtRest: 'AES-256',
            hasIpWhitelisting: false,
            ssl: 'TLS',
            payloadEncryptionAlgorithm: 'AES-GCM',
            digitalCertificate: 'Test Cert',
            keyStore: 'AWS KMS',
            vulnerabilityAssessmentFrequency: 'MONTHLY',
            penetrationTestingFrequency: 'ANNUALLY'
          }
        }
      ],
    };
    render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('shows isSaving state', () => {
    render(<SystemComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('displays empty state initially', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/No system components added/i)).toBeInTheDocument();
  });
});
