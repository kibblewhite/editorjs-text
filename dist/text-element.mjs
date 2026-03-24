(function(){try{if(typeof document<`u`){var e=document.createElement(`style`);e.appendChild(document.createTextNode(`.ce-text{text-align:start;outline:none;line-height:1.6em}.ce-text[data-placeholder]:empty:before{content:attr(data-placeholder);color:#707684;opacity:0;font-weight:400}.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty:before{opacity:1}.codex-editor--toolbox-opened .ce-block:first-child .ce-text[data-placeholder]:empty:before,.codex-editor--empty .ce-block:first-child .ce-text[data-placeholder]:empty:focus:before{opacity:0}[contenteditable=true].ce-text{white-space:nowrap;overflow:hidden}[contenteditable=true].ce-text br{display:none}[contenteditable=true].ce-text *{display:inline}.ce-text.cdx-block{margin-inline-start:var(--block-indent,0)}
/*$vite$:1*/`)),document.head.appendChild(e)}}catch(e){console.error(`vite-plugin-css-injected-by-js`,e)}})();var e = class {
	static get toolbox() {
		return null;
	}
	static get pasteConfig() {
		return !1;
	}
	render() {
		return document.createElement("div");
	}
	save() {
		return {};
	}
}, t = class t {
	static get DefaultPlaceHolder() {
		return "";
	}
	static get Version() {
		return "1.0.3";
	}
	static get DefaultWrapElement() {
		return "text";
	}
	static get SupportedWrapElementsArray() {
		return [
			"text",
			"custom",
			"title",
			"synopsis"
		];
	}
	constructor({ data: e, config: n, api: r, readOnly: i }) {
		this.api = r, this.readOnly = i, this._CSS = {
			block: this.api.styles.block,
			wrapper: "ce-text"
		}, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this), this.onKeyDown = this.onKeyDown.bind(this), this.onPasteIntercept = this.onPasteIntercept.bind(this)), this._placeholder = n.placeholder || t.DefaultPlaceHolder, this._element = null, this._preserveBlank = n.preserveBlank ?? !1, this._allowEnterKeyDown = n.allowEnterKeyDown ?? !1, this._hidePopoverItem = n.hidePopoverItem ?? !1, this._hideToolbar = n.hideToolbar ?? !1, this._startMarginZero = n.startMarginZero ?? !1, this._direction = n.direction ?? "auto", this._data = this.normalizeData(e || {}), this._data.wrap = t.SupportedWrapElementsArray.find((e) => e === n.wrapElement) ?? t.DefaultWrapElement;
	}
	static get toolbox() {
		return {
			icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"none\" viewBox=\"0 0 24 24\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"2\" d=\"M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14\"/></svg>",
			title: "Text"
		};
	}
	normalizeData(e) {
		return {
			text: e && typeof e.text == "string" ? e.text : "",
			wrap: e && e.wrap ? e.wrap : t.DefaultWrapElement
		};
	}
	onKeyUp(e) {
		e.code !== "Backspace" && e.code !== "Delete" || this._element.textContent === "" && (this._element.innerHTML = "");
	}
	onKeyDown(e) {
		if (!1 === this._allowEnterKeyDown && e.key === "Enter") return this.api.events.emit("block:enter", {
			element: this._element,
			event: e
		}), e.stopPropagation(), !0;
	}
	onPasteIntercept(e) {
		e.stopPropagation(), e.preventDefault();
		let t = e.clipboardData.getData("text/plain").replace(/[\r\n]+/g, " ").trim();
		if (!document.execCommand("insertText", !1, t)) {
			let e = window.getSelection();
			if (e && e.rangeCount) {
				let n = e.getRangeAt(0);
				n.deleteContents();
				let r = document.createTextNode(t);
				n.insertNode(r), n.setStartAfter(r), n.collapse(!0), e.removeAllRanges(), e.addRange(n);
			}
		}
	}
	_hide_element_on_mutation(e) {
		if (this.holder && this.holder instanceof Node) {
			var t = new MutationObserver(() => {
				let n = this.holder?.querySelector(e);
				n && window.getComputedStyle(n).display !== "none" && (n.style.display = "none", t.disconnect());
			});
			t.observe(this.holder, {
				childList: !0,
				subtree: !0,
				attributes: !0
			});
		}
	}
	render() {
		let e = document.createElement("div");
		return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = !this.readOnly, e.dataset.placeholder = this.api.i18n.t(this._placeholder), e.dir = this._direction, this._data.text && (e.innerHTML = this._data.text), this.readOnly || (e.addEventListener("keyup", this.onKeyUp), e.addEventListener("keydown", this.onKeyDown), e.addEventListener("paste", this.onPasteIntercept)), this._element = e, setTimeout(() => {
			if (this.holder = this._element.closest(".codex-editor"), this.redactor = this.holder?.querySelector(".codex-editor__redactor"), this.holder && this.redactor) {
				if (this._hidePopoverItem) {
					this._hide_element_on_mutation(".ce-popover-item[data-item-name=\"text\"]");
					for (let e = this.api.blocks.getBlocksCount() - 1; e > 0; e--) this.api.blocks.delete(e);
				}
				if (this._hideToolbar && this._hide_element_on_mutation(".ce-toolbar"), this._startMarginZero) {
					let e = this.redactor.querySelectorAll(".ce-block__content");
					for (let t = 0; t < e.length; t++) e[t].style.setProperty("max-width", "100%", "important");
				}
			}
		}, 1), this._element;
	}
	merge(e) {
		this._data = this.normalizeData({
			text: this._data.text + e.text,
			wrap: this._data.wrap
		});
	}
	validate(e) {
		return !(e.text.trim() === "" && !this._preserveBlank);
	}
	save(e) {
		return {
			text: e.innerHTML,
			wrap: this._data.wrap
		};
	}
	static get sanitize() {
		return { text: { br: !1 } };
	}
	static get isReadOnlySupported() {
		return !0;
	}
	get data() {
		return this._element && (this._data.text = this._element.innerHTML), this.normalizeData(this._data);
	}
	set data(e) {
		this._data = this.normalizeData(e), this._element !== null && this.hydrate();
	}
	hydrate() {
		window.requestAnimationFrame(() => {
			this._element.innerHTML = this._data.text || "";
		});
	}
	static get enableLineBreaks() {
		return !1;
	}
	static get DisabledParagraph() {
		return e;
	}
};
export { t as default };
