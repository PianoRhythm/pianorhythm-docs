// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

let PIANORHYTHM_ENV = (process.env.PIANORHYTHM_ENV || process.env.NODE_ENV || "").toLowerCase();
if (PIANORHYTHM_ENV && PIANORHYTHM_ENV == "dev" || PIANORHYTHM_ENV == "localhost") PIANORHYTHM_ENV = "development";
const isStaging = (PIANORHYTHM_ENV) == "staging" || (PIANORHYTHM_ENV) == "stg" || (PIANORHYTHM_ENV) == "stage";
const isProduction = (PIANORHYTHM_ENV) == "production" || (PIANORHYTHM_ENV) == "prd" || (PIANORHYTHM_ENV) == "prod";

if (isProduction) PIANORHYTHM_ENV = "production";
if (isStaging) PIANORHYTHM_ENV = "staging";

const isDevelopment = !isProduction && !isStaging;

let host = isDevelopment ? "http://localhost" : "https://pianorhythm.io";

const googleAnalytics = {
  trackingID: 'G-HPWMT1LLDW',
  anonymizeIP: true,
};

/** @returns {Promise<import('@docusaurus/types').Config>} */
module.exports = async function createConfigAsync() {
  return {
    title: 'PianoRhythm',
    tagline: 'General documentation',
    url: 'https://docs.pianorhythm.io',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'pianorhythm',
    projectName: 'pianorhythm',

    future: {
      v4: false, // Improve compatibility with the upcoming Docusaurus v4
      experimental_faster: false,
    },

    plugins: [
      async function myPlugin(context, options) {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            // Appends TailwindCSS and AutoPrefixer.
            postcssOptions.plugins.push(require("tailwindcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      },
      [
        require.resolve('./src/plugins/webpack/index.js'),
        {}
      ],
      // require.resolve('docusaurus-lunr-search'),
      [
        require.resolve('./src/plugins/changelog/index.js'),
        {
          id: 'changelog',
          blogTitle: 'PianoRhythm changelog',
          blogDescription:
            'Keep yourself up-to-date about new features in every release',
          blogSidebarCount: 10,
          blogSidebarTitle: 'Changelog',
          routeBasePath: '/changelog',
          showReadingTime: false,
          postsPerPage: 20,
          archiveBasePath: null,
          feedOptions: {
            type: 'all',
            title: 'PianoRhythm changelog',
            description:
              'Keep yourself up-to-date about new features in every release',
            copyright: `Copyright © ${new Date().getFullYear()} PianoRhythm, LLC.`,
            language: "en",
          },
        },
      ],
      ['@grnet/docusaurus-terminology', {
        termsDir: './docs/terms',
        docsDir: './docs/',
        glossaryFilepath: './docs/glossary.md'
      }],
      [
        '@docusaurus/plugin-client-redirects',
        {
          redirects: [
            {
              to: '/troubleshoot/audio',
              from: ['/troubleshoot-audio'],
            },
            {
              to: '/guides/sheet-music',
              from: ['/guide/sheetmusic', '/guides/sheetmusic'],
            },
            {
              to: '/guides/midi-player',
              from: ['/guide/midiplayer', '/guide/midiplayer'],
            },
            {
              to: '/guides/customization/customization-piano',
              from: ['/guides/customization-piano/'],
            },
          ],
        },
      ],
      // (await import('./src/plugins/feature-requests/feature-requests-plugin.mjs')).default
    ],

    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            routeBasePath: '/',
            sidebarPath: require.resolve('./sidebars.js'),
            showLastUpdateAuthor: true,
            showLastUpdateTime: true,
            includeCurrentVersion: true,
            exclude: [
              './api/index.md'
            ],
          },
          blog: {
            id: 'blog',
            blogTitle: 'PianoRhythm Blog',
            blogDescription: 'A blog about the PianoRhythm app and its development.',
            showReadingTime: true,
            onInlineTags: 'warn',
            onInlineAuthors: 'warn',
            onUntruncatedBlogPosts: 'warn',
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css')
          },
          gtag: googleAnalytics,
          sitemap: {
            changefreq: 'weekly',
            priority: 0.5,
            // trailingSlash: false,
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        docs: {
          sidebar: {
            hideable: true
          }
        },
        colorMode: {
          defaultMode: "dark",
          disableSwitch: true,
        },
        navbar: {
          title: 'PianoRhythm',
          hideOnScroll: true,
          logo: {
            alt: 'PianoRhythm Logo',
            src: 'img/logo.png',
          },
          items: [
            {
              label: 'Guides',
              position: 'left',
              to: 'guides',
              items: [
                {
                  label: "Guides",
                  to: 'guides',
                },
                {
                  label: "Tutorials",
                  to: 'tutorials',
                },
                {
                  label: "Plugins",
                  to: 'advanced-guides/plugins',
                },
                {
                  label: "FAQs",
                  to: 'faqs',
                },
                {
                  label: "Troubleshoot",
                  to: 'troubleshoot/audio',
                },
                {
                  label: "Contributing",
                  to: 'guides/contributing',
                }
              ]
            },
            { to: 'blog', label: 'Blog', position: 'left' },

            //Development only for now.
            //CORS Issue in production.
            // isDevelopment && {
            //   label: "Bug Report / Feature Request",
            //   position: 'left',
            //   to: '/feature-requests',
            // },
            {
              label: "Changelog",
              position: 'left',
              to: '/changelog',
            },
            {
              label: "Community",
              position: 'left',
              to: 'community',
            },
            // {
            //   label: "Development",
            //   position: 'left',
            //   to: 'development',
            // },
            // {
            //   type: 'localeDropdown',
            //   position: 'right',
            // },
            { href: host, label: 'Enter PianoRhythm', position: 'right' },
            { href: "https://staging.pianorhythm.io", label: 'Enter Staging', position: 'right' },
          ].filter(Boolean),
        },
        footer: {
          style: 'dark',
          links: [
            {
              title: 'Docs',
              items: [
                {
                  label: 'Guides',
                  to: 'guides',
                },
              ],
            },
            {
              title: 'Community',
              items: [
                {
                  label: 'Discord',
                  href: 'https://discord.gg/Pm2xXxb',
                }
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'PianoRhythm',
                  href: host,
                },
                {
                  label: 'Status Page',
                  href: "https://pianorhythm.statuspage.io",
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} <b>PianoRhythm, LLC.</b> Built with Docusaurus.`,
        },
        metadata: [
          {
            name: 'keywords',
            content: 'HTML5, WEBGL, Piano, Rust, Tauri, Documentation, PianoRhythm, PR, Multiplayer, Game, Music, Synthesizer, Instruments',
          },
          {
            name: 'description',
            content: 'General documentation for PianoRhythm',
          },
          {
            name: 'author',
            content: 'PianoRhythm, LLC',
          },
          {
            name: 'title',
            content: 'PianoRhythm Documentation',
          },
          {
            name: "og:image",
            content: "https://assets.pianorhythm.io/images/logo.png",
          }
        ],
        algolia: {
          apiKey: '092f02625f6059bbdaeb244b27d88ccb',
          indexName: 'docs_pianorhythm_io_vkdm8hozh8_pages',
          appId: 'VKDM8HOZH8',
          contextualSearch: true,
        }
      }),

    scripts: [
      // 'https://buttons.github.io/buttons.js',
      // 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
      // '/docs/js/code-block-buttons.js',
      '/js/analytics.js',
      '/js/pianorhythm-changelog-check.js',
    ],

    headTags: [
      {
        tagName: 'meta',
        attributes: {
          property: 'og:image',
          content: 'https://assets.pianorhythm.io/images/logo.png',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          property: 'og:type',
          content: 'website',
        },
      },
    ],

    markdown: {
      format: 'mdx',
      mermaid: true,
      mdx1Compat: {
        comments: true,
        admonitions: true,
        headingIds: true,
      },
    },

    stylesheets: [
      // '/docs/css/code-block-buttons.css'
    ],

    themes: ['@docusaurus/theme-mermaid'],
  };
};
