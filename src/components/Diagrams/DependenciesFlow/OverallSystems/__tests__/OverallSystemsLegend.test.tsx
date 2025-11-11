import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OverallSystemsLegend from '../OverallSystemsLegend';

describe('OverallSystemsLegend', () => {
  it('renders legend title', () => {
    render(<OverallSystemsLegend />);
    expect(screen.getByText('Nodes Legend (Criticality)')).toBeInTheDocument();
  });

  it('renders all legend items', () => {
    render(<OverallSystemsLegend />);
    
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Standard-1')).toBeInTheDocument();
    expect(screen.getByText('Standard-2')).toBeInTheDocument();
    expect(screen.getByText('N/A or Other')).toBeInTheDocument();
  });

  it('renders color indicators for each legend item', () => {
    render(<OverallSystemsLegend />);
    
    // Check that color indicators are rendered with styled backgrounds
    const colorIndicators = document.querySelectorAll('[style*="background-color"]');
    expect(colorIndicators.length).toBe(4);
  });

  it('renders specific colors for each criticality level', () => {
    render(<OverallSystemsLegend />);
    
    // Check for specific colors (RGB values)
    expect(document.querySelector('[style*="background-color: rgb(239, 68, 68)"]')).toBeInTheDocument(); // Major - Red
    expect(document.querySelector('[style*="background-color: rgb(245, 158, 11)"]')).toBeInTheDocument(); // Standard-1 - Orange
    expect(document.querySelector('[style*="background-color: rgb(34, 197, 94)"]')).toBeInTheDocument(); // Standard-2 - Green
    expect(document.querySelector('[style*="background-color: rgb(107, 114, 128)"]')).toBeInTheDocument(); // N/A - Gray
  });

  it('has proper container styling', () => {
    render(<OverallSystemsLegend />);
    
    const container = document.querySelector('.bg-white.rounded-xl.shadow-lg');
    expect(container).toBeInTheDocument();
  });

  it('has proper title styling with border', () => {
    render(<OverallSystemsLegend />);
    
    const title = screen.getByText('Nodes Legend (Criticality)');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'mb-3', 'border-b', 'pb-2');
  });

  it('renders each legend item with proper structure', () => {
    const { container } = render(<OverallSystemsLegend />);
    
    const legendItems = container.querySelectorAll('.flex.items-center');
    expect(legendItems.length).toBe(4);
  });

  it('renders color circles with correct dimensions', () => {
    render(<OverallSystemsLegend />);
    
    const colorCircles = document.querySelectorAll('.w-4.h-4.rounded-full');
    expect(colorCircles.length).toBe(4);
  });

  it('renders component without crashing', () => {
    const { container } = render(<OverallSystemsLegend />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has accessibility-friendly structure', () => {
    render(<OverallSystemsLegend />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Nodes Legend (Criticality)');
  });
});