(() => {
  'use strict';
  const supported = ['es', 'en', 'pt', 'de'];
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let language = read('sopa-viva-language');
  if (!supported.includes(language)) language = (navigator.language || 'es').split('-')[0];
  if (!supported.includes(language)) language = 'es';
  const records = [];
  const seen = new WeakSet();
  function t(source, values = {}) {
    const translated = language === 'es' ? source : window.SOPA_TRANSLATIONS[source]?.[{en:0,pt:1,de:2}[language]] ?? source;
    return translated.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
  }
  function translate(root) {
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const node = walk.currentNode;
      if (node.parentElement.closest('script,style,#board,#wordList,#printArea,select#bank,select#wordLanguage,.demo-grid,.demo-words,.intro-stamp')) continue;
      if (seen.has(node)) continue;
      const original = node.textContent;
      if (window.SOPA_TRANSLATIONS[original.trim()]) {
        records.push({node, original}); seen.add(node);
      }
    }
    root.querySelectorAll('[aria-label],[placeholder],meta[name="description"]').forEach(node => {
      for (const attribute of ['aria-label', 'placeholder', 'content']) {
        if (attribute === 'content' && node.name !== 'description') continue;
        const original = node.getAttribute(attribute);
        if (original && window.SOPA_TRANSLATIONS[original]) records.push({node, attribute, original});
      }
    });
    apply();
  }
  function apply() {
    document.documentElement.lang = language;
    for (const {node, attribute, original} of records) {
      if (!node.isConnected) continue;
      const translated = original.replace(original.trim(), t(original.trim()));
      if (attribute) node.setAttribute(attribute, translated); else node.textContent = translated;
    }
  }
  window.SopaI18n = {t, translate, get language() { return language; }, read, save, supported};
  translate(document.documentElement);
  const control = document.createElement('div'); control.className = 'theme-control language-control';
  const label = document.createElement('label'); label.htmlFor = 'ui-language';
  const select = document.createElement('select'); select.id = 'ui-language';
  for (const [value, name] of [['es','Español'],['en','English'],['pt','Português'],['de','Deutsch']]) select.add(new Option(name, value));
  select.value = language; control.append(label, select);
  window.SopaI18n.control = control;
  function refreshLabel() {label.textContent = t('Idioma de pantalla');}
  refreshLabel();
  select.addEventListener('change', () => {
    language = select.value; save('sopa-viva-language', language); apply(); refreshLabel();
    window.dispatchEvent(new Event('sopa-language-change'));
  });
})();
