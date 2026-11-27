/* Safe mini-Markdown renderer. Shared by browser and server. HTML in input is always escaped. */
(function (root) {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) {
    u = String(u).trim();
    if (/^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(u)) return u;
    return '#';
  }
  function inline(t) {
    t = esc(t);
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, a, u) {
      return '<img loading="lazy" alt="' + a + '" src="' + esc(safeUrl(u.replace(/&amp;/g, '&'))) + '">';
    });
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, a, u) {
      var url = safeUrl(u.replace(/&amp;/g, '&'));
      var ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + esc(url) + '"' + ext + '>' + a + '</a>';
    });
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return t;
  }
  function render(src) {
    var lines = String(src || '').replace(/\r\n?/g, '\n').split('\n');
    var out = [], i = 0;
    while (i < lines.length) {
      var l = lines[i];
      if (/^\s*$/.test(l)) { i++; continue; }
      if (/^```/.test(l)) {
        var buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++; out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>'); continue;
      }
      var h = l.match(/^(#{1,3})\s+(.*)$/);
      if (h) { var n = h[1].length + 1; out.push('<h' + n + '>' + inline(h[2]) + '</h' + n + '>'); i++; continue; }
      if (/^>\s?/.test(l)) {
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
        out.push('<blockquote>' + inline(q.join(' ')) + '</blockquote>'); continue;
      }
      if (/^\s*[-*]\s+/.test(l)) {
        var it = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) it.push('<li>' + inline(lines[i++].replace(/^\s*[-*]\s+/, '')) + '</li>');
        out.push('<ul>' + it.join('') + '</ul>'); continue;
      }
      if (/^\s*\d+[.)]\s+/.test(l)) {
        var ot = [];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) ot.push('<li>' + inline(lines[i++].replace(/^\s*\d+[.)]\s+/, '')) + '</li>');
        out.push('<ol>' + ot.join('') + '</ol>'); continue;
      }
      if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
      var p = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,3}\s|>|```|\s*[-*]\s+|\s*\d+[.)]\s+)/.test(lines[i])) p.push(lines[i++]);
      out.push('<p>' + p.map(inline).join('<br>') + '</p>');
    }
    return out.join('\n');
  }
  var api = { render: render, esc: esc };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.MD = api;
})(typeof window !== 'undefined' ? window : globalThis);
