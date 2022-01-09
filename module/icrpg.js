// Import Modules
import { IcrpgActor } from "./actor/actor.js";
import { IcrpgCharacterSheet } from "./actor/character-sheet.js";
import { IcrpgCharacterSheet2E } from "./actor/character-sheet-2e.js";
import { IcrpgNpcSheet } from "./actor/npc-sheet.js";
import { IcrpgNpcSheet2E } from "./actor/npc-sheet-2e.js";
import { IcrpgItem } from "./item/item.js";
import { IcrpgItemSheet } from "./item/item-sheet.js";
import { IcrpgAbilitySheet } from "./item/ability-sheet.js";
import { IcrpgRegisterHelpers } from "./handlebars.js";
import { IcrpgUtility } from "./utility.js";
import { IcrpgActiveEffect } from "./active-effect.js";
import { IcrpgCharacterSheet2Eunlocked } from "./actor/character-sheet-2e-unlocked";

Hooks.once('init', async function () {

  game.icrpg = {
    IcrpgActor,
    IcrpgItem,
    IcrpgUtility
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = IcrpgActor;
  CONFIG.Item.documentClass = IcrpgItem;
  CONFIG.ActiveEffect.documentClass = IcrpgActiveEffect;

  // Preload Handlebars Templates
  await loadTemplates([
    "systems/icrpg/templates/active-effects.html"
  ]);

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("icrpg", IcrpgCharacterSheet2E, { types: ["character"], makeDefault: true });
  Actors.registerSheet("icrpg", IcrpgCharacterSheet2Eunlocked, { types: ["character"] });
  Actors.registerSheet("icrpg", IcrpgCharacterSheet, { types: ["character"] });
  Actors.registerSheet("icrpg", IcrpgNpcSheet2E, { types: ["npc"], makeDefault: true });
  Actors.registerSheet("icrpg", IcrpgNpcSheet, { types: ["npc"] });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("icrpg", IcrpgItemSheet, { types: ["item", "weapon", "armor"], makeDefault: true });
  Items.registerSheet("icrpg", IcrpgAbilitySheet, { types: ["ability"], makeDefault: true });

  IcrpgRegisterHelpers.init();
});
