(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".ce-text{line-height:1.6em;outline:none}.ce-text[data-placeholder]:empty:before{content:attr(data-placeholder);color:#707684;font-weight:400;opacity:0}.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty:before{opacity:1}.codex-editor--toolbox-opened .ce-block:first-child .ce-text[data-placeholder]:empty:before,.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty:focus:before{opacity:0}.ce-text p:first-of-type{margin-top:0}.ce-text p:last-of-type{margin-bottom:0}[contenteditable=true].ce-text{white-space:nowrap;overflow:hidden}[contenteditable=true].ce-text br{display:none}[contenteditable=true].ce-text *{display:inline;white-space:nowrap}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
const i = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
class n {
  /**
   * Default placeholder for Text Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }
  constructor({ data: t, config: e, api: a, readOnly: s }) {
    this.api = a, this.readOnly = s, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-text"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this), this.onKeyDown = this.onKeyDown.bind(this)), this._placeholder = e.placeholder ? e.placeholder : n.DEFAULT_PLACEHOLDER, this._data = {}, this._element = null, this._preserveBlank = e.preserveBlank !== void 0 ? e.preserveBlank : !1, this._allowEnterKeyDown = e.allowEnterKeyDown !== void 0 ? e.allowEnterKeyDown : !1, this.data = t;
  }
  static get toolbox() {
    return {
      icon: i,
      title: "Text"
    };
  }
  onKeyUp(t) {
    if (t.code !== "Backspace" && t.code !== "Delete")
      return;
    const { textContent: e } = this._element;
    e === "" && (this._element.innerHTML = "");
  }
  onKeyDown(t) {
    if (this._allowEnterKeyDown === !1 && t.key === "Enter")
      return t.stopPropagation(), t.preventDefault(), !1;
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLElement}
   * @private
   */
  drawView() {
    const t = document.createElement("DIV");
    return t.classList.add(this._CSS.wrapper, this._CSS.block), t.contentEditable = !1, t.dataset.placeholder = this.api.i18n.t(this._placeholder), this._data.text && (t.innerHTML = this._data.text), this.readOnly || (t.contentEditable = !0, t.addEventListener("keyup", this.onKeyUp), t.addEventListener("keydown", this.onKeyDown)), t;
  }
  render() {
    return this._element = this.drawView(), this._element;
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {TestData} data
   * @public
   */
  merge(t) {
    let e = {
      text: this.data.text + t.text
    };
    this.data = e;
  }
  /**
   * Validate Test block data:
   * - check for emptiness
   *
   * @param {TestData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(t) {
    return !(t.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Test tools rendered view
   * @returns {TestData} - saved data
   * @public
   */
  save(t) {
    return {
      text: t.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(t) {
    const e = {
      text: t.detail.data.innerHTML
    };
    this.data = e;
  }
  /**
   * Enable Conversion Toolbar. Test can be converted to/from other tools
   */
  // static get conversionConfig() {
  //   return {
  //     export: 'text', // to convert Test to other block, use 'text' property of saved data
  //     import: 'text', // to covert other block's exported string to Test, fill 'text' property of tool data
  //   };
  // }
  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: !1
      }
    };
  }
  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Get current Tools`s data
   *
   * @returns {TestData} Current data
   * @private
   */
  get data() {
    if (this._element !== null) {
      const t = this._element.innerHTML;
      this._data.text = t;
    }
    return this._data;
  }
  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {TestData} data — data to set
   * @private
   */
  set data(t) {
    this._data = t || {}, this._element !== null && this.hydrate();
  }
  /**
   * Fill tool's view with data
   */
  hydrate() {
    window.requestAnimationFrame(() => {
      this._element.innerHTML = this._data.text || "";
    });
  }
  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }
  /**
   * Allow pressing "shift+" Enter inside the text block
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return !1;
  }
}
export {
  n as default
};
