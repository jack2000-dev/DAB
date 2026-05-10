# SQL Fundamentals

## Database diagram

Every example on this page queries the same toy schema. Read it once, refer back as needed.

```mermaid
erDiagram
  USERS ||--o{ ORDERS : places

  USERS {
    int id PK
    string name
    string country
    string email
    string phone
    decimal lifetime_value
    timestamp created_at
  }
  ORDERS {
    int id PK
    int user_id FK
    string status
    decimal total
    timestamp created_at
  }
  LEADS {
    int id PK
    string email
    timestamp created_at
  }
  EMPLOYEES {
    int id PK
    string name
    int manager_id FK
  }
```

### How to read this diagram

This is an **ER (entity-relationship) diagram** in Mermaid syntax. Conventions:

- **Each box is a table.** Bold name on top; columns listed below as `type name [PK|FK]`.
- **`PK`** = *primary key*. Uniquely identifies a row — no two rows share the same PK value.
- **`FK`** = *foreign key*. Column whose value is the PK of another table — the "join key" that says which row this one belongs to.
- **Line between two tables** = a relationship. The endpoint markers are **crow's-foot notation**:
    - `||` *exactly one*
    - `o|` *zero or one*
    - `}o` *zero or many*
    - `}|` *one or many*

    So `USERS ||--o{ ORDERS : places` reads "one user places zero-or-many orders."
- **Self-loop** (`EMPLOYEES }o--o| EMPLOYEES : reports_to`) is a relationship into the same table — many employees report to zero-or-one manager (the CEO has none). Standard pattern for trees/hierarchies (employees ↔ manager, comments ↔ parent, categories ↔ subcategory).
- **No line ≠ unrelated.** `USERS.email` and `LEADS.email` aren't formally linked, but you can still match them as a set operation.

You'll see this schema referenced throughout the rest of the page.


## JOIN

JOINs let you combine rows from two tables on a related column. In our schema, the canonical example is `users` ⋈ `orders` ON `users.id = orders.user_id`.

<div class="join-explorer" data-join="inner" markdown="0">
  <div class="je-buttons" role="tablist" aria-label="JOIN type">
    <button class="je-btn" data-join="inner"      aria-pressed="true">INNER</button>
    <button class="je-btn" data-join="left"       aria-pressed="false">LEFT</button>
    <button class="je-btn" data-join="right"      aria-pressed="false">RIGHT</button>
    <button class="je-btn" data-join="full"       aria-pressed="false">FULL OUTER</button>
    <button class="je-btn" data-join="left_excl"  aria-pressed="false">LEFT EXCLUSIVE</button>
    <button class="je-btn" data-join="right_excl" aria-pressed="false">RIGHT EXCLUSIVE</button>
    <button class="je-btn" data-join="full_excl"  aria-pressed="false">FULL EXCLUSIVE</button>
    <button class="je-btn" data-join="cross"      aria-pressed="false">CROSS</button>
    <button class="je-btn" data-join="self"       aria-pressed="false">SELF</button>
  </div>

  <div class="je-stage">
    <svg class="je-venn" viewBox="0 0 280 160" role="img" aria-labelledby="je-title je-desc">
      <title id="je-title">Two-set Venn diagram for SQL joins</title>
      <desc id="je-desc">Highlighted region updates when a JOIN type is selected.</desc>
      <defs>
        <clipPath id="je-clip-a"><circle cx="110" cy="80" r="50"/></clipPath>
        <clipPath id="je-clip-b"><circle cx="170" cy="80" r="50"/></clipPath>
        <mask id="je-mask-not-b" maskUnits="userSpaceOnUse" x="0" y="0" width="280" height="160">
          <rect width="280" height="160" fill="white"/>
          <circle cx="170" cy="80" r="50" fill="black"/>
        </mask>
        <mask id="je-mask-not-a" maskUnits="userSpaceOnUse" x="0" y="0" width="280" height="160">
          <rect width="280" height="160" fill="white"/>
          <circle cx="110" cy="80" r="50" fill="black"/>
        </mask>
      </defs>

      <!-- highlight regions -->
      <circle data-region="a"  cx="110" cy="80" r="50" mask="url(#je-mask-not-b)" class="je-region"/>
      <circle data-region="ab" cx="110" cy="80" r="50" clip-path="url(#je-clip-b)" class="je-region"/>
      <circle data-region="b"  cx="170" cy="80" r="50" mask="url(#je-mask-not-a)" class="je-region"/>

      <!-- outlines -->
      <circle cx="110" cy="80" r="50" class="je-outline"/>
      <circle cx="170" cy="80" r="50" class="je-outline"/>

      <!-- labels -->
      <text x="78"  y="84" class="je-label">A</text>
      <text x="202" y="84" class="je-label">B</text>
    </svg>

    <svg class="je-grid" viewBox="0 0 280 160" role="img" aria-label="Cross join Cartesian product grid">
      <!-- column headers (B) -->
      <g class="je-grid-cell">
        <rect x="92"  y="22" width="40" height="26" rx="4"/>
        <rect x="138" y="22" width="40" height="26" rx="4"/>
        <rect x="184" y="22" width="40" height="26" rx="4"/>
        <text x="112" y="40" class="je-label">B1</text>
        <text x="158" y="40" class="je-label">B2</text>
        <text x="204" y="40" class="je-label">B3</text>
      </g>
      <!-- row headers (A) -->
      <g class="je-grid-cell">
        <rect x="40" y="56"  width="40" height="26" rx="4"/>
        <rect x="40" y="88"  width="40" height="26" rx="4"/>
        <rect x="40" y="120" width="40" height="26" rx="4"/>
        <text x="60" y="74"  class="je-label">A1</text>
        <text x="60" y="106" class="je-label">A2</text>
        <text x="60" y="138" class="je-label">A3</text>
      </g>
      <!-- product cells -->
      <g class="je-grid-prod">
        <rect x="92"  y="56"  width="40" height="26" rx="4"/>
        <rect x="138" y="56"  width="40" height="26" rx="4"/>
        <rect x="184" y="56"  width="40" height="26" rx="4"/>
        <rect x="92"  y="88"  width="40" height="26" rx="4"/>
        <rect x="138" y="88"  width="40" height="26" rx="4"/>
        <rect x="184" y="88"  width="40" height="26" rx="4"/>
        <rect x="92"  y="120" width="40" height="26" rx="4"/>
        <rect x="138" y="120" width="40" height="26" rx="4"/>
        <rect x="184" y="120" width="40" height="26" rx="4"/>
        <text x="112" y="74"  class="je-label">×</text>
        <text x="158" y="74"  class="je-label">×</text>
        <text x="204" y="74"  class="je-label">×</text>
        <text x="112" y="106" class="je-label">×</text>
        <text x="158" y="106" class="je-label">×</text>
        <text x="204" y="106" class="je-label">×</text>
        <text x="112" y="138" class="je-label">×</text>
        <text x="158" y="138" class="je-label">×</text>
        <text x="204" y="138" class="je-label">×</text>
      </g>
    </svg>

    <svg class="je-self" viewBox="0 0 280 160" role="img" aria-label="Self join: same table joined under two aliases">
      <text x="140" y="22" class="je-label" style="font-size:10px; letter-spacing:.06em">SAME TABLE · TWO ALIASES</text>
      <circle cx="100" cy="82" r="42" class="je-region" style="opacity:.55"/>
      <circle cx="180" cy="82" r="42" class="je-region" style="opacity:.55"/>
      <circle cx="100" cy="82" r="42" class="je-outline"/>
      <circle cx="180" cy="82" r="42" class="je-outline"/>
      <text x="100" y="86" class="je-label">t1</text>
      <text x="180" y="86" class="je-label">t2</text>
      <path d="M 100 132 Q 140 152 180 132" class="je-self-link"/>
      <text x="140" y="152" class="je-label" style="font-size:10px">= one table</text>
    </svg>
  </div>

  <div class="je-meta">
    <div class="je-name">
      <span data-field="name">INNER JOIN</span>
      <span class="je-level" data-field="level" data-level="beginner">BEGINNER</span>
    </div>
    <div class="je-tag"   data-field="tag">A ∩ B  ·  matches in both</div>
    <div class="je-desc"  data-field="desc">Returns only rows whose key exists in <em>both</em> tables.</div>
    <pre class="je-sql"><code data-field="sql">SELECT *
FROM   a
INNER JOIN b ON a.id = b.a_id;</code></pre>
  </div>
</div>

<style>
.join-explorer{
  --je-fill: var(--md-accent-fg-color, #58a6ff);
  --je-edge: var(--md-default-fg-color--lighter, rgba(127,127,127,.45));
  --je-text: var(--md-default-fg-color, currentColor);
  --je-muted: var(--md-default-fg-color--light, rgba(127,127,127,.85));
  --je-cell: var(--md-default-fg-color--lightest, rgba(127,127,127,.18));
  border: 1px solid var(--je-edge);
  border-radius: 8px;
  padding: 1rem 1rem 1.1rem;
  margin: 1.25rem 0;
  background: var(--md-default-bg-color, transparent);
}
.join-explorer .je-buttons{
  display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:1rem;
}
.join-explorer .je-btn{
  font: inherit; font-size:.72rem; letter-spacing:.04em;
  background: transparent; color: var(--je-muted);
  border: 1px solid var(--je-edge); border-radius: 999px;
  padding: .32em .8em; cursor: pointer;
  transition: background .15s, color .15s, border-color .15s;
}
.join-explorer .je-btn:hover{ color: var(--je-text); border-color: var(--je-text); }
.join-explorer .je-btn[aria-pressed="true"]{
  background: var(--je-fill);
  color: var(--md-accent-bg-color, var(--md-default-bg-color, #fff));
  border-color: transparent;
}
.join-explorer .je-stage{
  display:flex; justify-content:center; align-items:center;
  min-height: 180px;
}
.join-explorer .je-venn,
.join-explorer .je-grid,
.join-explorer .je-self{
  width: 100%; max-width: 360px; height: auto;
}
.join-explorer .je-grid,
.join-explorer .je-self{ display:none; }
.join-explorer[data-join="cross"] .je-venn{ display:none; }
.join-explorer[data-join="cross"] .je-grid{ display:block; }
.join-explorer[data-join="self"]  .je-venn{ display:none; }
.join-explorer[data-join="self"]  .je-self{ display:block; }
.join-explorer .je-self-link{
  fill:none; stroke: var(--je-edge); stroke-width: 1; opacity:.7;
}

.join-explorer .je-region{
  fill: var(--je-fill); opacity: 0;
  transition: opacity .25s ease;
}
.join-explorer .je-outline{
  fill: none; stroke: var(--je-edge); stroke-width: 1.2;
}
.join-explorer .je-label{
  fill: var(--je-muted); font-size: 11px;
  font-family: var(--md-code-font-family, ui-monospace, monospace);
  text-anchor: middle; dominant-baseline: middle;
}
.join-explorer .je-grid-cell rect{ fill: var(--je-cell); }
.join-explorer .je-grid-prod rect{ fill: var(--je-fill); opacity:.35; }

.join-explorer .je-meta{ margin-top: 1rem; }
.join-explorer .je-name{
  font-weight: 600; font-size: .95rem; color: var(--je-text);
  letter-spacing: .02em;
  display: flex; align-items: center; gap: .55em; flex-wrap: wrap;
}
.join-explorer .je-level{
  font-family: var(--md-code-font-family, ui-monospace, monospace);
  font-size: .58rem; font-weight: 600;
  letter-spacing: .1em; text-transform: uppercase;
  padding: .25em .6em; border-radius: 999px;
  border: 1px solid currentColor;
  line-height: 1;
}
.join-explorer .je-level[data-level="beginner"]    { color:#1d9e75; }
.join-explorer .je-level[data-level="intermediate"]{ color:#c97f0a; }
.join-explorer .je-level[data-level="advanced"]    { color:#d85a30; }
.join-explorer .je-tag{
  font-family: var(--md-code-font-family, ui-monospace, monospace);
  font-size: .72rem; color: var(--je-muted);
  margin-top:.15rem;
}
.join-explorer .je-desc{
  margin-top:.55rem; font-size:.88rem; color: var(--je-text);
}
.join-explorer .je-sql{
  margin-top:.7rem;
  background: var(--md-code-bg-color, rgba(127,127,127,.12));
  color: var(--md-code-fg-color, var(--je-text));
  padding: .7rem .85rem; border-radius: 6px;
  font-family: var(--md-code-font-family, ui-monospace, monospace);
  font-size: .78rem; line-height: 1.5;
  overflow-x: auto;
}
.join-explorer .je-sql code{ background:none; padding:0; font: inherit; color: inherit; }
</style>

<script>
(function(){
  var root = document.currentScript.previousElementSibling;
  // walk back to the .join-explorer container (skip <style>)
  while (root && !root.classList.contains('join-explorer')) root = root.previousElementSibling;
  if (!root) return;

  var joins = {
    inner:      { name:'INNER JOIN',           level:'beginner',
                  tag:'A ∩ B  ·  matches in both',
                  desc:'Returns only rows whose key exists in <em>both</em> tables.',
                  regions:['ab'],
                  sql:'SELECT *\nFROM   a\nINNER JOIN b ON a.id = b.a_id;' },
    left:       { name:'LEFT JOIN',            level:'beginner',
                  tag:'A  ·  all of A, matches from B',
                  desc:'All rows from A. Matching B columns where they exist; <code>NULL</code> otherwise.',
                  regions:['a','ab'],
                  sql:'SELECT *\nFROM   a\nLEFT JOIN b ON a.id = b.a_id;' },
    right:      { name:'RIGHT JOIN',           level:'beginner',
                  tag:'B  ·  all of B, matches from A',
                  desc:'All rows from B. Mirror of LEFT JOIN — most analysts swap sides and use LEFT instead.',
                  regions:['b','ab'],
                  sql:'SELECT *\nFROM   a\nRIGHT JOIN b ON a.id = b.a_id;' },
    full:       { name:'FULL OUTER JOIN',      level:'intermediate',
                  tag:'A ∪ B  ·  everything from both',
                  desc:'Every row from both tables. Non-matches on either side become <code>NULL</code>.',
                  regions:['a','ab','b'],
                  sql:'SELECT *\nFROM   a\nFULL OUTER JOIN b ON a.id = b.a_id;' },
    left_excl:  { name:'LEFT EXCLUSIVE',       level:'intermediate',
                  tag:'A − B  ·  in A only (anti-join)',
                  desc:'Rows in A with <em>no</em> match in B. Useful for “customers without orders”.',
                  regions:['a'],
                  sql:'SELECT *\nFROM   a\nLEFT JOIN b ON a.id = b.a_id\nWHERE  b.a_id IS NULL;' },
    right_excl: { name:'RIGHT EXCLUSIVE',      level:'intermediate',
                  tag:'B − A  ·  in B only (anti-join)',
                  desc:'Rows in B with no match in A. Useful for “orphan” records.',
                  regions:['b'],
                  sql:'SELECT *\nFROM   a\nRIGHT JOIN b ON a.id = b.a_id\nWHERE  a.id IS NULL;' },
    full_excl:  { name:'FULL EXCLUSIVE (XOR)', level:'advanced',
                  tag:'(A ∪ B) − (A ∩ B)  ·  unmatched on either side',
                  desc:'Everything except the matches — symmetric difference. Often written as a UNION of the two anti-joins.',
                  regions:['a','b'],
                  sql:'SELECT *\nFROM   a\nFULL OUTER JOIN b ON a.id = b.a_id\nWHERE  a.id IS NULL OR b.a_id IS NULL;' },
    cross:      { name:'CROSS JOIN',           level:'intermediate',
                  tag:'A × B  ·  Cartesian product',
                  desc:'Every row of A paired with every row of B. <strong>m × n</strong> output. Use with caution.',
                  regions:[],
                  sql:'SELECT *\nFROM   a\nCROSS JOIN b;' },
    self:       { name:'SELF JOIN',            level:'intermediate',
                  tag:'T ⋈ T  ·  one table, two aliases',
                  desc:'A table joined to itself — usually to walk a hierarchy or compare rows within the same table (e.g. employee → manager).',
                  regions:[],
                  sql:'SELECT  e.name AS employee,\n        m.name AS manager\nFROM    employees e\nLEFT JOIN employees m ON e.manager_id = m.id;' }
  };

  var REGIONS = ['a','ab','b'];
  var regionEls = {};
  REGIONS.forEach(function(r){
    regionEls[r] = root.querySelector('[data-region="'+r+'"]');
  });
  var fields = {};
  ['name','level','tag','desc','sql'].forEach(function(f){
    fields[f] = root.querySelector('[data-field="'+f+'"]');
  });
  var btns = root.querySelectorAll('.je-btn');

  function apply(key){
    var j = joins[key]; if (!j) return;
    root.setAttribute('data-join', key);
    REGIONS.forEach(function(r){
      regionEls[r].style.opacity = j.regions.indexOf(r) >= 0 ? '0.55' : '0';
    });
    fields.name.textContent  = j.name;
    fields.level.textContent = j.level.toUpperCase();
    fields.level.setAttribute('data-level', j.level);
    fields.tag.innerHTML     = j.tag;
    fields.desc.innerHTML    = j.desc;
    fields.sql.textContent   = j.sql;
    btns.forEach(function(b){
      b.setAttribute('aria-pressed', b.dataset.join === key ? 'true' : 'false');
    });
  }

  btns.forEach(function(b){
    b.addEventListener('click', function(){ apply(b.dataset.join); });
  });

  // initial state
  apply(root.getAttribute('data-join') || 'inner');
}());
</script>




## SELECT basics

Pick rows or columns from a table. Click each variant to see what changes.

<div class="sx-explorer" data-variant="all" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="all"      aria-pressed="true">SELECT *</button>
    <button class="sx-btn" data-variant="cols"     aria-pressed="false">columns</button>
    <button class="sx-btn" data-variant="distinct" aria-pressed="false">DISTINCT</button>
    <button class="sx-btn" data-variant="limit"    aria-pressed="false">LIMIT</button>
  </div>
  <div class="sx-stage">
    <div class="sx-sublabel">Input · users</div>
    <div class="sx-table-wrap" data-stage="input"></div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">Result</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'all',
  stages: {
    input: { cols:['id','name','country','email'], rows:[
      [1,'Alice','US','alice@gmail.com'],
      [2,'Bob','UK','bob@yahoo.com'],
      [3,'Cara','US','cara@gmail.com'],
      [4,'Dan','CA','dan@hotmail.com']
    ]}
  },
  variants: {
    all: { name:'SELECT *', level:'beginner',
      tag:'every column, every row',
      desc:'Returns all columns. Cheap to type, fragile in production — schema changes leak through.',
      sql:'SELECT *\nFROM users;',
      stages:{ output:{ cols:['id','name','country','email'], rows:[
        [1,'Alice','US','alice@gmail.com'],
        [2,'Bob','UK','bob@yahoo.com'],
        [3,'Cara','US','cara@gmail.com'],
        [4,'Dan','CA','dan@hotmail.com']
      ]}}
    },
    cols: { name:'SELECT columns', level:'beginner',
      tag:'projection · pick the columns you need',
      desc:'List columns explicitly. Faster, clearer, version-stable.',
      sql:'SELECT name, country\nFROM users;',
      hl:{ input:[1,2] },
      stages:{ output:{ cols:['name','country'], rows:[
        ['Alice','US'],['Bob','UK'],['Cara','US'],['Dan','CA']
      ]}}
    },
    distinct: { name:'SELECT DISTINCT', level:'beginner',
      tag:'unique values only',
      desc:'Removes duplicate rows from the result.',
      sql:'SELECT DISTINCT country\nFROM users;',
      hl:{ input:[2] },
      stages:{ output:{ cols:['country'], rows:[
        ['US'],['UK'],['CA']
      ]}}
    },
    limit: { name:'LIMIT', level:'beginner',
      tag:'cap the row count',
      desc:'Returns at most N rows. Pair with <code>ORDER BY</code> for determinism.',
      sql:'SELECT *\nFROM users\nLIMIT 2;',
      stages:{ output:{ cols:['id','name','country','email'], rows:[
        [1,'Alice','US','alice@gmail.com'],
        [2,'Bob','UK','bob@yahoo.com']
      ]}}
    }
  }
});
</script>


## WHERE filters

Filter rows by condition. Highlighted rows match the predicate.

<div class="sx-explorer" data-variant="equals" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="equals"  aria-pressed="true">=</button>
    <button class="sx-btn" data-variant="and"     aria-pressed="false">AND</button>
    <button class="sx-btn" data-variant="like"    aria-pressed="false">LIKE</button>
    <button class="sx-btn" data-variant="in"      aria-pressed="false">IN</button>
    <button class="sx-btn" data-variant="between" aria-pressed="false">BETWEEN</button>
    <button class="sx-btn" data-variant="isnull"  aria-pressed="false">IS NULL</button>
    <button class="sx-btn" data-variant="notnull" aria-pressed="false">IS NOT NULL</button>
  </div>
  <div class="sx-stage">
    <div class="sx-sublabel">Input · users (highlighted = match)</div>
    <div class="sx-table-wrap" data-stage="input"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'equals',
  stages: {
    input: { cols:['id','country','email','phone','lifetime_value'], rows:[
      [1,'US','alice@gmail.com','555-1', 250],
      [2,'UK','bob@yahoo.com',  null,     80],
      [3,'CA','cara@gmail.com', '555-3', 150],
      [4,'US','dan@hotmail.com','555-4', 600],
      [5,'DE','eve@gmail.com',  null,    420]
    ]}
  },
  variants: {
    equals:  { name:"country = 'US'", level:'beginner',
      tag:'equality predicate',
      desc:'Simple match. <code>=</code> ignores rows where the column is <code>NULL</code>.',
      sql:"SELECT *\nFROM   users\nWHERE  country = 'US';",
      hl:{input:[1]}, matches:{ input:[0,3] } },
    and: { name:"country = 'US' AND lifetime_value > 100", level:'beginner',
      tag:'compound · all conditions must hold',
      desc:'Combine predicates with <code>AND</code>. Use <code>OR</code> for either-side matches; parens for clarity.',
      sql:"SELECT *\nFROM   users\nWHERE  country = 'US'\n  AND  lifetime_value > 100;",
      hl:{input:[1,4]}, matches:{ input:[0,3] } },
    like: { name:"email LIKE '%@gmail.com'", level:'beginner',
      tag:'pattern match · % = any chars, _ = one char',
      desc:'Pattern match. Use <code>ILIKE</code> for case-insensitive (Postgres).',
      sql:"SELECT *\nFROM   users\nWHERE  email LIKE '%@gmail.com';",
      hl:{input:[2]}, matches:{ input:[0,2,4] } },
    in: { name:"country IN ('US','CA')", level:'beginner',
      tag:'membership in a list',
      desc:'Cleaner than chaining <code>OR</code>s. Negate with <code>NOT IN</code>.',
      sql:"SELECT *\nFROM   users\nWHERE  country IN ('US','CA');",
      hl:{input:[1]}, matches:{ input:[0,2,3] } },
    between: { name:'lifetime_value BETWEEN 100 AND 500', level:'beginner',
      tag:'inclusive range · low <= x <= high',
      desc:'Inclusive on both ends. Equivalent to <code>x &gt;= low AND x &lt;= high</code>.',
      sql:'SELECT *\nFROM   users\nWHERE  lifetime_value BETWEEN 100 AND 500;',
      hl:{input:[4]}, matches:{ input:[0,2,4] } },
    isnull: { name:'phone IS NULL', level:'intermediate',
      tag:'NULL test · = NULL is wrong',
      desc:'<code>NULL = NULL</code> evaluates to <em>unknown</em> — always use <code>IS NULL</code>.',
      sql:'SELECT *\nFROM   users\nWHERE  phone IS NULL;',
      hl:{input:[3]}, matches:{ input:[1,4] } },
    notnull: { name:'phone IS NOT NULL', level:'intermediate',
      tag:'has a value',
      desc:'Opposite of <code>IS NULL</code>. Same NULL caveat applies — use this form, not <code>!= NULL</code>.',
      sql:'SELECT *\nFROM   users\nWHERE  phone IS NOT NULL;',
      hl:{input:[3]}, matches:{ input:[0,2,3] } }
  }
});
</script>


## Aggregation

Roll many rows up into summary numbers with `GROUP BY`.

<div class="sx-explorer" data-variant="count" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="count"     aria-pressed="true">COUNT(*)</button>
    <button class="sx-btn" data-variant="distinct"  aria-pressed="false">COUNT(DISTINCT)</button>
    <button class="sx-btn" data-variant="sum"       aria-pressed="false">SUM</button>
    <button class="sx-btn" data-variant="avg"       aria-pressed="false">AVG</button>
    <button class="sx-btn" data-variant="min"       aria-pressed="false">MIN</button>
    <button class="sx-btn" data-variant="max"       aria-pressed="false">MAX</button>
    <button class="sx-btn" data-variant="group"     aria-pressed="false">GROUP BY</button>
    <button class="sx-btn" data-variant="having"    aria-pressed="false">HAVING</button>
  </div>
  <div class="sx-stage">
    <div class="sx-sublabel">Input · orders</div>
    <div class="sx-table-wrap" data-stage="input"></div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">Result</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'count',
  stages: {
    input: { cols:['id','user_id','status','total'], rows:[
      [101,1,'paid',100],[102,2,'paid', 50],[103,1,'paid',200],
      [104,3,'open', 80],[105,2,'paid', 30],[106,4,'open',500]
    ]}
  },
  variants: {
    count: { name:'COUNT(*)', level:'beginner',
      tag:'how many rows',
      desc:'Counts every row, including those with <code>NULL</code>s.',
      sql:'SELECT COUNT(*) AS rows\nFROM   orders;',
      stages:{output:{cols:['rows'], rows:[[6]]}} },
    distinct: { name:'COUNT(DISTINCT col)', level:'beginner',
      tag:'unique non-null values',
      desc:'Counts unique values; ignores <code>NULL</code>.',
      sql:'SELECT COUNT(DISTINCT user_id) AS users\nFROM   orders;',
      hl:{input:[1]},
      stages:{output:{cols:['users'], rows:[[4]]}} },
    sum: { name:'SUM(total)', level:'beginner',
      tag:'add the column up',
      desc:'Adds non-null values. Returns <code>NULL</code> on empty input.',
      sql:'SELECT SUM(total) AS revenue\nFROM   orders;',
      hl:{input:[3]},
      stages:{output:{cols:['revenue'], rows:[[960]]}} },
    avg: { name:'AVG(total)', level:'beginner',
      tag:'arithmetic mean',
      desc:'Average of non-null values.',
      sql:'SELECT AVG(total) AS avg_order\nFROM   orders;',
      hl:{input:[3]},
      stages:{output:{cols:['avg_order'], rows:[[160]]}} },
    min: { name:'MIN(total)', level:'beginner',
      tag:'smallest value',
      desc:'Smallest non-null value.',
      sql:'SELECT MIN(total) AS min_order\nFROM   orders;',
      hl:{input:[3]},
      stages:{output:{cols:['min_order'], rows:[[30]]}} },
    max: { name:'MAX(total)', level:'beginner',
      tag:'largest value',
      desc:'Largest non-null value.',
      sql:'SELECT MAX(total) AS max_order\nFROM   orders;',
      hl:{input:[3]},
      stages:{output:{cols:['max_order'], rows:[[500]]}} },
    group: { name:'GROUP BY status', level:'beginner',
      tag:'one row per group',
      desc:'Collapse rows that share a key, apply aggregates per group.',
      sql:'SELECT status, SUM(total) AS revenue\nFROM   orders\nGROUP BY status;',
      hl:{input:[2,3]},
      stages:{output:{cols:['status','revenue'], rows:[
        ['paid',380],['open',580]
      ]}} },
    having: { name:'GROUP BY … HAVING', level:'intermediate',
      tag:'filter <em>after</em> aggregation',
      desc:'<code>WHERE</code> filters rows; <code>HAVING</code> filters groups. <code>HAVING</code> can use aggregates, <code>WHERE</code> cannot.',
      sql:'SELECT status, SUM(total) AS revenue\nFROM   orders\nGROUP BY status\nHAVING SUM(total) > 400;',
      hl:{input:[2,3]},
      stages:{output:{cols:['status','revenue'], rows:[
        ['open',580]
      ]}} }
  }
});
</script>


## CASE expressions

Conditional logic inline — bucket values into categories.

<div class="sx-explorer" data-variant="simple" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="simple"   aria-pressed="true">2 buckets</button>
    <button class="sx-btn" data-variant="nested"   aria-pressed="false">3 buckets</button>
    <button class="sx-btn" data-variant="null_safe" aria-pressed="false">NULL-safe</button>
  </div>
  <div class="sx-stage">
    <div class="sx-sublabel">Input · orders</div>
    <div class="sx-table-wrap" data-stage="input"></div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">Result · adds a segment column</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'simple',
  stages: {
    input: { cols:['id','total'], rows:[
      [1,5000],[2,250],[3,50],[4,1500],[5,null]
    ]}
  },
  variants: {
    simple: { name:'CASE · 2 buckets', level:'beginner',
      tag:'binary classification',
      desc:'Two-way bucket. Predicates are evaluated top-down; first match wins.',
      sql:"SELECT id, total,\n       CASE WHEN total > 500 THEN 'high'\n            ELSE                'low'\n       END AS segment\nFROM   orders;",
      stages:{output:{cols:['id','total','segment'], rows:[
        [1,5000,'high'],[2,250,'low'],[3,50,'low'],[4,1500,'high'],[5,null,'low']
      ]}} },
    nested: { name:'CASE · 3 buckets', level:'beginner',
      tag:'tiered thresholds',
      desc:'Order matters: list the most specific (highest threshold) first.',
      sql:"SELECT id, total,\n       CASE WHEN total > 1000 THEN 'whale'\n            WHEN total >  100 THEN 'regular'\n            ELSE                'small'\n       END AS segment\nFROM   orders;",
      stages:{output:{cols:['id','total','segment'], rows:[
        [1,5000,'whale'],[2,250,'regular'],[3,50,'small'],[4,1500,'whale'],[5,null,'small']
      ]}} },
    null_safe: { name:'CASE · NULL-safe', level:'intermediate',
      tag:'handle missing values explicitly',
      desc:'<code>NULL &gt; 100</code> is <em>unknown</em>, falling through to <code>ELSE</code>. Branch on <code>IS NULL</code> first if you need a distinct bucket.',
      sql:"SELECT id, total,\n       CASE WHEN total IS NULL  THEN 'unknown'\n            WHEN total > 1000   THEN 'whale'\n            WHEN total >  100   THEN 'regular'\n            ELSE                  'small'\n       END AS segment\nFROM   orders;",
      stages:{output:{cols:['id','total','segment'], rows:[
        [1,5000,'whale'],[2,250,'regular'],[3,50,'small'],[4,1500,'whale'],[5,null,'unknown']
      ]}} }
  }
});
</script>


## Subqueries and CTEs

Same result, three readability shapes. Find orders from US users.

<div class="sx-explorer" data-variant="subquery" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="subquery" aria-pressed="true">subquery</button>
    <button class="sx-btn" data-variant="cte"      aria-pressed="false">CTE (WITH)</button>
    <button class="sx-btn" data-variant="multicte" aria-pressed="false">multi-CTE</button>
    <button class="sx-btn" data-variant="join"     aria-pressed="false">JOIN</button>
  </div>
  <div class="sx-stage">
    <div class="sx-stage-grid">
      <div>
        <div class="sx-sublabel">users</div>
        <div class="sx-table-wrap" data-stage="users"></div>
      </div>
      <div>
        <div class="sx-sublabel">orders</div>
        <div class="sx-table-wrap" data-stage="orders"></div>
      </div>
    </div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">Result · orders from US users</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'subquery',
  stages: {
    users:  { cols:['id','name','country'], rows:[
      [1,'Alice','US'],[2,'Bob','UK'],[3,'Cara','US'],[4,'Dan','CA']
    ]},
    orders: { cols:['id','user_id','total'], rows:[
      [101,1,200],[102,2,150],[103,3,400],[104,1,250]
    ]},
    output: { cols:['id','user_id','total'], rows:[
      [101,1,200],[103,3,400],[104,1,250]
    ]}
  },
  variants: {
    subquery: { name:'Subquery · IN ( SELECT … )', level:'beginner',
      tag:'inline · readable for one filter',
      desc:'Filter the outer query with the result of an inner one. Fine for one nesting level; gets messy fast.',
      sql:"SELECT *\nFROM   orders\nWHERE  user_id IN (\n  SELECT id FROM users WHERE country = 'US'\n);" },
    cte: { name:'CTE · WITH alias AS ( … )', level:'intermediate',
      tag:'name a query, then use it',
      desc:'A common table expression names an intermediate result. Reads top-down — much easier to debug.',
      sql:"WITH us_users AS (\n  SELECT id FROM users WHERE country = 'US'\n)\nSELECT *\nFROM   orders\nWHERE  user_id IN (SELECT id FROM us_users);" },
    multicte: { name:'Multi-CTE pipeline', level:'advanced',
      tag:'chain steps · each builds on the previous',
      desc:'Chain CTEs to spell out a transformation in steps. Each is reusable lower down.',
      sql:"WITH us_users AS (\n  SELECT id FROM users WHERE country = 'US'\n),\ntheir_orders AS (\n  SELECT *\n  FROM   orders\n  WHERE  user_id IN (SELECT id FROM us_users)\n)\nSELECT *\nFROM   their_orders;" },
    join: { name:'JOIN form', level:'beginner',
      tag:'often the planner-friendly equivalent',
      desc:'Same result via a join. Most query planners optimise to the same plan as the subquery.',
      sql:"SELECT o.*\nFROM   orders o\nJOIN   users  u ON u.id = o.user_id\nWHERE  u.country = 'US';" }
  }
});
</script>


## Window functions

Calculate over partitions <em>without</em> collapsing rows. Output gets one extra column.

<div class="sx-explorer" data-variant="row_number" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="row_number"    aria-pressed="true">ROW_NUMBER</button>
    <button class="sx-btn" data-variant="rank"          aria-pressed="false">RANK</button>
    <button class="sx-btn" data-variant="dense_rank"    aria-pressed="false">DENSE_RANK</button>
    <button class="sx-btn" data-variant="running_total" aria-pressed="false">running SUM</button>
    <button class="sx-btn" data-variant="lag"           aria-pressed="false">LAG</button>
    <button class="sx-btn" data-variant="lead"          aria-pressed="false">LEAD</button>
  </div>
  <div class="sx-stage">
    <div class="sx-sublabel">Input · orders</div>
    <div class="sx-table-wrap" data-stage="input"></div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">Result · same rows, new column</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'row_number',
  stages: {
    input: { cols:['user_id','total'], rows:[
      [1,80],[1,100],[1,250],[2,100],[2,200],[2,200],[3,500]
    ]}
  },
  variants: {
    row_number: { name:'ROW_NUMBER()', level:'beginner',
      tag:'unique sequential number per partition',
      desc:'Sequential 1, 2, 3… Always unique, even on ties — pick the tie-breaker carefully.',
      sql:'SELECT user_id, total,\n       ROW_NUMBER() OVER (PARTITION BY user_id\n                          ORDER BY total DESC) AS rn\nFROM   orders;',
      stages:{output:{cols:['user_id','total','rn'], rows:[
        [1,80,3],[1,100,2],[1,250,1],
        [2,100,3],[2,200,1],[2,200,2],
        [3,500,1]
      ]}} },
    rank: { name:'RANK()', level:'intermediate',
      tag:'ties share a number; gaps after',
      desc:'Ties get the same rank. Next rank skips: 1, 1, <strong>3</strong>.',
      sql:'SELECT user_id, total,\n       RANK() OVER (PARTITION BY user_id\n                    ORDER BY total DESC) AS rk\nFROM   orders;',
      stages:{output:{cols:['user_id','total','rk'], rows:[
        [1,80,3],[1,100,2],[1,250,1],
        [2,100,3],[2,200,1],[2,200,1],
        [3,500,1]
      ]}} },
    dense_rank: { name:'DENSE_RANK()', level:'intermediate',
      tag:'ties share a number; no gaps',
      desc:'Like <code>RANK</code> but no gaps after ties: 1, 1, <strong>2</strong>.',
      sql:'SELECT user_id, total,\n       DENSE_RANK() OVER (PARTITION BY user_id\n                          ORDER BY total DESC) AS drk\nFROM   orders;',
      stages:{output:{cols:['user_id','total','drk'], rows:[
        [1,80,3],[1,100,2],[1,250,1],
        [2,100,2],[2,200,1],[2,200,1],
        [3,500,1]
      ]}} },
    running_total: { name:'SUM() OVER · running total', level:'intermediate',
      tag:'cumulative sum within a partition',
      desc:'Running total within each <code>user_id</code>, ordered ascending. Drop <code>PARTITION BY</code> for a global running total.',
      sql:'SELECT user_id, total,\n       SUM(total) OVER (PARTITION BY user_id\n                        ORDER BY total) AS running\nFROM   orders;',
      stages:{output:{cols:['user_id','total','running'], rows:[
        [1,80,80],[1,100,180],[1,250,430],
        [2,100,100],[2,200,300],[2,200,500],
        [3,500,500]
      ]}} },
    lag: { name:'LAG(col)', level:'intermediate',
      tag:'previous row in the partition',
      desc:'Value from the previous row, ordered by <code>total</code>. <code>NULL</code> on the first row.',
      sql:'SELECT user_id, total,\n       LAG(total) OVER (PARTITION BY user_id\n                        ORDER BY total) AS prev\nFROM   orders;',
      stages:{output:{cols:['user_id','total','prev'], rows:[
        [1,80,null],[1,100,80],[1,250,100],
        [2,100,null],[2,200,100],[2,200,200],
        [3,500,null]
      ]}} },
    lead: { name:'LEAD(col)', level:'intermediate',
      tag:'next row in the partition',
      desc:'Value from the next row, ordered by <code>total</code>. <code>NULL</code> on the last row.',
      sql:'SELECT user_id, total,\n       LEAD(total) OVER (PARTITION BY user_id\n                         ORDER BY total) AS next\nFROM   orders;',
      stages:{output:{cols:['user_id','total','next'], rows:[
        [1,80,100],[1,100,250],[1,250,null],
        [2,100,200],[2,200,200],[2,200,null],
        [3,500,null]
      ]}} }
  }
});
</script>


## Set operations

Combine the rows of two queries — like Venn diagrams over result sets. Both queries must have the <em>same number and type</em> of columns.

<div class="sx-explorer" data-variant="union" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="union"     aria-pressed="true">UNION</button>
    <button class="sx-btn" data-variant="union_all" aria-pressed="false">UNION ALL</button>
    <button class="sx-btn" data-variant="intersect" aria-pressed="false">INTERSECT</button>
    <button class="sx-btn" data-variant="except"    aria-pressed="false">EXCEPT</button>
  </div>
  <div class="sx-stage">
    <div class="sx-stage-grid">
      <div>
        <div class="sx-sublabel">users.email</div>
        <div class="sx-table-wrap" data-stage="left"></div>
      </div>
      <div>
        <div class="sx-sublabel">leads.email</div>
        <div class="sx-table-wrap" data-stage="right"></div>
      </div>
    </div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">Result</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'union',
  stages: {
    left:  { cols:['email'], rows:[
      ['alice@gmail.com'],['bob@yahoo.com'],['cara@gmail.com']
    ]},
    right: { cols:['email'], rows:[
      ['bob@yahoo.com'],['cara@gmail.com'],['eve@gmail.com']
    ]}
  },
  variants: {
    union: { name:'UNION', level:'beginner',
      tag:'A ∪ B  ·  distinct',
      desc:'All rows from both queries, duplicates removed.',
      sql:'SELECT email FROM users\nUNION\nSELECT email FROM leads;',
      stages:{output:{cols:['email'], rows:[
        ['alice@gmail.com'],['bob@yahoo.com'],['cara@gmail.com'],['eve@gmail.com']
      ]}} },
    union_all: { name:'UNION ALL', level:'beginner',
      tag:'A ∪ B  ·  keep duplicates',
      desc:'Stitches both row sets together — including duplicates. Cheaper than <code>UNION</code> (no dedup pass).',
      sql:'SELECT email FROM users\nUNION ALL\nSELECT email FROM leads;',
      stages:{output:{cols:['email'], rows:[
        ['alice@gmail.com'],['bob@yahoo.com'],['cara@gmail.com'],
        ['bob@yahoo.com'],['cara@gmail.com'],['eve@gmail.com']
      ]}} },
    intersect: { name:'INTERSECT', level:'intermediate',
      tag:'A ∩ B  ·  in both queries',
      desc:'Rows present in both result sets.',
      sql:'SELECT email FROM users\nINTERSECT\nSELECT email FROM leads;',
      stages:{output:{cols:['email'], rows:[
        ['bob@yahoo.com'],['cara@gmail.com']
      ]}} },
    except: { name:'EXCEPT', level:'intermediate',
      tag:'A − B  ·  in left but not right',
      desc:'Rows in the first query that are not in the second. (Some dialects spell it <code>MINUS</code>.)',
      sql:'SELECT email FROM users\nEXCEPT\nSELECT email FROM leads;',
      stages:{output:{cols:['email'], rows:[
        ['alice@gmail.com']
      ]}} }
  }
});
</script>


## Date functions (Postgres)

Manipulate timestamps and intervals. Reference row: `created_at = '2025-03-15 14:30:00'`, "today" = `2026-05-10`.

<div class="sx-explorer" data-variant="current_date" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="current_date"  aria-pressed="true">CURRENT_DATE</button>
    <button class="sx-btn" data-variant="now"           aria-pressed="false">NOW()</button>
    <button class="sx-btn" data-variant="trunc_month"   aria-pressed="false">DATE_TRUNC month</button>
    <button class="sx-btn" data-variant="trunc_year"    aria-pressed="false">DATE_TRUNC year</button>
    <button class="sx-btn" data-variant="extract_year"  aria-pressed="false">EXTRACT year</button>
    <button class="sx-btn" data-variant="extract_month" aria-pressed="false">EXTRACT month</button>
    <button class="sx-btn" data-variant="age"           aria-pressed="false">AGE()</button>
    <button class="sx-btn" data-variant="interval"      aria-pressed="false">- INTERVAL</button>
  </div>
  <div class="sx-stage">
    <div class="sx-sublabel">Input · users</div>
    <div class="sx-table-wrap" data-stage="input"></div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">Result</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'current_date',
  stages: {
    input: { cols:['id','created_at'], rows:[
      [1,'2025-03-15 14:30:00']
    ]}
  },
  variants: {
    current_date: { name:'CURRENT_DATE', level:'beginner',
      tag:'today, no time component',
      desc:'Server-side today as a <code>date</code>.',
      sql:'SELECT CURRENT_DATE AS today;',
      stages:{output:{cols:['today'], rows:[['2026-05-10']]}} },
    now: { name:'NOW()', level:'beginner',
      tag:'current timestamp with timezone',
      desc:'Same as <code>CURRENT_TIMESTAMP</code>. Frozen for the duration of the transaction.',
      sql:'SELECT NOW() AS ts;',
      stages:{output:{cols:['ts'], rows:[['2026-05-10 09:15:32+00']]}} },
    trunc_month: { name:"DATE_TRUNC('month', x)", level:'beginner',
      tag:'snap to start of month',
      desc:'Floor a timestamp to a unit. Common for monthly aggregates.',
      sql:"SELECT DATE_TRUNC('month', created_at) AS month\nFROM   users;",
      stages:{output:{cols:['month'], rows:[['2025-03-01 00:00:00']]}} },
    trunc_year: { name:"DATE_TRUNC('year', x)", level:'beginner',
      tag:'snap to start of year',
      desc:'Other units: <code>day</code>, <code>week</code>, <code>quarter</code>, <code>year</code>.',
      sql:"SELECT DATE_TRUNC('year', created_at) AS year\nFROM   users;",
      stages:{output:{cols:['year'], rows:[['2025-01-01 00:00:00']]}} },
    extract_year: { name:'EXTRACT(YEAR FROM x)', level:'intermediate',
      tag:'pull a numeric part out',
      desc:'Returns an integer (or float). Use this when you need to GROUP BY year, etc.',
      sql:'SELECT EXTRACT(YEAR FROM created_at) AS yr\nFROM   users;',
      stages:{output:{cols:['yr'], rows:[[2025]]}} },
    extract_month: { name:'EXTRACT(MONTH FROM x)', level:'intermediate',
      tag:'numeric month 1-12',
      desc:'Other parts: <code>DAY</code>, <code>HOUR</code>, <code>DOW</code>, <code>EPOCH</code>.',
      sql:'SELECT EXTRACT(MONTH FROM created_at) AS mo\nFROM   users;',
      stages:{output:{cols:['mo'], rows:[[3]]}} },
    age: { name:'AGE(now, then)', level:'advanced',
      tag:'human-readable interval',
      desc:'Returns an <code>interval</code> like <code>1 year 1 mon 25 days</code>. Friendly for display, awkward for math — use epoch differences for thresholds.',
      sql:'SELECT AGE(NOW(), created_at) AS lifetime\nFROM   users;',
      stages:{output:{cols:['lifetime'], rows:[['1 year 1 mon 25 days']]}} },
    interval: { name:"x - INTERVAL '7 days'", level:'beginner',
      tag:'shift a timestamp',
      desc:'Add or subtract an interval. Other units: <code>hours</code>, <code>months</code>, <code>years</code>.',
      sql:"SELECT created_at - INTERVAL '7 days' AS week_before\nFROM   users;",
      stages:{output:{cols:['week_before'], rows:[['2025-03-08 14:30:00']]}} }
  }
});
</script>

