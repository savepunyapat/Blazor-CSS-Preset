// Light/dark theme for the CSS preset. Load it as a blocking script in <head> so data-theme is set before first paint:
//   <script src="js/theme.js" data-storage-key="myapp.theme"></script>
// Saved choice wins, else the OS preference. window.presetTheme keeps the attribute and localStorage in sync.
(function () {
  var script = document.currentScript;
  var key = (script && script.dataset.storageKey) || 'theme';
  var root = document.documentElement;

  function read() {
    try {
      var saved = localStorage.getItem(key);
      if (saved === 'dark' || saved === 'light') return saved === 'dark';
    } catch (e) { /* storage blocked */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  root.setAttribute('data-theme', read() ? 'dark' : 'light');

  window.presetTheme = {
    isDark: function () { return root.getAttribute('data-theme') === 'dark'; },
    set: function (dark) {
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      try { localStorage.setItem(key, dark ? 'dark' : 'light'); } catch (e) { /* session-only */ }
    },
    toggle: function () { this.set(!this.isDark()); return this.isDark(); }
  };
})();
