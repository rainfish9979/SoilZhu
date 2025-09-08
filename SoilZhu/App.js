// ==UserScript==
// @name         TurboWarp Tweaker
// @description  tweaks the TurboWarp!
// @icon         https://turbowarp.org/favicon.ico
// @version      0.1
// @author       yukiitai
// @match        https://turbowarp.org/editor
// @match        https://turbowarp.org/editor?*
// @grant        unsafeWindow
// ==/UserScript==

/*!
  Highlight.js v11.6.0 (git: bed790f3f3)
  (c) 2006-2022 undefined and other contributors
  License: BSD-3-Clause
 */
var e={exports:{}};function n(e){
return e instanceof Map?e.clear=e.delete=e.set=()=>{
throw Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=()=>{
throw Error("set is read-only")
}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((t=>{var a=e[t]
;"object"!=typeof a||Object.isFrozen(a)||n(a)})),e}
e.exports=n,e.exports.default=n;class t{constructor(e){
void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}
ignoreMatch(){this.isMatchIgnored=!0}}function a(e){
return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")
}function i(e,...n){const t=Object.create(null);for(const n in e)t[n]=e[n]
;return n.forEach((e=>{for(const n in e)t[n]=e[n]})),t}
const r=e=>!!e.scope||e.sublanguage&&e.language;class s{constructor(e,n){
this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){
this.buffer+=a(e)}openNode(e){if(!r(e))return;let n=""
;n=e.sublanguage?"language-"+e.language:((e,{prefix:n})=>{if(e.includes(".")){
const t=e.split(".")
;return[`${n}${t.shift()}`,...t.map(((e,n)=>`${e}${"_".repeat(n+1)}`))].join(" ")
}return`${n}${e}`})(e.scope,{prefix:this.classPrefix}),this.span(n)}
closeNode(e){r(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){
this.buffer+=`<span class="${e}">`}}const o=(e={})=>{const n={children:[]}
;return Object.assign(n,e),n};class l{constructor(){
this.rootNode=o(),this.stack=[this.rootNode]}get top(){
return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){
this.top.children.push(e)}openNode(e){const n=o({scope:e})
;this.add(n),this.stack.push(n)}closeNode(){
if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){
for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}
walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){
return"string"==typeof n?e.addText(n):n.children&&(e.openNode(n),
n.children.forEach((n=>this._walk(e,n))),e.closeNode(n)),e}static _collapse(e){
"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{
l._collapse(e)})))}}class c extends l{constructor(e){super(),this.options=e}
addKeyword(e,n){""!==e&&(this.openNode(n),this.addText(e),this.closeNode())}
addText(e){""!==e&&this.add(e)}addSublanguage(e,n){const t=e.root
;t.sublanguage=!0,t.language=n,this.add(t)}toHTML(){
return new s(this,this.options).value()}finalize(){return!0}}function d(e){
return e?"string"==typeof e?e:e.source:null}function g(e){return m("(?=",e,")")}
function u(e){return m("(?:",e,")*")}function b(e){return m("(?:",e,")?")}
function m(...e){return e.map((e=>d(e))).join("")}function p(...e){const n=(e=>{
const n=e[e.length-1]
;return"object"==typeof n&&n.constructor===Object?(e.splice(e.length-1,1),n):{}
})(e);return"("+(n.capture?"":"?:")+e.map((e=>d(e))).join("|")+")"}
function _(e){return RegExp(e.toString()+"|").exec("").length-1}
const h=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
;function f(e,{joinWith:n}){let t=0;return e.map((e=>{t+=1;const n=t
;let a=d(e),i="";for(;a.length>0;){const e=h.exec(a);if(!e){i+=a;break}
i+=a.substring(0,e.index),
a=a.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?i+="\\"+(Number(e[1])+n):(i+=e[0],
"("===e[0]&&t++)}return i})).map((e=>`(${e})`)).join(n)}
const E="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",y={
begin:"\\\\[\\s\\S]",relevance:0},w={scope:"string",begin:"'",end:"'",
illegal:"\\n",contains:[y]},N={scope:"string",begin:'"',end:'"',illegal:"\\n",
contains:[y]},v=(e,n,t={})=>{const a=i({scope:"comment",begin:e,end:n,
contains:[]},t);a.contains.push({scope:"doctag",
begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
;const r=p("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
;return a.contains.push({begin:m(/[ ]+/,"(",r,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),a
},O=v("//","$"),k=v("/\\*","\\*/"),x=v("#","$");var M=Object.freeze({
__proto__:null,MATCH_NOTHING_RE:/\b\B/,IDENT_RE:"[a-zA-Z]\\w*",
UNDERSCORE_IDENT_RE:"[a-zA-Z_]\\w*",NUMBER_RE:"\\b\\d+(\\.\\d+)?",C_NUMBER_RE:E,
BINARY_NUMBER_RE:"\\b(0b[01]+)",
RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
SHEBANG:(e={})=>{const n=/^#![ ]*\//
;return e.binary&&(e.begin=m(n,/.*\b/,e.binary,/\b.*/)),i({scope:"meta",begin:n,
end:/$/,relevance:0,"on:begin":(e,n)=>{0!==e.index&&n.ignoreMatch()}},e)},
BACKSLASH_ESCAPE:y,APOS_STRING_MODE:w,QUOTE_STRING_MODE:N,PHRASAL_WORDS_MODE:{
begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
},COMMENT:v,C_LINE_COMMENT_MODE:O,C_BLOCK_COMMENT_MODE:k,HASH_COMMENT_MODE:x,
NUMBER_MODE:{scope:"number",begin:"\\b\\d+(\\.\\d+)?",relevance:0},
C_NUMBER_MODE:{scope:"number",begin:E,relevance:0},BINARY_NUMBER_MODE:{
scope:"number",begin:"\\b(0b[01]+)",relevance:0},REGEXP_MODE:{
begin:/(?=\/[^/\n]*\/)/,contains:[{scope:"regexp",begin:/\//,end:/\/[gimuy]*/,
illegal:/\n/,contains:[y,{begin:/\[/,end:/\]/,relevance:0,contains:[y]}]}]},
TITLE_MODE:{scope:"title",begin:"[a-zA-Z]\\w*",relevance:0},
UNDERSCORE_TITLE_MODE:{scope:"title",begin:"[a-zA-Z_]\\w*",relevance:0},
METHOD_GUARD:{begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0},
END_SAME_AS_BEGIN:e=>Object.assign(e,{"on:begin":(e,n)=>{n.data._beginMatch=e[1]
},"on:end":(e,n)=>{n.data._beginMatch!==e[1]&&n.ignoreMatch()}})})
;function S(e,n){"."===e.input[e.index-1]&&n.ignoreMatch()}function A(e,n){
void 0!==e.className&&(e.scope=e.className,delete e.className)}function C(e,n){
n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",
e.__beforeBegin=S,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,
void 0===e.relevance&&(e.relevance=0))}function T(e,n){
Array.isArray(e.illegal)&&(e.illegal=p(...e.illegal))}function R(e,n){
if(e.match){
if(e.begin||e.end)throw Error("begin & end are not supported with match")
;e.begin=e.match,delete e.match}}function D(e,n){
void 0===e.relevance&&(e.relevance=1)}const I=(e,n)=>{if(!e.beforeMatch)return
;if(e.starts)throw Error("beforeMatch cannot be used with starts")
;const t=Object.assign({},e);Object.keys(e).forEach((n=>{delete e[n]
})),e.keywords=t.keywords,e.begin=m(t.beforeMatch,g(t.begin)),e.starts={
relevance:0,contains:[Object.assign(t,{endsParent:!0})]
},e.relevance=0,delete t.beforeMatch
},L=["of","and","for","in","not","or","if","then","parent","list","value"]
;function B(e,n,t="keyword"){const a=Object.create(null)
;return"string"==typeof e?i(t,e.split(" ")):Array.isArray(e)?i(t,e):Object.keys(e).forEach((t=>{
Object.assign(a,B(e[t],n,t))})),a;function i(e,t){
n&&(t=t.map((e=>e.toLowerCase()))),t.forEach((n=>{const t=n.split("|")
;a[t[0]]=[e,$(t[0],t[1])]}))}}function $(e,n){
return n?Number(n):(e=>L.includes(e.toLowerCase()))(e)?0:1}const z={},F=e=>{
console.error(e)},U=(e,...n)=>{console.log("WARN: "+e,...n)},j=(e,n)=>{
z[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),z[`${e}/${n}`]=!0)
},P=Error();function K(e,n,{key:t}){let a=0;const i=e[t],r={},s={}
;for(let e=1;e<=n.length;e++)s[e+a]=i[e],r[e+a]=!0,a+=_(n[e-1])
;e[t]=s,e[t]._emit=r,e[t]._multi=!0}function H(e){(e=>{
e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,
delete e.scope)})(e),"string"==typeof e.beginScope&&(e.beginScope={
_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope
}),(e=>{if(Array.isArray(e.begin)){
if(e.skip||e.excludeBegin||e.returnBegin)throw F("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
P
;if("object"!=typeof e.beginScope||null===e.beginScope)throw F("beginScope must be object"),
P;K(e,e.begin,{key:"beginScope"}),e.begin=f(e.begin,{joinWith:""})}})(e),(e=>{
if(Array.isArray(e.end)){
if(e.skip||e.excludeEnd||e.returnEnd)throw F("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
P
;if("object"!=typeof e.endScope||null===e.endScope)throw F("endScope must be object"),
P;K(e,e.end,{key:"endScope"}),e.end=f(e.end,{joinWith:""})}})(e)}function q(e){
function n(n,t){
return RegExp(d(n),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(t?"g":""))
}class t{constructor(){
this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}
addRule(e,n){
n.position=this.position++,this.matchIndexes[this.matchAt]=n,this.regexes.push([n,e]),
this.matchAt+=_(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
;const e=this.regexes.map((e=>e[1]));this.matcherRe=n(f(e,{joinWith:"|"
}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
;const n=this.matcherRe.exec(e);if(!n)return null
;const t=n.findIndex(((e,n)=>n>0&&void 0!==e)),a=this.matchIndexes[t]
;return n.splice(0,t),Object.assign(n,a)}}class a{constructor(){
this.rules=[],this.multiRegexes=[],
this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){
if(this.multiRegexes[e])return this.multiRegexes[e];const n=new t
;return this.rules.slice(e).forEach((([e,t])=>n.addRule(e,t))),
n.compile(),this.multiRegexes[e]=n,n}resumingScanAtSamePosition(){
return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,n){
this.rules.push([e,n]),"begin"===n.type&&this.count++}exec(e){
const n=this.getMatcher(this.regexIndex);n.lastIndex=this.lastIndex
;let t=n.exec(e)
;if(this.resumingScanAtSamePosition())if(t&&t.index===this.lastIndex);else{
const n=this.getMatcher(0);n.lastIndex=this.lastIndex+1,t=n.exec(e)}
return t&&(this.regexIndex+=t.position+1,
this.regexIndex===this.count&&this.considerAll()),t}}
if(e.compilerExtensions||(e.compilerExtensions=[]),
e.contains&&e.contains.includes("self"))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
;return e.classNameAliases=i(e.classNameAliases||{}),function t(r,s){const o=r
;if(r.isCompiled)return o
;[A,R,H,I].forEach((e=>e(r,s))),e.compilerExtensions.forEach((e=>e(r,s))),
r.__beforeBegin=null,[C,T,D].forEach((e=>e(r,s))),r.isCompiled=!0;let l=null
;return"object"==typeof r.keywords&&r.keywords.$pattern&&(r.keywords=Object.assign({},r.keywords),
l=r.keywords.$pattern,
delete r.keywords.$pattern),l=l||/\w+/,r.keywords&&(r.keywords=B(r.keywords,e.case_insensitive)),
o.keywordPatternRe=n(l,!0),
s&&(r.begin||(r.begin=/\B|\b/),o.beginRe=n(o.begin),r.end||r.endsWithParent||(r.end=/\B|\b/),
r.end&&(o.endRe=n(o.end)),
o.terminatorEnd=d(o.end)||"",r.endsWithParent&&s.terminatorEnd&&(o.terminatorEnd+=(r.end?"|":"")+s.terminatorEnd)),
r.illegal&&(o.illegalRe=n(r.illegal)),
r.contains||(r.contains=[]),r.contains=[].concat(...r.contains.map((e=>(e=>(e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((n=>i(e,{
variants:null},n)))),e.cachedVariants?e.cachedVariants:Z(e)?i(e,{
starts:e.starts?i(e.starts):null
}):Object.isFrozen(e)?i(e):e))("self"===e?r:e)))),r.contains.forEach((e=>{t(e,o)
})),r.starts&&t(r.starts,s),o.matcher=(e=>{const n=new a
;return e.contains.forEach((e=>n.addRule(e.begin,{rule:e,type:"begin"
}))),e.terminatorEnd&&n.addRule(e.terminatorEnd,{type:"end"
}),e.illegal&&n.addRule(e.illegal,{type:"illegal"}),n})(o),o}(e)}function Z(e){
return!!e&&(e.endsWithParent||Z(e.starts))}class G extends Error{
constructor(e,n){super(e),this.name="HTMLInjectionError",this.html=n}}
const W=a,Q=i,X=Symbol("nomatch");var V=(n=>{
const a=Object.create(null),i=Object.create(null),r=[];let s=!0
;const o="Could not find the language '{}', did you forget to load/include a language module?",l={
disableAutodetect:!0,name:"Plain text",contains:[]};let d={
ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,
languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",
cssSelector:"pre code",languages:null,__emitter:c};function _(e){
return d.noHighlightRe.test(e)}function h(e,n,t){let a="",i=""
;"object"==typeof n?(a=e,
t=n.ignoreIllegals,i=n.language):(j("10.7.0","highlight(lang, code, ...args) has been deprecated."),
j("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),
i=e,a=n),void 0===t&&(t=!0);const r={code:a,language:i};x("before:highlight",r)
;const s=r.result?r.result:f(r.language,r.code,t)
;return s.code=r.code,x("after:highlight",s),s}function f(e,n,i,r){
const l=Object.create(null);function c(){if(!k.keywords)return void M.addText(S)
;let e=0;k.keywordPatternRe.lastIndex=0;let n=k.keywordPatternRe.exec(S),t=""
;for(;n;){t+=S.substring(e,n.index)
;const i=w.case_insensitive?n[0].toLowerCase():n[0],r=(a=i,k.keywords[a]);if(r){
const[e,a]=r
;if(M.addText(t),t="",l[i]=(l[i]||0)+1,l[i]<=7&&(A+=a),e.startsWith("_"))t+=n[0];else{
const t=w.classNameAliases[e]||e;M.addKeyword(n[0],t)}}else t+=n[0]
;e=k.keywordPatternRe.lastIndex,n=k.keywordPatternRe.exec(S)}var a
;t+=S.substring(e),M.addText(t)}function g(){null!=k.subLanguage?(()=>{
if(""===S)return;let e=null;if("string"==typeof k.subLanguage){
if(!a[k.subLanguage])return void M.addText(S)
;e=f(k.subLanguage,S,!0,x[k.subLanguage]),x[k.subLanguage]=e._top
}else e=E(S,k.subLanguage.length?k.subLanguage:null)
;k.relevance>0&&(A+=e.relevance),M.addSublanguage(e._emitter,e.language)
})():c(),S=""}function u(e,n){let t=1;const a=n.length-1;for(;t<=a;){
if(!e._emit[t]){t++;continue}const a=w.classNameAliases[e[t]]||e[t],i=n[t]
;a?M.addKeyword(i,a):(S=i,c(),S=""),t++}}function b(e,n){
return e.scope&&"string"==typeof e.scope&&M.openNode(w.classNameAliases[e.scope]||e.scope),
e.beginScope&&(e.beginScope._wrap?(M.addKeyword(S,w.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),
S=""):e.beginScope._multi&&(u(e.beginScope,n),S="")),k=Object.create(e,{parent:{
value:k}}),k}function m(e,n,a){let i=((e,n)=>{const t=e&&e.exec(n)
;return t&&0===t.index})(e.endRe,a);if(i){if(e["on:end"]){const a=new t(e)
;e["on:end"](n,a),a.isMatchIgnored&&(i=!1)}if(i){
for(;e.endsParent&&e.parent;)e=e.parent;return e}}
if(e.endsWithParent)return m(e.parent,n,a)}function p(e){
return 0===k.matcher.regexIndex?(S+=e[0],1):(R=!0,0)}function _(e){
const t=e[0],a=n.substring(e.index),i=m(k,e,a);if(!i)return X;const r=k
;k.endScope&&k.endScope._wrap?(g(),
M.addKeyword(t,k.endScope._wrap)):k.endScope&&k.endScope._multi?(g(),
u(k.endScope,e)):r.skip?S+=t:(r.returnEnd||r.excludeEnd||(S+=t),
g(),r.excludeEnd&&(S=t));do{
k.scope&&M.closeNode(),k.skip||k.subLanguage||(A+=k.relevance),k=k.parent
}while(k!==i.parent);return i.starts&&b(i.starts,e),r.returnEnd?0:t.length}
let h={};function y(a,r){const o=r&&r[0];if(S+=a,null==o)return g(),0
;if("begin"===h.type&&"end"===r.type&&h.index===r.index&&""===o){
if(S+=n.slice(r.index,r.index+1),!s){const n=Error(`0 width match regex (${e})`)
;throw n.languageName=e,n.badRule=h.rule,n}return 1}
if(h=r,"begin"===r.type)return(e=>{
const n=e[0],a=e.rule,i=new t(a),r=[a.__beforeBegin,a["on:begin"]]
;for(const t of r)if(t&&(t(e,i),i.isMatchIgnored))return p(n)
;return a.skip?S+=n:(a.excludeBegin&&(S+=n),
g(),a.returnBegin||a.excludeBegin||(S=n)),b(a,e),a.returnBegin?0:n.length})(r)
;if("illegal"===r.type&&!i){
const e=Error('Illegal lexeme "'+o+'" for mode "'+(k.scope||"<unnamed>")+'"')
;throw e.mode=k,e}if("end"===r.type){const e=_(r);if(e!==X)return e}
if("illegal"===r.type&&""===o)return 1
;if(T>1e5&&T>3*r.index)throw Error("potential infinite loop, way more iterations than matches")
;return S+=o,o.length}const w=v(e)
;if(!w)throw F(o.replace("{}",e)),Error('Unknown language: "'+e+'"')
;const N=q(w);let O="",k=r||N;const x={},M=new d.__emitter(d);(()=>{const e=[]
;for(let n=k;n!==w;n=n.parent)n.scope&&e.unshift(n.scope)
;e.forEach((e=>M.openNode(e)))})();let S="",A=0,C=0,T=0,R=!1;try{
for(k.matcher.considerAll();;){
T++,R?R=!1:k.matcher.considerAll(),k.matcher.lastIndex=C
;const e=k.matcher.exec(n);if(!e)break;const t=y(n.substring(C,e.index),e)
;C=e.index+t}
return y(n.substring(C)),M.closeAllNodes(),M.finalize(),O=M.toHTML(),{
language:e,value:O,relevance:A,illegal:!1,_emitter:M,_top:k}}catch(t){
if(t.message&&t.message.includes("Illegal"))return{language:e,value:W(n),
illegal:!0,relevance:0,_illegalBy:{message:t.message,index:C,
context:n.slice(C-100,C+100),mode:t.mode,resultSoFar:O},_emitter:M};if(s)return{
language:e,value:W(n),illegal:!1,relevance:0,errorRaised:t,_emitter:M,_top:k}
;throw t}}function E(e,n){n=n||d.languages||Object.keys(a);const t=(e=>{
const n={value:W(e),illegal:!1,relevance:0,_top:l,_emitter:new d.__emitter(d)}
;return n._emitter.addText(e),n})(e),i=n.filter(v).filter(k).map((n=>f(n,e,!1)))
;i.unshift(t);const r=i.sort(((e,n)=>{
if(e.relevance!==n.relevance)return n.relevance-e.relevance
;if(e.language&&n.language){if(v(e.language).supersetOf===n.language)return 1
;if(v(n.language).supersetOf===e.language)return-1}return 0})),[s,o]=r,c=s
;return c.secondBest=o,c}function y(e){let n=null;const t=(e=>{
let n=e.className+" ";n+=e.parentNode?e.parentNode.className:""
;const t=d.languageDetectRe.exec(n);if(t){const n=v(t[1])
;return n||(U(o.replace("{}",t[1])),
U("Falling back to no-highlight mode for this block.",e)),n?t[1]:"no-highlight"}
return n.split(/\s+/).find((e=>_(e)||v(e)))})(e);if(_(t))return
;if(x("before:highlightElement",{el:e,language:t
}),e.children.length>0&&(d.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
console.warn("The element with unescaped HTML:"),
console.warn(e)),d.throwUnescapedHTML))throw new G("One of your code blocks includes unescaped HTML.",e.innerHTML)
;n=e;const a=n.textContent,r=t?h(a,{language:t,ignoreIllegals:!0}):E(a)
;e.innerHTML=r.value,((e,n,t)=>{const a=n&&i[n]||t
;e.classList.add("hljs"),e.classList.add("language-"+a)
})(e,t,r.language),e.result={language:r.language,re:r.relevance,
relevance:r.relevance},r.secondBest&&(e.secondBest={
language:r.secondBest.language,relevance:r.secondBest.relevance
}),x("after:highlightElement",{el:e,result:r,text:a})}let w=!1;function N(){
"loading"!==document.readyState?document.querySelectorAll(d.cssSelector).forEach(y):w=!0
}function v(e){return e=(e||"").toLowerCase(),a[e]||a[i[e]]}
function O(e,{languageName:n}){"string"==typeof e&&(e=[e]),e.forEach((e=>{
i[e.toLowerCase()]=n}))}function k(e){const n=v(e)
;return n&&!n.disableAutodetect}function x(e,n){const t=e;r.forEach((e=>{
e[t]&&e[t](n)}))}
"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(()=>{
w&&N()}),!1),Object.assign(n,{highlight:h,highlightAuto:E,highlightAll:N,
highlightElement:y,
highlightBlock:e=>(j("10.7.0","highlightBlock will be removed entirely in v12.0"),
j("10.7.0","Please use highlightElement now."),y(e)),configure:e=>{d=Q(d,e)},
initHighlighting:()=>{
N(),j("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},
initHighlightingOnLoad:()=>{
N(),j("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
},registerLanguage:(e,t)=>{let i=null;try{i=t(n)}catch(n){
if(F("Language definition for '{}' could not be registered.".replace("{}",e)),
!s)throw n;F(n),i=l}
i.name||(i.name=e),a[e]=i,i.rawDefinition=t.bind(null,n),i.aliases&&O(i.aliases,{
languageName:e})},unregisterLanguage:e=>{delete a[e]
;for(const n of Object.keys(i))i[n]===e&&delete i[n]},
listLanguages:()=>Object.keys(a),getLanguage:v,registerAliases:O,
autoDetection:k,inherit:Q,addPlugi
