/* ============================================================
   build-job-card.js — generates Session-Sketch-job-card.html

   A cross-comparison of the twelve Wave 5 AI castings.
   Reads the job data from wave5-jobs.js and the skill labels
   from Session-Sketch.html, so it can never disagree with the
   axis grid or with the engine.

   Run:  node build-job-card.js
   ============================================================ */
"use strict";
const fs = require("fs");
const { TAGS, TAGORDER, GROUND, FAILKIND, JOBS, jobsFor } = require("./wave5-jobs.js");

/* ---------- skill/output labels + pulls, lifted from the engine ---------- */
const src = fs.readFileSync("Session-Sketch.html", "utf8");
function lift(a, b) {
  const i = src.indexOf(a), j = src.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error("anchor not found: " + a);
  return src.slice(i, j + b.length);
}
const box = {};
new Function("S", lift("var SKILL = {", "var SKILLORDER").replace("var SKILL", "S.SKILL")
  .replace(/var SKILLORDER[\s\S]*$/, ""))(box);
new Function("S", lift("var OUTPUT = {", "var OUTPUTORDER").replace("var OUTPUT", "S.OUTPUT")
  .replace(/var OUTPUTORDER[\s\S]*$/, ""))(box);
new Function("S", (lift("var SKILLORDER", "];") + ";" + lift("var OUTPUTORDER", "];") + ";")
  .replace("var SKILLORDER", "S.SKILLORDER").replace("var OUTPUTORDER", "S.OUTPUTORDER"))(box);
const { SKILL, OUTPUT, SKILLORDER, OUTPUTORDER } = box;

/* ---------- coverage, computed the same way the grid does ---------- */
function axisScores(s, o) {
  const sp = SKILL[s].pull || {}, op = OUTPUT[o].pull || {}, out = {};
  TAGORDER.forEach(t => { out[t] = (sp[t] || 0) + (op[t] || 0); });
  return out;
}
const cov = {};
JOBS.forEach(j => { cov[j.k] = { strong: 0, ok: 0 }; });
SKILLORDER.forEach(s => OUTPUTORDER.forEach(o => {
  jobsFor(s, o, axisScores(s, o)).forEach(j => {
    if (!j.blocked && (j.tier === "strong" || j.tier === "ok")) cov[j.k][j.tier]++;
  });
}));

/* ---------- render ---------- */
const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SHORT = {
  perform:"perform", make:"make", standard:"standard", tooluse:"tool use",
  situation:"situation", process:"process", judgment:"judgment", interpret:"interpret"
};

function skillChips(j) {
  return SKILLORDER.map(s => {
    const tier = j.strong.indexOf(s) > -1 ? "strong" : (j.ok.indexOf(s) > -1 ? "ok" : "no");
    return '<span class="sc ' + tier + '" title="' + esc(SKILL[s].label) + '">' + esc(SHORT[s]) + '</span>';
  }).join("");
}

const order = JOBS.slice().sort((a, b) => {
  if (!a.excl && b.excl) return -1;
  if (a.excl && !b.excl) return 1;
  if (a.excl && b.excl) return TAGORDER.indexOf(a.excl) - TAGORDER.indexOf(b.excl);
  return (cov[b.k].strong + cov[b.k].ok) - (cov[a.k].strong + cov[a.k].ok);
});

let rows = "", group = "";
order.forEach(j => {
  const g = j.excl ? "excl" : "uni";
  if (g !== group) {
    group = g;
    rows += '<tr class="grp"><td colspan="5">' +
      (g === "uni"
        ? "Universal — legal under any tag, gated only by the skill axis"
        : "Tag-exclusive — each depends on its tag's artifact, so it cannot be borrowed") +
      '</td></tr>';
  }
  const c = cov[j.k];
  rows +=
    '<tr>' +
    '<td class="jb">' +
      '<div class="cast">' +
        (j.excl ? '<i class="dot" style="background:' + TAGS[j.excl].color + '"></i>' : '<i class="dot uni"></i>') +
        esc(j.cast) + '</div>' +
      '<div class="jn">' + esc(j.label) + '</div>' +
      '<div class="jm">' + (j.excl ? esc(TAGS[j.excl].name) + " only" : "universal") +
        ' · <b class="tnum">' + c.strong + '</b> strong, <b class="tnum">' + c.ok + '</b> workable of 72</div>' +
      '<div class="need">Needs: ' + esc(j.note.replace(/^Needs /, "")) + '</div>' +
      (j.needsArtifact ? '<div class="warn">dies on output “none”</div>' : '') +
    '</td>' +
    '<td class="lift"><div class="ll">Where it genuinely helps</div>' + esc(j.lift) +
      '<div class="wowl">The wow</div><div class="wowt">' + esc(j.wow) + '</div></td>' +
    '<td class="lim"><div class="ll">Where it runs out</div>' + esc(j.limit) +
      '<div class="fkl"><span class="fk fk-' + j.fail.split(" ")[0].toLowerCase() + '">' +
      esc(j.fail) + '</span></div><div class="failt">' + esc(j.failline) + '</div></td>' +
    '<td class="take"><div class="ll">The AI skill they can name</div><b>' + esc(j.aiskill) + '</b>' +
      '<div class="ll" style="margin-top:5px">Only a person can</div>' + esc(j.human) + '</td>' +
    '<td class="fit">' + skillChips(j) + '</td>' +
    '</tr>' +
    '<tr class="wr"><td></td><td colspan="4"><b>Watch:</b> ' + esc(j.watch) +
      (j.unlock ? ' <span class="unl">Not possible before AI: ' + esc(j.unlock) + '</span>' : '') +
      '</td></tr>';
});

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Session Sketch — AI job quick reference</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --ink-blue:#00244e; --gold:#fdb913; --heritage:#0a3370; --sky-blue:#009dea;
  --impact-blue:#00559a; --parchment:#f4f0ec; --soft-blue:#e6f0f7; --warm-brown:#a55b00;
  --panel-tint:#faf7f3; --warm-black:#1d1c18; --line:#d9d2c7; --line-soft:#e2ddd5;
  --muted:#5b6b7c; --radius:4px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:'Inter',Arial,sans-serif;background:var(--parchment);color:var(--warm-black);
  font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
.tnum{font-variant-numeric:tabular-nums}
header.mast{background:var(--ink-blue);color:#fff;border-bottom:3px solid var(--gold)}
.mast-in{max-width:1400px;margin:0 auto;padding:14px 22px}
.eyebrow{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
h1{margin:2px 0 3px;font-size:21px;font-weight:800;letter-spacing:-.015em}
.sub{font-size:12.5px;color:#cfe0f2;max-width:105ch;margin:0}
.wrap{max-width:1400px;margin:0 auto;padding:16px 22px 60px}

table{border-collapse:separate;border-spacing:0;width:100%;background:#fff;
  border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
thead th{background:var(--heritage);color:#fff;text-align:left;padding:6px 9px;
  font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
thead th span{display:block;font-size:10px;font-weight:600;letter-spacing:0;
  text-transform:none;color:#cfe0f2;margin-top:1px}
tbody td{padding:7px 9px;font-size:11.5px;line-height:1.45;vertical-align:top;
  border-top:1px solid var(--line-soft)}
tr.grp td{background:var(--ink-blue);color:#fff;font-size:10px;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;padding:4px 9px}
tr.wr td{border-top:none;padding:0 9px 8px;font-size:10.5px;color:var(--muted);background:#fff}
tr.wr b{color:var(--warm-brown);font-weight:800}
.unl{display:inline-block;margin-left:5px;color:var(--impact-blue);font-weight:700}
td.jb{width:172px;background:var(--panel-tint)}
.cast{font-size:12.5px;font-weight:800;color:var(--ink-blue);letter-spacing:-.01em;line-height:1.28}
.jn{font-size:10.5px;font-weight:700;color:var(--warm-brown);margin-top:2px;
  letter-spacing:.02em;text-transform:uppercase}
.jm{font-size:10px;color:var(--muted);font-weight:600;margin-top:2px}
.jm b{color:var(--ink-blue)}
.warn{margin-top:3px;font-size:9.5px;font-weight:800;color:#8a1c1c;text-transform:uppercase;letter-spacing:.05em}
.dot{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px;vertical-align:1px}
.dot.uni{background:#9aa7b4}
.need{margin-top:3px;font-size:10px;color:var(--muted);font-style:italic}
td.lift{background:#fffdf5}
td.lim{background:#fdf6f5}
td.take{background:var(--soft-blue)}
.ll{font-size:8.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;
  color:var(--muted);margin:0 0 2px}
.wowl,.fkl{margin-top:5px}
.wowl{font-size:8.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--warm-brown)}
.wowt{font-style:italic}
.failt{margin-top:1px}
td.take b{color:var(--ink-blue);font-weight:700}
.fk{display:inline-block;font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;
  padding:1px 5px;border-radius:2px;border:1px solid;margin-bottom:3px}
.fk-wrong{color:var(--heritage);border-color:var(--heritage);background:var(--soft-blue)}
.fk-flat{color:#8a1c1c;border-color:#8a1c1c;background:#fbeceb}
.fk-either{color:var(--warm-brown);border-color:var(--warm-brown);background:#fdf3e2}
.fk-narrow{color:var(--impact-blue);border-color:var(--impact-blue);background:#e6f0f7}
td.fit{width:142px}
.sc{display:inline-block;font-size:9.5px;font-weight:700;padding:1px 4px;margin:0 2px 2px 0;
  border-radius:2px;border:1px solid}
.sc.strong{background:var(--ink-blue);color:#fff;border-color:var(--ink-blue)}
.sc.ok{background:#fff;color:var(--ink-blue);border-color:#b9c3cf;font-weight:600}
.sc.no{background:#f2efea;color:#b3ada3;border-color:#e8e3db;font-weight:600}

.card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:13px 16px;margin:14px 0 0}
.card.hero{border-top:3px solid var(--gold)}
.card h2{margin:0 0 5px;font-size:15px;font-weight:800;color:var(--ink-blue)}
.eb{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--warm-brown);margin:0 0 4px}
ol.pick{margin:4px 0 0;padding-left:20px;font-size:12px}
ol.pick li{margin:0 0 3px}
ol.pick b{color:var(--ink-blue)}
.foot{font-size:10.5px;color:var(--muted);margin:9px 0 0}
@page{size:letter landscape;margin:10mm}
@media print{
  body{background:#fff;font-size:9px}
  header.mast{border-bottom-width:2px}
  .mast-in{padding:7px 0}
  h1{font-size:13px;margin:1px 0 2px}
  .sub{font-size:7.4px;max-width:none}
  .eyebrow{font-size:7px}
  .wrap{padding:8px 0 0;max-width:none}
  tbody td{padding:3px 5px;font-size:8px;line-height:1.3}
  tr.wr td{font-size:6.9px;padding:0 4px 3px}
  .need{font-size:6.6px;margin-top:2px}
  .wowl,.fkl{margin-top:3px}
  ol.pick{font-size:8.5px} ol.pick li{margin:0 0 1px}
  .card{padding:8px 11px;margin:8px 0 0} .card h2{font-size:11px;margin:0 0 3px}
  .foot{font-size:7.6px;margin:5px 0 0}
  .cast{font-size:9.5px} .jn{font-size:7.5px} .jm{font-size:7.5px} .sc,.fk,.warn{font-size:7.5px}
  .ll,.wowl{font-size:6.8px}
  .card{break-inside:avoid}
  thead{display:table-header-group}
  tr{break-inside:avoid}
  tbody tr:not(.wr){break-after:avoid}
  tr.grp td{break-after:avoid}
  .fk,.sc,.dot,tr.grp td,thead th,td.wow,td.hum,td.jb,.warn{print-color-adjust:exact;-webkit-print-color-adjust:exact}
}
</style></head>
<body>
<header class="mast"><div class="mast-in">
  <div class="eyebrow">SNHU AI Labs · Session Sketch · Wave 5 design</div>
  <h1>What AI is cast as — the ${JOBS.length === 12 ? "twelve" : JOBS.length} parts, side by side</h1>
  <p class="sub">Every Lab casts AI as something, and today it is always the expert who already has the answer.
  Each part below carries <b>two halves that rank equally</b> — where AI genuinely helps, and where it runs out —
  because the point of a Lab is that students use the tool for real and leave able to name both. The transferable
  skill is the takeaway; the failure is how the limit gets discovered, not the purpose. Nothing here scores:
  the part is chosen after the tag.
  Coverage counts come from the 72-cell axis grid. Generated by <code>build-job-card.js</code> from <code>wave5-jobs.js</code>.</p>
</div></header>

<div class="wrap">
  <table>
    <thead><tr>
      <th style="width:172px">AI is cast as<span>and the name we use internally</span></th>
      <th>Where it genuinely helps<span>the capability, then the wow that proves it</span></th>
      <th>Where it runs out<span>the limit, then the failure that exposes it</span></th>
      <th>What they walk out with<span>the transferable skill, and the human move</span></th>
      <th style="width:142px">Skill fit<span>filled = natural, outline = workable</span></th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="card hero">
    <div class="eb">Selection order</div>
    <h2>How the casting gets decided — content votes, preference refines</h2>
    <p class="foot" style="margin:0 0 6px">The same rule <code>score()</code> already follows. The tag is decided first; the casting is chosen from that tag's legal parts and never changes the tag.</p>
    <ol class="pick">
      <li><b>Skill (Q-A) gates.</b> Is there a right answer to plant an error against? <code>make</code>,
        <code>situation</code> and <code>judgment</code> have none, so those Labs can only fail <i>flat</i>, never <i>wrong</i>
        — and the Oracle is illegal there.</li>
      <li><b>Output (Q-B) filters.</b> It is a 2-point tag vote, so it cannot lead. Its job is feasibility:
        <code>none</code> rules out anything needing something handed over.</li>
      <li><b>Then <code>worry</code> breaks the tie</b> among survivors — <i>wrong</i> → Oracle, <i>generic</i> → Volume
        Engine or Commissioner, <i>sources</i> → Witness, <i>thinking</i> → Apprentice or Adversary.</li>
      <li><b>Then refine</b> on material, <code>exper</code>, and <code>size</code> (<code>&lt;12</code> is what earns
        the Ghost Rival its place).</li>
      <li><b>Never <code>goeswrong</code> as the primary signal</b> — its values are the four tag keys and it already
        adds +2, so it is collinear with the outcome. Use it only where it disagrees with the winning tag.</li>
    </ol>
    <p class="foot">Square colour marks a tag-exclusive job —
      <i class="dot" style="background:${TAGS.studio.color}"></i>Create,
      <i class="dot" style="background:${TAGS.lab.color}"></i>Research,
      <i class="dot" style="background:${TAGS.arena.color}"></i>Compete,
      <i class="dot" style="background:${TAGS.quests.color}"></i>Simulate. Grey is universal.
      Full cell-by-cell detail is in <code>Session-Sketch-axis-grid.html</code>; the reasoning is in
      <code>Session-Sketch-wave5-aijob-design.md</code>.</p>
  </div>
</div>
</body></html>`;

fs.writeFileSync("Session-Sketch-job-card.html", html, "utf8");
console.log("wrote Session-Sketch-job-card.html", html.length, "bytes");
console.log("coverage:", JOBS.map(j => j.label.replace(/^The /, "") + " " + (cov[j.k].strong + cov[j.k].ok)).join(" · "));
