document.addEventListener('DOMContentLoaded', () => {
  Page.init();
});

var Page = (() => {
  function init() {
    console.log('init');
  }

  return {
    init,
  };
})();
