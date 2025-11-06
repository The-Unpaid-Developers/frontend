import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input, Textarea } from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('shows help text when no error', () => {
    render(<Input label="Email" helpText="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('hides help text when error present', () => {
    render(<Input label="Email" error="Invalid" helpText="Help" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('applies error styling', () => {
    render(<Input label="Email" error="Invalid" />);
    const input = screen.getByLabelText('Email');
    expect(input.className).toContain('border-red-300');
  });

  it('uses custom id when provided', () => {
    render(<Input label="Email" id="custom-id" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'custom-id');
  });

  it('generates id from label', () => {
    render(<Input label="First Name" />);
    expect(screen.getByLabelText('First Name')).toHaveAttribute('id', 'first-name');
  });

  it('applies custom className', () => {
    render(<Input label="Email" className="custom-class" />);
    expect(screen.getByLabelText('Email').className).toContain('custom-class');
  });

  it('passes through input props', () => {
    render(<Input label="Email" type="email" required />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('required');
  });
});

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Textarea label="Description" error="Too short" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('shows help text when no error', () => {
    render(<Textarea label="Description" helpText="Enter details" />);
    expect(screen.getByText('Enter details')).toBeInTheDocument();
  });

  it('hides help text when error present', () => {
    render(<Textarea label="Description" error="Invalid" helpText="Help" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('applies error styling', () => {
    render(<Textarea label="Description" error="Invalid" />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea.className).toContain('border-red-300');
  });

  it('uses custom id when provided', () => {
    render(<Textarea label="Description" id="custom-id" />);
    expect(screen.getByLabelText('Description')).toHaveAttribute('id', 'custom-id');
  });

  it('generates id from label', () => {
    render(<Textarea label="User Message" />);
    expect(screen.getByLabelText('User Message')).toHaveAttribute('id', 'user-message');
  });

  it('applies custom className', () => {
    render(<Textarea label="Description" className="custom-class" />);
    expect(screen.getByLabelText('Description').className).toContain('custom-class');
  });

  it('passes through textarea props', () => {
    render(<Textarea label="Description" required maxLength={100} />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('required');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  it('has default rows attribute', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '4');
  });
});
