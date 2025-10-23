# URL-Based Job Import - Quick Start Guide

## 🎯 What This Does

Upload a CSV with just job URLs → App automatically extracts ALL job data → Imports to database

**Time savings**: 2-3 hours → 8 minutes for 50 jobs!

---

## 🚀 Quick Start (5 Steps)

### Step 1: Create Your CSV

Create a simple CSV with ONE column: `URL`

```csv
URL
https://www.linkedin.com/jobs/view/3829847261
https://www.jobstreet.com.sg/job/72819485
https://www.mycareersfuture.gov.sg/job/details/example-id
```

**That's it!** Just URLs - no other data needed.

### Step 2: Open the Import Page

1. Run `npm run dev`
2. Go to http://localhost:3000
3. Click **"Start URL Import (Recommended)"**

### Step 3: Upload Your CSV

1. Drag & drop your CSV file
2. See validation results
3. Click **"Preview First 3"** to test (optional)

### Step 4: Review Preview (Optional)

The preview shows you what data was extracted from the first 3 URLs:
- ✅ Job Title
- ✅ Company Name
- ✅ Location
- ✅ Salary Range
- ✅ Full Description
- ✅ Company Logo
- ✅ Hero Banner

### Step 5: Start Import

1. Click **"Start Import"**
2. Watch progress (2 seconds per URL)
3. See summary when complete!

---

## 📋 What Gets Extracted

For each URL, the system automatically extracts:

| Field | Source | Required |
|-------|--------|----------|
| Job Title | Scraped from page | Yes |
| Company Name | Scraped from page | Yes |
| Location | Scraped from page | Yes |
| Salary Range | Scraped from page | No (shows "Not specified" if missing) |
| Job Description | Scraped from page | Yes |
| Apply Link | Your URL | Yes |
| Source | Auto-detected (LinkedIn/JobStreet/etc) | Yes |
| Company Logo | Scraped from page | No |
| Hero Banner | Scraped from page | No |
| Category | AI categorization | Auto (15 categories) |

---

## 🌐 Supported Job Boards

### ✅ Fully Supported (Optimized Selectors)
- **LinkedIn** - linkedin.com/jobs
- **JobStreet** - jobstreet.com.sg
- **CareerFuture SG** - mycareersfuture.gov.sg

### ⚠️ Generic Support
- Other job sites work but may have lower success rate
- Uses generic HTML extraction methods

---

## ⚙️ Import Options

### Skip Duplicates (Default: ON)
- Checks if job URL already exists in database
- Skips importing duplicates
- **Recommended**: Keep this ON

### AI Categorization (Default: ON)
- Uses OpenAI GPT-3.5 to categorize jobs
- 15 pre-defined categories
- Falls back to keyword matching if API unavailable
- **Note**: Requires OpenAI API key

**Turn OFF AI Categorization if:**
- You don't have OpenAI API key
- You want faster imports
- You're okay with keyword-based categorization

---

## ⏱️ Import Speed

| Jobs | Time | Notes |
|------|------|-------|
| 10 | ~30 seconds | Quick test |
| 50 | ~2 minutes | Typical batch |
| 100 | ~4 minutes | Large batch |

**Rate limiting**: 2 seconds per URL to avoid being blocked by job sites

---

## 📊 Import Summary

After import completes, you'll see:

### Success Metrics
- ✅ Total URLs processed
- ✅ Successfully imported
- ❌ Failed (with error details)
- ⚠️ Duplicates skipped

### Failed Imports
- URL that failed
- Error message (e.g., "Failed to extract Job Title")
- Option to download error report

### What To Do With Failures
1. Check the URL is valid and accessible
2. Some sites require login - these will fail
3. Some sites have anti-scraping measures
4. Try manually adding failed jobs using "Manual Import Tool"

---

## 🛠️ Troubleshooting

### "Failed to extract required fields"
**Cause**: Page structure different than expected
**Fix**:
- Check if URL is accessible
- Try "Manual Import Tool" for these URLs
- Some job boards require login

### "Scraping failed: timeout"
**Cause**: Site took too long to respond
**Fix**:
- Check your internet connection
- Try again - might be temporary
- Site might be blocking automated requests

### "Duplicate: Job already exists"
**Cause**: URL already in your database
**Fix**:
- This is expected behavior if "Skip Duplicates" is ON
- No action needed - preventing duplicates!

### AI Categorization Errors
**Cause**: Invalid or missing OpenAI API key
**Fix**:
- Add valid API key to `.env.local`
- OR turn OFF "AI Categorization" option
- Fallback keyword matching will still work

---

## 💡 Best Practices

### For Best Results:

1. **Start Small**: Test with 3-5 URLs first using Preview
2. **Use Supported Sites**: LinkedIn, JobStreet, CareerFuture SG work best
3. **Check URLs**: Make sure URLs are publicly accessible (no login required)
4. **Batch Size**: Import 20-50 jobs at a time for optimal speed
5. **Review Preview**: Always check preview before full import

### Your Workflow:

```
Monday Morning (5 minutes):
1. Browse LinkedIn/JobStreet/CareerFuture
2. Copy 50 job URLs
3. Paste into Excel (1 column: URL)
4. Save as jobs-2025-01-20.csv

Upload & Import (3 minutes):
1. Upload CSV to URL Import page
2. Preview first 3 URLs
3. Start full import
4. Wait ~2 minutes
5. ✅ Done! 50 jobs imported
```

---

## 🔄 Complete Example

### Input CSV (`my-jobs.csv`):
```csv
URL
https://www.linkedin.com/jobs/view/3829847261
https://www.jobstreet.com.sg/job/72819485
https://www.mycareersfuture.gov.sg/job/details/abc123
```

### Preview Result:
```
Job 1: Senior Software Engineer @ Tech Corp
  Location: Singapore
  Salary: $6,000 - $10,000
  Category: Software Development
  ✅ Logo found ✅ Banner found

Job 2: Marketing Manager @ StartUp Inc
  Location: Singapore
  Salary: Not specified
  Category: Marketing & Sales
  ✅ Logo found

Job 3: Data Analyst @ Finance Co
  Location: Singapore
  Salary: $4,500 - $7,000
  Category: Data Science & Analytics
  ✅ Logo found ✅ Banner found
```

### Import Summary:
```
✅ Total: 3
✅ Successful: 3
❌ Failed: 0
⚠️ Duplicates: 0

100% Success Rate!
```

---

## 📁 CSV Template

Click **"Download Template"** button in the app, or create this:

```csv
URL
https://www.linkedin.com/jobs/view/YOUR_JOB_ID
https://www.jobstreet.com.sg/job/YOUR_JOB_ID
https://www.mycareersfuture.gov.sg/job/details/YOUR_JOB_ID
```

**Replace** `YOUR_JOB_ID` with actual job IDs from URLs you copied.

---

## 🎯 Quick Comparison

| Method | Input | Time for 50 Jobs | Data Quality |
|--------|-------|------------------|--------------|
| **Manual Entry** | Type everything | 2-3 hours | Error-prone |
| **Manual CSV** | Fill all fields | 1-2 hours | Manual work |
| **URL Import** | Just URLs | 8 minutes | Auto-extracted |

**Winner**: URL Import! 🏆

---

## ❓ FAQ

**Q: Can I import from any job site?**
A: LinkedIn, JobStreet, and CareerFuture SG work best. Other sites may work with generic extraction.

**Q: What if scraping fails?**
A: Check the error message. Use "Manual Import Tool" for failed URLs or sites requiring login.

**Q: Do I need OpenAI API?**
A: No! Turn off "AI Categorization" to use keyword-based categorization instead.

**Q: How fast is it?**
A: ~2 seconds per URL. 50 jobs = ~2 minutes.

**Q: Will I get blocked?**
A: We use 2-second delays and proper headers to minimize blocking. If blocked, try again later.

**Q: Can I see what will be imported?**
A: Yes! Use "Preview First 3" to test before full import.

---

## 🚀 Ready to Start?

1. Create your URL CSV
2. Go to http://localhost:3000
3. Click "Start URL Import (Recommended)"
4. Upload and import!

**Need help?** Check `URL_BASED_WORKFLOW.md` for technical details.

---

**Time saved per week**: If you import 200 jobs/week:
- Manual: 10-12 hours
- URL Import: 30 minutes
- **Savings: ~11 hours per week!** ⏰
