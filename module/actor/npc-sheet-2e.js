import { IcrpgNpcSheet } from "./npc-sheet.js";

/**
 * Extend the IcrpgNpcSheet with a 2E sheet
 * @extends {IcrpgNpcSheet}
 */
export class IcrpgNpcSheet2E extends IcrpgNpcSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/icrpg/templates/actor/npc-sheet-2e.html",
    });
  }
}
