import './text-element.css';

import { IconText } from '@codexteam/icons'

/**
 * No-op paragraph class to cleanly disable the built-in paragraph tool.
 * Using `paragraph: false` causes a "constructable is not a constructor" warning
 * because Editor.js's Paste module tries to instantiate every registered tool.
 * Use this class instead: `paragraph: { class: TextElement.DisabledParagraph }`
 */
class DisabledParagraph {
  static get toolbox() { return null; }
  static get pasteConfig() { return false; }
  render() { return document.createElement('div'); }
  save() { return {}; }
}

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
      this.onPasteIntercept = this.onPasteIntercept.bind(this);
    }

    this._placeholder = config.placeholder || TextElement.DefaultPlaceHolder;
    this._element = null;

    this._preserveBlank = config.preserveBlank ?? false;
    this._allowEnterKeyDown = config.allowEnterKeyDown ?? false;
    this._hidePopoverItem = config.hidePopoverItem ?? false;
    this._hideToolbar = config.hideToolbar ?? false;
    this._startMarginZero = config.startMarginZero ?? false;

    this._data = this.normalizeData(data || {});
    this._data.wrap = TextElement.SupportedWrapElementsArray.find(item => item === config.wrapElement) ?? TextElement.DefaultWrapElement;
  }

  static get toolbox() {
    return {
      icon: IconText,
      title: 'Text'
    };
  }

  normalizeData(data) {
    return {
      text: data && typeof data.text === 'string' ? data.text : '',
      wrap: data && data.wrap ? data.wrap : TextElement.DefaultWrapElement
    };
  }

  onKeyUp(e) {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    if (this._element.textContent === '') {
      this._element.innerHTML = '';
    }
  }

  onKeyDown(e) {
    if (this._allowEnterKeyDown === false && e.key === 'Enter') {

      this.api.events.emit('block:enter', {
        element: this._element,
        event: e
      });

      e.stopPropagation();
      return true;
    }
  }

  onPasteIntercept(e) {
    e.stopPropagation();
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');
    const singleLine = text.replace(/[\r\n]+/g, ' ').trim();

    // Prefer execCommand for undo-stack integration and reliable iOS Safari support.
    // Falls back to Selection/Range API if execCommand is unavailable.
    // eslint-disable-next-line -- execCommand is deprecated in spec but retained by all browsers;
    if (!document.execCommand('insertText', false, singleLine)) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(singleLine);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  _hide_element_on_mutation(selectors) {
    if (!this.holder || !(this.holder instanceof Node)) {
      return;
    }

    var observer = new MutationObserver(() => {
      let el = this.holder?.querySelector(selectors);
      if (el && window.getComputedStyle(el).display !== 'none') {
        el.style.display = 'none';
        observer.disconnect();
      }
    });

    observer.observe(this.holder, { childList: true, subtree: true, attributes: true });
  }

  render() {
    const div = document.createElement('div');

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = !this.readOnly;
    div.dataset.placeholder = this.api.i18n.t(this._placeholder);

    if (this._data.text) {
      div.innerHTML = this._data.text;
    }

    if (!this.readOnly) {
      div.addEventListener('keyup', this.onKeyUp);
      div.addEventListener('keydown', this.onKeyDown);
      div.addEventListener('paste', this.onPasteIntercept);
    }

    this._element = div;

    setTimeout(() => {
      this.holder = this._element.closest('.codex-editor');
      this.redactor = this.holder?.querySelector('.codex-editor__redactor');

      if (!this.holder || !this.redactor) {
        return;
      }

      if (this._hidePopoverItem) {
        this._hide_element_on_mutation('.ce-popover-item[data-item-name="text"]');

        const blockCount = this.api.blocks.getBlocksCount();
        for (let i = blockCount - 1; i > 0; i--) {
          this.api.blocks.delete(i);
        }
      }

      if (this._hideToolbar) {
        this._hide_element_on_mutation('.ce-toolbar');
      }

      if (this._startMarginZero) {
        const content_blocks = this.redactor.querySelectorAll('.ce-block__content');
        for (let i = 0; i < content_blocks.length; i++) {
          content_blocks[i].style.setProperty('max-width', '100%', 'important');
        }
      }
    }, 1);

    return this._element;
  }

  merge(data) {
    this._data = this.normalizeData({
      text: this._data.text + data.text,
      wrap: this._data.wrap,
    });
  }

  validate(savedData) {
    return !(savedData.text.trim() === '' && !this._preserveBlank);
  }

  save(toolsContent) {
    return {
      text: toolsContent.innerHTML,
      wrap: this._data.wrap
    };
  }

  static get sanitize() {
    return {
      text: {
        br: false
      }
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  get data() {
    if (this._element) {
      this._data.text = this._element.innerHTML;
    }
    return this.normalizeData(this._data);
  }

  set data(data) {
    this._data = this.normalizeData(data);
    if (this._element !== null) {
      this.hydrate();
    }
  }

  hydrate() {
    window.requestAnimationFrame(() => {
      this._element.innerHTML = this._data.text || '';
    });
  }

  static get enableLineBreaks() {
    return false;
  }

  static get DisabledParagraph() {
    return DisabledParagraph;
  }
}
