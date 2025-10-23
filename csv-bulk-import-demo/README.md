# CSV Bulk Import Demo for Job Board

A complete, production-ready CSV bulk import system for job boards with AI categorization, web scraping, and comprehensive validation.

## Features

- **Drag & Drop CSV Upload** - Easy-to-use interface for uploading job listings
- **AI-Powered Categorization** - Automatically categorizes jobs using OpenAI GPT
- **Web Scraping** - Extracts company logos and hero banners from job URLs
- **Duplicate Detection** - Prevents importing the same job twice
- **Data Validation** - Comprehensive validation with clear error messages
- **Preview Mode** - Review data before importing
- **Batch Processing** - Handles large CSV files efficiently
- **Import Summary** - Detailed reports of successful and failed imports
- **Error Reporting** - Download error reports for debugging

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5 Turbo
- **Scraping**: Axios + Cheerio (Crawl4AI-inspired)
- **CSV Parsing**: PapaParse

## Setup Instructions

### 1. Install Dependencies

```bash
cd csv-bulk-import-demo
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Get your Supabase URL and keys from Project Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI for AI categorization
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## CSV Template Format

Your CSV file should have the following columns:

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| Job Title | Yes | The job position title | "Senior Software Engineer" |
| Company Name | Yes | Company hiring | "Tech Corp Pte Ltd" |
| Location | Yes | Job location | "Singapore" |
| Salary Range | No | Salary information | "$5000-$8000" or "Competitive" |
| Job Description | Yes | Full job description | "We are looking for..." |
| Apply Link | Yes | URL to original job posting | "https://linkedin.com/jobs/123" |
| Source | Yes | Where job was found | "LinkedIn", "JobStreet", "CareerFuture SG", or "Other" |
| Industry/Category | No | Job category (auto-categorized if empty) | "Software Development" |

### Valid Sources
- JobStreet
- LinkedIn
- CareerFuture SG
- Other

### Pre-defined Categories
The system can categorize jobs into these categories:
- Software Development
- Data Science & Analytics
- Design & UX
- Marketing & Sales
- Finance & Accounting
- Human Resources
- Operations & Logistics
- Customer Service
- Healthcare
- Education & Training
- Engineering (Non-Software)
- Legal & Compliance
- Administration
- Hospitality & Tourism
- Other

## Usage Workflow

### 1. Download Template
Click "Download Template" button on the import page to get a sample CSV file.

### 2. Prepare Your Data
- Manually scrape job URLs from JobStreet, LinkedIn, or other sources
- Fill in the CSV template with job details
- Save as CSV file

### 3. Upload & Validate
- Drag and drop your CSV file or click to browse
- System validates all fields and checks for errors
- Preview shows first 5 rows of data
- Warnings are shown for missing optional fields

### 4. Configure Options
- **Skip Duplicates**: Skip jobs already in database (recommended)
- **Enrich Data**: Enable AI categorization and web scraping (slower but better quality)

### 5. Import
- Click "Start Import" to begin bulk import
- System processes jobs in batches
- Real-time progress tracking
- Detailed summary shows successful/failed imports

### 6. Review Results
- View import summary with success rates
- Download error report for failed imports
- Failed imports are logged to database for debugging

## API Endpoints

### POST /api/upload
Upload and validate CSV file.

**Request**: Multipart form data with CSV file

**Response**:
```json
{
  "validation": {
    "isValid": true,
    "errors": [],
    "warnings": [],
    "totalRows": 50
  },
  "duplicatesInCSV": [],
  "preview": [...],
  "filename": "jobs.csv"
}
```

### POST /api/check-duplicates
Check for existing jobs in database.

**Request**:
```json
{
  "applyLinks": ["https://example.com/job1", "https://example.com/job2"]
}
```

**Response**:
```json
{
  "total": 2,
  "duplicateCount": 1,
  "duplicates": ["https://example.com/job1"]
}
```

### POST /api/import
Import validated jobs into database.

**Request**:
```json
{
  "csvData": [...],
  "filename": "jobs.csv",
  "options": {
    "skipDuplicates": true,
    "enrichData": true,
    "batchSize": 10
  }
}
```

**Response**:
```json
{
  "success": true,
  "summary": {
    "total": 50,
    "successful": 45,
    "failed": 3,
    "duplicates": 2,
    "results": [...]
  },
  "logId": "uuid"
}
```

## Project Structure

```
csv-bulk-import-demo/
├── src/
│   ├── components/          # React components
│   │   ├── CSVUploader.tsx
│   │   ├── ValidationResults.tsx
│   │   ├── DataPreview.tsx
│   │   └── ImportSummary.tsx
│   ├── lib/                 # Utilities and helpers
│   │   ├── supabase.ts
│   │   ├── scraper.ts
│   │   ├── categorizer.ts
│   │   ├── csv-validator.ts
│   │   └── import-processor.ts
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx
│   │   ├── admin/
│   │   │   └── import.tsx
│   │   ├── api/
│   │   │   ├── upload.ts
│   │   │   ├── import.ts
│   │   │   └── check-duplicates.ts
│   │   └── _app.tsx
│   └── styles/
│       └── globals.css
├── supabase-schema.sql      # Database schema
├── sample-jobs.csv          # Sample CSV file
├── .env.example             # Environment variables template
└── README.md
```

## Database Schema

The system uses 4 main tables:

1. **jobs** - Stores all job listings
2. **import_logs** - Tracks import operations
3. **failed_imports** - Logs failed import attempts
4. **job_categories** - Pre-defined job categories with keywords

See `supabase-schema.sql` for complete schema.

## Advanced Features

### AI Categorization
Jobs without a category are automatically categorized using OpenAI GPT-3.5 Turbo. The system:
- Analyzes job title and description
- Matches against pre-defined categories
- Provides confidence scores
- Falls back to keyword matching if API fails

### Web Scraping
The scraper extracts additional data from job URLs:
- Company logos
- Hero/banner images
- Missing job details
- Supports LinkedIn, JobStreet, CareerFuture SG
- Generic extraction for other sites

### Duplicate Detection
Two-level duplicate detection:
1. **Within CSV**: Detects duplicate Apply Links in uploaded file
2. **Database**: Checks existing jobs before import

### Error Handling
Comprehensive error handling:
- Validation errors prevent import
- Failed imports are logged with details
- Error reports can be downloaded
- Import continues even if individual jobs fail

## Performance Considerations

- **Batch Processing**: Jobs imported in batches of 10 (configurable)
- **Rate Limiting**: 1-second delay between scraping requests
- **Timeouts**: 10-second timeout for web scraping
- **Caching**: AI categorization uses fallback keyword matching
- **Progress Tracking**: Real-time import status updates

## Security Notes

- Use Supabase Row Level Security (RLS) for production
- Implement admin authentication before deployment
- Validate and sanitize all user inputs
- Use environment variables for sensitive data
- Implement rate limiting on API endpoints

## Troubleshooting

### Import fails with "Network error"
- Check Supabase credentials in `.env.local`
- Verify database tables exist
- Check Supabase RLS policies

### AI categorization not working
- Verify OpenAI API key is valid
- Check API usage limits
- System falls back to keyword matching

### Scraping fails
- Some sites block automated scraping
- Timeouts may need adjustment
- Fallback: manually provide logo URLs in CSV

## Future Enhancements

- [ ] Background job processing with queues
- [ ] Real-time progress with WebSockets
- [ ] Export jobs to CSV
- [ ] Bulk edit/delete operations
- [ ] Advanced filtering and search
- [ ] Image upload and hosting
- [ ] Email notifications on import completion
- [ ] Scheduled imports from URLs
- [ ] Multi-language support

## License

MIT License - feel free to use in your own projects!

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase and OpenAI documentation
3. Open an issue on GitHub

---

Built with ❤️ using Next.js, Supabase, and OpenAI
