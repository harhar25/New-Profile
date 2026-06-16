# Available Commands

All commands should be run from the project directory: `c:\Users\HarHar\Documents\GitHub\New-Profile`

## Development Commands

### Start Development Server
```bash
npm run dev
```
- Starts the local development server
- Visit: http://localhost:3000
- Hot reload enabled (changes reflect immediately)
- Access admin at: http://localhost:3000/admin

### Build for Production
```bash
npm run build
```
- Creates an optimized production build
- Generates `.next` folder
- Note: May require specific platform support for Turbopack

### Start Production Server
```bash
npm start
```
- Runs the production-built application
- Must run `npm run build` first

## Code Quality

### Check for Linting Issues
```bash
npm run lint
```
- Runs ESLint on the codebase
- Helps catch bugs and style issues

## Package Management

### Install Dependencies
```bash
npm install
```
- Installs all required packages from package.json
- Creates node_modules folder

### Install Specific Package
```bash
npm install package-name
```
Example:
```bash
npm install lucide-react  # Already installed
npm install axios         # To add HTTP client
```

### Update Dependencies
```bash
npm update
```
- Updates all packages to latest compatible versions

## Common Development Tasks

### Clear Cache
```bash
# Remove .next folder
rm -r .next    # Or delete manually on Windows

# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### View Installed Packages
```bash
npm list
```

### Check npm Version
```bash
npm --version
node --version
```

## Project-Specific Navigation

### Open in VS Code
```bash
code .
```
- Opens the current directory in VS Code

### View Project Structure
```bash
tree /F /A    # Windows PowerShell
# Or use VS Code file explorer
```

## Environment Setup

### Create Environment File
```bash
cp .env.example .env.local
```
- Copy example to create your local environment file
- Edit as needed (currently not required)

## Deployment Commands

### Deploy to Vercel
```bash
# Make sure you have Vercel CLI installed
npm install -g vercel

# Deploy
vercel
```

### Generate Build Report
```bash
npm run build -- --analyze
```
- Shows bundle size analysis (if analyzer installed)

## Troubleshooting Commands

### Clear npm Cache
```bash
npm cache clean --force
```

### Verify Installation
```bash
npm run dev
# If it works, everything is installed correctly
```

## Important Notes

- Always run commands from project root directory
- Use `npm run dev` for development (not `next dev`)
- Use `npm run build` for production builds (not `next build`)
- Data is stored in browser localStorage by default

## Quick Start Command Chain

```bash
# 1. Navigate to project
cd "c:\Users\HarHar\Documents\GitHub\New-Profile"

# 2. Install dependencies (if needed)
npm install

# 3. Start development server
npm run dev

# 4. Open browser and go to:
# http://localhost:3000

# 5. Click Admin button to access dashboard
# http://localhost:3000/admin
```

## Additional Resources

- Next.js CLI: https://nextjs.org/docs/app/api-reference/next-cli
- npm Commands: https://docs.npmjs.com/cli/v8/commands
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs/
