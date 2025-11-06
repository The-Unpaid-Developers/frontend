import { describe, it, expect, vi } from 'vitest';
import { validateMongoQuery, formatQueryJSON, minifyQueryJSON } from '../queryValidation';

describe('queryValidation', () => {
  describe('validateMongoQuery', () => {
    describe('valid queries', () => {
      it('validates a simple valid aggregation pipeline', () => {
        const query = '[{"$match": {"status": "active"}}]';
        const result = validateMongoQuery(query);
        
        expect(result.isValid).toBe(true);
        expect(result.cleanedQuery).toBe(query);
        expect(result.error).toBeUndefined();
      });

      it('validates a multi-stage pipeline', () => {
        const query = '[{"$match": {"type": "user"}}, {"$group": {"_id": "$department", "count": {"$sum": 1}}}]';
        const result = validateMongoQuery(query);
        
        expect(result.isValid).toBe(true);
        expect(result.cleanedQuery).toBe(query);
      });

      it('validates pipeline with complex operators', () => {
        const query = '[{"$project": {"name": 1, "age": 1}}, {"$sort": {"age": -1}}, {"$limit": 10}]';
        const result = validateMongoQuery(query);
        
        expect(result.isValid).toBe(true);
      });

      it('handles queries with whitespace', () => {
        const query = '  [{"$match": {"status": "active"}}]  ';
        const result = validateMongoQuery(query);
        
        expect(result.isValid).toBe(true);
        expect(result.cleanedQuery).toBe('[{"$match": {"status": "active"}}]');
      });

      it('validates lookup operations', () => {
        const query = '[{"$lookup": {"from": "orders", "localField": "_id", "foreignField": "userId", "as": "userOrders"}}]';
        const result = validateMongoQuery(query);
        
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid format', () => {
      it('rejects empty string', () => {
        const result = validateMongoQuery('');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query string cannot be empty');
      });

      it('rejects whitespace-only string', () => {
        const result = validateMongoQuery('   ');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query string cannot be empty');
      });

      it('rejects queries not starting with [', () => {
        const result = validateMongoQuery('{"$match": {"status": "active"}}');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("MongoDB aggregation pipeline must be a JSON array starting with '['");
      });

      it('rejects queries not ending with ]', () => {
        const result = validateMongoQuery('[{"$match": {"status": "active"}}');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("MongoDB aggregation pipeline must end with ']'");
      });

      it('rejects invalid JSON', () => {
        const result = validateMongoQuery('[{"$match": {"status": "active"}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toMatch(/Invalid JSON format/);
      });

      it('rejects non-array JSON', () => {
        const result = validateMongoQuery('{"$match": {"status": "active"}}');

        expect(result.isValid).toBe(false);
        expect(result.error).toBe("MongoDB aggregation pipeline must be a JSON array starting with '['");
      });

      it('rejects valid JSON that is not an array', () => {
        // Mock JSON.parse to return a non-array for coverage
        const originalParse = JSON.parse;
        JSON.parse = vi.fn().mockReturnValueOnce({ key: 'value' });

        const result = validateMongoQuery('[{"$match": {"status": "active"}}]');

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query must be a valid JSON array');

        // Restore original
        JSON.parse = originalParse;
      });

      it('handles non-Error exceptions from JSON.parse', () => {
        // Mock JSON.parse to throw a non-Error object
        const originalParse = JSON.parse;
        JSON.parse = vi.fn().mockImplementationOnce(() => {
          throw 'String error from parser';
        });

        const result = validateMongoQuery('[invalid]');

        expect(result.isValid).toBe(false);
        expect(result.error).toMatch(/Invalid JSON format/);
        expect(result.error).toMatch(/Unknown error/);

        // Restore original
        JSON.parse = originalParse;
      });

      it('rejects empty array', () => {
        const result = validateMongoQuery('[]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Aggregation pipeline cannot be empty');
      });

      it('rejects array with non-object stages', () => {
        const result = validateMongoQuery('[{"$match": {"status": "active"}}, "invalid"]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Pipeline stage 2 must be an object');
      });

      it('rejects array with null stages', () => {
        const result = validateMongoQuery('[{"$match": {"status": "active"}}, null]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Pipeline stage 2 must be an object');
      });

      it('rejects array with array stages', () => {
        const result = validateMongoQuery('[{"$match": {"status": "active"}}, []]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Pipeline stage 2 must be an object');
      });
    });

    describe('forbidden operations', () => {
      it('rejects $out operator with double quotes', () => {
        const result = validateMongoQuery('[{"$out": "collection"}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: $out. Only read operations are allowed.');
      });

      it('rejects $out operator with single quotes', () => {
        const result = validateMongoQuery("[{'$out': 'collection'}]");

        expect(result.isValid).toBe(false);
        // Single quotes make invalid JSON, so it should fail JSON validation first
        expect(result.error).toMatch(/Invalid JSON format/);
      });

      it('rejects $merge operator', () => {
        const result = validateMongoQuery('[{"$merge": {"into": "target"}}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: $merge. Only read operations are allowed.');
      });

      it('rejects $function operator', () => {
        const result = validateMongoQuery('[{"$addFields": {"result": {"$function": {"body": "function(x) { return x * 2; }", "args": ["$value"], "lang": "js"}}}}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: $function. Only read operations are allowed.');
      });

      it('rejects $accumulator operator', () => {
        const result = validateMongoQuery('[{"$group": {"_id": null, "result": {"$accumulator": {"init": "function() { return 0; }", "accumulate": "function(state, value) { return state + value; }", "lang": "js"}}}}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: $accumulator. Only read operations are allowed.');
      });

      it('rejects $where operator', () => {
        const result = validateMongoQuery('[{"$match": {"$where": "this.field > 10"}}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: $where. Only read operations are allowed.');
      });

      it('rejects $eval patterns', () => {
        const result = validateMongoQuery('[{"$eval": "db.collection.find()"}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: $eval. Only read operations are allowed.');
      });

      it('rejects function declarations', () => {
        const result = validateMongoQuery('[{"$addFields": {"code": "function test() { return 1; }"}}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: function declarations. Only read operations are allowed.');
      });

      it('rejects arrow functions', () => {
        const result = validateMongoQuery('[{"$addFields": {"code": "x => x * 2"}}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: arrow functions. Only read operations are allowed.');
      });

      it('is case insensitive for forbidden operators', () => {
        const result = validateMongoQuery('[{"$OUT": "collection"}]');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Query contains forbidden operation: $out. Only read operations are allowed.');
      });
    });
  });

  describe('formatQueryJSON', () => {
    it('formats valid JSON with proper indentation', () => {
      const input = '[{"$match":{"status":"active"}},{"$group":{"_id":"$type","count":{"$sum":1}}}]';
      const result = formatQueryJSON(input);
      
      expect(result).toContain('[\n');
      expect(result).toContain('  {');
      expect(result).toContain('    "$match"');
      expect(result).toContain('\n]');
    });

    it('returns original string for invalid JSON', () => {
      const input = '[{"$match": {"status": "active"}';
      const result = formatQueryJSON(input);
      
      expect(result).toBe(input);
    });

    it('handles empty object', () => {
      const input = '{}';
      const result = formatQueryJSON(input);
      
      expect(result).toBe('{}');
    });

    it('handles empty array', () => {
      const input = '[]';
      const result = formatQueryJSON(input);
      
      expect(result).toBe('[]');
    });

    it('preserves existing formatting if already formatted', () => {
      const input = '[\n  {\n    "$match": {\n      "status": "active"\n    }\n  }\n]';
      const result = formatQueryJSON(input);
      
      // Should be consistently formatted
      expect(result).toMatch(/\[\s*\{\s*"\$match":/);
    });
  });

  describe('minifyQueryJSON', () => {
    it('removes whitespace from formatted JSON', () => {
      const input = '[\n  {\n    "$match": {\n      "status": "active"\n    }\n  }\n]';
      const result = minifyQueryJSON(input);
      
      expect(result).toBe('[{"$match":{"status":"active"}}]');
    });

    it('returns original string for invalid JSON', () => {
      const input = '[{"$match": {"status": "active"}';
      const result = minifyQueryJSON(input);
      
      expect(result).toBe(input);
    });

    it('handles already minified JSON', () => {
      const input = '[{"$match":{"status":"active"}}]';
      const result = minifyQueryJSON(input);
      
      expect(result).toBe(input);
    });

    it('handles empty structures', () => {
      expect(minifyQueryJSON('{}')).toBe('{}');
      expect(minifyQueryJSON('[]')).toBe('[]');
    });

    it('removes all unnecessary whitespace', () => {
      const input = '  [  {  "$match"  :  {  "status"  :  "active"  }  }  ]  ';
      const result = minifyQueryJSON(input);
      
      expect(result).toBe('[{"$match":{"status":"active"}}]');
    });
  });
});