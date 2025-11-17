import { describe, it, expect } from 'vitest';
import type { Node, Link, Metadata, SankeyData } from '../diagrams';
import type { Lookup, LookupWOData, UploadLookup } from '../lookup';
import type { Query } from '../query';

describe('Type Definitions', () => {
  describe('Diagram Types', () => {
    describe('Node interface', () => {
      it('should accept all required properties', () => {
        const node: Node = {
          id: 'test-node-1',
          name: 'Test Node',
          type: 'service',
          criticality: 'high'
        };

        expect(node.id).toBe('test-node-1');
        expect(node.name).toBe('Test Node');
        expect(node.type).toBe('service');
        expect(node.criticality).toBe('high');
      });

      it('should accept optional url property', () => {
        const nodeWithUrl: Node = {
          id: 'test-node-2',
          name: 'Test Node with URL',
          type: 'database',
          criticality: 'medium',
          url: 'https://example.com'
        };

        expect(nodeWithUrl.url).toBe('https://example.com');
      });

      it('should work without optional url property', () => {
        const nodeWithoutUrl: Node = {
          id: 'test-node-3',
          name: 'Test Node without URL',
          type: 'api',
          criticality: 'low'
        };

        expect(nodeWithoutUrl.url).toBeUndefined();
      });
    });

    describe('Link interface', () => {
      it('should accept all required properties', () => {
        const link: Link = {
          source: 'node-1',
          target: 'node-2',
          pattern: 'sync',
          frequency: 'high',
          role: 'producer'
        };

        expect(link.source).toBe('node-1');
        expect(link.target).toBe('node-2');
        expect(link.pattern).toBe('sync');
        expect(link.frequency).toBe('high');
        expect(link.role).toBe('producer');
      });

      it('should accept optional value property', () => {
        const linkWithValue: Link = {
          source: 'node-a',
          target: 'node-b',
          pattern: 'async',
          frequency: 'medium',
          role: 'consumer',
          value: 100
        };

        expect(linkWithValue.value).toBe(100);
      });

      it('should work without optional value property', () => {
        const linkWithoutValue: Link = {
          source: 'node-x',
          target: 'node-y',
          pattern: 'batch',
          frequency: 'low',
          role: 'processor'
        };

        expect(linkWithoutValue.value).toBeUndefined();
      });
    });

    describe('Metadata interface', () => {
      it('should accept all required properties', () => {
        const metadata: Metadata = {
          code: 'TEST-001',
          review: 'Test Review',
          integrationMiddleware: ['kafka', 'redis'],
          generatedDate: '2024-01-01'
        };

        expect(metadata.code).toBe('TEST-001');
        expect(metadata.review).toBe('Test Review');
        expect(metadata.integrationMiddleware).toEqual(['kafka', 'redis']);
        expect(metadata.generatedDate).toBe('2024-01-01');
      });

      it('should accept empty integrationMiddleware array', () => {
        const metadata: Metadata = {
          code: 'TEST-002',
          review: 'Empty Middleware Review',
          integrationMiddleware: [],
          generatedDate: '2024-01-02'
        };

        expect(metadata.integrationMiddleware).toEqual([]);
      });
    });

    describe('SankeyData interface', () => {
      it('should accept complete sankey data structure', () => {
        const sankeyData: SankeyData = {
          nodes: [
            { id: '1', name: 'Node 1', type: 'service', criticality: 'high' },
            { id: '2', name: 'Node 2', type: 'database', criticality: 'medium' }
          ],
          links: [
            { source: '1', target: '2', pattern: 'sync', frequency: 'high', role: 'producer' }
          ],
          metadata: {
            code: 'SANKEY-001',
            review: 'Test Sankey',
            integrationMiddleware: ['rest'],
            generatedDate: '2024-01-01'
          }
        };

        expect(sankeyData.nodes).toHaveLength(2);
        expect(sankeyData.links).toHaveLength(1);
        expect(sankeyData.metadata.code).toBe('SANKEY-001');
      });

      it('should accept empty nodes and links arrays', () => {
        const emptySankeyData: SankeyData = {
          nodes: [],
          links: [],
          metadata: {
            code: 'EMPTY-001',
            review: 'Empty Sankey',
            integrationMiddleware: [],
            generatedDate: '2024-01-01'
          }
        };

        expect(emptySankeyData.nodes).toEqual([]);
        expect(emptySankeyData.links).toEqual([]);
      });
    });
  });

  describe('Lookup Types', () => {
    describe('Lookup interface', () => {
      it('should accept complete lookup structure', () => {
        const lookup: Lookup = {
          id: 'lookup-123',
          lookupName: 'Test Lookup',
          data: [
            { key: 'value1', description: 'First item' },
            { key: 'value2', description: 'Second item' }
          ],
          uploadedAt: '2024-01-01T10:00:00Z',
          recordCount: 2,
          description: 'A test lookup table',
          fieldDescriptions: {
            key: 'The lookup key',
            description: 'The item description'
          }
        };

        expect(lookup.id).toBe('lookup-123');
        expect(lookup.lookupName).toBe('Test Lookup');
        expect(lookup.data).toHaveLength(2);
        expect(lookup.recordCount).toBe(2);
        expect(lookup.fieldDescriptions.key).toBe('The lookup key');
      });

      it('should accept empty data array', () => {
        const emptyLookup: Lookup = {
          id: 'empty-lookup',
          lookupName: 'Empty Lookup',
          data: [],
          uploadedAt: '2024-01-01T10:00:00Z',
          recordCount: 0,
          description: 'An empty lookup table',
          fieldDescriptions: {}
        };

        expect(emptyLookup.data).toEqual([]);
        expect(emptyLookup.recordCount).toBe(0);
        expect(emptyLookup.fieldDescriptions).toEqual({});
      });
    });

    describe('LookupWOData interface', () => {
      it('should accept lookup without data field', () => {
        const lookupWOData: LookupWOData = {
          id: 'lookup-456',
          lookupName: 'Lookup Without Data',
          uploadedAt: '2024-01-02T10:00:00Z',
          recordCount: 100,
          description: 'A lookup without data field'
        };

        expect(lookupWOData.id).toBe('lookup-456');
        expect(lookupWOData.lookupName).toBe('Lookup Without Data');
        expect(lookupWOData.recordCount).toBe(100);
        expect('data' in lookupWOData).toBe(false);
      });
    });

    describe('UploadLookup interface', () => {
      it('should accept upload lookup structure', () => {
        const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
        
        const uploadLookup: UploadLookup = {
          lookupName: 'Upload Test Lookup',
          description: 'A lookup for testing upload',
          lookupFile: mockFile
        };

        expect(uploadLookup.lookupName).toBe('Upload Test Lookup');
        expect(uploadLookup.description).toBe('A lookup for testing upload');
        expect(uploadLookup.lookupFile).toBe(mockFile);
      });
    });
  });

  describe('Query Types', () => {
    describe('Query interface', () => {
      it('should accept complete query structure', () => {
        const query: Query = {
          name: 'Test Query',
          mongoQuery: '{ "field": "value" }',
          description: 'A test MongoDB query'
        };

        expect(query.name).toBe('Test Query');
        expect(query.mongoQuery).toBe('{ "field": "value" }');
        expect(query.description).toBe('A test MongoDB query');
      });

      it('should accept complex MongoDB query strings', () => {
        const complexQuery: Query = {
          name: 'Complex Query',
          mongoQuery: '{ "$and": [{ "status": "active" }, { "count": { "$gte": 10 } }] }',
          description: 'A complex MongoDB query with operators'
        };

        expect(complexQuery.mongoQuery).toContain('$and');
        expect(complexQuery.mongoQuery).toContain('$gte');
      });

      it('should accept empty strings', () => {
        const emptyQuery: Query = {
          name: '',
          mongoQuery: '',
          description: ''
        };

        expect(emptyQuery.name).toBe('');
        expect(emptyQuery.mongoQuery).toBe('');
        expect(emptyQuery.description).toBe('');
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should allow Node arrays in SankeyData', () => {
      const nodes: Node[] = [
        { id: '1', name: 'Service A', type: 'service', criticality: 'high' },
        { id: '2', name: 'Service B', type: 'service', criticality: 'low', url: 'http://service-b' }
      ];

      const sankeyData: SankeyData = {
        nodes,
        links: [],
        metadata: {
          code: 'COMPAT-001',
          review: 'Compatibility Test',
          integrationMiddleware: [],
          generatedDate: '2024-01-01'
        }
      };

      expect(sankeyData.nodes).toBe(nodes);
      expect(sankeyData.nodes).toHaveLength(2);
    });

    it('should allow Link arrays in SankeyData', () => {
      const links: Link[] = [
        { source: 'a', target: 'b', pattern: 'sync', frequency: 'high', role: 'producer' },
        { source: 'b', target: 'c', pattern: 'async', frequency: 'low', role: 'consumer', value: 50 }
      ];

      const sankeyData: SankeyData = {
        nodes: [],
        links,
        metadata: {
          code: 'COMPAT-002',
          review: 'Link Compatibility Test',
          integrationMiddleware: ['http'],
          generatedDate: '2024-01-01'
        }
      };

      expect(sankeyData.links).toBe(links);
      expect(sankeyData.links).toHaveLength(2);
    });

    it('should allow Record<string, string> arrays in Lookup data', () => {
      const data: Record<string, string>[] = [
        { id: '1', name: 'Item 1', category: 'A' },
        { id: '2', name: 'Item 2', category: 'B' }
      ];

      const lookup: Lookup = {
        id: 'compat-lookup',
        lookupName: 'Compatibility Lookup',
        data,
        uploadedAt: '2024-01-01T10:00:00Z',
        recordCount: data.length,
        description: 'Testing data compatibility',
        fieldDescriptions: { id: 'ID', name: 'Name', category: 'Category' }
      };

      expect(lookup.data).toBe(data);
      expect(lookup.recordCount).toBe(2);
    });
  });
});