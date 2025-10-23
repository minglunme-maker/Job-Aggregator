# 🚀 GET STARTED IN 3 STEPS

## Step 1: Setup (5 minutes)

```bash
cd csv-bulk-import-demo
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

## Step 2: Database (2 minutes)

1. Go to your Supabase project
2. Open SQL Editor
3. Copy & paste `supabase-schema.sql`
4. Run it

## Step 3: Test (2 minutes)

```bash
npm run dev
```

1. Go to http://localhost:3000
2. Click "Go to Import Tool"
3. Upload `sample-jobs.csv`
4. Click "Start Import"

## 🎉 That's It!

You now have a fully functional CSV bulk import system with:
- ✅ AI categorization
- ✅ Web scraping for logos/banners
- ✅ Duplicate detection
- ✅ Data validation
- ✅ Import tracking

## 📚 Learn More

- **Quick Reference**: `QUICK_START.md`
- **Detailed Setup**: `SETUP_GUIDE.md`
- **Full Documentation**: `README.md`
- **Project Structure**: `PROJECT_OVERVIEW.md`

## 🛠️ Your Workflow

1. **Scrape jobs** manually from JobStreet, LinkedIn, etc.
2. **Save URLs** to CSV file (use template)
3. **Upload CSV** via admin panel
4. **Review** validation and preview
5. **Import** - system auto-categorizes and enriches
6. **Done!** Jobs appear in your database

## 💡 Pro Tips

- Uncheck "Enrich data" for faster testing
- Use "Download Template" for correct CSV format
- Check import_logs table for debugging
- Start with small batches (10-20 jobs)

## 🆘 Need Help?

**Common Issues:**
- Can't connect? → Check `.env.local`
- OpenAI errors? → Uncheck "Enrich data"
- CSV fails? → Use the template

**All documentation is in:**
- QUICK_START.md
- SETUP_GUIDE.md
- README.md

---

**You're ready to start importing jobs in bulk!** 🎯
