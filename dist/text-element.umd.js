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
!function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).TextElement = t();
}(this, function() {
  "use strict";
  class e {
    static get DefaultPlaceHolder() {
      return "";
    }
    static get Version() {
      return "0.1.7";
    }
    static get DefaultWrapElement() {
      return "text";
    }
    static get SupportedWrapElementsArray() {
      return ["text", "custom", "title", "synopsis"];
    }
    _set_wrap_element(t) {
      this._data.wrap = e.SupportedWrapElementsArray.find((e2) => e2 === t) ?? e.DefaultWrapElement;
    }
    _instantiate_data(e2) {
      this._data = this.normalizeData(e2 || {});
    }
    constructor({ data: t, config: i, api: a, readOnly: n }) {
      this.api = a, this.readOnly = n, this._CSS = { block: this.api.styles.block, wrapper: "ce-text" }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this), this.onKeyDown = this.onKeyDown.bind(this)), this._placeholder = i.placeholder ? i.placeholder : e.DefaultPlaceHolder, this._data = t ?? {}, this._element = null, this._preserveBlank = void 0 !== i.preserveBlank && i.preserveBlank, this._allowEnterKeyDown = void 0 !== i.allowEnterKeyDown && i.allowEnterKeyDown, this._hidePopoverItem = void 0 !== i.hidePopoverItem && i.hidePopoverItem, this._hideToolbar = void 0 !== i.hideToolbar && i.hideToolbar, this._instantiate_data(t), this._set_wrap_element(i.wrapElement);
    }
    static get toolbox() {
      return true === this._hidePopoverItem ? [] : { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>', title: "Text" };
    }
    _currentWrapElement() {
      return e.SupportedWrapElementsArray.find((e2) => e2.wrap === this._data.wrap).toString() ?? e.DefaultWrapElement;
    }
    normalizeData(t) {
      const i = t && "string" == typeof t.text ? t.text : "", a = t && t.wrap ? t.wrap : e.DefaultWrapElement;
      if (this.redactor) {
        const e2 = this.redactor.querySelectorAll(".ce-block");
        if (e2.length > 1) for (let t2 = 1; t2 < e2.length; t2++) e2[t2].remove();
      }
      return { text: i, wrap: a };
    }
    onKeyUp(e2) {
      if ("Backspace" !== e2.code && "Delete" !== e2.code) return;
      const { textContent: t } = this._element;
      "" === t && (this._element.innerHTML = "");
    }
    onKeyDown(e2) {
      if (false === this._allowEnterKeyDown && "Enter" === e2.key) return this.api.events.emit("block:enter", { element: this._element, event: e2 }), e2.stopPropagation(), true;
    }
    drawView() {
      const e2 = document.createElement("div");
      return e2.classList.add(this._CSS.wrapper, this._CSS.block), e2.contentEditable = false, e2.dataset.placeholder = this.api.i18n.t(this._placeholder), this._data.text && (e2.innerHTML = this._data.text), this.readOnly || (e2.contentEditable = true, e2.addEventListener("keyup", this.onKeyUp), e2.addEventListener("keydown", this.onKeyDown)), e2;
    }
    _hide_element_on_mutation(e2) {
      var t = new MutationObserver(() => {
        let i = this.holder?.querySelector(e2);
        if (null != i) {
          "none" !== window.getComputedStyle(i).display && (i.style.display = "none", t.disconnect());
        }
      });
      t.observe(this.holder, { childList: true, subtree: true, attributes: true });
    }
    render() {
      return this._element = this.drawView(), setTimeout(() => {
        this.holder = this._element.closest(".codex-editor"), this.redactor = this.holder?.querySelector(".codex-editor__redactor"), true === this._hidePopoverItem && this._hide_element_on_mutation('.ce-popover-item[data-item-name="text"]'), true === this._hideToolbar && this._hide_element_on_mutation(".ce-toolbar");
      }, 1), this._element;
    }
    merge(e2) {
      let t = { text: this._data.text + e2.text, wrap: this._data.wrap };
      this._data = this.normalizeData(t);
    }
    validate(e2) {
      return !("" === e2.text.trim() && !this._preserveBlank);
    }
    save(e2) {
      return { text: e2.innerHTML, wrap: this._data.wrap };
    }
    onPaste(e2) {
      const t = { text: e2.detail.data.innerHTML };
      this._data = this.normalizeData(t);
    }
    static get sanitize() {
      return { text: { br: false } };
    }
    static get isReadOnlySupported() {
      return true;
    }
    get data() {
      if (null !== this._element && void 0 !== this._element) {
        const e2 = this._element.innerHTML;
        this._data.text = e2;
      }
      return this._data.wrap = this._currentWrapElement(), this.normalizeData(this._data);
    }
    set data(e2) {
      this._data = this.normalizeData(e2), null !== this._element && this.hydrate();
    }
    hydrate() {
      window.requestAnimationFrame(() => {
        this._element.innerHTML = this._data.text || "";
      });
    }
    static get pasteConfig() {
      return { tags: ["p"] };
    }
    static get enableLineBreaks() {
      return false;
    }
  }
  return e;
});
