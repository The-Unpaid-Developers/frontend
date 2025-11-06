import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DropDown } from '../DropDown';

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3', disabled: true },
];

describe('DropDown', () => {
  it('renders with options', () => {
    render(<DropDown options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<DropDown options={mockOptions} />);
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('renders placeholder', () => {
    render(<DropDown options={mockOptions} placeholder="Select option" />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    // Placeholder is a hidden option, check it's in the DOM
    const placeholder = select.querySelector('option[value=""]');
    expect(placeholder).toHaveTextContent('Select option');
  });

  it('renders disabled option', () => {
    render(<DropDown options={mockOptions} />);
    const option = screen.getByRole('option', { name: 'Option 3' });
    expect(option).toBeDisabled();
  });

  it('shows error message', () => {
    render(<DropDown options={mockOptions} error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('shows help text when no error', () => {
    render(<DropDown options={mockOptions} helpText="Choose one" />);
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  it('hides help text when error present', () => {
    render(<DropDown options={mockOptions} error="Invalid" helpText="Help" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('applies error styling', () => {
    render(<DropDown options={mockOptions} error="Invalid" />);
    expect(screen.getByRole('combobox').className).toContain('border-red-300');
  });

  it('uses custom id', () => {
    render(<DropDown options={mockOptions} id="custom-id" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'custom-id');
  });

  it('generates id from label', () => {
    render(<DropDown options={mockOptions} label="Select Option" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'select-option');
  });

  it('applies custom className', () => {
    render(<DropDown options={mockOptions} className="custom-class" />);
    expect(screen.getByRole('combobox').className).toContain('custom-class');
  });

  it('passes through select props', () => {
    render(<DropDown options={mockOptions} required disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('required');
    expect(select).toBeDisabled();
  });

  it('renders with controlled value', () => {
    render(<DropDown options={mockOptions} value="2" />);
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('renders with empty options array', () => {
    render(<DropDown options={[]} placeholder="No options" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<DropDown options={mockOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
