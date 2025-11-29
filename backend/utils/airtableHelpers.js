/**
 * Format Airtable error messages for user display
 */
function formatAirtableError(error) {
  if (error.response?.data?.error) {
    const airtableError = error.response.data.error;
    
    if (airtableError.type === 'INVALID_REQUEST_BODY') {
      return 'Invalid data format. Please check your form fields.';
    }
    
    if (airtableError.type === 'INVALID_VALUE_FOR_COLUMN') {
      return `Invalid value: ${airtableError.message}`;
    }
    
    if (airtableError.type === 'NOT_FOUND') {
      return 'The requested Airtable resource was not found.';
    }
    
    if (airtableError.type === 'UNAUTHORIZED') {
      return 'Airtable authentication failed. Please log in again.';
    }
    
    return airtableError.message || 'Airtable request failed';
  }
  
  return error.message || 'Unknown error occurred';
}

/**
 * Map Airtable field types to our internal types
 */
function mapAirtableFieldType(airtableType) {
  const typeMap = {
    'singleLineText': 'singleLineText',
    'multilineText': 'multilineText',
    'singleSelect': 'singleSelect',
    'multipleSelects': 'multipleSelects',
    'multipleAttachments': 'multipleAttachments'
  };
  
  return typeMap[airtableType] || null;
}

/**
 * Check if field type is supported
 */
function isSupportedFieldType(fieldType) {
  const supportedTypes = [
    'singleLineText',
    'multilineText',
    'singleSelect',
    'multipleSelects',
    'multipleAttachments'
  ];
  
  return supportedTypes.includes(fieldType);
}

module.exports = {
  formatAirtableError,
  mapAirtableFieldType,
  isSupportedFieldType
};
