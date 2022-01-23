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
import { IcrpgCharacterSheet2Eunlocked } from "./actor/character-sheet-2e-unlocked.js";

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
  CONFIG.SpellTypes = {
    Arcane: "ICRPG.Arcane",
    Holy: "ICRPG.Holy",
    Infernal: "ICRPG.Infernal"
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = IcrpgActor;
  CONFIG.Item.documentClass = IcrpgItem;
  CONFIG.ActiveEffect.documentClass = IcrpgActiveEffect;

  // Preload Handlebars Templates
  await loadTemplates([
    "systems/icrpg/templates/active-effects.html"
  ]);

  // Register module settings
  game.settings.register("icrpg", "NPCdefense", {
    name: "ICRPG.NPCdefense",
    hint: "",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
  game.settings.register("icrpg" ,"globalDC" , {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Number,
    default: 10
  });

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("icrpg", IcrpgCharacterSheet2E, { types: ["character"], makeDefault: true });
  Actors.registerSheet("icrpg", IcrpgCharacterSheet2Eunlocked, { types: ["character"] });
  Actors.registerSheet("icrpg", IcrpgCharacterSheet, { types: ["character"] });
  Actors.registerSheet("icrpg", IcrpgNpcSheet2E, { types: ["npc"], makeDefault: true });
  Actors.registerSheet("icrpg", IcrpgNpcSheet, { types: ["npc"] });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("icrpg", IcrpgItemSheet, { types: ["item", "weapon", "armor", "spell", "gun"], makeDefault: true });
  Items.registerSheet("icrpg", IcrpgAbilitySheet, { types: ["ability"], makeDefault: true });

  IcrpgRegisterHelpers.init();
});


// Chat message context menu to apply effort roll
Hooks.on("getChatLogEntryContext", (html, options) => {
  const canApply = li => {
    const message = game.messages.get(li.data("messageId"));
    return message.isRoll && message?.isContentVisible && canvas.tokens?.controlled.length;
  };

  options.push(
    {
      name: game.i18n.localize("ICRPG.ChatApplyDamage"),
      icon: '<i class="fas fa-user-minus"></i>',
      condition: canApply,
      callback: li => {
        const message = game.messages.get(li.data("messageId"));
        const roll = message.roll;
        return Promise.all(canvas.tokens.controlled.map(t => t.actor.applyDamage(roll.total)));
      }
    },
    {
      name: game.i18n.localize("ICRPG.ChatApplyHeal"),
      icon: '<i class="fas fa-user-plus"></i>',
      condition: canApply,
      callback: li => {
        const message = game.messages.get(li.data("messageId"));
        const roll = message.roll;
        return Promise.all(canvas.tokens.controlled.map(t => t.actor.applyDamage(-1 * roll.total)));
      }
    }
  );

});