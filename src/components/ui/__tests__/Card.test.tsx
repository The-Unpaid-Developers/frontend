import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies base classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-gray-200');
    expect(card).toHaveClass('shadow-sm');
  });

  it('applies default medium padding', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('p-6');
  });

  it('applies no padding when padding="none"', () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).not.toHaveClass('p-4');
    expect(card).not.toHaveClass('p-6');
    expect(card).not.toHaveClass('p-8');
  });

  it('applies small padding when padding="sm"', () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('p-4');
  });

  it('applies large padding when padding="lg"', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('p-8');
  });

  it('applies hover classes when hover=true', () => {
    const { container } = render(<Card hover>Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('hover:shadow-md');
    expect(card).toHaveClass('transition-shadow');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('does not apply hover classes by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).not.toHaveClass('hover:shadow-md');
    expect(card).not.toHaveClass('cursor-pointer');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('custom-class');
  });

  it('combines all props correctly', () => {
    const { container } = render(
      <Card padding="sm" hover className="custom-class">
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('p-4');
    expect(card).toHaveClass('hover:shadow-md');
    expect(card).toHaveClass('custom-class');
  });

  it('renders complex children correctly', () => {
    render(
      <Card>
        <div>Child 1</div>
        <div>Child 2</div>
        <button>Click me</button>
      </Card>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header Content</CardHeader>);

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies default margin bottom class', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;

    expect(header).toHaveClass('mb-4');
  });

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;

    expect(header).toHaveClass('custom-header');
    expect(header).toHaveClass('mb-4');
  });
});

describe('CardTitle', () => {
  it('renders children correctly', () => {
    render(<CardTitle>Title Text</CardTitle>);

    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('renders as h3 element', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.querySelector('h3');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Title');
  });

  it('applies default title classes', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild as HTMLElement;

    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('text-gray-900');
  });

  it('applies custom className', () => {
    const { container } = render(<CardTitle className="custom-title">Title</CardTitle>);
    const title = container.firstChild as HTMLElement;

    expect(title).toHaveClass('custom-title');
    expect(title).toHaveClass('text-lg');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(<CardContent>Content Text</CardContent>);

    expect(screen.getByText('Content Text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>);
    const content = container.firstChild as HTMLElement;

    expect(content).toHaveClass('custom-content');
  });

  it('renders complex children', () => {
    render(
      <CardContent>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </CardContent>
    );

    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer Content</CardFooter>);

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies default footer classes', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;

    expect(footer).toHaveClass('mt-4');
    expect(footer).toHaveClass('pt-4');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-gray-200');
  });

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;

    expect(footer).toHaveClass('custom-footer');
    expect(footer).toHaveClass('mt-4');
  });

  it('renders buttons correctly', () => {
    render(
      <CardFooter>
        <button>Cancel</button>
        <button>Submit</button>
      </CardFooter>
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});

describe('Card - Integration', () => {
  it('renders full card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the card content.</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('This is the card content.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders card with header and content only', () => {
    render(
      <Card hover padding="lg">
        <CardHeader>
          <CardTitle>Simple Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content without footer</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Simple Card')).toBeInTheDocument();
    expect(screen.getByText('Content without footer')).toBeInTheDocument();
  });

  it('renders card with custom styling on all parts', () => {
    const { container } = render(
      <Card className="w-full" padding="none" hover>
        <CardHeader className="bg-blue-100">
          <CardTitle className="text-blue-900">Styled Card</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p>Custom styled content</p>
        </CardContent>
        <CardFooter className="bg-gray-50">
          <button>Custom Footer</button>
        </CardFooter>
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('w-full');
    expect(card).toHaveClass('hover:shadow-md');

    expect(screen.getByText('Styled Card')).toBeInTheDocument();
    expect(screen.getByText('Custom styled content')).toBeInTheDocument();
  });
});
