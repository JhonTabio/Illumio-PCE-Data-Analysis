# Illumio PCE Analyzer

A professional web application for analyzing Illumio Policy Compute Engine (PCE) export data. Upload, visualize, filter, and explore relationships between workloads, labels, rulesets, services, IP lists, and label groups with **persistent MongoDB storage** and version tracking.

![Illumio PCE Analyzer](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwindcss) ![MongoDB](https://img.shields.io/badge/MongoDB-6.20-47A248?style=flat-square&logo=mongodb)

## Features

### File Upload & Management

- **Drag-and-drop interface** for easy file uploads
- **Automatic file type detection** for CSV and JSON formats
- **MongoDB storage** with automatic version tracking
- **Persistent data** across sessions
- **Supported file types:**
  - CSV: Workloads, Labels, Services, IP Lists
  - JSON: Rulesets, Label Groups
- **File validation** with visual feedback

### Data Preview

- **Interactive tables** for CSV data with clean column headers
- **Expandable JSON viewer** for ruleset and label group data
- **Pagination indicators** showing data volume
- **Professional monospace formatting** for data display
- **Version information** for each upload

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
- **Database:** MongoDB 6.20
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI primitives
- **Charts:** Recharts 2.15
- **File Parsing:** PapaParse 5.4
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- **MongoDB Atlas account** or local MongoDB instance
- MongoDB connection string

### Installation

1. **Clone or download the project**

# If using git

git clone <repository-url>
cd illumio-pce-analyzer

# Or download and extract the ZIP file

2. **Set up MongoDB**

Create a MongoDB database with the following collections:

- \`workloads\`
- \`labels\`
- \`services\`
- \`ip_lists\`
- \`rulesets\`
- \`label_groups\`

**MongoDB Atlas Setup (Recommended):**

- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Create a database named \`pce_data\`
- Create the 6 collections listed above
- Get your connection string from the "Connect" button

3. **Configure environment variables**

Create a \`.env.local\` file in the root directory:

cp .env.example .env.local

Edit \`.env.local\` and add your MongoDB connection string:

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pce_data

**Important:** Replace \`username\`, \`password\`, and \`cluster\` with your actual MongoDB credentials.

4. **Install dependencies**

**npm install**
or
**yarn install**
or
**pnpm install**

5. **Run the development server**

**npm run dev**
or
**yarn dev**
or
**pnpm dev**

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

npm run build
npm run start

**Note:** Make sure to set the \`MONGODB_URI\` environment variable in your production environment.

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
- Files are automatically uploaded to MongoDB with version tracking
- Each upload creates a new version, preserving historical data

### 2. Preview Data

- Click the **Preview** tab to view uploaded files
- Data is loaded from MongoDB automatically
- Expand cards to see data tables (CSV) or JSON structures
- Review the first 10 rows/entries of each file
- Version information is displayed for each file

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

## Data Storage & Versioning

### MongoDB Collections

Data is stored in MongoDB with the following structure:

**Collection Names:**

- \`workloads\` - Workload data from CSV uploads
- \`labels\` - Label definitions from CSV uploads
- \`services\` - Service definitions from CSV uploads
- \`ip_lists\` - IP list data from CSV uploads
- \`rulesets\` - Ruleset configurations from JSON uploads
- \`label_groups\` - Label group definitions from JSON uploads

**Document Structure:**

Each document contains the original data plus metadata:

{
// Original data fields
"hostname": "web-server-01",
"ip_address": "10.0.1.100",
// ... other fields ...

// Metadata fields (added automatically)
"\_uploadId": "upload_1234567890_abc123",
"\_uploadedAt": "2025-01-08T10:30:00.000Z",
"\_version": 1,
"\_fileName": "workloads.csv"
}

### Version Tracking

- Each upload creates a new version number
- Previous versions are preserved in the database
- You can query specific versions using the API
- Version history helps track changes over time

### API Endpoints

**Upload Data:**

POST /api/upload
Body: { fileType, data, fileName }

**Fetch Data:**
GET /api/data/[collection]?version=1

**Get Versions:**
GET /api/versions

## Project Structure

```
illumio-pce-analyzer/
├── app/
│ ├── api/
│ │ ├── upload/
│ │ │ └── route.ts # Upload API endpoint
│ │ ├── data/
│ │ │ └── [collection]/
│ │ │ └── route.ts # Fetch data API endpoint
│ │ └── versions/
│ │ └── route.ts # Version tracking API
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
│ ├── mongodb.ts # MongoDB connection utility
│ ├── utils.ts # Utility functions
│ └── export-utils.ts # Export functionality
├── .env.example # Environment variable template
├── .env.local # Your local environment variables (create this)
└── package.json # Dependencies and scripts
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "Failed to connect to MongoDB"**

- Verify your \`MONGODB_URI\` in \`.env.local\` is correct
- Check that your IP address is whitelisted in MongoDB Atlas (Network Access)
- Ensure your MongoDB user has read/write permissions
- Test your connection string using MongoDB Compass

**Error: "Database or collection not found"**

- Verify the database name is \`pce_data\`
- Ensure all 6 collections are created in MongoDB
- Check collection names match exactly: \`workloads\`, \`labels\`, \`services\`, \`ip_lists\`, \`rulesets\`, \`label_groups\`

### Files not uploading

- Check browser console for error messages
- Ensure files are in the correct format (CSV or JSON)
- Verify CSV files have proper headers
- Confirm JSON files are valid JSON format
- Check MongoDB connection is active

### Data not loading

- Verify MongoDB connection string is set correctly
- Check that data was successfully uploaded (check MongoDB Atlas dashboard)
- Look for error messages in the browser console
- Ensure the API routes are accessible

## Environment Variables

| Variable        | Description               | Required |
| --------------- | ------------------------- | -------- |
| \`MONGODB_URI\` | MongoDB connection string | Yes      |

**Example:**
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pce_data

## Security Notes

- Never commit \`.env.local\` to version control
- Keep your MongoDB credentials secure
- Use MongoDB Atlas IP whitelisting for additional security
- Consider using MongoDB user roles with minimal required permissions
- In production, use environment variables provided by your hosting platform

## License

This project is provided as-is for analyzing Illumio PCE export data.

## Support

For issues or questions, please refer to the Illumio PCE documentation or contact your Illumio administrator.
