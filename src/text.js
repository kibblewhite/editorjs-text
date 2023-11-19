import './text.css';

import { IconText } from '@codexteam/icons'

export default class Text {

  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  static get VERSION() {
    return process.env.VERSION;
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.holder = this.api.ui.nodes.wrapper.parentElement;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-text',
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
    }


    /**
     * Placeholder for test if it is first Block
     *
     * @type {string}
     */
    this._placeholder = config.placeholder ? config.placeholder : Text.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = null;
    this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;
    this._allowEnterKeyDown = config.allowEnterKeyDown !== undefined ? config.allowEnterKeyDown : false;
    this._hidePopoverItem = config.hidePopoverItem !== undefined ? config.hidePopoverItem : false;

    this.data = data;
  }

  static get toolbox() {
    if (this._hidePopoverItem === true) { return [ ]; }
    return {
      icon: IconText,
      title: 'Text',
    };
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
    if (this._allowEnterKeyDown === false && e.key === 'Enter') {
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
    const div = document.createElement('DIV');

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

    // <div class="ce-popover-item" data-item-name="text" />
    if (this._hidePopoverItem === true) {
        const codex_editor_mutation_observer = new MutationObserver(() => {
          let popover_element = this.holder.querySelector('.ce-popover-item[data-item-name="text"]');
            if (popover_element !== null && typeof popover_element !== 'undefined') {
              let computed_popover_element_style = window.getComputedStyle(popover_element);              
              if (computed_popover_element_style.display !== 'none') {
                popover_element.style.display = 'none';
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
      text : this.data.text + data.text
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
      tags: [ 'P' ]
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
