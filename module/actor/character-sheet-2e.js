import { IcrpgCharacterSheet } from "./character-sheet.js";

/**
 * Extend the IcrpgCharacterSheet with a 2E sheet
 * @extends {IcrpgCharacterSheet}
 */
export class IcrpgCharacterSheet2E extends IcrpgCharacterSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/icrpg/templates/actor/character-sheet-2e.html",
    });
  }
  
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Item controls
    html.find(".abilities").on("click", ".item-control", this._onClickItemControl.bind(this));
  }
}
