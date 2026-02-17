# Darija for Dummies — Google Sheets Setup

## 1. Create a New Google Sheet
Name it: **Darija for Dummies**

## 2. Share with Service Account
Share the spreadsheet (Editor) with:
`journey-creator@journey-creator-480523.iam.gserviceaccount.com`

## 3. Create 3 Tabs

### Tab: **Words**
Import `darija-words-import.csv`

| Column | Header | Description |
|--------|--------|-------------|
| A | id | Unique ID (w001, w002...) |
| B | darija | Latin transliteration |
| C | arabic | Arabic script |
| D | english | English meaning |
| E | french | French meaning |
| F | pronunciation | Pronunciation guide (e.g. sa-LAM) |
| G | category | greetings, food, shopping, transport, home, emotions, time, numbers, family, city, money, health, religion, slang, verbs, directions |
| H | part_of_speech | noun, verb, adjective, adverb, interjection, phrase, numeral, pronoun, particle |
| I | gender | masculine, feminine, or blank |
| J | plural | Plural form or blank |
| K | register | universal, formal, informal, street |
| L | example_darija | Example sentence (Darija) |
| M | example_arabic | Example sentence (Arabic) |
| N | example_english | Example sentence (English) |
| O | example_french | Example sentence (French) |
| P | cultural_note | The gold — what no dictionary tells you |
| Q | tags | Comma-separated: essential,first-day,food,culture |
| R | published | TRUE or FALSE |

### Tab: **Phrases**
Import `darija-phrases-import.csv`

| Column | Header | Description |
|--------|--------|-------------|
| A | id | Unique ID (p001, p002...) |
| B | darija | Latin transliteration |
| C | arabic | Arabic script |
| D | english | English meaning |
| E | french | French meaning |
| F | pronunciation | Pronunciation guide |
| G | literal_translation | Literal word-for-word translation |
| H | category | survival, souk, taxi, cafe, riad, restaurant, pharmacy, hammam, directions, compliments, arguments, proverbs, blessings, daily, emergency, street |
| I | register | universal, formal, informal, street |
| J | cultural_note | Cultural context |
| K | response_darija | Expected response (Darija) |
| L | response_arabic | Expected response (Arabic) |
| M | response_english | Expected response (English) |
| N | tags | Comma-separated tags |
| O | published | TRUE or FALSE |

### Tab: **Settings**
Import `darija-settings-import.csv`

| Column | Header |
|--------|--------|
| A | key |
| B | value |

## 4. Copy the Spreadsheet ID
From the URL: `https://docs.google.com/spreadsheets/d/[THIS-PART]/edit`

## 5. Vercel Environment Variables

```
DARIJA_SPREADSHEET_ID=[spreadsheet ID]
GOOGLE_SERVICE_ACCOUNT_BASE64=[same base64 string as other properties]
NEXUS_SUPABASE_URL=https://soqcqlzerhgacdaggtch.supabase.co
NEXUS_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcWNxbHplcmhnYWNkYWdndGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODMwNzIsImV4cCI6MjA4NjU1OTA3Mn0.Z96me0MLsDidL6VR7cflULwuVV_hx6W2KA405BxIq1U
SITE_ID=darija-for-dummies
NEXT_PUBLIC_SITE_URL=https://darija.app
```

## How It Works

- Site fetches from Google Sheet via `/api/dictionary` endpoint
- If Sheet fails (no credentials, network error), falls back to static JSON in `/data/`
- Static JSON ships with the 100 words + 80 phrases already written
- You add/edit/remove content in the Sheet — site updates within 5 minutes (ISR cache)
- Glossary API at `/api/glossary` auto-updates for AI citation
