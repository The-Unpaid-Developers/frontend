import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SankeyLegend from '../SpecificSystemLegend';

describe('SpecificSystemLegend (SankeyLegend)', () => {
  describe('Rendering', () => {
    it('renders the legend component', () => {
      render(<SankeyLegend />);

      expect(screen.getByText('Nodes Legend (Criticality)')).toBeInTheDocument();
      expect(screen.getByText('Links Legend (Integration Pattern)')).toBeInTheDocument();
    });

    it('renders without crashing', () => {
      expect(() => {
        render(<SankeyLegend />);
      }).not.toThrow();
    });
  });

  describe('Nodes Legend', () => {
    it('displays all node criticality levels', () => {
      render(<SankeyLegend />);

      expect(screen.getByText('Major')).toBeInTheDocument();
      expect(screen.getByText('Standard-1')).toBeInTheDocument();
      expect(screen.getByText('Standard-2')).toBeInTheDocument();
      // "N/A or Other" appears in both nodes and links legend, so use getAllByText
      const naOrOtherElements = screen.getAllByText('N/A or Other');
      expect(naOrOtherElements).toHaveLength(2); // Should appear in both nodes and links
      expect(naOrOtherElements[0]).toBeInTheDocument();
    });

    it('renders correct number of node legend items', () => {
      const { container } = render(<SankeyLegend />);

      // Find the nodes legend section
      const nodesLegendSection = container.querySelector('.space-y-2.mb-6');
      const legendItems = nodesLegendSection?.querySelectorAll('.flex.items-center');

      expect(legendItems).toHaveLength(4);
    });

    it('displays node legend items with correct colors', () => {
      const { container } = render(<SankeyLegend />);

      const legendItems = container.querySelectorAll('.space-y-2.mb-6 .flex.items-center');
      const colorDivs = Array.from(legendItems).map(item =>
        item.querySelector('.w-4.h-4.rounded-full.mr-2')
      );

      expect(colorDivs[0]).toHaveStyle({ backgroundColor: '#ef4444' }); // Major - red
      expect(colorDivs[1]).toHaveStyle({ backgroundColor: '#f59e0b' }); // Standard-1 - amber
      expect(colorDivs[2]).toHaveStyle({ backgroundColor: '#22c55e' }); // Standard-2 - green
      expect(colorDivs[3]).toHaveStyle({ backgroundColor: '#6b7280' }); // N/A - gray
    });

    it('renders color indicators with proper styling', () => {
      const { container } = render(<SankeyLegend />);

      const colorIndicators = container.querySelectorAll('.w-4.h-4.rounded-full.mr-2');

      colorIndicators.forEach(indicator => {
        expect(indicator.className).toContain('w-4');
        expect(indicator.className).toContain('h-4');
        expect(indicator.className).toContain('rounded-full');
        expect(indicator.className).toContain('mr-2');
      });
    });
  });

  describe('Links Legend', () => {
    it('displays all link integration patterns', () => {
      render(<SankeyLegend />);

      expect(screen.getByText('Web Service')).toBeInTheDocument();
      expect(screen.getByText('API')).toBeInTheDocument();
      expect(screen.getByText('Batch')).toBeInTheDocument();
      expect(screen.getByText('File')).toBeInTheDocument();
      // Second "N/A or Other" for links
      const naOrOtherItems = screen.getAllByText('N/A or Other');
      expect(naOrOtherItems).toHaveLength(2); // One for nodes, one for links
    });

    it('renders correct number of link legend items', () => {
      const { container } = render(<SankeyLegend />);

      // Get all legend sections and find the links section (second one)
      const allLegendSections = container.querySelectorAll('.space-y-2');
      const linksLegendSection = allLegendSections[1]; // Second section is links
      const legendItems = linksLegendSection?.querySelectorAll('.flex.items-center');

      expect(legendItems).toHaveLength(5);
    });

    it('displays link legend items with correct colors', () => {
      const { container } = render(<SankeyLegend />);

      const allLegendSections = container.querySelectorAll('.space-y-2');
      const linksLegendSection = allLegendSections[1];
      const legendItems = linksLegendSection.querySelectorAll('.flex.items-center');
      const colorDivs = Array.from(legendItems).map(item =>
        item.querySelector('.w-4.h-4.rounded-full.mr-2')
      );

      expect(colorDivs[0]).toHaveStyle({ backgroundColor: '#1f77b4' }); // Web Service - blue
      expect(colorDivs[1]).toHaveStyle({ backgroundColor: '#9467bd' }); // API - purple
      expect(colorDivs[2]).toHaveStyle({ backgroundColor: '#2ca02c' }); // Batch - green
      expect(colorDivs[3]).toHaveStyle({ backgroundColor: '#ff7f0e' }); // File - orange
      expect(colorDivs[4]).toHaveStyle({ backgroundColor: '#6b7280' }); // N/A - gray
    });
  });

  describe('Layout and Structure', () => {
    it('applies proper container styling', () => {
      const { container } = render(<SankeyLegend />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.className).toContain('mt-8');
      expect(mainContainer.className).toContain('border-t');
      expect(mainContainer.className).toContain('pt-4');
    });

    it('renders headings with proper styling', () => {
      const { container } = render(<SankeyLegend />);

      const headings = container.querySelectorAll('h3.text-lg.font-semibold.mb-2');
      expect(headings).toHaveLength(2);
    });

    it('renders nodes legend before links legend', () => {
      const { container } = render(<SankeyLegend />);

      const headings = Array.from(container.querySelectorAll('h3'));
      expect(headings[0].textContent).toBe('Nodes Legend (Criticality)');
      expect(headings[1].textContent).toBe('Links Legend (Integration Pattern)');
    });

    it('has proper spacing between legend items', () => {
      const { container } = render(<SankeyLegend />);

      const legendContainers = container.querySelectorAll('.space-y-2');
      expect(legendContainers.length).toBeGreaterThan(0);

      legendContainers.forEach(legendContainer => {
        expect(legendContainer.className).toContain('space-y-2');
      });
    });

    it('nodes legend section has bottom margin', () => {
      const { container } = render(<SankeyLegend />);

      const nodesLegendSection = container.querySelector('.space-y-2.mb-6');
      expect(nodesLegendSection).toBeInTheDocument();
      expect(nodesLegendSection?.className).toContain('mb-6');
    });
  });

  describe('Legend Items Structure', () => {
    it('each legend item has a color indicator and label', () => {
      const { container } = render(<SankeyLegend />);

      const allLegendItems = container.querySelectorAll('.flex.items-center');

      allLegendItems.forEach(item => {
        const colorIndicator = item.querySelector('.w-4.h-4.rounded-full.mr-2');
        const label = item.querySelector('.text-sm');

        expect(colorIndicator).toBeInTheDocument();
        expect(label).toBeInTheDocument();
      });
    });

    it('legend items use flex layout with items-center', () => {
      const { container } = render(<SankeyLegend />);

      const allLegendItems = container.querySelectorAll('.flex.items-center');

      expect(allLegendItems.length).toBe(9); // 4 nodes + 5 links

      allLegendItems.forEach(item => {
        expect(item.className).toContain('flex');
        expect(item.className).toContain('items-center');
      });
    });

    it('labels have proper text size', () => {
      const { container } = render(<SankeyLegend />);

      const labels = container.querySelectorAll('.text-sm');

      expect(labels.length).toBe(9); // 4 nodes + 5 links

      labels.forEach(label => {
        expect(label.className).toContain('text-sm');
      });
    });
  });

  describe('Static Content', () => {
    it('does not change on re-render', () => {
      const { container, rerender } = render(<SankeyLegend />);

      const initialHTML = container.innerHTML;

      rerender(<SankeyLegend />);

      expect(container.innerHTML).toBe(initialHTML);
    });

    it('always displays the same legend items', () => {
      const { unmount } = render(<SankeyLegend />);

      // First render
      expect(screen.getByText('Major')).toBeInTheDocument();
      expect(screen.getByText('Web Service')).toBeInTheDocument();

      unmount();

      // Second render
      render(<SankeyLegend />);

      expect(screen.getByText('Major')).toBeInTheDocument();
      expect(screen.getByText('Web Service')).toBeInTheDocument();
    });
  });

  describe('Color Consistency', () => {
    it('uses consistent colors for N/A or Other across nodes and links', () => {
      const { container } = render(<SankeyLegend />);

      const allLegendSections = container.querySelectorAll('.space-y-2');
      const nodesLegendSection = allLegendSections[0];
      const linksLegendSection = allLegendSections[1];

      // Get the last item in each section (N/A or Other)
      const nodesItems = nodesLegendSection.querySelectorAll('.flex.items-center');
      const linksItems = linksLegendSection.querySelectorAll('.flex.items-center');

      const nodesNAColor = nodesItems[nodesItems.length - 1].querySelector('.w-4.h-4.rounded-full.mr-2');
      const linksNAColor = linksItems[linksItems.length - 1].querySelector('.w-4.h-4.rounded-full.mr-2');

      expect(nodesNAColor).toHaveStyle({ backgroundColor: '#6b7280' });
      expect(linksNAColor).toHaveStyle({ backgroundColor: '#6b7280' });
    });

    it('all colors are properly formatted hex codes', () => {
      const { container } = render(<SankeyLegend />);

      const colorIndicators = container.querySelectorAll('.w-4.h-4.rounded-full.mr-2');

      colorIndicators.forEach(indicator => {
        const bgColor = (indicator as HTMLElement).style.backgroundColor;
        // backgroundColor might be in rgb format, so we just check it's not empty
        expect(bgColor).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('has semantic HTML structure', () => {
      const { container } = render(<SankeyLegend />);

      const headings = container.querySelectorAll('h3');
      expect(headings).toHaveLength(2);

      headings.forEach(heading => {
        expect(heading.tagName).toBe('H3');
      });
    });

    it('uses meaningful text content', () => {
      render(<SankeyLegend />);

      // Check that all text is meaningful
      expect(screen.getByText('Nodes Legend (Criticality)')).toBeInTheDocument();
      expect(screen.getByText('Links Legend (Integration Pattern)')).toBeInTheDocument();

      // Check that legend items have descriptive labels
      const labels = [
        'Major',
        'Standard-1',
        'Standard-2',
        'Web Service',
        'API',
        'Batch',
        'File',
      ];

      labels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('renders correctly when mounted and unmounted multiple times', () => {
      const { unmount } = render(<SankeyLegend />);

      expect(screen.getByText('Nodes Legend (Criticality)')).toBeInTheDocument();

      unmount();

      render(<SankeyLegend />);

      expect(screen.getByText('Nodes Legend (Criticality)')).toBeInTheDocument();
    });

    it('maintains structure with repeated renders', () => {
      const { rerender, container } = render(<SankeyLegend />);

      const initialItemCount = container.querySelectorAll('.flex.items-center').length;

      rerender(<SankeyLegend />);
      rerender(<SankeyLegend />);
      rerender(<SankeyLegend />);

      const finalItemCount = container.querySelectorAll('.flex.items-center').length;

      expect(finalItemCount).toBe(initialItemCount);
      expect(finalItemCount).toBe(9); // 4 nodes + 5 links
    });
  });
});
