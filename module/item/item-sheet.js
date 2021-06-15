/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
 import {onManageActiveEffect} from "../effects.js";

 
export class IcrpgItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["icrpg", "sheet", "item"],
      template: "systems/icrpg/templates/item/item-sheet.html",
      width: 375,
      height: 375,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/icrpg/templates/item";
    // Return a single sheet for all item types.
    return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    // return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /* -------------------------------------------- */

  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetHeader = this.element.find(".sheet-header");
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - sheetHeader[0].clientHeight - 99 + 40; // sheet-tabs hidden
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
	html.find(".effect-control").click(ev => {
        if ( this.item.isOwned ) return ui.notifications.warn("Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.")
        onManageActiveEffect(ev, this.item)
      });
    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }

  /* -------------------------------------------- */
}
