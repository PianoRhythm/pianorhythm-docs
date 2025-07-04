const path = require('path');
const fs = require('fs-extra');
const pluginContentBlog = require('@docusaurus/plugin-content-blog');
const { aliasedSitePath, docuHash, normalizeUrl } = require('@docusaurus/utils');

/**
 * Multiple versions may be published on the same day, causing the order to be
 * the reverse. Therefore, our publish time has a "fake hour" to order them.
 */
const publishTimes = new Set();
/**
 * @type {Record<string, {name: string, url: string,alias: string, imageURL: string}>}
 */
const authorsMap = {};

const YOUTRACK_ISSUES_URL = `https://pianorhythm.myjetbrains.com/youtrack/issue`;
const GITHUB_ISSUES_URL = `https://github.com/PianoRhythm/pianorhythm-ssr/issues`;

/**
 * @param {string} section
 */
function processSection(section) {
  const title = section
    .match(/\n## .*/)?.[0]
    .trim()
    .replace('## ', '');

  if (!title) {
    return null;
  }

  const content = section
    .replace(/\n## .*/, '')
    .replace(/\[(PRFP-)(\d+)\]/g, `[$1$2](${YOUTRACK_ISSUES_URL}/$1$2)`)
    .replace(/\[(#)(\d+)\]/g, `[$1$2](${GITHUB_ISSUES_URL}/$1$2)`)
    .replace('running_woman', 'running')
    .trim();

  let authors = content.match(/## Committers: \d.*/s);
  if (authors) {
    authors = authors[0]
      .match(/- .*/g)
      .map(
        (line) => {
          let match =
            line.match (
              /- (?:(?<name>.*?) \()?\[@(?<alias>.*)\]\((?<url>.*?)\)\)?/,
            );
          if (!match) return undefined;
          return match.groups;
        },
      )
      .filter(Boolean)
      .map((author) => ({
        ...author,
        name: author.name ?? author.alias,
        imageURL: author.alias ? `https://github.com/${author.alias}.png` : '',
      }))
      .sort((a, b) => a.url.localeCompare(b.url));

    if (!authors || authors.length == 0) {
      authors = "";
      return;
    }

    authors.forEach((author) => {
      authorsMap[author.alias] = author;
    });
  }

  let hour = 20;
  const date = title.match(/ \((?<date>.*)\)/)?.groups.date;

  while (publishTimes.has(`${date}T${hour}:00`)) {
    hour -= 1;
  }

  publishTimes.add(`${date}T${hour}:00`);
  const _title = title.replace(/ \(.*\)/, '');

  return {
    title: _title,
    date,
    content:
      `---
  date: ${`${date}`}
  version: ${_title}
  tags:
    - ${_title}
    - changelog
  ${authors ? `authors:${authors.map((author) => `  - '${author.alias}'`).join('\n')}` : ''}
---

# ${_title}

${content.replace(/####/g, '##')}
`};
}

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @param options
 * @returns {import('@docusaurus/types').Plugin}
 */
async function ChangelogPlugin(context, options) {
  const generateDir = path.join(context.siteDir, 'changelog/source');
  const blogPlugin = await pluginContentBlog.default(context, {
    ...options,
    path: generateDir,
    id: 'changelog',
    blogListComponent: '@theme/ChangelogList',
    blogPostComponent: '@theme/ChangelogPage',
  });

  const changelogSourceFile = path.join(context.siteDir, 'changelog.md');

  return {
    ...blogPlugin,
    name: 'changelog-plugin',
    async loadContent() {
      try {
        console.log(`Loading changelog from: ${changelogSourceFile}`);

        if (!await fs.pathExists(changelogSourceFile)) {
          console.error(`Changelog source file not found: ${changelogSourceFile}`);
          return await blogPlugin.loadContent();
        }

        const fileContent = await fs.readFile(changelogSourceFile, 'utf-8');
        const sections = fileContent
          .split(/(?=\n## )/)
          .map(processSection)
          .filter(Boolean);

        // Ensure the directory exists
        await fs.ensureDir(generateDir);

        // Clear the directory
        await fs.emptyDir(generateDir);

        await Promise.all(
          sections.map((section) =>
            fs.outputFile(
              path.join(generateDir, `${section.date}-${section.title}.md`),
              section.content,
            ),
          ),
        );

        const authorsPath = path.join(generateDir, 'authors.json');
        await fs.outputFile(authorsPath, JSON.stringify(authorsMap, null, 2));

        const content = await blogPlugin.loadContent?.();

        if (!content || !content.blogPosts) {
          console.warn('Blog plugin did not return expected content structure');
          return content;
        }

        content.blogPosts.forEach((post, index) => {
          const pageIndex = Math.floor(index / options.postsPerPage);
          post.metadata.listPageLink = normalizeUrl([
            context.baseUrl,
            options.routeBasePath,
            pageIndex === 0 ? '/' : `/page/${pageIndex + 1}`,
          ]);
        });

        return content;
      } catch (ex) {
        console.error("Changelog plugin error:", ex);
        return await blogPlugin.loadContent();
      }
    },
    configureWebpack(...args) {
      const config = blogPlugin.configureWebpack?.(...args);
      const pluginDataDirRoot = path.join(
          context.generatedFilesDir,
          'changelog-plugin',
          options.id || 'changelog'  // Use the same ID as provided to the blog plugin
      );

      // Make sure we're using the correct MDX loader
      const mdxLoader = config.module.rules.find(
          rule => rule.test && rule.test.test('.md')
      )?.use.find(use => use.loader && use.loader.includes('mdx-loader'));

      // Redirect the metadata path to our folder
      mdxLoader.options.metadataPath = (mdxPath) => {
        // Note that metadataPath must be the same/in-sync as
        // the path from createData for each MDX.
        const aliasedPath = aliasedSitePath(mdxPath, context.siteDir);
        return path.join(pluginDataDirRoot, `${docuHash(aliasedPath)}.json`);
      };

      return config;
    },
    getThemePath() {
      return './theme';
    },
    getPathsToWatch() {
      // Don't watch the generated dir
      return [changelogSourceFile];
    },
  };
}

ChangelogPlugin.validateOptions = pluginContentBlog.validateOptions;

module.exports = ChangelogPlugin;
