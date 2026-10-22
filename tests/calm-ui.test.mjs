import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
const css=readFileSync('styles.css','utf8');
const app=readFileSync('app.js','utf8');
const sw=readFileSync('sw.js','utf8');

function luminance(hex){
  const rgb=hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255);
  const linear=rgb.map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
  return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}

test('light and dark primary text tokens meet WCAG AA reference contrast',()=>{
  for(const [name,fg,bg] of [
    ['light main','#14232a','#f6f8f5'],
    ['light secondary','#50616b','#f6f8f5'],
    ['light accent on white','#285c43','#ffffff'],
    ['light text on button','#ffffff','#285c43'],
    ['dark main','#f4f5f8','#0b0e18'],
    ['dark secondary','#b2bed0','#0b0e18'],
    ['dark accent','#d4fd7b','#0b0e18']
  ])assert.ok(contrast(fg,bg)>=4.5,name+' fails 4.5:1');
});
test('all three theme choices and quick switch implemented',()=>{
  for(const value of ['auto','light','dark'])assert.ok(app.includes("'"+value+"'"),value);
  for(const frag of ['function applyTheme()','function updateTheme(choice)','data-theme-option','theme-quick','prefers-color-scheme'])assert.ok((app+html).includes(frag),frag);
  assert.ok(html.includes('styles.css?v=11'));
  assert.ok(html.includes('app.js?v=11'));
  assert.ok(sw.includes('./styles.css?v=11'));
  assert.ok(sw.includes('./app.js?v=11'));
  assert.ok(html.includes('civic-pack-01.js?v=11'));
  assert.ok(sw.includes('./civic-pack-01.js?v=11'));
  assert.ok(css.includes('html[data-theme="light"]'));
});
test('progressive disclosure and clarity in primary screens',()=>{
  for(const marker of [
    'class="calm-greeting"','class="calm-feature"','class="calm-disclosure"',
    'function renderRightsCards(items)','class="calm-reading"',
    'class="theme-selector"','id="rights-search"'
  ])assert.ok(app.includes(marker.replace('class="calm-feature"','class="daily-feature calm-feature"')),marker);
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes('summary:focus-visible'));
});
