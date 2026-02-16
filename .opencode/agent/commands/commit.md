---
name: commit
description: Create a git commit following Conventional Commits standard with English messages
agent: build
model: anthropic/claude-opus-4-6
---

# Commit Command

## Purpose

This command automates the git commit workflow by:
1. Formatting code with Prettier to ensure consistent style
2. Running lint validation to ensure code quality
3. Running tests to verify code correctness
4. Building the application to verify no breaking changes
5. Showing modified files and letting you select which ones to stage
6. Analyzing changes and generating a Conventional Commits message
7. Creating the commit with your confirmation

## Workflow

The command follows this sequence:
- **Format** → **Lint** → **Test** → **Build** → **List Files** → **User Selects Files** → **Generate Message** → **User Confirms** → **Commit**

All commit messages are generated in **English** following the **Conventional Commits** standard as defined in the project's `AGENTS.md` file.

---

## Instructions for Agent

### Step 1: Format Code with Prettier

Execute the format check command:
```bash
npm run format:check
```

**If format check fails:**
- Display the formatting errors clearly
- Run `npm run format` to auto-fix formatting issues
- Show which files were formatted
- Ask the user if they want to:
  - Continue to lint step
  - Review changes first
  - Abort the commit process

**If format check passes:** Proceed to Step 2.

---

### Step 2: Run Lint Validation

Execute the lint command:
```bash
npm run lint
```

**If lint fails:**
- Display the linting errors clearly
- Ask the user if they want to:
  - Fix the errors and try again
  - Continue anyway (not recommended)
  - Abort the commit process

**If lint passes:** Proceed to Step 3.

---

### Step 3: Run Tests

Execute the test command:
```bash
npm run test:run
```

**If tests fail:**
- Display the test errors clearly
- Ask the user if they want to:
  - Fix the failing tests and try again
  - Continue anyway (not recommended)
  - Abort the commit process

**If tests pass:** Proceed to Step 4.

---

### Step 4: Build the Application

Execute the build command:
```bash
npm run build
```

**If build fails:**
- Display the build errors clearly
- Stop the process and inform the user to fix the errors first
- Do NOT proceed with the commit

**If build succeeds:** Proceed to Step 5.

---

### Step 5: Show Modified Files

Run git status to display all changes:
```bash
git status --short
```

Display the output clearly showing:
- Modified files (M)
- Untracked files (??)
- Deleted files (D)
- Staged files (A, M in staging area)

---

### Step 6: User Selects Files (INTERACTIVE)

**Ask the user which files to add to staging area:**

Present options clearly:
1. List each file with an option to select
2. Provide "Select all" option
3. Provide "Cancel" option

Example prompt:
```
Which files would you like to stage for this commit?

[ ] src/components/Admin/Services/ServiceEditDialog.tsx
[ ] src/actions/service.actions.ts
[ ] README.md

Options:
- Select individual files
- Type "all" to stage all changes
- Type "cancel" to abort
```

**Wait for user input.** Once files are selected, stage them:
```bash
git add <selected-files>
```

---

### Step 7: Analyze Changes and Generate Commit Message

Run git diff on staged changes:
```bash
git diff --cached
```

**Analyze the staged changes and generate a commit message following these rules:**

#### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body - only for complex or multiple changes]
```

#### Commit Message Rules

**Type Selection:**
- `feat`: New feature or functionality
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feat/fix)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Reverting previous changes

**Scope:**
- Derive from the files modified (e.g., `services`, `auth`, `api`, `ui`, `customers`)
- Use singular form
- Keep it concise (1-2 words max)

**Description:**
- Written in English
- Use imperative mood ("add" not "added" or "adds")
- No period at the end
- Max 72 characters
- Be specific and concise

**Body (conditional):**
- Include body ONLY when:
  - Changes are complex and need explanation
  - Multiple unrelated changes in one commit
  - Breaking changes that need documentation
  - Implementation details that aren't obvious from the diff
- If body is needed:
  - Separate from description with blank line
  - Wrap at 72 characters
  - Explain WHAT and WHY, not HOW
  - Use bullet points for multiple changes

**Examples:**

Simple change (title only):
```
fix(services): add vertical scroll to service edit dialog
```

Complex change (title + body):
```
feat(auth): add OAuth2 authentication support

- Implement OAuth2 provider integration
- Add token refresh mechanism
- Update user session handling
- Add migration for oauth_tokens table
```

Multiple changes:
```
chore(deps): update dependencies and fix deprecation warnings

- Upgrade React to v19.2.1
- Update TanStack Query to v5.90
- Fix deprecated useEffect patterns
- Update ESLint configuration
```

---

### Step 8: Present Message and Ask for Confirmation (INTERACTIVE)

**Display the generated commit message clearly:**

```
Proposed commit message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<generated-message-here>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files to be committed:
- file1.ts
- file2.tsx

Do you want to proceed with this commit? (yes/no/edit)
- yes: Create the commit
- no: Cancel the commit
- edit: Modify the commit message
```

**Wait for user response:**
- If **yes**: Proceed to Step 9
- If **no**: Cancel and inform user
- If **edit**: Allow user to provide custom message, then proceed to Step 9

---

### Step 9: Create the Commit

Execute the git commit:
```bash
git commit -m "<commit-message>"
```

If a body was generated:
```bash
git commit -m "<title>" -m "<body>"
```

**Display the commit confirmation:**
```
✓ Commit created successfully!

Commit hash: abc1234
Author: <user-name>
Date: <timestamp>

<commit-message>

Next steps:
- Run 'git push' to push to remote
- Run 'git log' to see commit history
```

---

## Important Notes

- **ALL commit messages MUST be in English** regardless of project language
- Follow the project's `AGENTS.md` guidelines for commit standards
- Ensure code is properly formatted with Prettier before committing
- Ensure lint, tests, and build all pass before allowing commits
- Never commit with format errors (auto-fix with `npm run format`)
- Never commit with lint errors (unless explicitly authorized by user)
- Never commit with failing tests (unless explicitly authorized by user)
- Never commit with build errors
- Use semantic commit types appropriately
- Be concise but descriptive in commit messages
- Only add body when changes are complex or need context

---

## Reference Files

- Project guidelines: `AGENTS.md`
- Conventional Commits: https://www.conventionalcommits.org/
