# Cylio — Official Website

The official website for **Cylio LLC**, a digital agency specializing in web design, development, and brand strategy for modern businesses.

## Quick Start

```bash
# Install dev dependencies
npm install

# Start the local server
npm run dev
```

The site will be available at **http://localhost:3000**.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the local HTTP server on port 3000 |
| `npm run test` | Run Playwright end-to-end tests |
| `npm run audit` | Audit all HTML files for remaining external requests |
| `npm run install-browsers` | Install Chromium for Playwright tests |

The port can be changed via the `PORT` environment variable:

```bash
PORT=8080 npm run dev
```

## Site Structure

### Main Pages

| Page | Path |
|------|------|
| Homepage | `/` |
| Portfolio | `/portfolio/` |
| About Us | `/about-us/` |
| Contact Us | `/contact-us/` |
| Careers | `/careers/` |
| Privacy Policy | `/privacy-policy/` |

### Blog Articles (12)

Blog posts covering web design industry topics and HVAC website design guides.

## Directory Structure

```
.
├── index.html                          # Homepage
├── server.js                           # Node.js static file server
├── package.json                        # Project config and scripts
├── vercel.json                         # Vercel deployment config
├── robots.txt                          # Search engine directives
│
├── about-us/index.html                 # About page
├── contact-us/index.html               # Contact page
├── careers/index.html                  # Careers page
├── portfolio/index.html                # Portfolio page
├── privacy-policy/index.html           # Privacy policy
│
├── assets/
│   ├── css/                            # Stylesheets
│   ├── js/                             # JavaScript files
│   ├── fonts/                          # Self-hosted fonts
│   ├── img/                            # Images
│   └── media/                          # Video/media assets
│
├── scripts/                            # Build/maintenance utilities
├── tests/                              # Playwright E2E tests
└── docs/                               # Project documentation
```

## Deployment

### Vercel (Recommended)

This project deploys as a static site on Vercel with zero build step:

1. Connect the repository to Vercel
2. Framework: Other (static)
3. Build command: (none)
4. Output directory: `.` (root)
5. Deploy

The `vercel.json` file handles routing configuration.

### Local Development

```bash
npm run dev
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Technical Details

- **Server**: Zero-dependency Node.js HTTP server
- **Framework**: Static HTML (no build step required)
- **Fonts**: Playfair Display, Metro Sans (self-hosted)
- **Forms**: Gravity Forms (visual only, requires backend integration for submission)

## Contact

- **Website**: [cylio.io](https://cylio.io)
- **Email**: support@cylio.io
- **Phone**: +1 (718) 781-7927
- **Address**: 1910 Thomes Ave, Cheyenne, WY 82001
