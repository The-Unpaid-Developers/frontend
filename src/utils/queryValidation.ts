/**
 * Utility functions for validating and cleaning MongoDB aggregation pipeline queries
 */

export interface QueryValidationResult {
  isValid: boolean;
  error?: string;
  cleanedQuery?: string;
}

/**
 * Validates that a MongoDB aggregation pipeline query is read-only and properly formatted.
 * Based on the validation logic from core-service's QueryService.
 *
 * @param queryString The MongoDB aggregation pipeline string to validate
 * @returns A validation result object
 */
export const validateMongoQuery = (queryString: string): QueryValidationResult => {
  if (!queryString || queryString.trim().length === 0) {
    return {
      isValid: false,
      error: "Query string cannot be empty",
    };
  }

  const trimmedQuery = queryString.trim();

  // Validate that it's a JSON array format
  if (!trimmedQuery.startsWith("[")) {
    return {
      isValid: false,
      error: "MongoDB aggregation pipeline must be a JSON array starting with '['",
    };
  }

  if (!trimmedQuery.endsWith("]")) {
    return {
      isValid: false,
      error: "MongoDB aggregation pipeline must end with ']'",
    };
  }

  // Validate JSON format
  try {
    const parsed = JSON.parse(trimmedQuery);
    
    if (!Array.isArray(parsed)) {
      return {
        isValid: false,
        error: "Query must be a valid JSON array",
      };
    }

    if (parsed.length === 0) {
      return {
        isValid: false,
        error: "Aggregation pipeline cannot be empty",
      };
    }

    // Validate each stage is an object
    for (let i = 0; i < parsed.length; i++) {
      if (typeof parsed[i] !== 'object' || parsed[i] === null || Array.isArray(parsed[i])) {
        return {
          isValid: false,
          error: `Pipeline stage ${i + 1} must be an object`,
        };
      }
    }
  } catch (e) {
    return {
      isValid: false,
      error: `Invalid JSON format: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }

  // Check for forbidden operators (write operations and code execution)
  const lowerQuery = queryString.toLowerCase();

  const forbiddenOperators = [
    // Write operations (CRITICAL)
    { pattern: '"$out"', name: '$out' },
    { pattern: "'$out'", name: '$out' },
    { pattern: '"$merge"', name: '$merge' },
    { pattern: "'$merge'", name: '$merge' },

    // JavaScript execution (CRITICAL - allows arbitrary code)
    { pattern: '"$function"', name: '$function' },
    { pattern: "'$function'", name: '$function' },
    { pattern: '"$accumulator"', name: '$accumulator' },
    { pattern: "'$accumulator'", name: '$accumulator' },
    { pattern: '"$where"', name: '$where' },
    { pattern: "'$where'", name: '$where' },

    // Generic code execution patterns
    { pattern: '$eval', name: '$eval' },
    { pattern: 'function(', name: 'function declarations' },
    { pattern: 'function ', name: 'function declarations' },
    { pattern: '=>', name: 'arrow functions' },
  ];

  for (const forbidden of forbiddenOperators) {
    if (lowerQuery.includes(forbidden.pattern.toLowerCase())) {
      return {
        isValid: false,
        error: `Query contains forbidden operation: ${forbidden.name}. Only read operations are allowed.`,
      };
    }
  }

  // If all validations pass, return the cleaned query
  return {
    isValid: true,
    cleanedQuery: trimmedQuery,
  };
};

/**
 * Formats a JSON string with proper indentation for better readability
 *
 * @param jsonString The JSON string to format
 * @returns Formatted JSON string or original if parsing fails
 */
export const formatQueryJSON = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonString;
  }
};

/**
 * Minifies a JSON string by removing whitespace
 *
 * @param jsonString The JSON string to minify
 * @returns Minified JSON string or original if parsing fails
 */
export const minifyQueryJSON = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch {
    return jsonString;
  }
};
