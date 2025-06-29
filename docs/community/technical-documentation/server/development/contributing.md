# Contributing Guidelines

Welcome to PianoRhythm Server! We appreciate your interest in contributing to our project. This guide outlines the process for contributing code, reporting issues, and collaborating effectively.

## 🤝 Code of Conduct

### Our Commitment
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or identity.

### Expected Behavior
- **Be respectful** in all interactions
- **Be constructive** when providing feedback
- **Be collaborative** and help others learn
- **Be patient** with newcomers and questions

### Unacceptable Behavior
- Harassment, discrimination, or offensive language
- Personal attacks or trolling
- Spam or off-topic discussions
- Sharing private information without consent

## 🐛 Reporting Issues

### Before Reporting
1. **Search existing issues** to avoid duplicates
2. **Check documentation** for known solutions
3. **Test with latest version** if possible
4. **Gather relevant information** (logs, environment, steps to reproduce)

### Issue Template
```markdown
## Bug Report

**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Environment**
- OS: [e.g., Windows 10, Ubuntu 20.04]
- Rust version: [e.g., 1.77.0]
- Server version: [e.g., v0.2.0]

**Additional Context**
Any other relevant information, logs, or screenshots.
```

### Feature Requests
```markdown
## Feature Request

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
Describe your proposed solution.

**Alternatives Considered**
Other approaches you've considered.

**Additional Context**
Any other relevant information or examples.
```

## 🔧 Development Process

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up development environment** (see [Development Setup](./setup.md))
4. **Create a feature branch** from `develop`
5. **Make your changes** following our coding standards
6. **Test thoroughly** (see [Testing Guide](./testing.md))
7. **Submit a pull request**

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical production fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Message Format
```
type(scope): brief description

Detailed explanation of the change, including:
- Why the change was made
- What was changed
- Any breaking changes or migration notes

Closes #123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(websocket): add room password validation

Add password validation for private rooms to ensure only
authorized users can join protected rooms.

- Implement password hashing and verification
- Add validation middleware for room join requests
- Update WebSocket message handling for password errors

Closes #456
```

## 📝 Coding Standards

### Rust Style Guide
We follow the official Rust style guide with these additions:

#### Code Formatting
```bash
# Format code before committing
cargo fmt

# Check formatting
cargo fmt -- --check
```

#### Linting
```bash
# Run clippy for linting
cargo clippy -- -D warnings

# Fix common issues automatically
cargo clippy --fix
```

#### Documentation
```rust
/// Authenticates a user with the provided credentials.
///
/// # Arguments
///
/// * `credentials` - The user's login credentials
/// * `state` - The application state containing database connections
///
/// # Returns
///
/// Returns `Ok(UserSession)` on successful authentication,
/// or `Err(AuthError)` if authentication fails.
///
/// # Examples
///
/// ```rust
/// let credentials = LoginCredentials {
///     username: "user123".to_string(),
///     password: "secure_password".to_string(),
/// };
/// 
/// match authenticate_user(credentials, &state).await {
///     Ok(session) => println!("User authenticated: {}", session.user_id),
///     Err(e) => eprintln!("Authentication failed: {}", e),
/// }
/// ```
pub async fn authenticate_user(
    credentials: LoginCredentials,
    state: &AppState,
) -> Result<UserSession, AuthError> {
    // Implementation
}
```

#### Error Handling
```rust
// Use Result types for fallible operations
pub fn parse_user_id(input: &str) -> Result<UserId, ParseError> {
    input.parse().map_err(ParseError::InvalidFormat)
}

// Use custom error types
#[derive(Debug, thiserror::Error)]
pub enum AuthError {
    #[error("Invalid credentials")]
    InvalidCredentials,
    #[error("User not found: {user_id}")]
    UserNotFound { user_id: String },
    #[error("Database error: {0}")]
    Database(#[from] DatabaseError),
}
```

#### Testing
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_authenticate_user_success() {
        // Arrange
        let credentials = create_valid_credentials();
        let state = create_test_state().await;

        // Act
        let result = authenticate_user(credentials, &state).await;

        // Assert
        assert!(result.is_ok());
        let session = result.unwrap();
        assert_eq!(session.user_id, "expected_user_id");
    }

    #[tokio::test]
    async fn test_authenticate_user_invalid_credentials() {
        // Arrange
        let credentials = create_invalid_credentials();
        let state = create_test_state().await;

        // Act
        let result = authenticate_user(credentials, &state).await;

        // Assert
        assert!(matches!(result, Err(AuthError::InvalidCredentials)));
    }
}
```

### Performance Guidelines
- **Avoid unnecessary allocations** - Use string slices when possible
- **Use appropriate data structures** - HashMap for lookups, Vec for sequences
- **Profile critical paths** - Use benchmarks for performance-sensitive code
- **Minimize database queries** - Batch operations when possible
- **Cache frequently accessed data** - Use Redis for hot data

### Security Guidelines
- **Validate all inputs** - Never trust user input
- **Use parameterized queries** - Prevent SQL injection
- **Hash passwords properly** - Use bcrypt or similar
- **Sanitize outputs** - Prevent XSS attacks
- **Log security events** - Track authentication attempts
- **Follow principle of least privilege** - Minimal required permissions

## 🔍 Pull Request Process

### Before Submitting
1. **Ensure tests pass** - Run full test suite
2. **Update documentation** - Include relevant docs updates
3. **Check code coverage** - Maintain or improve coverage
4. **Verify formatting** - Run `cargo fmt` and `cargo clippy`
5. **Test manually** - Verify changes work as expected

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new warnings introduced

## Related Issues
Closes #123
Related to #456
```

### Review Process
1. **Automated checks** - CI/CD pipeline runs tests and checks
2. **Code review** - Team members review code quality and design
3. **Testing** - Reviewers may test changes locally
4. **Approval** - At least one approval required from maintainers
5. **Merge** - Squash and merge to maintain clean history

### Review Criteria
- **Functionality** - Does the code work as intended?
- **Code Quality** - Is the code clean, readable, and maintainable?
- **Performance** - Are there any performance implications?
- **Security** - Are there any security concerns?
- **Testing** - Is the code adequately tested?
- **Documentation** - Is the code properly documented?

## 🏗️ Architecture Decisions

### Proposing Changes
For significant architectural changes:

1. **Create an RFC** (Request for Comments) issue
2. **Discuss with maintainers** before implementation
3. **Consider backwards compatibility**
4. **Plan migration strategy** if needed
5. **Update architecture documentation**

### RFC Template
```markdown
## RFC: [Title]

**Status:** Draft | Under Review | Accepted | Rejected

### Summary
Brief explanation of the proposed change.

### Motivation
Why is this change needed?

### Detailed Design
Technical details of the proposed solution.

### Alternatives Considered
Other approaches that were considered.

### Migration Strategy
How will existing systems be migrated?

### Unresolved Questions
What questions remain to be resolved?
```

## 🎯 Contribution Areas

### High-Priority Areas
- **Performance optimization** - Improve server performance
- **Test coverage** - Increase test coverage
- **Documentation** - Improve and expand documentation
- **Security** - Enhance security measures
- **Monitoring** - Add better observability

### Good First Issues
Look for issues labeled `good-first-issue` for newcomer-friendly tasks:
- Documentation improvements
- Simple bug fixes
- Test additions
- Code cleanup

### Advanced Contributions
- **New features** - Major functionality additions
- **Architecture improvements** - System design enhancements
- **Performance optimizations** - Critical path improvements
- **Security enhancements** - Security feature additions

## 📞 Getting Help

### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Discord** - Real-time chat with the community
- **Email** - Direct contact with maintainers

### Mentorship
New contributors can request mentorship:
- **Pair programming** sessions
- **Code review** guidance
- **Architecture** discussions
- **Career advice** in open source

## 🏆 Recognition

### Contributor Recognition
- **Contributors list** - All contributors acknowledged
- **Release notes** - Major contributions highlighted
- **Community spotlight** - Featured contributor posts
- **Swag** - Stickers and merchandise for active contributors

### Becoming a Maintainer
Active contributors may be invited to become maintainers:
- **Consistent contributions** over time
- **Code quality** and review skills
- **Community involvement** and helpfulness
- **Technical expertise** in relevant areas

---

Thank you for contributing to PianoRhythm Server! Your contributions help make the platform better for everyone.
