(() => { try { const t=localStorage.getItem('sopa-viva-theme'); if(['green','blue','lavender','sepia','contrast'].includes(t)) document.documentElement.dataset.theme=t; } catch {} })();
