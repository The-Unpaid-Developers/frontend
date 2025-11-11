import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PathsTooltip from '../PathTooltip';

describe('PathsTooltip', () => {
  const defaultProps = {
    visible: true,
    x: 100,
    y: 200,
    content: 'Test tooltip content'
  };

  describe('Visibility', () => {
    it('should render when visible is true', () => {
      render(<PathsTooltip {...defaultProps} />);
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    });

    it('should not render when visible is false', () => {
      render(<PathsTooltip {...defaultProps} visible={false} />);
      expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
    });

    it('should return null when visible is false', () => {
      const { container } = render(<PathsTooltip {...defaultProps} visible={false} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Positioning', () => {
    it('should apply correct position styles', () => {
      const { container } = render(<PathsTooltip {...defaultProps} x={150} y={250} />);
      const tooltip = container.firstChild as HTMLElement;
      
      expect(tooltip).toHaveStyle({
        left: '165px', // x + 15
        top: '222px'   // y - 28
      });
    });

    it('should handle zero coordinates', () => {
      const { container } = render(<PathsTooltip {...defaultProps} x={0} y={0} />);
      const tooltip = container.firstChild as HTMLElement;
      
      expect(tooltip).toHaveStyle({
        left: '15px',   // 0 + 15
        top: '-28px'    // 0 - 28
      });
    });

    it('should handle negative coordinates', () => {
      const { container } = render(<PathsTooltip {...defaultProps} x={-10} y={-5} />);
      const tooltip = container.firstChild as HTMLElement;
      
      expect(tooltip).toHaveStyle({
        left: '5px',    // -10 + 15
        top: '-33px'    // -5 - 28
      });
    });
  });

  describe('Content Rendering', () => {
    it('should render plain text content', () => {
      render(<PathsTooltip {...defaultProps} content="Simple text" />);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('should render HTML content using dangerouslySetInnerHTML', () => {
      const htmlContent = '<strong>Bold text</strong> and <em>italic text</em>';
      render(<PathsTooltip {...defaultProps} content={htmlContent} />);
      
      expect(screen.getByText('Bold text')).toBeInTheDocument();
      expect(screen.getByText('italic text')).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      const { container } = render(<PathsTooltip {...defaultProps} content="" />);
      const tooltip = container.firstChild as HTMLElement;
      const innerDiv = tooltip.firstElementChild as HTMLElement;
      const contentDiv = innerDiv.firstElementChild as HTMLElement;
      expect(contentDiv).toBeInTheDocument();
    });

    it('should handle multi-line HTML content', () => {
      const multiLineContent = 'Line 1<br/>Line 2<br/>Line 3';
      const { container } = render(<PathsTooltip {...defaultProps} content={multiLineContent} />);
      
      const tooltip = container.firstChild as HTMLElement;
      const innerDiv = tooltip.firstElementChild as HTMLElement;
      const contentDiv = innerDiv.firstElementChild as HTMLElement;
      // Browser converts <br/> to <br>, so we need to check for the normalized version
      expect(contentDiv.innerHTML).toBe('Line 1<br>Line 2<br>Line 3');
    });
  });

  describe('Styling', () => {
    it('should have correct CSS classes', () => {
      const { container } = render(<PathsTooltip {...defaultProps} />);
      const tooltip = container.firstChild as HTMLElement;
      const innerDiv = tooltip.firstElementChild as HTMLElement;
      
      expect(tooltip).toHaveClass('fixed', 'z-10', 'pointer-events-none');
      expect(innerDiv).toHaveClass('bg-gray-800', 'text-white', 'text-xs', 'p-2', 'rounded-lg', 'border-0');
    });

    it('should have opacity 1 when visible', () => {
      const { container } = render(<PathsTooltip {...defaultProps} visible={true} />);
      const tooltip = container.firstChild as HTMLElement;
      
      expect(tooltip).toHaveStyle({ opacity: '1' });
    });

    it('should have correct z-index for overlay', () => {
      const { container } = render(<PathsTooltip {...defaultProps} />);
      const tooltip = container.firstChild as HTMLElement;
      
      expect(tooltip).toHaveClass('z-10');
    });

    it('should be non-interactive with pointer-events-none', () => {
      const { container } = render(<PathsTooltip {...defaultProps} />);
      const tooltip = container.firstChild as HTMLElement;
      
      expect(tooltip).toHaveClass('pointer-events-none');
    });
  });

  describe('Edge Cases', () => {
    it('should handle large coordinate values', () => {
      const { container } = render(<PathsTooltip {...defaultProps} x={9999} y={9999} />);
      const tooltip = container.firstChild as HTMLElement;
      
      expect(tooltip).toHaveStyle({
        left: '10014px', // 9999 + 15
        top: '9971px'    // 9999 - 28
      });
    });

    it('should handle special characters in content', () => {
      const specialContent = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const { container } = render(<PathsTooltip {...defaultProps} content={specialContent} />);
      
      // Content should be rendered as-is due to dangerouslySetInnerHTML
      const tooltip = container.firstChild as HTMLElement;
      const innerDiv = tooltip.firstElementChild as HTMLElement;
      const contentDiv = innerDiv.firstElementChild as HTMLElement;
      expect(contentDiv).toHaveProperty('innerHTML', specialContent);
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      render(<PathsTooltip {...defaultProps} content={longContent} />);
      
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });
});