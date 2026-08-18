/* Assembles Session-Sketch-Portal.html from the wizard's engine blocks
   (lifted byte-for-byte) plus the new conversational layer.
   Run: node build-portal.js */
var fs = require("fs");

var src = fs.readFileSync("Session-Sketch.html", "utf8");

var styles  = src.match(/<style>[\s\S]*?<\/style>/g);          // [head style, kind/result style]
var scripts = src.match(/<script>[\s\S]*?<\/script>/g);        // engine blocks (count may grow)
var mast    = src.match(/<header class="mast">[\s\S]*?<\/header>/)[0];

if(!styles || styles.length!==2) throw new Error("expected 2 <style> blocks, got "+(styles&&styles.length));
if(!scripts || scripts.length<7) throw new Error("expected >=7 <script> blocks, got "+(scripts&&scripts.length));

/* Keep every engine/result block; drop ONLY the wizard renderer (identified by
   content, so adding blocks like Wave 5's 1a can't shift an index). Strip the
   wizard's trailing draw() call from whichever block carries it. */
var kept = scripts.filter(function(b){ return !/function\s+drawRail\s*\(/.test(b); });
if(kept.length !== scripts.length-1) throw new Error("expected to drop exactly 1 wizard block, dropped "+(scripts.length-kept.length));
var engineBlocks = kept.map(function(b){ return b.replace(/\n\s*draw\(\);\s*(?=<\/script>)/, "\n"); });
var engine = engineBlocks.join("\n");
if(/\bdraw\(\);/.test(engine)) throw new Error("failed to strip the wizard draw() call");
var resultBlock = "";   // now folded into `engine` (kept blocks include the result block)

var portalCss = fs.readFileSync("portal.css", "utf8");
var portalJs  = fs.readFileSync("portal.js", "utf8");

/* masthead: keep it, but retitle the subhead and both action buttons still exist (facToggle/resetBtn) */
mast = mast.replace(
  '<p class="sub">Turn what you already teach into a runnable Lab concept.</p>',
  '<p class="sub">A few plain questions about your class &mdash; and a runnable Lab concept comes back.</p>'
);

var winShield =
  '<svg width="14" height="16" viewBox="0 0 18 20" aria-hidden="true">'+
  '<path d="M9 1 16.5 3.6v7.1C16.5 15 13.3 17.9 9 19 4.7 17.9 1.5 15 1.5 10.7V3.6L9 1Z" fill="none" stroke="#fff" stroke-width="1.4"/>'+
  '<path d="M9 5.6c1.9 1.5 2.8 2.9 2.8 4.3 0 1.1-.7 2-1.8 2.3.5-1.4.1-2.6-1-3.6Z" fill="#fdb913"/></svg>';

var scaffold =
'<main class="stage">'+
  '<div class="chatwin" id="chatwin">'+
    '<div class="wintop">'+
      '<span class="winmark">'+winShield+'</span>'+
      '<span class="wintitle">Session Sketch</span>'+
      '<span class="winmeta" id="pmeta"></span>'+
      '<span class="winprog">'+
        '<span class="pbar"><i id="pbarI" style="width:0%"></i></span>'+
        '<span class="pcount" id="pcount">0 of 0</span>'+
      '</span>'+
      '<button class="drawerBtn" id="drawerBtn">Review</button>'+
    '</div>'+
    '<div class="winbody" id="chat"></div>'+
    '<div class="windrawer" id="drawer"></div>'+
  '</div>'+
'</main>'+
'<div id="result" class="rpage"></div>';

var out =
'<!DOCTYPE html>\n<html lang="en">\n<head>\n'+
'<meta charset="utf-8">\n'+
'<meta name="viewport" content="width=device-width, initial-scale=1">\n'+
'<title>Session Sketch — SNHU AI Labs</title>\n'+
'<link rel="stylesheet" href="https://rsms.me/inter/inter.css">\n'+
styles[0]+'\n'+
styles[1]+'\n'+
'<style>\n'+portalCss+'</style>\n'+
'</head>\n<body>\n'+
mast+'\n'+
scaffold+'\n'+
engine+'\n'+
resultBlock+'\n'+
'<script>\n"use strict";\n'+portalJs+'</script>\n'+
'</body>\n</html>\n';

fs.writeFileSync("Session-Sketch-Portal.html", out, "utf8");

/* sanity */
var okEnd = /<\/html>\s*$/.test(out);
console.log("wrote Session-Sketch-Portal.html");
console.log("  bytes:", out.length);
console.log("  <script> blocks:", (out.match(/<script>/g)||[]).length);
console.log("  ends with </html>:", okEnd);
if(!okEnd) throw new Error("file does not end with </html>");
