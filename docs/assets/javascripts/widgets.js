// Shared interactive learning widgets for DAB docs.
// Pattern: each widget block ends with an inline <script> that calls
//   sxInit(document.currentScript, { ... })
// or the chart-picker variant which is just sxInit with html-stages.

(function(){
  function escHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function cell(c){
    if (c === null || c === undefined) return '<span class="sx-null">NULL</span>';
    return escHtml(c);
  }

  function renderTable(el, data, hl){
    hl = hl || [];
    var matches = data.matches || [];
    var html = '<table class="sx-tbl"><thead><tr>';
    data.cols.forEach(function(c, i){
      html += '<th'+(hl.indexOf(i)>=0?' class="sx-hl"':'')+'>'+escHtml(c)+'</th>';
    });
    html += '</tr></thead><tbody>';
    (data.rows||[]).forEach(function(row, ri){
      var trcls = matches.indexOf(ri)>=0 ? ' class="sx-match"' : '';
      html += '<tr'+trcls+'>';
      row.forEach(function(c, i){
        html += '<td'+(hl.indexOf(i)>=0?' class="sx-hl"':'')+'>'+cell(c)+'</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  function renderStage(el, data, hl){
    if (!data){ el.innerHTML = ''; return; }
    if (typeof data.html === 'string'){ el.innerHTML = data.html; return; }
    if (typeof data.code === 'string'){
      var cls = 'sx-code' + (data.kind ? ' sx-code-' + data.kind : '');
      el.innerHTML = '<pre class="'+cls+'"><code>'+escHtml(data.code)+'</code></pre>';
      return;
    }
    if (data.cols){ renderTable(el, data, hl); return; }
    el.innerHTML = '';
  }

  window.sxInit = function(scriptEl, cfg){
    var root = scriptEl.previousElementSibling;
    while (root && !(root.classList && root.classList.contains('sx-explorer'))){
      root = root.previousElementSibling;
    }
    if (!root) return;

    var fields = {};
    ['name','level','tag','desc','sql'].forEach(function(f){
      fields[f] = root.querySelector('[data-field="'+f+'"]');
    });
    var stages = root.querySelectorAll('[data-stage]');
    var btns   = root.querySelectorAll('.sx-btn');

    function apply(key){
      var v = cfg.variants[key]; if (!v) return;
      root.setAttribute('data-variant', key);
      if (fields.name)  fields.name.textContent  = v.name || '';
      if (fields.level){
        fields.level.textContent = (v.level||'').toUpperCase();
        fields.level.setAttribute('data-level', v.level || '');
      }
      if (fields.tag)  fields.tag.innerHTML  = v.tag  || '';
      if (fields.desc) fields.desc.innerHTML = v.desc || '';
      if (fields.sql)  fields.sql.textContent = v.sql || '';

      stages.forEach(function(st){
        var skey = st.getAttribute('data-stage');
        var base = (cfg.stages && cfg.stages[skey]) || null;
        var override = v.stages && v.stages[skey];
        var data = override || base;
        if (data && v.matches && v.matches[skey]){
          var copy = {}; for (var k in data) copy[k] = data[k];
          copy.matches = v.matches[skey];
          data = copy;
        }
        var hl = v.hl && v.hl[skey];
        renderStage(st, data, hl);
      });
      btns.forEach(function(b){
        b.setAttribute('aria-pressed', b.dataset.variant === key ? 'true' : 'false');
      });
    }
    btns.forEach(function(b){
      b.addEventListener('click', function(){ apply(b.dataset.variant); });
    });
    apply(root.getAttribute('data-variant') || cfg.initial);
  };
})();
