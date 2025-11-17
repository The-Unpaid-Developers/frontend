import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BusinessCapabilitiesLegend from '../BusinessCapabilitiesLegend';

describe('BusinessCapabilitiesLegend', () => {
  it('renders legend title', () => {
    render(<BusinessCapabilitiesLegend />);
    expect(screen.getByText('Legend')).toBeInTheDocument();
  });

  it('renders all legend items', () => {
    render(<BusinessCapabilitiesLegend />);
    
    // Check for all legend items
    expect(screen.getByText('L1 - Level 1 Capability')).toBeInTheDocument();
    expect(screen.getByText('L2 - Level 2 Capability')).toBeInTheDocument();
    expect(screen.getByText('L3 - Level 3 Capability')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Search Match')).toBeInTheDocument();
    expect(screen.getByText('Search Path')).toBeInTheDocument();
  });

  it('renders legend descriptions', () => {
    render(<BusinessCapabilitiesLegend />);
    
    // Check for descriptions
    expect(screen.getByText('Top-level business capabilities')).toBeInTheDocument();
    expect(screen.getByText('Mid-level business capabilities')).toBeInTheDocument();
    expect(screen.getByText('Detailed business capabilities')).toBeInTheDocument();
    expect(screen.getByText('Individual systems')).toBeInTheDocument();
    expect(screen.getByText('Matched search results')).toBeInTheDocument();
    expect(screen.getByText('Path to matched results')).toBeInTheDocument();
  });

  it('renders interactions section', () => {
    render(<BusinessCapabilitiesLegend />);
    
    expect(screen.getByText('Interactions')).toBeInTheDocument();
    expect(screen.getByText('Click nodes to expand/collapse')).toBeInTheDocument();
    expect(screen.getByText('Hover for details')).toBeInTheDocument();
    expect(screen.getByText('Zoom with scroll wheel')).toBeInTheDocument();
    expect(screen.getByText('Pan by dragging background')).toBeInTheDocument();
  });

  it('renders color indicators for each legend item', () => {
    render(<BusinessCapabilitiesLegend />);
    
    // Check that color indicators are rendered (should have colored backgrounds)
    const colorIndicators = document.querySelectorAll('[style*="background-color"]');
    expect(colorIndicators.length).toBe(6); // 6 legend items with colors
  });

  it('has proper styling classes', () => {
    render(<BusinessCapabilitiesLegend />);
    
    const legendContainer = document.querySelector('.bg-white.rounded-xl.shadow-lg');
    expect(legendContainer).toBeInTheDocument();
  });

  it('renders SVG icons for interaction instructions', () => {
    render(<BusinessCapabilitiesLegend />);
    
    const svgIcons = document.querySelectorAll('svg');
    expect(svgIcons.length).toBe(4); // 4 interaction items with SVG icons
  });

  it('renders all expected legend colors', () => {
    render(<BusinessCapabilitiesLegend />);
    
    // Check for specific colors in the style attributes using backgroundColor
    expect(document.querySelector('[style*="background-color: rgb(59, 130, 246)"]')).toBeInTheDocument(); // L1 - Blue
    expect(document.querySelector('[style*="background-color: rgb(16, 185, 129)"]')).toBeInTheDocument(); // L2 - Green  
    expect(document.querySelector('[style*="background-color: rgb(245, 158, 11)"]')).toBeInTheDocument(); // L3 - Orange
    expect(document.querySelector('[style*="background-color: rgb(239, 68, 68)"]')).toBeInTheDocument(); // System - Red
    expect(document.querySelector('[style*="background-color: rgb(251, 191, 36)"]')).toBeInTheDocument(); // Search Match - Yellow
    expect(document.querySelector('[style*="background-color: rgb(251, 146, 60)"]')).toBeInTheDocument(); // Search Path - Orange-ish
  });

  it('has proper accessibility structure', () => {
    render(<BusinessCapabilitiesLegend />);
    
    // Check for heading structure
    const legendTitle = screen.getByRole('heading', { level: 3 });
    expect(legendTitle).toHaveTextContent('Legend');
    
    const interactionsTitle = screen.getByRole('heading', { level: 4 });
    expect(interactionsTitle).toHaveTextContent('Interactions');
  });

  it('renders component without crashing', () => {
    const { container } = render(<BusinessCapabilitiesLegend />);
    expect(container.firstChild).toBeInTheDocument();
  });
});