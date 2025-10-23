# Project Overview - CSV Bulk Import System

## Complete File Listing

### 📁 Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.js` | Next.js configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration for Tailwind |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore rules |

### 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `SETUP_GUIDE.md` | Step-by-step setup instructions |
| `QUICK_START.md` | Fast setup reference |
| `PROJECT_OVERVIEW.md` | This file - project structure overview |

### 🗃️ Database Files

| File | Purpose |
|------|---------|
| `supabase-schema.sql` | Complete database schema with tables, indexes, and policies |
| `sample-jobs.csv` | Sample CSV file with 15 test job listings |

### 🎨 React Components (`src/components/`)

| File | Description | Key Features |
|------|-------------|---------------|
| `CSVUploader.tsx` | Drag & drop file upload component | • File validation<br>• Visual feedback<br>• Error handling |
| `ValidationResults.tsx` | Displays validation errors/warnings | • Error categorization<br>• Expandable warnings<br>• Color-coded results |
| `DataPreview.tsx` | Shows preview of CSV data | • Table view<br>• First 5 rows<br>• Truncated long text |
| `ImportSummary.tsx` | Import results dashboard | • Success metrics<br>• Failed imports list<br>• Download error report |

### 🔧 Utility Libraries (`src/lib/`)

| File | Description | Key Functions |
|------|-------------|---------------|
| `supabase.ts` | Supabase client setup | • Client initialization<br>• Service role client |
| `scraper.ts` | Web scraping utility | • Extract logos/banners<br>• Support for LinkedIn, JobStreet, CareerFuture SG<br>• Batch scraping |
| `categorizer.ts` | AI job categorization | • OpenAI integration<br>• 15 pre-defined categories<br>• Fallback keyword matching |
| `csv-validator.ts` | CSV validation logic | • Field validation<br>• URL format checking<br>• Duplicate detection |
| `import-processor.ts` | Bulk import processing | • Batch processing<br>• Duplicate checking<br>• Data enrichment<br>• Import logging |

### 📄 Pages (`src/pages/`)

| File | Route | Description |
|------|-------|-------------|
| `index.tsx` | `/` | Homepage with feature overview |
| `admin/import.tsx` | `/admin/import` | Main CSV import interface |
| `_app.tsx` | - | Next.js app wrapper |

### 🔌 API Routes (`src/pages/api/`)

| File | Endpoint | Method | Description |
|------|----------|--------|-------------|
| `upload.ts` | `/api/upload` | POST | Validates CSV and returns preview |
| `check-duplicates.ts` | `/api/check-duplicates` | POST | Checks for existing jobs in DB |
| `import.ts` | `/api/import` | POST | Processes bulk import |

### 🎨 Styles (`src/styles/`)

| File | Purpose |
|------|---------|
| `globals.css` | Global styles with Tailwind imports |

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   User Interface                 │
│  (Next.js Pages + React Components)              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│              API Routes Layer                    │
│  • /api/upload - File validation                 │
│  • /api/check-duplicates - DB lookup             │
│  • /api/import - Bulk processing                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│            Business Logic Layer                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ CSV          │  │ Import       │             │
│  │ Validator    │  │ Processor    │             │
│  └──────────────┘  └──────────────┘             │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ AI           │  │ Web          │             │
│  │ Categorizer  │  │ Scraper      │             │
│  └──────────────┘  └──────────────┘             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│              Data Layer                          │
│  ┌──────────────┐  ┌──────────────┐             │
│  │  Supabase    │  │  OpenAI      │             │
│  │  PostgreSQL  │  │  GPT-3.5     │             │
│  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘
```

## Data Flow

### 1. CSV Upload Flow
```
User uploads CSV
    ↓
CSVUploader component parses file
    ↓
Sent to /api/upload
    ↓
CSV Validator checks format
    ↓
Returns validation results + preview
    ↓
User reviews in ValidationResults component
```

### 2. Duplicate Check Flow
```
Valid CSV data
    ↓
Extract Apply Links
    ↓
POST to /api/check-duplicates
    ↓
Import Processor checks database
    ↓
Returns list of duplicates
    ↓
Display warning to user
```

### 3. Import Flow
```
User clicks "Start Import"
    ↓
POST CSV data to /api/import
    ↓
For each job (in batches):
    ├─ Check duplicate (skip if exists)
    ├─ Enrich data (if enabled):
    │   ├─ AI categorization
    │   └─ Web scraping (logo/banner)
    └─ Insert into database
    ↓
Log import operation
    ↓
Return summary
    ↓
Display in ImportSummary component
```

## Database Schema

### Tables

**1. jobs**
- Primary table for job listings
- Stores all imported job data
- Unique constraint on `apply_link`

**2. import_logs**
- Tracks all import operations
- Stores success/failure counts
- Links to failed_imports for debugging

**3. failed_imports**
- Logs individual failed job imports
- Stores error messages and row data
- References import_logs

**4. job_categories**
- Pre-defined job categories
- Keywords for AI categorization
- 15 default categories

## Key Features Implementation

### ✅ Drag & Drop Upload
- **Component**: `CSVUploader.tsx`
- **Library**: `react-dropzone`
- **Validation**: File type, size (10MB max)

### ✅ Data Validation
- **Utility**: `csv-validator.ts`
- **Checks**: Required fields, URL format, source validity
- **Output**: Errors (blocking) and warnings (non-blocking)

### ✅ Duplicate Detection
- **Level 1**: Within CSV (same Apply Link appears multiple times)
- **Level 2**: Database (job already exists)
- **API**: `/api/check-duplicates`

### ✅ Preview Mode
- **Component**: `DataPreview.tsx`
- **Display**: First 5 rows in table format
- **Features**: Truncated text, empty field indicators

### ✅ AI Categorization
- **Utility**: `categorizer.ts`
- **Model**: OpenAI GPT-3.5 Turbo
- **Fallback**: Keyword matching (no API required)
- **Categories**: 15 pre-defined industries

### ✅ Web Scraping
- **Utility**: `scraper.ts`
- **Targets**: Company logos, hero banners
- **Support**: LinkedIn, JobStreet, CareerFuture SG, generic sites
- **Rate Limiting**: 1-second delay between requests

### ✅ Bulk Import
- **Processor**: `import-processor.ts`
- **Batch Size**: 10 jobs (configurable)
- **Options**: Skip duplicates, enrich data
- **Logging**: All operations logged to database

### ✅ Import Summary
- **Component**: `ImportSummary.tsx`
- **Metrics**: Total, successful, failed, duplicates
- **Features**: Success rate visualization, error download

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **File Handling**: react-dropzone, papaparse

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **File Upload**: Formidable

### External Services
- **AI**: OpenAI GPT-3.5 Turbo
- **Scraping**: Axios + Cheerio

## Environment Variables Required

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenAI (Optional - only if using AI categorization)
OPENAI_API_KEY=sk-xxx...
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| CSV Upload & Validation | <1s | Client-side parsing |
| Duplicate Check | 1-3s | DB query for N URLs |
| Import (without enrichment) | 2-5s per 10 jobs | Direct DB inserts |
| Import (with AI categorization) | 5-10s per 10 jobs | OpenAI API calls |
| Import (with web scraping) | 10-20s per 10 jobs | HTTP requests + parsing |
| Full enrichment (AI + scraping) | 15-30s per 10 jobs | Both external calls |

## Scalability Considerations

### Current Implementation
- **Max CSV Size**: 10MB (~10,000 jobs)
- **Batch Processing**: 10 jobs at a time
- **Rate Limiting**: Basic delay between scrapes

### For Large Scale (1000+ jobs)
Consider adding:
- Background job queue (Bull, BullMQ)
- Progress tracking with WebSockets
- Distributed scraping
- Redis caching for duplicate checks
- Separate worker processes

## Security Features

### Current
- ✅ Environment variable secrets
- ✅ File type validation
- ✅ File size limits
- ✅ URL validation
- ✅ SQL injection prevention (Supabase client)

### Recommended for Production
- [ ] Admin authentication
- [ ] Role-based access control
- [ ] Rate limiting on API routes
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Audit logging
- [ ] Row-level security (RLS) in Supabase

## Customization Guide

### Add New Job Source
1. Edit `src/lib/csv-validator.ts` - Add to `VALID_SOURCES`
2. Edit `src/lib/scraper.ts` - Add new extraction methods
3. Update `supabase-schema.sql` - Add to CHECK constraint

### Add New Job Category
1. Run SQL in Supabase:
   ```sql
   INSERT INTO job_categories (category_name, keywords)
   VALUES ('Your Category', ARRAY['keyword1', 'keyword2']);
   ```
2. Edit `src/lib/categorizer.ts` - Add to `JOB_CATEGORIES`

### Change Batch Size
Edit `src/pages/admin/import.tsx`:
```typescript
batchSize: 20  // Change from default 10
```

### Disable AI Categorization
Set default in `src/pages/admin/import.tsx`:
```typescript
const [enrichData, setEnrichData] = useState(false);
```

### Disable Web Scraping
In `src/lib/import-processor.ts`, comment out scraping calls in `enrichJobData()`

## Testing Strategy

### Unit Tests (Recommended)
- CSV validation logic
- AI categorization fallback
- URL parsing in scraper

### Integration Tests (Recommended)
- API endpoints
- Database operations
- Full import flow

### Manual Testing Checklist
- ✅ Upload valid CSV
- ✅ Upload invalid CSV (missing columns)
- ✅ Upload CSV with duplicates
- ✅ Import with "Skip duplicates" enabled
- ✅ Import with "Enrich data" enabled
- ✅ Import with "Enrich data" disabled
- ✅ Test with large file (100+ jobs)
- ✅ Test error handling (invalid URLs)

## Maintenance

### Regular Tasks
- Monitor OpenAI API usage and costs
- Review import logs for patterns
- Clean up old import logs
- Update scraping selectors (sites change)
- Review and update job categories

### Troubleshooting
- Check `import_logs` table for failed imports
- Review `failed_imports` for error patterns
- Monitor browser console for frontend errors
- Check server logs for API errors

## Future Enhancements

### High Priority
- [ ] Authentication and admin roles
- [ ] Background job processing
- [ ] Real-time progress updates
- [ ] Export jobs to CSV

### Medium Priority
- [ ] Bulk edit/delete operations
- [ ] Advanced filtering and search
- [ ] Scheduled imports from URLs
- [ ] Email notifications

### Low Priority
- [ ] Image upload and hosting
- [ ] Multi-language support
- [ ] Custom field mapping
- [ ] API for external integrations

---

## Quick Reference Commands

```bash
# Install
npm install

# Development
npm run dev

# Build for production
npm run build
npm start

# Lint code
npm run lint
```

## Support & Resources

- **Documentation**: README.md, SETUP_GUIDE.md
- **Quick Start**: QUICK_START.md
- **Sample Data**: sample-jobs.csv
- **Database Schema**: supabase-schema.sql

---

**Project Size**: ~30 files, ~3,500 lines of code
**Setup Time**: 25-30 minutes
**First Import**: <5 minutes after setup
