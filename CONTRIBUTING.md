# 🤝 Contributing to SkinScan API

Thank you for your interest in contributing! We're excited to have you help improve this project.

**Version:** 1.0  
**Last Updated:** March 2024

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Code Style & Standards](#code-style--standards)
6. [Testing](#testing)
7. [Commit Messages](#commit-messages)
8. [Pull Requests](#pull-requests)
9. [Issue Reporting](#issue-reporting)
10. [Documentation](#documentation)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards
- **Be respectful** - Treat everyone with courtesy and kindness
- **Be inclusive** - Welcome contributions from everyone
- **Be constructive** - Provide helpful feedback on pull requests
- **Be professional** - Keep discussions focused and productive

### Reporting Violations
If you witness unacceptable behavior, please report it to `conduct@example.com`.

---

## Getting Started

### Prerequisites
- Git knowledge (basic: clone, branch, push, PR)
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.8+ ([Download](https://www.python.org/))
- MongoDB local instance or Atlas account
- A GitHub account

### Quick Setup
```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/skin-scan-api.git
cd skin-scan-api

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/skin-scan-api.git

# 4. Create a feature branch
git checkout -b feature/your-feature-name

# 5. Follow Development Setup below
```

---

## Development Setup

### Backend Environment

**macOS / Linux:**
```bash
cd backend

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Node dependencies
npm install

# Copy environment template and configure
cp ../.env.example .env
nano .env  # Edit with your MongoDB URI, JWT secret, etc.

# Install Python dependencies
pip install -r requirements.txt

# Verify setup
npm run lint
npm test
```

**Windows (PowerShell):**
```bash
cd backend

# Create Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
npm install
pip install -r requirements.txt

# Copy .env
Copy-Item ..\.env.example .env
# Edit .env in your editor
```

### Frontend Environment

```bash
cd frontend/my-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" >> .env.local
```

### Running the Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start
# API running at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/my-app
npm run dev
# Frontend running at http://localhost:3000
```

**Terminal 3 - Run tests (optional):**
```bash
cd backend
npm test -- --watch
```

---

## Making Changes

### Feature Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/user-feedback-system
   # OR for bug fixes:
   git checkout -b fix/prediction-error-handling
   # OR for documentation:
   git checkout -b docs/api-reference
   ```

2. **Keep Branch Updated**
   ```bash
   # Before starting work
   git fetch upstream
   git rebase upstream/main
   
   # Or if already working
   git fetch upstream
   git rebase upstream/main  # or merge if rebase causes issues
   ```

3. **Make Your Changes**
   - Write code following [code style guidelines](#code-style--standards)
   - Add or update tests as needed
   - Update documentation if changing functionality
   - Commit early and often with clear messages

4. **Before Submitting**
   ```bash
   # Lint and format
   npm run lint -- --fix
   npm run format
   
   # Run tests
   npm test
   
   # Type check (if TypeScript)
   npm run type-check
   ```

---

## Code Style & Standards

### Backend (Node.js/JavaScript)

**We use ESLint and Prettier for consistency:**

```bash
# Check code style
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

**Naming Conventions:**
```javascript
// ✅ Good
const getUserHistory = async (userId) => { }
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
class PredictionController { }

// ❌ Bad
const get_user_history = async (userId) => { }
const max_upload_size = 5 * 1024 * 1024;
class prediction_controller { }
```

**Code Organization:**
```javascript
// 1. Imports
const express = require('express');
const mongoose = require('mongoose');

// 2. Constants
const MAX_SIZE = 5000000;

// 3. Middleware/Helper functions
const validateInput = (data) => { }

// 4. Main function/class
const handleRequest = async (req, res) => { }

// 5. Exports
module.exports = handleRequest;
```

**Documentation:**
```javascript
/**
 * Upload image and get skin lesion prediction
 * @param {Object} req - Express request object
 * @param {File} req.file - Uploaded image file
 * @param {Object} req.user - Authenticated user (from JWT)
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.handlePrediction = async (req, res) => {
  // Implementation
}
```

### Frontend (TypeScript/React)

**Naming Conventions:**
```typescript
// ✅ Good
interface UserProfile {
  id: string;
  email: string;
  createdAt: Date;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {}

export const useUserData = () => { }

// ❌ Bad
type user_profile = {
  id: string;
}

const usercard = (props) => {}

export const getUserData = () => {}
```

**Component Structure:**
```typescript
// 1. Imports
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types
interface ComponentProps {
  userId: string;
}

// 3. Component
const UserProfile: React.FC<ComponentProps> = ({ userId }) => {
  const [state, setState] = React.useState('');
  
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return <div>{/* JSX */}</div>;
};

// 4. Exports
export default UserProfile;
```

**TypeScript Best Practices:**
```typescript
// ✅ Good
const fetchPrediction = async (id: string): Promise<Prediction> => {
  const response = await api.get(`/predict/${id}`);
  return response.data;
};

// ❌ Bad
const fetchPrediction = async (id) => {
  const response = await api.get(`/predict/${id}`);
  return response.data; // No type checking
};
```

### Python (ML Model)

**Code Style:**
```python
# ✅ Good
import torch
from PIL import Image

def preprocess_image(image_path: str) -> torch.Tensor:
    """Load and preprocess image for model inference."""
    image = Image.open(image_path).convert('RGB')
    # ... transforms
    return tensor

# ❌ Bad
def preprocess_image(image_path):
    image = Image.open(image_path)
    # Missing documentation, type hints
```

---

## Testing

### Backend Testing

**Write Tests First (TDD):**
```javascript
// tests/predict.test.js
describe('POST /api/predict', () => {
  it('should return Benign for benign image', async () => {
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', 'test-fixtures/benign.jpg');

    expect(response.status).toBe(200);
    expect(response.body.label).toBe('Benign');
    expect(response.body.confidence).toBeGreaterThan(0);
  });

  it('should reject invalid file type', async () => {
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', 'test-fixtures/document.pdf');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('image');
  });
});
```

**Run Tests:**
```bash
# All tests
npm test

# Specific test file
npm test -- auth.test.js

# Watch mode (re-run on changes)
npm test -- --watch

# Coverage report
npm test -- --coverage
```

**Coverage Goals:**
- **Statements:** >80%
- **Branches:** >75%
- **Functions:** >80%
- **Lines:** >80%

### Frontend Testing (Optional for Now)

We welcome frontend tests! Consider:
- Component tests with React Testing Library
- Integration tests with Cypress
- Unit tests for utils/hooks

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import UserCard from '@/components/UserCard';

describe('UserCard', () => {
  it('displays user information', () => {
    const user = { id: '1', email: 'test@example.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
```

---

## Commit Messages

### Commit Message Format

We use **Conventional Commits** for clear, organized history:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add two-factor authentication` |
| `fix` | Bug fix | `fix(predict): handle null image pointer` |
| `docs` | Documentation | `docs(api): update endpoint reference` |
| `style` | Code style (no logic changes) | `style: fix indentation` |
| `refactor` | Code refactoring | `refactor(db): optimize query performance` |
| `perf` | Performance improvements | `perf(model): reduce inference time` |
| `test` | Add/modify tests | `test(auth): add login failure tests` |
| `ci` | CI/CD changes | `ci: add code coverage to GitHub Actions` |
| `chore` | Maintenance, dependencies | `chore: update dependencies` |

### Scope (Optional)

Specify affected component:
- `auth` - Authentication system
- `predict` - Prediction endpoint
- `db` - Database/models
- `api` - API routes
- `frontend` - Frontend code
- `tests` - Test suite
- `docs` - Documentation

### Examples

**Good Commit Messages:**
```bash
git commit -m "feat(predict): add confidence threshold validation"

git commit -m "fix(auth): prevent token leakage in error responses

- Remove sensitive data from 401 responses
- Add explicit error logging
- Update error handling middleware"

git commit -m "docs: add architecture diagram to ARCHITECTURE.md"

git commit -m "test(feedback): add feedback validation tests"

git commit -m "refactor(controller): extract validation logic to utils"
```

**Bad Commit Messages:**
```bash
git commit -m "fixed stuff"         # Too vague
git commit -m "Updated code"        # No context
git commit -m "Fixes #123"          # No description
git commit -m "WIP"                 # Incomplete
```

---

## Pull Requests

### Before Submitting

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run full test suite**
   ```bash
   cd backend
   npm run lint
   npm test
   ```

3. **Update documentation**
   - Add/update README sections if needed
   - Document new environment variables
   - Update API docs if endpoints changed

4. **Review your own changes**
   - Check for debug code (console.log, debugger)
   - Verify no secrets are committed
   - Ensure tests pass locally

### PR Title Format

Follow conventional commits:
```
feat(scope): short description
fix(scope): short description
docs: short description
```

### PR Description Template

```markdown
## Description
Brief explanation of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
Describe how you tested these changes:
- [ ] Added unit tests
- [ ] Added integration tests
- [ ] Manual testing on localhost

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] No new warnings from linter
- [ ] Documentation updated
- [ ] No hardcoded secrets or credentials
```

### What We Look For

✅ **Good PRs:**
- Single, focused change
- Clear description and rationale
- Tests for new functionality
- No breaking changes (or documented)
- Code follows our style guide
- Commits have clear messages

❌ **Issues We May Request Changes For:**
- Multiple unrelated changes
- Missing or inadequate tests
- Hardcoded values that should be env vars
- Poor variable/function names
- Incomplete documentation
- Performance concerns

### Feedback & Iterations

- Be open to feedback
- Respond respectfully to all comments
- Make requested changes in new commits
- Re-request review after updates

---

## Issue Reporting

### Before Creating an Issue

- [ ] Search existing issues (closed and open)
- [ ] Check documentation (README, docs/)
- [ ] Try reproduction steps locally
- [ ] Update to latest version

### Issue Template

```markdown
## Description
Clear, concise description of the issue.

## Steps to Reproduce
1. Step one
2. Step two
3. Expected result
4. Actual result

## Environment
- OS: [Windows/macOS/Linux]
- Node version: v18.x
- npm version: 9.x
- Python version: 3.10
- Browser: [if frontend issue]

## Screenshots/Logs
If applicable, add:
- Error messages
- Console output
- Stack traces
- Screenshots

## Possible Solution
(Optional) Any ideas on fixing this?
```

### Issue Labels

- `bug` - Something isn't working
- `feature` - Feature request
- `documentation` - Docs improvements
- `help wanted` - Open to contributions
- `good first issue` - Great for newcomers
- `question` - Questions/clarifications

---

## Documentation

### Updating Docs

**When to Update:**
- Adding new endpoints or parameters
- Changing default behavior
- Adding new environment variables
- Modifying deployment process

**Files to Update:**
- `README.md` - For user-facing changes
- `docs/API.md` - For endpoint changes
- `docs/SETUP.md` - For setup/install changes
- `docs/DEPLOYMENT.md` - For deploy changes
- `CONTRIBUTING.md` - For contribution process changes
- Code comments - For implementation details

### Documentation Standards

1. **Clarity**
   - Write for both beginners and experts
   - Use concrete examples
   - Avoid jargon or explain it

2. **Completeness**
   - Cover happy path and error cases
   - Include prerequisites
   - Link to related docs

3. **Formatting**
   - Use Markdown headers appropriately
   - Code blocks with language specified
   - Tables for comparative information
   - Lists for steps or options

**Example:**
```markdown
## Updating User Email

### Prerequisites
- User must be authenticated
- New email must not already exist

### Steps

1. Prepare request:
   ```bash
   curl -X PUT http://localhost:5000/api/users/me \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"email": "newemail@example.com"}'
   ```

2. Response (200 OK):
   ```json
   {
     "message": "Email updated successfully",
     "user": {
       "id": "507f1f77bcf86cd799439011",
       "email": "newemail@example.com"
     }
   }
   ```

### Error Handling

If email already exists (400):
```json
{
  "error": "Email already registered"
}
```
```

---

## Getting Help

- **Questions?** Open a GitHub Discussion
- **Found a bug?** Open an Issue
- **Need help setting up?** Check SETUP.md or ask in Discussions
- **Email:** support@example.com

---

## Recognition

Contributors will be recognized in:
- This CONTRIBUTING.md file
- Project README
- GitHub Insights / Contributors page

---

## License

By contributing, you agree that your contributions will be licensed under the ISC License (same as the project).

---

## Thank You! 🙏

Your contributions help make SkinScan better for everyone. Whether it's code, docs, or feedback, we appreciate you!

Happy coding! 🚀
