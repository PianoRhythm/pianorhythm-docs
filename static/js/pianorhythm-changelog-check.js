// story: PRFP-1036 Fix CORS issue with displaying release notes for docs (production)

window.addEventListener('message', function (e) {
  let data = {};
  try {
    data = (typeof e.data === 'string' || e.data instanceof String) ? JSON.parse(e.data) : e.data;
  } catch { }

  const target = data.target;
  const source = data.source;
  if (
    source && target &&
    (source.includes("localhost") || source.includes("tauri") || source.includes("pianorhythm.io")) &&
    target === "changelog-latest"
  ) {
    window.location.href = `${window.location.origin}/changelog/?showLatest`;
  }
});

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("showLatest")) return;

  const firstEntry = document.querySelector('article header h2 a[href^="/changelog/"]');
  if (firstEntry && firstEntry.href) {
    window.location.replace(firstEntry.href);
  }
};
