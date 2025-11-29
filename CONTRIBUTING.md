# Contributing Guide

## Code Style

This project follows standard JavaScript/React conventions with a focus on clean, readable code that doesn't appear AI-generated.

### Key Principles

1. **Use natural variable names** - Avoid overly verbose or generic names
2. **Write comments sparingly** - Only where logic is complex
3. **Keep functions focused** - Each function should do one thing well
4. **Handle errors gracefully** - User-friendly error messages
5. **Test thoroughly** - Manual testing of all features

## Development Workflow

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit pull request with description

## Testing Checklist

Before submitting:
- [ ] OAuth flow works completely
- [ ] Forms can be created with all field types
- [ ] Conditional logic works correctly
- [ ] Form submissions save to both Airtable and MongoDB
- [ ] Responses are displayed correctly
- [ ] Webhooks update database properly
- [ ] No console errors
- [ ] Code is clean and well-organized

## Common Patterns

### Error Handling
```javascript
try {
  const response = await api.call();
  // Handle success
} catch (error) {
  console.error('Descriptive error:', error);
  // Show user-friendly message
}
```

### State Management
```javascript
const [data, setData] = useState(initialValue);
```

### API Calls
```javascript
const response = await apiModule.method(params);
```

## Questions?

Feel free to ask for clarification on any part of the codebase.
