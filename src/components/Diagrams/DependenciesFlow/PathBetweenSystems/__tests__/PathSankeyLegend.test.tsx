import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PathSankeyLegend from '../PathSankeyLegend';

describe('PathSankeyLegend', () => {
  it('renders both legend sections', () => {
    render(<PathSankeyLegend />);
    
    expect(screen.getByText('Nodes Legend (Criticality)')).toBeInTheDocument();
    expect(screen.getByText('Links Legend (Integration Pattern)')).toBeInTheDocument();
  });

  describe('Nodes Legend', () => {
    it('renders all node legend items', () => {
      render(<PathSankeyLegend />);
      
      expect(screen.getByText('Major')).toBeInTheDocument();
      expect(screen.getByText('Standard-1')).toBeInTheDocument();
      expect(screen.getByText('Standard-2')).toBeInTheDocument();
      // Use getAllByText since "N/A or Other" appears twice (nodes and links)
      const naItems = screen.getAllByText('N/A or Other');
      expect(naItems).toHaveLength(2);
    });

    it('renders node legend colors correctly', () => {
      render(<PathSankeyLegend />);
      
      // Check for specific colors (RGB values)
      expect(document.querySelector('[style*="background-color: rgb(239, 68, 68)"]')).toBeInTheDocument(); // Major - Red
      expect(document.querySelector('[style*="background-color: rgb(245, 158, 11)"]')).toBeInTheDocument(); // Standard-1 - Orange
      expect(document.querySelector('[style*="background-color: rgb(34, 197, 94)"]')).toBeInTheDocument(); // Standard-2 - Green
      expect(document.querySelector('[style*="background-color: rgb(107, 114, 128)"]')).toBeInTheDocument(); // N/A - Gray
    });
  });

  describe('Links Legend', () => {
    it('renders all link legend items', () => {
      render(<PathSankeyLegend />);
      
      expect(screen.getByText('Web Service')).toBeInTheDocument();
      expect(screen.getByText('API')).toBeInTheDocument();
      expect(screen.getByText('Batch')).toBeInTheDocument();
      expect(screen.getByText('File')).toBeInTheDocument();
      // Note: There are two "N/A or Other" items, so getAllByText is appropriate
      const naOrOtherItems = screen.getAllByText('N/A or Other');
      expect(naOrOtherItems).toHaveLength(2);
    });

    it('renders link legend colors correctly', () => {
      render(<PathSankeyLegend />);
      
      // Check for specific colors (RGB values) 
      expect(document.querySelector('[style*="background-color: rgb(31, 119, 180)"]')).toBeInTheDocument(); // Web Service - Blue
      expect(document.querySelector('[style*="background-color: rgb(148, 103, 189)"]')).toBeInTheDocument(); // API - Purple
      expect(document.querySelector('[style*="background-color: rgb(44, 160, 44)"]')).toBeInTheDocument(); // Batch - Green
      expect(document.querySelector('[style*="background-color: rgb(255, 127, 14)"]')).toBeInTheDocument(); // File - Orange
      // Note: There are two gray items (N/A or Other for both nodes and links)
    });
  });

  it('has proper structure and styling', () => {
    render(<PathSankeyLegend />);
    
    const container = document.querySelector('.mt-8.border-t.pt-4');
    expect(container).toBeInTheDocument();
  });

  it('renders headings with correct hierarchy', () => {
    render(<PathSankeyLegend />);
    
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Nodes Legend (Criticality)');
    expect(headings[1]).toHaveTextContent('Links Legend (Integration Pattern)');
  });

  it('renders color indicators with proper dimensions', () => {
    render(<PathSankeyLegend />);
    
    const colorCircles = document.querySelectorAll('.w-4.h-4.rounded-full');
    expect(colorCircles.length).toBe(9); // 4 nodes + 5 links
  });

  it('has proper spacing between sections', () => {
    render(<PathSankeyLegend />);
    
    const nodesSection = document.querySelector('.space-y-2.mb-6');
    expect(nodesSection).toBeInTheDocument();
    
    const linksSection = document.querySelector('.space-y-2:not(.mb-6)');
    expect(linksSection).toBeInTheDocument();
  });

  it('renders all legend items with flex layout', () => {
    const { container } = render(<PathSankeyLegend />);
    
    const flexItems = container.querySelectorAll('.flex.items-center');
    expect(flexItems.length).toBe(9); // 4 nodes + 5 links
  });

  it('renders component without crashing', () => {
    const { container } = render(<PathSankeyLegend />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has accessible text sizes', () => {
    render(<PathSankeyLegend />);
    
    const smallTexts = document.querySelectorAll('.text-sm');
    expect(smallTexts.length).toBe(9); // All legend labels should have text-sm class
  });

  it('renders complete legend with proper count', () => {
    render(<PathSankeyLegend />);
    
    // Verify total number of legend entries
    const legendLabels = [
      'Major', 'Standard-1', 'Standard-2', 'N/A or Other',
      'Web Service', 'API', 'Batch', 'File', 'N/A or Other'
    ];
    
    legendLabels.forEach((label, index) => {
      if (label === 'N/A or Other') {
        // Handle duplicate N/A or Other entries
        expect(screen.getAllByText(label).length).toBeGreaterThan(0);
      } else {
        expect(screen.getByText(label)).toBeInTheDocument();
      }
    });
  });
});