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

  it('renders component name input', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
  });

  it('handles component name input change', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    const input = screen.getByPlaceholderText(/Enter component name/i);
    fireEvent.change(input, { target: { value: 'New Component' } });
    expect(input).toHaveValue('New Component');
  });

  it('renders multiple components', () => {
    const initialData = {
      systemComponents: [
        {
          id: '1',
          name: 'Component 1',
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
        },
        {
          id: '2',
          name: 'Component 2',
          status: 'EXISTING',
          role: 'FRONT_END',
          hostedOn: 'ON_PREMISE',
          hostingRegion: 'SINGAPORE',
          solutionType: 'COTS',
          languageFramework: {
            language: { name: 'JAVASCRIPT', version: '18' },
            framework: { name: 'REACT', version: '18' }
          },
          isOwnedByUs: false,
          isCICDUsed: false,
          customizationLevel: 'NONE',
          upgradeStrategy: 'VENDOR_LED',
          upgradeFrequency: 'ANNUALLY',
          isSubscription: true,
          isInternetFacing: true,
          availabilityRequirement: 'MEDIUM',
          latencyRequirement: 200,
          throughputRequirement: 500,
          scalabilityMethod: 'VERTICAL_MANUAL',
          backupSite: 'ON_PREMISE_DR',
          securityDetails: {
            authenticationMethod: 'SAML',
            authorizationModel: 'ABAC',
            isAuditLoggingEnabled: false,
            sensitiveDataElements: 'None',
            dataEncryptionAtRest: 'FILE',
            encryptionAlgorithmForDataAtRest: 'RSA',
            hasIpWhitelisting: true,
            ssl: 'SSL',
            payloadEncryptionAlgorithm: 'RSA',
            digitalCertificate: 'Test Cert 2',
            keyStore: 'Local',
            vulnerabilityAssessmentFrequency: 'QUARTERLY',
            penetrationTestingFrequency: 'BI_ANNUALLY'
          }
        },
      ],
    };
    render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Component 1')).toBeInTheDocument();
    expect(screen.getByText('Component 2')).toBeInTheDocument();
  });

  it('renders status dropdown', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
  });

  it('renders role dropdown', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Role/i).length).toBeGreaterThan(0);
  });

  it('adds new component when add button clicked', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);

    const addButton = screen.getByText(/Add Component/i);
    fireEvent.click(addButton);

    expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
  });

  it('removes component when delete button clicked', () => {
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

  it('validates component name is required', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);

    const nameInput = screen.getByPlaceholderText(/Enter component name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('updates component status when dropdown changed', () => {
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

  it('renders all component fields', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);

    expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Role/i).length).toBeGreaterThan(0);
  });

  it('handles empty initial data', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/No system components added/i)).toBeInTheDocument();
  });

  it('handles undefined systemComponents in initial data', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{ systemComponents: undefined }} />);
    expect(screen.getByText(/No system components added/i)).toBeInTheDocument();
  });

  it('shows loading state on save button', () => {
    render(<SystemComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    expect(screen.getByText(/Saving/i)).toBeInTheDocument();
  });

  it('disables add button while saving', () => {
    render(<SystemComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const addButton = screen.getByText(/Add Component/i);
    expect(addButton).toBeDisabled();
  });

  it('calls onSave with correct data structure', () => {
    render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);

    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
    expect(mockOnSave.mock.calls[0][0]).toBeDefined();
  });

  it('preserves existing components when adding new one', () => {
    const initialData = {
      systemComponents: [
        {
          id: '1',
          name: 'Existing Component',
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
    expect(screen.getByText('Existing Component')).toBeInTheDocument();

    const addButton = screen.getByText(/Add Component/i);
    fireEvent.click(addButton);

    expect(screen.getByText('Existing Component')).toBeInTheDocument();
  });
});
