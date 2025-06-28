#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');
const removeMd = require('remove-markdown');
const mkdirp = require('mkdirp');

// Configuration
const OUTPUT_DIR = './algolia-records';
const CONTENT_DIRS = [
  { path: './docs', type: 'docs', urlPrefix: '/' },
  { path: './blog', type: 'blog', urlPrefix: '/blog/' },
  { path: './changelog', type: 'changelog', urlPrefix: '/changelog/' }
];

// Create output directory
mkdirp.sync(OUTPUT_DIR);

// Process content and generate records
const records = [];
let objectID = 1;

CONTENT_DIRS.forEach(({ path: contentDir, type, urlPrefix }) => {
  const files = glob.sync(`${contentDir}/**/*.{md,mdx}`);
  
  files.forEach(filePath => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // Skip draft content
      if (data.draft) return;
      
      // Generate URL path
      let urlPath = filePath
        .replace(contentDir, '')
        .replace(/\.(md|mdx)$/, '')
        .replace(/\/index$/, '/');
      
      // Handle special cases for index files
      if (urlPath === '/index') urlPath = '/';
      
      const url = urlPrefix + (urlPath.startsWith('/') ? urlPath.substring(1) : urlPath);
      
      // Clean content
      const plainText = removeMd(content)
        .replace(/\s+/g, ' ')
        .trim();
      
      // Extract description if not provided in frontmatter
      let description = data.description || '';
      // if (!description && plainText.length > 0) {
      //   // Use first paragraph or first 160 characters as description
      //   const firstParagraph = plainText.split('.')[0];
      //   description = firstParagraph.length > 160
      //     ? firstParagraph.substring(0, 157) + '...'
      //     : firstParagraph;
      // }
      
      // Extract keywords
      let keywords = [];
      
      // Add tags as keywords
      if (data.tags && Array.isArray(data.tags)) {
        keywords = keywords.concat(data.tags);
      }
      
      // Add keywords from frontmatter if available
      if (data.keywords) {
        if (Array.isArray(data.keywords)) {
          keywords = keywords.concat(data.keywords);
        } else if (typeof data.keywords === 'string') {
          keywords.push(data.keywords);
        }
      }
      
      // Extract categories if available
      if (data.category) {
        keywords.push(data.category);
      }
      if (data.categories && Array.isArray(data.categories)) {
        keywords = keywords.concat(data.categories);
      }
      
      // Create chunks of content for better search results
      const contentChunks = chunkContent(plainText, 300);
      
      contentChunks.forEach((chunk, i) => {
        records.push({
          objectID: objectID++,
          title: data.title || 'Untitled',
          description: description,
          content: chunk,
          url: url,
          type: type,
          tags: data.tags || [],
          keywords: keywords,
          hierarchy: {
            lvl0: type.charAt(0).toUpperCase() + type.slice(1),
            lvl1: data.title || 'Untitled',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null
          },
          weight: getWeight(type),
          chunkIndex: i
        });
      });
      
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  });
});

// Write records to file
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'records.json'),
  JSON.stringify(records, null, 2)
);

console.log(`✅ Generated ${records.length} Algolia records in ${OUTPUT_DIR}/records.json`);

// Helper functions
function chunkContent(text, size) {
  const chunks = [];
  let index = 0;
  
  while (index < text.length) {
    chunks.push(text.slice(index, index + size));
    index += size;
  }
  
  return chunks.length > 0 ? chunks : [''];
}

function getWeight(type) {
  switch (type) {
    case 'docs': return 100;
    case 'blog': return 90;
    case 'changelog': return 80;
    default: return 70;
  }
}