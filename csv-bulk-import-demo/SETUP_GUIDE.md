# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account
- OpenAI account with API access

## Step-by-Step Setup

### 1. Install Dependencies (5 minutes)

```bash
cd csv-bulk-import-demo
npm install
```

### 2. Set Up Supabase Database (10 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and project name
   - Set a strong database password
   - Select region (Singapore recommended for Asia)
   - Wait for project to be ready (~2 minutes)

2. **Run Database Schema**
   - In your Supabase project, go to SQL Editor
   - Click "New Query"
   - Copy entire contents of `supabase-schema.sql`
   - Paste and click "Run"
   - Verify all tables are created (jobs, import_logs, failed_imports, job_categories)

3. **Get API Credentials**
   - Go to Project Settings > API
   - Copy these values:
     - Project URL
     - `anon` `public` key
     - `service_role` `secret` key (⚠️ Keep this secure!)

### 3. Configure Environment Variables (2 minutes)

1. **Copy template**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your credentials:
   ```env
   # Supabase (get from Supabase Project Settings > API)
   NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

   # OpenAI (get from platform.openai.com)
   OPENAI_API_KEY=sk-...
   ```

### 4. Get OpenAI API Key (5 minutes)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy the key and paste into `.env.local`
6. Add billing information if not already done
7. Note: You need a paid account for GPT-3.5 Turbo API access

### 5. Test the Setup

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the homepage with the "Go to Import Tool" button.

### 6. Test with Sample Data (5 minutes)

1. Click "Go to Import Tool"
2. Click "Download Template" to get the CSV template
3. Use the provided `sample-jobs.csv` file
4. Drag and drop `sample-jobs.csv` into the upload area
5. Review validation results
6. Configure import options:
   - ✅ Skip duplicates
   - ✅ Enrich data (for testing, you can uncheck this to speed up)
7. Click "Start Import"
8. Wait for import to complete
9. Review import summary

### 7. Verify in Database

1. Go to Supabase Dashboard
2. Open Table Editor
3. Click on `jobs` table
4. You should see imported jobs
5. Check `import_logs` table for import history

## Common Issues

### "Failed to connect to Supabase"
- ✅ Check your Supabase URL and keys in `.env.local`
- ✅ Verify `.env.local` file exists and is in project root
- ✅ Restart dev server after changing `.env.local`

### "OpenAI API error"
- ✅ Verify your API key is correct
- ✅ Check you have billing set up in OpenAI
- ✅ Make sure you have API credits
- **Workaround**: Disable "Enrich data" option to skip AI categorization

### "Database error during import"
- ✅ Verify schema was created successfully
- ✅ Check Supabase RLS policies allow inserts
- ✅ Make sure you're using the service role key, not anon key

### "Module not found" errors
- ✅ Run `npm install` again
- ✅ Delete `node_modules` and `package-lock.json`, then `npm install`

### CSV Upload Issues
- ✅ Make sure file is valid CSV format
- ✅ Check file size is under 10MB
- ✅ Verify all required columns are present

## Testing Without OpenAI

If you don't have OpenAI credits, you can still test the system:

1. In the import options, **uncheck "Enrich data"**
2. Manually provide categories in your CSV file
3. The system will use the provided categories instead of AI categorization

## Testing Without Web Scraping

To test without actually scraping websites:

1. Uncheck "Enrich data" option
2. The system will skip logo/banner extraction
3. Jobs will still be imported successfully

## Production Deployment

Before deploying to production:

1. **Security**
   - ✅ Implement authentication (e.g., NextAuth.js)
   - ✅ Add admin role checks
   - ✅ Enable Supabase RLS policies properly
   - ✅ Use secure environment variables

2. **Performance**
   - ✅ Consider using background jobs for large imports
   - ✅ Implement rate limiting
   - ✅ Add caching where appropriate

3. **Monitoring**
   - ✅ Set up error tracking (e.g., Sentry)
   - ✅ Monitor API usage (OpenAI, Supabase)
   - ✅ Track import success rates

## Next Steps

1. ✅ Test with your own job data
2. ✅ Customize categories in database
3. ✅ Adjust scraper for your specific job sources
4. ✅ Add authentication
5. ✅ Integrate into your main job board

## Support

If you run into issues:
1. Check this guide first
2. Review README.md for detailed documentation
3. Check browser console for errors
4. Check terminal for server errors
5. Verify environment variables are set correctly

---

Estimated total setup time: **25-30 minutes**
