#!/usr/bin/env node

const algoliasearch = require('algoliasearch');
const fs = require('fs');

let PIANORHYTHM_ENV = (process.env.PIANORHYTHM_ENV || process.env.NODE_ENV || "").toLowerCase();
const isStaging = (PIANORHYTHM_ENV) == "staging" || (PIANORHYTHM_ENV) == "stg" || (PIANORHYTHM_ENV) == "stage";
const isProduction = (PIANORHYTHM_ENV) == "production" || (PIANORHYTHM_ENV) == "prd" || (PIANORHYTHM_ENV) == "prod";

// Algolia configuration
const ALGOLIA_APP_ID = 'VKDM8HOZH8';
const ALGOLIA_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY; // Admin API key needed for indexing
let ALGOLIA_INDEX_NAME = 'documents';
if (!isProduction && !isStaging) ALGOLIA_INDEX_NAME = 'documents_dev';
const RECORDS_FILE = './algolia-records/records.json';

if (!ALGOLIA_API_KEY) {
  console.error('❌ ALGOLIA_ADMIN_API_KEY environment variable is required');
  console.log('Please set your Algolia Admin API Key:');
  console.log('export ALGOLIA_ADMIN_API_KEY=your_admin_api_key_here');
  process.exit(1);
}

async function uploadRecords() {
  try {
    // Initialize Algolia client
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    // Read records
    if (!fs.existsSync(RECORDS_FILE)) {
      console.error(`❌ Records file not found: ${RECORDS_FILE}`);
      console.log('Run "npm run generate-algolia" first to generate records');
      process.exit(1);
    }

    const records = JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf8'));
    console.log(`📄 Found ${records.length} records to upload`);

    // Clear existing records
    console.log('🗑️  Clearing existing records...');
    await index.clearObjects();

    // Upload records in batches
    const batchSize = 1000;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${batch.length} records)`);
      
      await index.saveObjects(batch);
    }

    console.log('✅ Successfully uploaded all records to Algolia');
    console.log(`🔍 Index: ${ALGOLIA_INDEX_NAME}`);
    console.log(`📊 Total records: ${records.length}`);

  } catch (error) {
    console.error('❌ Error uploading records:', error);
    process.exit(1);
  }
}

uploadRecords();
