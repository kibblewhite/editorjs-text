import './text-element.css';

import { IconText } from '@codexteam/icons'

export default class TextElement {

  static get DefaultPlaceHolder() {
    return '';
  }

  static get Version() {
    return process.env.VERSION;
  }

  static get DefaultWrapElement() {
    return 'text';
  }

  static get SupportedWrapElementsArray() {
    return [ 'text', 'custom', 'title', 'synopsis' ];
  }

  _set_wrap_element(wrap_element) {
    this._data.wrap = TextElement.SupportedWrapElementsArray.find(item => item === wrap_element) ?? TextElement.DefaultWrapElement;
  }

  _instantiate_data(data) {
    this._data = this.normalizeData(data || {});
  }

  constructor({ data, config, api, readOnly }) {

    this.api = api;
    this.readOnly = readOnly;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-text"
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
    }

    this._placeholder = config.placeholder ? config.placeholder : TextElement.DefaultPlaceHolder;
    this._data = data ?? {};
    this._element = null;
    
    this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;
    this._allowEnterKeyDown = config.allowEnterKeyDown !== undefined ? config.allowEnterKeyDown : false;
    this._hidePopoverItem = config.hidePopoverItem !== undefined ? config.hidePopoverItem : false;
    this._hideToolbar = config.hideToolbar !== undefined ? config.hideToolbar : false;

    this._instantiate_data(data);
    this._set_wrap_element(config.wrapElement);
  }

  static get toolbox() {
    if (this._hidePopoverItem === true) { return [ ]; }
    return {
      icon: IconText,
      title: 'Text'
    };
  }

  _currentWrapElement() {
    const wrap_element = TextElement.SupportedWrapElementsArray.find(item => item.wrap === this._data.wrap).toString() ?? TextElement.DefaultWrapElement;
    return wrap_element;
  }

  normalizeData(data) {
    const text = data && typeof data.text === 'string' ? data.text : '';
    const wrap = data && data.wrap ? data.wrap : TextElement.DefaultWrapElement;

    // Remove all of the elements with the class `ce-block` except the first/top one from `this.redactor`
    if (this.redactor) {
      const blocks = this.redactor.querySelectorAll('.ce-block');
      if (blocks.length > 1) {
        for (let i = 1; i < blocks.length; i++) {
          blocks[i].remove();
        }
      }
    }

    return { text, wrap };
  }

  onKeyUp(e) {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    const { textContent } = this._element;

    if (textContent === '') {
      this._element.innerHTML = '';
    }
  }

  onKeyDown(e) {
    // console.debug('e.key', e.key, e);
    if (this._allowEnterKeyDown === false && e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    // if (e.ctrlKey === true && e.key === 'v') {
    //   // const clipboard_text = navigator.clipboard.readText();
    //   // const clipboard_update = clipboard_text.replace(/[\n\r]+/g, '');
    //   // e.clipboardData.setData('text/plain', clipboard_update);
    //   // console.log('clipboard_text', clipboard_text, clipboard_update);
    //   e.stopPropagation();
    //   e.preventDefault();
    //   return false;
    // }
  }

  drawView() {
    const div = document.createElement('div');

    div.classList.add(this._CSS.wrapper, this._CSS.block);

    div.contentEditable = false;
    div.dataset.placeholder = this.api.i18n.t(this._placeholder);

    if (this._data.text) {
      div.innerHTML = this._data.text;
    }

    if (!this.readOnly) {
      div.contentEditable = true;
      div.addEventListener('keyup', this.onKeyUp);
      div.addEventListener('keydown', this.onKeyDown);
    }

    return div;
  }

  _hide_element_on_mutation(selectors) {
    var codex_editor_mutation_observer = new MutationObserver(() => {
      let tool_element = this.holder?.querySelector(selectors);
        if (tool_element !== null && typeof tool_element !== 'undefined') {
          let computed_tool_element_style = window.getComputedStyle(tool_element);
          if (computed_tool_element_style.display !== 'none') {
            tool_element.style.display = 'none';
            codex_editor_mutation_observer.disconnect();
          }
        }
    });
    codex_editor_mutation_observer.observe(this.holder, { childList: true, subtree: true, attributes: true });
  }

  render() {
    this._element = this.drawView();

    setTimeout(() => {
      // search up through the parent elements to find a div element with the css class of `codex-editor` assigned to it
      this.holder = this._element.closest('.codex-editor');
      this.redactor = this.holder?.querySelector('.codex-editor__redactor');

      // <div class="ce-popover-item" data-item-name="text" />
      if (this._hidePopoverItem === true) {
        this._hide_element_on_mutation('.ce-popover-item[data-item-name="text"]');
      }

      // <div class="ce-toolbar ce-toolbar--opened" />
      if (this._hideToolbar === true) {
        this._hide_element_on_mutation('.ce-toolbar');
      }

    }, 1);

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
    let merged_data = {
      text : this._data.text + data.text,
      wrap: this._data.wrap,
    };
    this._data = this.normalizeData(merged_data);
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
    return !(savedData.text.trim() === '' && !this._preserveBlank);
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
      text: toolsContent.innerHTML,
      wrap: this._data.wrap
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
    this._data = this.normalizeData(data);
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
    if (this._element !== null && typeof this._element !== 'undefined') {
      const text = this._element.innerHTML;
      this._data.text = text;
    }
    this._data.wrap = this._currentWrapElement();
    return this.normalizeData(this._data);
  }

  /**
   * Store data in plugin:
   * - at the this.data property
   * - at the HTML
   *
   * @param {TestData} data — data to set
   * @private
   */
  set data(data) {
    this._data = this.normalizeData(data);
    if (this._element !== null) {
      this.hydrate();
    }
  }

  /**
   * Fill tool's view with data
   */
  hydrate() {
    window.requestAnimationFrame(() => {
      this._element.innerHTML = this._data.text || '';
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
      tags: [ 'p' ]
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
