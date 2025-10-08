# Illumio PCE Analyzer

A professional web application for analyzing Illumio Policy Compute Engine (PCE) export data. Upload, visualize, filter, and explore relationships between workloads, labels, rulesets, services, IP lists, and label groups.

![Illumio PCE Analyzer](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwindcss)

## Features

### File Upload & Management

- **Drag-and-drop interface** for easy file uploads
- **Automatic file type detection** for CSV and JSON formats
- **Supported file types:**
  - CSV: Workloads, Labels, Services, IP Lists
  - JSON: Rulesets, Label Groups
- **File validation** with visual feedback

### Data Preview

- **Interactive tables** for CSV data with clean column headers
- **Expandable JSON viewer** for ruleset and label group data
- **Pagination indicators** showing data volume
- **Professional monospace formatting** for data display

### Analysis & Filtering Tools

- **Dynamic workload filtering** by:
  - Enforcement Mode (Full, Selective, Idle, Visibility Only)
  - VEN Status (Active, Stopped, Suspended)
  - Environment (Production, Development, Testing, etc.)
- **Real-time search** across all workload fields
- **Interactive charts:**
  - Workload distribution by environment (bar chart)
  - Top services used in rulesets (bar chart)
- **Filtered results table** with instant updates

### Data Relationships

- **Clickable workloads** showing:
  - Workload properties (hostname, IP, OS, enforcement mode)
  - Associated labels (role, app, env, loc)
  - Related rulesets
- **Clickable rulesets** displaying:
  - Ruleset properties (name, enabled status, scope)
  - Consumer/provider traffic flows
  - Resolved workload relationships
  - Detailed rule information

### Export Functionality

- **Export filtered workload results** as CSV or JSON
- **Export chart data** for external reporting
- **Automatic file downloads** with proper naming

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI primitives
- **Charts:** Recharts 2.15
- **File Parsing:** PapaParse 5.4
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Clone or download the project**

\`\`\`bash

# If using git

git clone <repository-url>
cd illumio-pce-analyzer

# Or download and extract the ZIP file

\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install

# or

yarn install

# or

pnpm install
\`\`\`

3. **Run the development server**

\`\`\`bash
npm run dev

# or

yarn dev

# or

pnpm dev
\`\`\`

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

\`\`\`bash

# Build the application

npm run build

# Start the production server

npm run start
\`\`\`

## Usage Guide

### 1. Upload Files

- Click the **Upload** tab in the sidebar
- Drag and drop files or click to browse
- Upload your Illumio PCE export files:
  - **workloads.csv** - Workload inventory
  - **labels.csv** - Label definitions
  - **services.csv** - Service definitions
  - **ip_lists.csv** - IP list definitions
  - **rulesets.json** - Ruleset configurations
  - **label_groups.json** - Label group definitions

### 2. Preview Data

- Click the **Preview** tab to view uploaded files
- Expand cards to see data tables (CSV) or JSON structures
- Review the first 10 rows/entries of each file

### 3. Analyze & Filter

- Click the **Analysis** tab to access filtering tools
- Use dropdown filters to narrow down workloads:
  - Filter by enforcement mode
  - Filter by VEN status
  - Filter by environment
- Use the search box to find specific workloads
- View interactive charts showing data distribution
- Click on workloads in the results table to see details

### 4. Explore Relationships

- In the Analysis view, click any workload row to open details
- View associated labels and related rulesets
- Click on rulesets to see consumer/provider relationships
- Explore traffic flows and rule configurations

### 5. Export Results

- After filtering workloads, click **Export CSV** or **Export JSON**
- Export chart data using the chart export buttons
- Files download automatically to your default download folder

## File Format Requirements

### CSV Files

All CSV files should have headers in the first row. Expected columns:

**workloads.csv:**
\`\`\`csv
hostname,ip_address,os_type,enforcement_mode,ven_status,environment,role,app,location
\`\`\`

**labels.csv:**
\`\`\`csv
key,value,description
\`\`\`

**services.csv:**
\`\`\`csv
name,port,protocol,description
\`\`\`

**ip_lists.csv:**
\`\`\`csv
name,ip_ranges,description
\`\`\`

## Project Structure

\`\`\`
illumio-pce-analyzer/
├── app/
│ ├── layout.tsx # Root layout with fonts
│ ├── page.tsx # Main application page
│ └── globals.css # Global styles and theme
├── components/
│ ├── sidebar.tsx # Navigation sidebar
│ ├── file-upload.tsx # File upload component
│ ├── file-list.tsx # Uploaded files list
│ ├── data-preview.tsx # Data preview tables
│ ├── analysis-view.tsx # Analysis and filtering
│ ├── workload-details.tsx # Workload detail modal
│ ├── ruleset-details.tsx # Ruleset detail modal
│ └── ui/ # Reusable UI components
├── lib/
│ ├── utils.ts # Utility functions
│ └── export-utils.ts # Export functionality
└── package.json # Dependencies and scripts
\`\`\`

## Troubleshooting

### Files not uploading

- Ensure files are in the correct format (CSV or JSON)
- Check that CSV files have proper headers
- Verify JSON files are valid JSON format

### Charts not displaying

- Ensure workloads.csv and rulesets.json are uploaded
- Check that data contains the required fields (environment, services)

### Relationships not showing

- Upload all related files (workloads, labels, rulesets)
- Ensure label references in rulesets match labels in workloads
