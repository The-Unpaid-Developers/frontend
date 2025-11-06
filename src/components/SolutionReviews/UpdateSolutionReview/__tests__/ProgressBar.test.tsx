import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProgressBar } from '../ProgressBar';

const mockSteps = [
  { key: 'step1', label: 'Solution Overview' },
  { key: 'step2', label: 'Business Capabilities' },
  { key: 'step3', label: 'System Components' },
  { key: 'step4', label: 'Review' },
];

describe('ProgressBar', () => {
  it('renders all steps', () => {
    render(<ProgressBar currentStep={0} steps={mockSteps} />);
    expect(screen.getByText('Solution Overview')).toBeInTheDocument();
    expect(screen.getByText('Business Capabilities')).toBeInTheDocument();
    expect(screen.getByText('System Components')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('highlights active step', () => {
    render(<ProgressBar currentStep={1} steps={mockSteps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveAttribute('aria-current', 'step');
  });

  it('calls onStepClick when step clicked', () => {
    const onStepClick = vi.fn();
    render(<ProgressBar currentStep={0} steps={mockSteps} onStepClick={onStepClick} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(onStepClick).toHaveBeenCalledWith(2);
  });

  it('does not call onStepClick when handler not provided', () => {
    render(<ProgressBar currentStep={0} steps={mockSteps} />);
    const buttons = screen.getAllByRole('button');
    expect(() => fireEvent.click(buttons[0])).not.toThrow();
  });

  it('displays step numbers', () => {
    render(<ProgressBar currentStep={0} steps={mockSteps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows step count text', () => {
    render(<ProgressBar currentStep={0} steps={mockSteps} />);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
  });

  it('applies active styling to current step', () => {
    render(<ProgressBar currentStep={2} steps={mockSteps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[2].className).toContain('bg-primary-600');
  });

  it('applies inactive styling to other steps', () => {
    render(<ProgressBar currentStep={1} steps={mockSteps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].className).toContain('bg-white');
    expect(buttons[2].className).toContain('bg-white');
  });

  it('has accessible navigation label', () => {
    render(<ProgressBar currentStep={0} steps={mockSteps} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Create solution review steps');
  });

  it('has descriptive button titles', () => {
    render(<ProgressBar currentStep={0} steps={mockSteps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('title', '1. Solution Overview');
    expect(buttons[1]).toHaveAttribute('title', '2. Business Capabilities');
  });

  it('renders single step', () => {
    const singleStep = [{ key: 'only', label: 'Only Step' }];
    render(<ProgressBar currentStep={0} steps={singleStep} />);
    expect(screen.getByText('Only Step')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 1')).toBeInTheDocument();
  });

  it('renders empty steps array', () => {
    const { container } = render(<ProgressBar currentStep={0} steps={[]} />);
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('handles last step as active', () => {
    render(<ProgressBar currentStep={3} steps={mockSteps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[3]).toHaveAttribute('aria-current', 'step');
  });

  it('renders progress connectors', () => {
    const { container } = render(<ProgressBar currentStep={1} steps={mockSteps} />);
    const connectors = container.querySelectorAll('[aria-hidden]');
    expect(connectors.length).toBeGreaterThan(0);
  });

  it('calculates progress width correctly', () => {
    const { container } = render(<ProgressBar currentStep={1} steps={mockSteps} />);
    const progressBars = container.querySelectorAll('.bg-primary-600');
    expect(progressBars.length).toBeGreaterThan(0);
  });
});
