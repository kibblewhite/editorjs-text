(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".ce-text{line-height:1.6em;outline:none}.ce-text[data-placeholder]:empty:before{content:attr(data-placeholder);color:#707684;font-weight:400;opacity:0}.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty:before{opacity:1}.codex-editor--toolbox-opened .ce-block:first-child .ce-text[data-placeholder]:empty:before,.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty:focus:before{opacity:0}.ce-text p:first-of-type{margin-top:0}.ce-text p:last-of-type{margin-bottom:0}[contenteditable=true].ce-text{white-space:nowrap;overflow:hidden}[contenteditable=true].ce-text br{display:none}[contenteditable=true].ce-text *{display:inline;white-space:nowrap}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
"use strict";const i='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';class n{static get DEFAULT_PLACEHOLDER(){return""}constructor({data:t,config:e,api:a,readOnly:s}){this.api=a,this.readOnly=s,this._CSS={block:this.api.styles.block,wrapper:"ce-text"},this.readOnly||(this.onKeyUp=this.onKeyUp.bind(this),this.onKeyDown=this.onKeyDown.bind(this)),this._placeholder=e.placeholder?e.placeholder:n.DEFAULT_PLACEHOLDER,this._data={},this._element=null,this._preserveBlank=e.preserveBlank!==void 0?e.preserveBlank:!1,this._allowEnterKeyDown=e.allowEnterKeyDown!==void 0?e.allowEnterKeyDown:!1,this.data=t}static get toolbox(){return{icon:i,title:"Text"}}onKeyUp(t){if(t.code!=="Backspace"&&t.code!=="Delete")return;const{textContent:e}=this._element;e===""&&(this._element.innerHTML="")}onKeyDown(t){if(this._allowEnterKeyDown===!1&&t.key==="Enter")return t.stopPropagation(),t.preventDefault(),!1}drawView(){const t=document.createElement("DIV");return t.classList.add(this._CSS.wrapper,this._CSS.block),t.contentEditable=!1,t.dataset.placeholder=this.api.i18n.t(this._placeholder),this._data.text&&(t.innerHTML=this._data.text),this.readOnly||(t.contentEditable=!0,t.addEventListener("keyup",this.onKeyUp),t.addEventListener("keydown",this.onKeyDown)),t}render(){return this._element=this.drawView(),this._element}merge(t){let e={text:this.data.text+t.text};this.data=e}validate(t){return!(t.text.trim()===""&&!this._preserveBlank)}save(t){return{text:t.innerHTML}}onPaste(t){const e={text:t.detail.data.innerHTML};this.data=e}static get sanitize(){return{text:{br:!1}}}static get isReadOnlySupported(){return!0}get data(){if(this._element!==null){const t=this._element.innerHTML;this._data.text=t}return this._data}set data(t){this._data=t||{},this._element!==null&&this.hydrate()}hydrate(){window.requestAnimationFrame(()=>{this._element.innerHTML=this._data.text||""})}static get pasteConfig(){return{tags:["P"]}}static get enableLineBreaks(){return!1}}module.exports=n;