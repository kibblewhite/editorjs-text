(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode('.ce-text {\n  line-height: 1.6em;\n  outline: none;\n}\n\n.ce-text[data-placeholder]:empty::before{\n  content: attr(data-placeholder);\n  color: #707684;\n  font-weight: normal;\n  opacity: 0;\n}\n\n/** Show placeholder at the first text if Editor is empty */\n.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty::before {\n  opacity: 1;\n}\n\n.codex-editor--toolbox-opened .ce-block:first-child .ce-text[data-placeholder]:empty::before,\n.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty:focus::before {\n  opacity: 0;\n}\n\n.ce-text p:first-of-type{\n  margin-top: 0;\n}\n\n.ce-text p:last-of-type{\n  margin-bottom: 0;\n}\n\n[contenteditable="true"].ce-text {\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n[contenteditable="true"].ce-text br {\n  display: none;\n}\n\n[contenteditable="true"].ce-text * {\n  display: inline;\n  white-space: nowrap;\n}'));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
var Text = function() {
  "use strict";
  class e {
    static get DEFAULT_PLACEHOLDER() {
      return "";
    }
    static get VERSION() {
      return "1.1.2";
    }
    constructor({ data: t, config: i, api: n, readOnly: r }) {
      this.api = n, this.readOnly = r, this.holder = this.api.ui.nodes.wrapper.parentElement, this._CSS = { block: this.api.styles.block, wrapper: "ce-text" }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this), this.onKeyDown = this.onKeyDown.bind(this)), this._placeholder = i.placeholder ? i.placeholder : e.DEFAULT_PLACEHOLDER, this._data = {}, this._element = null, this._preserveBlank = void 0 !== i.preserveBlank && i.preserveBlank, this._allowEnterKeyDown = void 0 !== i.allowEnterKeyDown && i.allowEnterKeyDown, this._hidePopoverItem = void 0 !== i.hidePopoverItem && i.hidePopoverItem, this._hideToolbar = void 0 !== i.hideToolbar && i.hideToolbar, this.data = t;
    }
    static get toolbox() {
      return true === this._hidePopoverItem ? [] : { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>', title: "Text" };
    }
    onKeyUp(e2) {
      if ("Backspace" !== e2.code && "Delete" !== e2.code)
        return;
      const { textContent: t } = this._element;
      "" === t && (this._element.innerHTML = "");
    }
    onKeyDown(e2) {
      if (false === this._allowEnterKeyDown && "Enter" === e2.key)
        return e2.stopPropagation(), e2.preventDefault(), false;
    }
    drawView() {
      const e2 = document.createElement("DIV");
      return e2.classList.add(this._CSS.wrapper, this._CSS.block), e2.contentEditable = false, e2.dataset.placeholder = this.api.i18n.t(this._placeholder), this._data.text && (e2.innerHTML = this._data.text), this.readOnly || (e2.contentEditable = true, e2.addEventListener("keyup", this.onKeyUp), e2.addEventListener("keydown", this.onKeyDown)), true === this._hidePopoverItem && this._hide_element_on_mutation('.ce-popover-item[data-item-name="text"]'), true === this._hideToolbar && this._hide_element_on_mutation(".ce-toolbar"), e2;
    }
    _hide_element_on_mutation(e2) {
      var t = new MutationObserver(() => {
        let i = this.holder.querySelector(e2);
        if (null != i) {
          "none" !== window.getComputedStyle(i).display && (i.style.display = "none", t.disconnect());
        }
      });
      t.observe(this.holder, { childList: true, subtree: true, attributes: true });
    }
    render() {
      return this._element = this.drawView(), this._element;
    }
    merge(e2) {
      let t = { text: this.data.text + e2.text };
      this.data = t;
    }
    validate(e2) {
      return !("" === e2.text.trim() && !this._preserveBlank);
    }
    save(e2) {
      return { text: e2.innerHTML };
    }
    onPaste(e2) {
      const t = { text: e2.detail.data.innerHTML };
      this.data = t;
    }
    static get sanitize() {
      return { text: { br: false } };
    }
    static get isReadOnlySupported() {
      return true;
    }
    get data() {
      if (null !== this._element) {
        const e2 = this._element.innerHTML;
        this._data.text = e2;
      }
      return this._data;
    }
    set data(e2) {
      this._data = e2 || {}, null !== this._element && this.hydrate();
    }
    hydrate() {
      window.requestAnimationFrame(() => {
        this._element.innerHTML = this._data.text || "";
      });
    }
    static get pasteConfig() {
      return { tags: ["P"] };
    }
    static get enableLineBreaks() {
      return false;
    }
  }
  return e;
}();
