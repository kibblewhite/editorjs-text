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
  const C1 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
  class Text2 {
    static get DEFAULT_PLACEHOLDER() {
      return "";
    }
    static get VERSION() {
      return "1.0.8";
    }
    constructor({ data, config, api, readOnly }) {
      this.api = api;
      this.readOnly = readOnly;
      this.holder = this.api.ui.nodes.wrapper.parentElement;
      this._CSS = {
        block: this.api.styles.block,
        wrapper: "ce-text"
      };
      if (!this.readOnly) {
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
      }
      this._placeholder = config.placeholder ? config.placeholder : Text2.DEFAULT_PLACEHOLDER;
      this._data = {};
      this._element = null;
      this._preserveBlank = config.preserveBlank !== void 0 ? config.preserveBlank : false;
      this._allowEnterKeyDown = config.allowEnterKeyDown !== void 0 ? config.allowEnterKeyDown : false;
      this._hidePopoverItem = config.hidePopoverItem !== void 0 ? config.hidePopoverItem : false;
      this.data = data;
    }
    static get toolbox() {
      if (this._hidePopoverItem === true) {
        return [];
      }
      return {
        icon: C1,
        title: "Text"
      };
    }
    onKeyUp(e) {
      if (e.code !== "Backspace" && e.code !== "Delete") {
        return;
      }
      const { textContent } = this._element;
      if (textContent === "") {
        this._element.innerHTML = "";
      }
    }
    onKeyDown(e) {
      if (this._allowEnterKeyDown === false && e.key === "Enter") {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    }
    /**
     * Create Tool's view
     *
     * @returns {HTMLElement}
     * @private
     */
    drawView() {
      const div = document.createElement("DIV");
      div.classList.add(this._CSS.wrapper, this._CSS.block);
      div.contentEditable = false;
      div.dataset.placeholder = this.api.i18n.t(this._placeholder);
      if (this._data.text) {
        div.innerHTML = this._data.text;
      }
      if (!this.readOnly) {
        div.contentEditable = true;
        div.addEventListener("keyup", this.onKeyUp);
        div.addEventListener("keydown", this.onKeyDown);
      }
      if (this._hidePopoverItem === true) {
        const codex_editor_mutation_observer = new MutationObserver(() => {
          let popover_element = this.holder.querySelector('.ce-popover-item[data-item-name="text"]');
          if (popover_element !== null && typeof popover_element !== "undefined") {
            let computed_popover_element_style = window.getComputedStyle(popover_element);
            if (computed_popover_element_style.display !== "none") {
              popover_element.style.display = "none";
              codex_editor_mutation_observer.disconnect();
            }
          }
        });
        codex_editor_mutation_observer.observe(this.holder, { childList: true, subtree: true, attributes: true });
      }
      return div;
    }
    render() {
      this._element = this.drawView();
      return this._element;
    }
    /**
     * Method that specified how to merge two Text blocks.
     * Called by Editor.js by backspace at the beginning of the Block
     *
     * @param {TestData} data
     * @public
     */
    merge(data) {
      let newData = {
        text: this.data.text + data.text
      };
      this.data = newData;
    }
    /**
     * Validate Test block data:
     * - check for emptiness
     *
     * @param {TestData} savedData — data received after saving
     * @returns {boolean} false if saved data is not correct, otherwise true
     * @public
     */
    validate(savedData) {
      return !(savedData.text.trim() === "" && !this._preserveBlank);
    }
    /**
     * Extract Tool's data from the view
     *
     * @param {HTMLDivElement} toolsContent - Test tools rendered view
     * @returns {TestData} - saved data
     * @public
     */
    save(toolsContent) {
      return {
        text: toolsContent.innerHTML
      };
    }
    /**
     * On paste callback fired from Editor.
     *
     * @param {PasteEvent} event - event with pasted data
     */
    onPaste(event) {
      const data = {
        text: event.detail.data.innerHTML
      };
      this.data = data;
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
          br: false
        }
      };
    }
    /**
     * Returns true to notify the core that read-only mode is supported
     *
     * @returns {boolean}
     */
    static get isReadOnlySupported() {
      return true;
    }
    /**
     * Get current Tools`s data
     *
     * @returns {TestData} Current data
     * @private
     */
    get data() {
      if (this._element !== null) {
        const text = this._element.innerHTML;
        this._data.text = text;
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
    set data(data) {
      this._data = data || {};
      if (this._element !== null) {
        this.hydrate();
      }
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
      return false;
    }
  }
  return Text2;
}();
