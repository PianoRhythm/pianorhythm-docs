// story: PRFP-1036 Fix CORS issue with displaying release notes for docs (production)
const isProduction = this.window.document.location.host == "https:";
// const host2 = `${isProduction ? "https" : "http"}://${this.window.document.location.host}`;
const host = `https://${this.window.document.location.host}`;

const showLatestChangelogPath = `${host}/changelog/?showLatest`;
const showLatestChanglogPage = () => {
  let doc = window.document;
  let latestChangelogVersion = "";
  let versions = [...doc.querySelectorAll("[itemprop='url']")].map(x => x.innerHTML);
  let dates = [...doc.querySelectorAll("[datetime]")].map(x => new Date(x.innerHTML));
  if (versions.length > 0 && dates.length > 0) {
    let date = dates[0];
    let _month = `${date.getMonth() + 1}`.padStart(2, "0");
    let _date = `${date.getDate()}`.padStart(2, "0");
    latestChangelogVersion = `${date.getFullYear()}/${_month}/${_date}/${versions[0]}`;
  }

  if (latestChangelogVersion) {
    this.window.document.location = `${host}/changelog/${latestChangelogVersion}/`;
  }
};

window.addEventListener('message', function (e) {
  let data = {};
  try {
    data = (typeof e.data === 'string' || e.data instanceof String) ? JSON.parse(e.data) : e.data;
  } catch { }

  const target = data.target;
  const source = data.source;
  if (source && target) {
    if (
      (
        source.includes("localhost") ||
        source.includes("tauri") ||
        source.includes("pianorhythm.io")
      ) &&
      target == "changelog-latest"
    ) {
      this.window.document.location = showLatestChangelogPath;
    }
  }
});

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("showLatest")) {
    this.window.document.location = showLatestChangelogPath;
    showLatestChanglogPage();
  }
};