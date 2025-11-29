export function shouldShowQuestion(rules, answersSoFar) {
  // If no rules, always show the question
  if (!rules || !rules.conditions || rules.conditions.length === 0) {
    return true;
  }
  
  const { logic, conditions } = rules;
  
  // Evaluate each condition
  const results = conditions.map(condition => {
    return evaluateCondition(condition, answersSoFar);
  });
  
  // Combine results based on logic operator
  if (logic === 'AND') {
    return results.every(result => result === true);
  } else if (logic === 'OR') {
    return results.some(result => result === true);
  }
  
  // Default to true if logic is invalid
  return true;
}

function evaluateCondition(condition, answersSoFar) {
  const { questionKey, operator, value } = condition;
  
  // Get the current answer for this question
  const currentAnswer = answersSoFar[questionKey];
  
  // Handle missing values
  if (currentAnswer === undefined || currentAnswer === null || currentAnswer === '') {
    return false;
  }
  
  switch (operator) {
    case 'equals':
      return compareEquals(currentAnswer, value);
      
    case 'notEquals':
      return !compareEquals(currentAnswer, value);
      
    case 'contains':
      return compareContains(currentAnswer, value);
      
    default:
      return false;
  }
}

/**
 * Compare two values for equality
 * Handles arrays for multi-select fields
 */
function compareEquals(currentAnswer, expectedValue) {
  // Handle array comparison for multi-select
  if (Array.isArray(currentAnswer)) {
    if (Array.isArray(expectedValue)) {
      // Compare arrays
      return currentAnswer.length === expectedValue.length &&
        currentAnswer.every(item => expectedValue.includes(item));
    } else {
      // Check if array contains the single value
      return currentAnswer.includes(expectedValue);
    }
  }
  
  // Simple equality check
  return String(currentAnswer).toLowerCase() === String(expectedValue).toLowerCase();
}

/**
 * Check if current answer contains the expected value
 * Works for strings and arrays
 */
function compareContains(currentAnswer, expectedValue) {
  if (Array.isArray(currentAnswer)) {
    // For arrays, check if any element contains the value
    return currentAnswer.some(item => 
      String(item).toLowerCase().includes(String(expectedValue).toLowerCase())
    );
  }
  
  // For strings, check if it contains the substring
  return String(currentAnswer).toLowerCase().includes(String(expectedValue).toLowerCase());
}
