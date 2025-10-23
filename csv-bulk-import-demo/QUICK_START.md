# Quick Start - CSV Bulk Import

## Installation (One Command!)

```bash
cd csv-bulk-import-demo
npm install
```

## Minimal Setup (3 Steps)

### 1. Create `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
OPENAI_API_KEY=your_openai_key_here
```

### 2. Run Supabase Schema
Copy `supabase-schema.sql` into Supabase SQL Editor and run it.

### 3. Start Server
```bash
npm run dev
```

Go to http://localhost:3000

## Test Import (2 Minutes)

1. Click "Go to Import Tool"
2. Drag `sample-jobs.csv` into the upload area
3. Uncheck "Enrich data" for faster testing
4. Click "Start Import"
5. Done! Check your Supabase `jobs` table

## CSV Format

```csv
Job Title,Company Name,Location,Salary Range,Job Description,Apply Link,Source,Industry/Category
Software Engineer,Tech Corp,Singapore,$5000-$8000,Description here,https://example.com/job1,LinkedIn,Software Development
```

**Required Columns:**
- Job Title
- Company Name
- Location
- Job Description
- Apply Link (must be valid URL)
- Source (LinkedIn, JobStreet, CareerFuture SG, or Other)

**Optional Columns:**
- Salary Range
- Industry/Category (auto-categorized if empty)

## Import Options

**Skip Duplicates** ✅ Recommended
- Prevents importing jobs that already exist in database

**Enrich Data** ⚠️ Optional (Slower)
- AI categorization using OpenAI
- Web scraping for logos and banners
- Uncheck for faster testing without OpenAI

## Troubleshooting

**Can't connect to Supabase?**
→ Check `.env.local` has correct values

**OpenAI errors?**
→ Uncheck "Enrich data" or add valid API key

**CSV validation fails?**
→ Use the template from "Download Template" button

**Import succeeds but no data?**
→ Check Supabase RLS policies allow inserts

## File Structure

```
csv-bulk-import-demo/
├── src/
│   ├── components/          # UI components
│   ├── lib/                 # Business logic
│   ├── pages/               # Next.js pages & API routes
│   └── styles/              # CSS
├── supabase-schema.sql      # Database setup
├── sample-jobs.csv          # Test data
├── .env.example             # Environment template
└── README.md                # Full documentation
```

## What It Does

1. **Upload CSV** → Validates data
2. **Preview** → Shows first 5 rows
3. **Check Duplicates** → Compares with database
4. **AI Categorize** → Auto-categorizes jobs (if enabled)
5. **Web Scrape** → Extracts logos/banners (if enabled)
6. **Bulk Import** → Inserts jobs into Supabase
7. **Summary** → Shows success/failure report

## Production Checklist

Before going live:
- [ ] Add authentication
- [ ] Restrict admin access
- [ ] Enable Supabase RLS
- [ ] Add rate limiting
- [ ] Set up error monitoring
- [ ] Review security settings

## Need Help?

1. Read `SETUP_GUIDE.md` for detailed setup
2. Read `README.md` for full documentation
3. Check browser console for errors
4. Check terminal for server errors

---

**That's it! You're ready to import jobs in bulk.**
