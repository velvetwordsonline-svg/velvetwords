# Contributing to Velvet Words

Thank you for your interest in contributing to Velvet Words! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Git
- Basic knowledge of JavaScript, React, and Node.js

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/velvetwords.git`
3. Install dependencies: `npm run install-all`
4. Set up environment variables (see .env.example files)
5. Start development: `npm run dev`

## 📋 How to Contribute

### Reporting Bugs
1. Check existing issues first
2. Use the bug report template
3. Include steps to reproduce
4. Add screenshots if applicable

### Suggesting Features
1. Check existing feature requests
2. Use the feature request template
3. Explain the use case
4. Consider implementation complexity

### Code Contributions
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Write/update tests if applicable
4. Update documentation
5. Commit with clear messages
6. Push and create a Pull Request

## 🎯 Development Guidelines

### Code Style
- Use ESLint and Prettier configurations
- Follow existing code patterns
- Write meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Use conventional commits format:
```
type(scope): description

feat(backend): add story search functionality
fix(admin): resolve upload progress display
docs(readme): update installation instructions
```

### Pull Request Process
1. Update README.md if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update documentation
5. Request review from maintainers

## 🏗️ Project Structure

```
velvet-words/
├── backend/           # Node.js API server
├── admin/            # Next.js admin dashboard
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

### Backend (`/backend`)
- Express.js server with MongoDB
- RESTful API endpoints
- File upload and processing
- Translation services

### Admin Dashboard (`/admin`)
- Next.js 13+ with App Router
- Tailwind CSS for styling
- React components and hooks
- Authentication and state management

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Admin tests
cd admin && npm test

# All tests
npm test
```

### Writing Tests
- Write unit tests for new functions
- Add integration tests for API endpoints
- Test React components with React Testing Library
- Ensure good test coverage

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document API endpoints
- Update README for new features
- Include examples in documentation

### Documentation Files
- Keep documentation up to date
- Use clear, concise language
- Include code examples
- Add screenshots for UI changes

## 🔧 Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- MongoDB for VS Code
- GitLens

### Useful Commands
```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build

# Seed database
npm run seed

# Lint code
npm run lint

# Format code
npm run format
```

## 🌟 Areas for Contribution

### High Priority
- [ ] User authentication system
- [ ] Reading progress tracking
- [ ] Mobile app development
- [ ] Performance optimizations
- [ ] Additional language support

### Medium Priority
- [ ] Advanced search functionality
- [ ] Social features (comments, ratings)
- [ ] Offline reading capability
- [ ] Analytics dashboard
- [ ] Email notifications

### Low Priority
- [ ] Dark mode theme
- [ ] Accessibility improvements
- [ ] SEO optimizations
- [ ] Additional file format support
- [ ] Integration with external services

## 🐛 Bug Reports

When reporting bugs, please include:
- Operating system and version
- Node.js version
- Browser (if frontend issue)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error logs

## 💡 Feature Requests

For feature requests, please provide:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Any relevant examples or mockups

## 📞 Getting Help

- 📧 Email: dev@velvetwords.com
- 💬 Discussions: GitHub Discussions
- 🐛 Issues: GitHub Issues
- 📖 Docs: Check documentation first

## 🎉 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Invited to the contributors team (for regular contributors)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Velvet Words! 🚀