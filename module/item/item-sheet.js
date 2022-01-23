import { IcrpgItemEffectsConfig } from "../active-effect.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
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
    return `${path}/item-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.config = CONFIG;
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

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }

    /** @inheritdoc */
    _getHeaderButtons() {
      const buttons = super._getHeaderButtons();

      // Active Effects
      //if (game.user.isGM) {} // if only GMs should be able to see/edit AEs on items
      buttons.unshift({
        label: game.i18n.localize("ICRPG.Effects"),
        class: "effects",
        icon: "fas fa-exchange-alt",
        onclick: () => new IcrpgItemEffectsConfig(this.document).render(true)
      });

      return buttons;
    }

  /* -------------------------------------------- */
}
