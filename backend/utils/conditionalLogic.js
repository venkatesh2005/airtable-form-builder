/**
 * Pure function to evaluate conditional logic rules
 * @param {Object|null} rules - Conditional rules object with logic and conditions
 * @param {Object} answersSoFar - Current form answers
 * @returns {boolean} - Whether the question should be shown
 */
function shouldShowQuestion(rules, answersSoFar) {
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

/**
 * Evaluate a single condition
 * @param {Object} condition - Single condition with questionKey, operator, and value
 * @param {Object} answersSoFar - Current form answers
 * @returns {boolean} - Whether condition is met
 */
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

/**
 * Validate form submission data against form definition
 * @param {Object} formDefinition - Form schema with questions
 * @param {Object} answers - User's submitted answers
 * @returns {Object} - Validation result with isValid and errors
 */
function validateFormSubmission(formDefinition, answers) {
  const errors = {};
  let isValid = true;
  
  formDefinition.questions.forEach(question => {
    // Check if question should be shown based on conditional logic
    const shouldShow = shouldShowQuestion(question.conditionalRules, answers);
    
    if (!shouldShow) {
      // Skip validation for hidden questions
      return;
    }
    
    const answer = answers[question.questionKey];
    
    // Check required fields
    if (question.required) {
      if (answer === undefined || answer === null || answer === '') {
        errors[question.questionKey] = `${question.label} is required`;
        isValid = false;
        return;
      }
      
      // Check empty arrays for multi-select
      if (Array.isArray(answer) && answer.length === 0) {
        errors[question.questionKey] = `${question.label} is required`;
        isValid = false;
        return;
      }
    }
    
    // Validate field types
    if (answer !== undefined && answer !== null && answer !== '') {
      switch (question.type) {
        case 'singleSelect':
          if (question.options && !question.options.includes(answer)) {
            errors[question.questionKey] = `Invalid option for ${question.label}`;
            isValid = false;
          }
          break;
          
        case 'multipleSelects':
          if (!Array.isArray(answer)) {
            errors[question.questionKey] = `${question.label} must be an array`;
            isValid = false;
          } else if (question.options) {
            const invalidOptions = answer.filter(opt => !question.options.includes(opt));
            if (invalidOptions.length > 0) {
              errors[question.questionKey] = `Invalid options for ${question.label}: ${invalidOptions.join(', ')}`;
              isValid = false;
            }
          }
          break;
          
        case 'multipleAttachments':
          if (!Array.isArray(answer)) {
            errors[question.questionKey] = `${question.label} must be an array`;
            isValid = false;
          }
          break;
      }
    }
  });
  
  return { isValid, errors };
}

module.exports = {
  shouldShowQuestion,
  evaluateCondition,
  validateFormSubmission
};
