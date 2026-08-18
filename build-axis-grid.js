/* ============================================================
   build-axis-grid.js — generates Session-Sketch-axis-grid.html

   Lifts SKILL and OUTPUT (labels + tag pulls) straight out of
   Session-Sketch.html so the numbers can never drift from the
   engine, applies the Wave 5 job rules, and writes a
   self-contained comparison grid: 8 skills x 9 outputs = 72 cells,
   each showing which of the twelve castings are legal there.

   Run:  node build-axis-grid.js
   ============================================================ */
"use strict";
const fs = require("fs");

/* ---------- 1. lift the two axes from the engine ---------- */
const src = fs.readFileSync("Session-Sketch.html", "utf8");

function liftBlock(startMarker, endMarker) {
  const i = src.indexOf(startMarker);
  if (i < 0) throw new Error("anchor not found: " + startMarker);
  const j = src.indexOf(endMarker, i);
  if (j < 0) throw new Error("end anchor not found: " + endMarker);
  return src.slice(i, j + endMarker.length);
}

const skillSrc  = liftBlock("var SKILL = {", "var SKILLORDER");
const outputSrc = liftBlock("var OUTPUT = {", "var OUTPUTORDER");
const orderSrc  = liftBlock("var SKILLORDER", "];") + ";" +
                  liftBlock("var OUTPUTORDER", "];") + ";";

const sandbox = {};
new Function("S", skillSrc.replace("var SKILL", "S.SKILL")
  .replace(/var SKILLORDER[\s\S]*$/, ""))(sandbox);
new Function("S", outputSrc.replace("var OUTPUT", "S.OUTPUT")
  .replace(/var OUTPUTORDER[\s\S]*$/, ""))(sandbox);
new Function("S", orderSrc.replace("var SKILLORDER", "S.SKILLORDER")
  .replace("var OUTPUTORDER", "S.OUTPUTORDER"))(sandbox);

const SKILL = sandbox.SKILL, OUTPUT = sandbox.OUTPUT;
const SKILLORDER = sandbox.SKILLORDER, OUTPUTORDER = sandbox.OUTPUTORDER;

console.log("lifted", Object.keys(SKILL).length, "skills,", Object.keys(OUTPUT).length, "outputs");

/* ---------- 2-4. tags, gate and jobs come from the shared module ---------- */
const { TAGS, TAGORDER, GROUND, FAILKIND, JOBS, jobsFor } = require("./wave5-jobs.js");

/* ---------- 5. the twelve regression cases, as (skill, output) ---------- */
const CASES = [
  { s:"perform",   o:"build",      n:"Joins / CIS-255",        tag:"lab"    },
  { s:"situation", o:"experience", n:"Disruptive classroom",   tag:"quests" },
  { s:"interpret", o:"finding",    n:"Minimum wage",           tag:"lab"    },
  { s:"make",      o:"designed",   n:"Brand identity",         tag:"studio" },
  { s:"make",      o:"planspec",   n:"Database schema",        tag:"studio" },
  { s:"perform",   o:"finding",    n:"Significance test",      tag:"lab"    },
  { s:"process",   o:"decision",   n:"Live intrusion",         tag:"arena"  },
  { s:"judgment",  o:"planspec",   n:"Seed fund pitch",        tag:"arena"  },
  { s:"situation", o:"decision",   n:"Plea negotiation",       tag:"arena"  },
  { s:"perform",   o:"planspec",   n:"Lesson plan",            tag:"studio" },
  { s:"situation", o:"build",      n:"guard — axis conflict", tag:"" },
  { s:"perform",   o:"none",       n:"guard — none output",   tag:"lab" }
];

/* ---------- 6. compute every cell ---------- */
function axisScores(s, o) {
  const sp = SKILL[s].pull || {}, op = OUTPUT[o].pull || {};
  const out = {};
  TAGORDER.forEach(t => { out[t] = (sp[t] || 0) + (op[t] || 0); });
  return out;
}

function cellFor(s, o) {
  const sc = axisScores(s, o);
  const ranked = TAGORDER.slice().sort((a, b) => sc[b] - sc[a]);
  const lead = ranked[0], margin = +(sc[ranked[0]] - sc[ranked[1]]).toFixed(2);
  const isNone = (o === "none");

  const jobs = jobsFor(s, o, sc);

  const live = jobs.filter(j => !j.blocked);
  return {
    s, o, sc, lead, margin, isNone,
    fail: FAILKIND[GROUND[s]],
    jobs,
    liveCount: live.length,
    strongCount: live.filter(j => j.tier === "strong").length,
    onlyOracle: live.length === 1 && live[0].k === "oracle",
    cases: CASES.filter(c => c.s === s && c.o === o)
  };
}

const GRID = {};
SKILLORDER.forEach(s => { GRID[s] = {}; OUTPUTORDER.forEach(o => { GRID[s][o] = cellFor(s, o); }); });

/* ---------- 7. coverage stats ---------- */
const cells = [];
SKILLORDER.forEach(s => OUTPUTORDER.forEach(o => cells.push(GRID[s][o])));
const coverage = JOBS.map(j => {
  const strong = cells.filter(c => c.jobs.some(x => x.k === j.k && x.tier === "strong" && !x.blocked)).length;
  const ok     = cells.filter(c => c.jobs.some(x => x.k === j.k && x.tier === "ok" && !x.blocked)).length;
  return { k:j.k, label:j.label, cast:j.cast, excl:j.excl, strong, ok, total:strong + ok, note:j.note, fail:j.fail };
}).sort((a, b) => b.total - a.total);

const holes    = cells.filter(c => c.liveCount === 0);
const thin     = cells.filter(c => c.liveCount > 0 && c.liveCount <= 2);
const flatCells = cells.filter(c => c.fail === "Flat");
const oracleDead = cells.filter(c => !c.jobs.some(x => x.k === "oracle" && !x.blocked));

console.log("cells:", cells.length,
  "| holes:", holes.length,
  "| thin (<=2):", thin.length,
  "| Oracle illegal in:", oracleDead.length);

/* ---------- 8. render ---------- */
const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n = v => (Math.round(v * 100) / 100).toString();

function cellHTML(c) {
  const t = TAGS[c.lead];
  const chips = c.jobs.map(j =>
    '<span class="jc ' + (j.tier === "gate" ? "ok gate" : j.tier) + (j.blocked ? ' blk' : '') + '" data-job="' + j.k + '"' +
    (j.blocked ? ' title="ruled out: ' + esc(j.blocked) + '"' : '') + '>' +
    (j.excl ? '<i class="dot" style="background:' + TAGS[j.excl].color + '"></i>' : '') +
    esc(j.label.replace(/^The /, "")) + '</span>').join("");

  const caseTags = c.cases.map(x =>
    '<span class="case">' + esc(x.n) + '</span>').join("");

  return '<td class="cell' +
    (c.liveCount === 0 ? ' hole' : '') +
    (c.liveCount > 0 && c.liveCount <= 2 ? ' thin' : '') +
    (c.cases.length ? ' hascase' : '') +
    '" data-fail="' + esc(c.fail) + '" data-lead="' + c.lead + '" data-live="' + c.liveCount + '">' +
    '<div class="chead">' +
      '<span class="tag" style="background:' + t.color + '">' + esc(t.name) + '</span>' +
      '<span class="ax tnum" title="skill pull + output pull, this cell only">' +
        n(c.sc[c.lead]) + (c.margin > 0 ? ' <i>+' + n(c.margin) + '</i>' : ' <i>tie</i>') + '</span>' +
    '</div>' +
    '<div class="fk fk-' + c.fail.split(" ")[0].toLowerCase() + '">' + esc(c.fail) + '</div>' +
    '<div class="jobs">' + chips + '</div>' +
    (caseTags ? '<div class="cases">' + caseTags + '</div>' : '') +
    '</td>';
}

let rows = "";
SKILLORDER.forEach(s => {
  rows += '<tr><th class="rh"><span class="rk">' + esc(s) + '</span>' +
    '<span class="rl">' + esc(SKILL[s].label) + '</span>' +
    '<span class="rg g-' + GROUND[s] + '">' + esc(FAILKIND[GROUND[s]]) + '</span>' +
    (SKILL[s].eg ? '<span class="reg">' + esc(SKILL[s].eg) + '</span>' : '') +
    '</th>';
  OUTPUTORDER.forEach(o => { rows += cellHTML(GRID[s][o]); });
  rows += '</tr>';
});

let heads = '<tr><th class="corner"><span>skill ↓ &nbsp; output →</span></th>';
OUTPUTORDER.forEach(o => {
  heads += '<th class="ch"><span class="ck">' + esc(o) + '</span>' +
    '<span class="cl">' + esc(OUTPUT[o].label) + '</span></th>';
});
heads += '</tr>';

const legendHTML = coverage.map(j =>
  '<button class="lg" data-job="' + j.k + '">' +
    (j.excl ? '<i class="dot" style="background:' + TAGS[j.excl].color + '"></i>' : '<i class="dot uni"></i>') +
    '<b>' + esc(j.label) + '</b>' +
    '<span class="castl">cast as ' + esc(j.cast) + '</span>' +
    '<span class="cov tnum">' + j.strong + ' strong · ' + j.ok + ' workable</span>' +
    '<span class="lgnote">' + esc(j.note) + '</span>' +
  '</button>').join("");

const holeList = holes.length
  ? holes.map(c => '<li><b>' + esc(c.s) + ' × ' + esc(c.o) + '</b> — no legal job</li>').join("")
  : '<li>None. Every cell has at least one legal job.</li>';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Session Sketch — the axis grid (skill × output × AI job)</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --ink-blue:#00244e; --gold:#fdb913; --heritage:#0a3370; --sky-blue:#009dea;
  --impact-blue:#00559a; --parchment:#f4f0ec; --soft-blue:#e6f0f7; --warm-brown:#a55b00;
  --panel-tint:#faf7f3; --white:#fff; --warm-black:#1d1c18; --line:#d9d2c7;
  --line-soft:#e2ddd5; --muted:#5b6b7c; --radius:4px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:'Inter',Arial,sans-serif;background:var(--parchment);color:var(--warm-black);
  font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
.tnum{font-variant-numeric:tabular-nums}
header.mast{background:var(--ink-blue);color:#fff;border-bottom:3px solid var(--gold)}
.mast-in{max-width:1600px;margin:0 auto;padding:18px 24px}
.eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
h1{margin:2px 0 4px;font-size:23px;font-weight:800;letter-spacing:-.015em}
.sub{font-size:13.5px;color:var(--dim-on-navy,#cfe0f2);max-width:80ch}
.wrap{max-width:1600px;margin:0 auto;padding:22px 24px 80px}
.card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:18px 20px;margin:0 0 18px}
.card.hero{border-top:3px solid var(--gold)}
.card h2{margin:0 0 6px;font-size:19px;font-weight:800;color:var(--ink-blue);letter-spacing:-.01em}
.card h3{margin:18px 0 7px;font-size:14px;font-weight:800;color:var(--ink-blue)}
.lead{margin:0 0 10px;font-size:14px;color:#33404f}
.eb{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--warm-brown);margin:0 0 5px}

/* stats */
.stats{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0 0}
.stat{flex:1 1 150px;border:1px solid var(--line);border-radius:var(--radius);padding:9px 11px;background:var(--panel-tint)}
.stat b{display:block;font-size:24px;font-weight:800;color:var(--ink-blue);line-height:1.1}
.stat span{font-size:11.5px;color:var(--muted);font-weight:600}

/* legend */
.legend{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0 0}
.lg{flex:1 1 250px;text-align:left;cursor:pointer;font-family:inherit;font-size:12px;
  background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:8px 10px;display:block}
.lg:hover{border-color:var(--ink-blue)}
.lg.on{background:var(--soft-blue);border-color:var(--ink-blue);box-shadow:inset 0 0 0 1px var(--ink-blue)}
.lg b{display:inline-block;font-size:12.5px;color:var(--ink-blue)}
.lg .castl{display:block;font-size:11.5px;color:var(--warm-black);font-weight:600;margin:1px 0 1px}
.lg .cov{display:block;font-size:11px;color:var(--warm-brown);font-weight:700;margin:1px 0 2px}
.lg .lgnote{display:block;font-size:11px;color:var(--muted);line-height:1.4}
.dot{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px;vertical-align:1px}
.dot.uni{background:#9aa7b4}

/* grid */
.gridwrap{overflow:auto;border:1px solid var(--line);border-radius:var(--radius);background:#fff}
table{border-collapse:separate;border-spacing:0;width:100%;min-width:1500px}
th,td{vertical-align:top;border-right:1px solid var(--line-soft);border-bottom:1px solid var(--line-soft)}
th.corner{position:sticky;left:0;top:0;z-index:6;background:var(--ink-blue);color:#fff;
  padding:8px 10px;font-size:11px;font-weight:700;text-align:left;min-width:210px}
th.ch{position:sticky;top:0;z-index:4;background:var(--heritage);color:#fff;padding:7px 9px;text-align:left;min-width:143px}
th.ch .ck{display:block;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}
th.ch .cl{display:block;font-size:11.5px;font-weight:600;line-height:1.35;margin-top:1px}
th.rh{position:sticky;left:0;z-index:3;background:var(--panel-tint);padding:8px 10px;text-align:left;min-width:210px;max-width:210px}
th.rh .rk{display:block;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--warm-brown)}
th.rh .rl{display:block;font-size:12px;font-weight:700;color:var(--ink-blue);line-height:1.35;margin:1px 0 3px}
th.rh .rg{display:inline-block;font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  padding:1px 5px;border-radius:2px;border:1px solid}
th.rh .g-yes{color:var(--heritage);border-color:var(--heritage);background:var(--soft-blue)}
th.rh .g-provenance{color:var(--heritage);border-color:var(--heritage);background:var(--soft-blue)}
th.rh .g-partial{color:var(--warm-brown);border-color:var(--warm-brown);background:#fdf3e2}
th.rh .g-no{color:#8a1c1c;border-color:#8a1c1c;background:#fbeceb}
th.rh .reg{display:block;font-size:10.5px;color:var(--muted);margin-top:4px;line-height:1.35}

td.cell{padding:6px 7px;background:#fff}
td.cell.thin{background:#fffdf5}
td.cell.hole{background:#fbeceb}
td.cell.hascase{box-shadow:inset 3px 0 0 var(--gold)}
.chead{display:flex;align-items:center;gap:5px;margin-bottom:3px}
.tag{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#fff;padding:1px 5px;border-radius:2px}
.ax{font-size:10.5px;color:var(--muted);font-weight:700}
.ax i{font-style:normal;color:#9aa7b4;font-weight:600}
.fk{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;margin-bottom:4px}
.fk-wrong{color:var(--heritage)}
.fk-flat{color:#8a1c1c}
.fk-either{color:var(--warm-brown)}
.fk-narrow{color:var(--impact-blue)}
.jobs{display:flex;flex-wrap:wrap;gap:3px}
.jc{font-size:10.5px;font-weight:700;padding:1.5px 5px;border-radius:2px;border:1px solid;line-height:1.45}
.jc.strong{background:var(--ink-blue);color:#fff;border-color:var(--ink-blue)}
.jc.ok{background:#fff;color:var(--ink-blue);border-color:#b9c3cf;font-weight:600}
.jc.blk{background:#f2efea;color:#a9a49b;border-color:#e2ddd5;text-decoration:line-through;font-weight:600}
.jc .dot{width:6px;height:6px;margin-right:3px}
.cases{margin-top:5px;display:flex;flex-wrap:wrap;gap:3px}
.case{font-size:9.5px;font-weight:700;color:var(--warm-brown);background:#fdf3e2;
  border:1px solid #f0dcb0;border-radius:2px;padding:1px 4px}
body.hidegate .jc.gate{display:none}
.jc.gate{border-style:dashed}
body.filtering .jc{opacity:.16}
body.filtering .jc.hit{opacity:1}
body.filtering td.cell{background:#fbfbf9}
body.filtering td.cell.hashit{background:var(--soft-blue)}
ul.tight{margin:6px 0 0;padding-left:20px;font-size:13px}
ul.tight li{margin:0 0 3px}
.foot{font-size:11.5px;color:var(--muted);margin-top:8px}
.bar{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}
.btn{font:inherit;font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:var(--radius);
  border:1px solid var(--line);background:#fff;color:var(--ink-blue);cursor:pointer}
.btn-ink{background:var(--ink-blue);color:#fff;border-color:var(--ink-blue)}
@media print{
  body{background:#fff}
  .bar,.legend{display:none}
  .gridwrap{overflow:visible;border:none}
  table{min-width:0;font-size:8px}
  th.corner,th.ch,th.rh{position:static}
  .card{border:1px solid #999;break-inside:avoid}
  .jc,.tag,.fk,.case{print-color-adjust:exact;-webkit-print-color-adjust:exact}
  td.cell.thin,td.cell.hole,.stat{print-color-adjust:exact;-webkit-print-color-adjust:exact}
}
</style></head>
<body>
<header class="mast"><div class="mast-in">
  <div class="eyebrow">SNHU AI Labs · Session Sketch · Wave 5 design</div>
  <h1>The axis grid — what AI can be cast as in each (skill × output) pair</h1>
  <p class="sub">Eight skills by nine outputs, 72 cells. Each cell shows what the two content axes alone say about the tag,
  which failure kind is available, and which of the eleven AI jobs are legal there.
  Generated from <code>Session-Sketch.html</code> by <code>build-axis-grid.js</code> — the pull numbers are the engine's own.</p>
</div></header>

<div class="wrap">

  <div class="card hero">
    <div class="eb">How to read it</div>
    <h2>Three things per cell</h2>
    <p class="lead"><b>The tag chip</b> is what these two answers alone say, with the axis-only margin over second place —
    material, catch-method and competing are not in these numbers, so a thin margin here is normal and not a problem.
    <b>The failure kind</b> comes from the skill row: whether there is a right answer to plant an error against.
    <b>The job chips</b> are filled where the job is a natural fit, outlined where it works but needs reframing, and
    struck through with a dashed edge where it is ruled out — hover for the reason. Every one of the eleven jobs is drawn in every cell, so an absence is always deliberate; use <i>Hide ruled-out jobs</i> for a compact read.
    Cells with a gold left edge carry one of the twelve regression cases.</p>
    <div class="stats">
      <div class="stat"><b>72</b><span>cells</span></div>
      <div class="stat"><b>${JOBS.length}</b><span>castings</span></div>
      <div class="stat"><b>${flatCells.length}</b><span>cells with no ground truth<br>(failure can only be Flat)</span></div>
      <div class="stat"><b>${oracleDead.length}</b><span>cells where the Oracle is illegal<br>(the tool ships it anyway)</span></div>
      <div class="stat"><b>${thin.length}</b><span>thin cells (2 jobs or fewer)</span></div>
      <div class="stat"><b>${holes.length}</b><span>holes (no legal job)</span></div>
    </div>
  </div>

  <div class="card">
    <div class="eb">Filter</div>
    <h2>Click a part to see where it is legal</h2>
    <p class="lead">Coverage counts are out of 72. A universal casting with low coverage is not a bad casting — it is a specialist.
    One with very high coverage is worth checking for vagueness.</p>
    <div class="bar"><button class="btn btn-ink" id="clear">Show all jobs</button>
      <button class="btn" id="gateb">Hide ruled-out jobs</button>
      <button class="btn" id="printb">Print / save as PDF</button></div>
    <div class="legend">${legendHTML}</div>
    <p class="foot">Square colour marks a tag-exclusive job —
      <i class="dot" style="background:${TAGS.studio.color}"></i>Create,
      <i class="dot" style="background:${TAGS.lab.color}"></i>Research,
      <i class="dot" style="background:${TAGS.arena.color}"></i>Compete,
      <i class="dot" style="background:${TAGS.quests.color}"></i>Simulate.
      Grey is universal.</p>
  </div>

  <div class="gridwrap">
    <table>
      <thead>${heads}</thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <div class="card" style="margin-top:18px">
    <div class="eb">What the grid shows</div>
    <h2>Read these first</h2>
    <h3>1. The Oracle covers exactly half the grid</h3>
    <p class="lead">It is legal in ${72 - oracleDead.length} of 72 cells and illegal in ${oracleDead.length}.
    Three rows have no right answer to plant an error against — <code>make</code>, <code>situation</code>,
    <code>judgment</code> — and the fourth, <code>interpret</code>, is contested by nature, so the honest job there is
    The Witness cross-examining provenance rather than an oracle being wrong about a conclusion.
    The tool currently produces an Oracle activity for all 72 cells.</p>
    <h3>2. ${flatCells.length} cells can only fail flat, not wrong</h3>
    <p class="lead">Every cell in the <code>make</code>, <code>situation</code> and <code>judgment</code> rows.
    On those topics the honest failure is that AI produced the average of everything ever written — competent and dead.
    That is a different teaching moment from a planted error, and it needs its own slot.</p>
    <h3>3. Where the grid is thin</h3>
    <ul class="tight">${holeList}</ul>
    <p class="lead" style="margin-top:8px">${thin.length} further cells have two legal jobs or fewer (shaded cream).
    Those are the cells where a faculty member has almost no choice, and they are the first place to look when adding a job.</p>
    <h3>4. The regression cases cluster</h3>
    <p class="lead">The twelve cases sit in ${new Set(CASES.map(c => c.s + "|" + c.o)).size} distinct cells —
    ${Math.round(new Set(CASES.map(c => c.s + "|" + c.o)).size / 72 * 100)}% of the grid.
    Real faculty answers concentrate, which is good news: populating the well-trodden cells well matters far more than
    filling all 72 evenly.</p>
  </div>

</div>

<script>
(function(){
  var body=document.body, on=null;
  function apply(){
    var cells=document.querySelectorAll("td.cell");
    if(!on){ body.classList.remove("filtering");
      document.querySelectorAll(".jc.hit").forEach(function(e){e.classList.remove("hit");});
      cells.forEach(function(c){c.classList.remove("hashit");});
      document.querySelectorAll(".lg.on").forEach(function(e){e.classList.remove("on");});
      return; }
    body.classList.add("filtering");
    document.querySelectorAll(".lg").forEach(function(b){ b.classList.toggle("on", b.dataset.job===on); });
    document.querySelectorAll(".jc").forEach(function(e){ e.classList.toggle("hit", e.dataset.job===on && !e.classList.contains("blk")); });
    cells.forEach(function(c){ c.classList.toggle("hashit", !!c.querySelector('.jc.hit')); });
  }
  document.querySelectorAll(".lg").forEach(function(b){
    b.addEventListener("click", function(){ on = (on===b.dataset.job) ? null : b.dataset.job; apply(); });
  });
  document.getElementById("clear").addEventListener("click", function(){ on=null; apply(); });
  var gb=document.getElementById("gateb"), hid=false;
  gb.addEventListener("click", function(){
    hid=!hid; body.classList.toggle("hidegate", hid);
    gb.textContent = hid ? "Show ruled-out jobs" : "Hide ruled-out jobs";
  });
  document.getElementById("printb").addEventListener("click", function(){ window.print(); });
})();
</script>
</body></html>`;

fs.writeFileSync("Session-Sketch-axis-grid.html", html, "utf8");
console.log("wrote Session-Sketch-axis-grid.html", html.length, "bytes");
