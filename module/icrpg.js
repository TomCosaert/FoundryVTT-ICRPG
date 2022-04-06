// Import Modules
import { IcrpgActor } from "./actor/actor.js";
import { IcrpgCharacterSheet } from "./actor/character-sheet.js";
import { IcrpgCharacterSheet2E } from "./actor/character-sheet-2e.js";
import { IcrpgNpcSheet } from "./actor/npc-sheet.js";
import { IcrpgNpcSheet2E } from "./actor/npc-sheet-2e.js";
import { IcrpgVehicleSheet2E } from "./actor/vehicle-sheet-2e.js";
import { IcrpgItem } from "./item/item.js";
import { IcrpgItemSheet } from "./item/item-sheet.js";
import { IcrpgAbilitySheet } from "./item/ability-sheet.js";
import { IcrpgRegisterHelpers } from "./handlebars.js";
import { IcrpgUtility } from "./utility.js";
import { IcrpgActiveEffect } from "./active-effect.js";
import { IcrpgCharacterSheet2Eunlocked } from "./actor/character-sheet-2e-unlocked.js";
import { IcrpgGlobalDC } from "./apps/globalDC.js";
import {IcrpgChatMessage } from "./chatMessage.js";

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
  CONFIG.ChatMessage.documentClass = IcrpgChatMessage;

  // Preload Handlebars templates
  await loadTemplates([
    "systems/icrpg/templates/active-effects.html"
  ]);

  // Register system settings
  game.settings.register("icrpg", "globalDC", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Number,
    default: 10,
    onChange: () => game.icrpg.globalDC.render()
  });

  game.settings.register("icrpg", "globalDCposition", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Object,
    default: {
      left: window.innerWidth - 200,
      top: 5
    }
  });

  game.settings.register("icrpg", "globalDCvisible", {
    name: "",
    hint:"",
    scope: "world",
    type: Boolean,
    default: true,
    onChange: () => game.icrpg.globalDC.render()
  });

  // Optional rules
  game.settings.register("icrpg", "NPCdefense", {
    name: "ICRPG.NPCdefense",
    hint: "ICRPG.NPCdefenseHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("icrpg", "itemDurability", {
    name: "ICRPG.itemDurabilitySetting",
    hint: "",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("icrpg", "spellMastery", {
    name: "ICRPG.spellMasterySetting",
    hint: "",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("icrpg", "abilityMastery", {
    name: "ICRPG.abilityMasterySetting",
    hint: "",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Setup socket handler
  socket.on("system.icrpg", data => {
    if (data.action === "positionGlobalDC") {
      game.icrpg.globalDC.setPosition({
        left: data.position.left * (window.innerWidth - 100),
        top: data.position.top * (window.innerHeight - 100),
      });
    }
  });

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("icrpg", IcrpgCharacterSheet2E, { types: ["character"], makeDefault: true });
  Actors.registerSheet("icrpg", IcrpgCharacterSheet2Eunlocked, { types: ["character"] });
  Actors.registerSheet("icrpg", IcrpgCharacterSheet, { types: ["character"] });
  Actors.registerSheet("icrpg", IcrpgNpcSheet2E, { types: ["npc"], makeDefault: true });
  Actors.registerSheet("icrpg", IcrpgNpcSheet, { types: ["npc"] });
  Actors.registerSheet("icrpg", IcrpgVehicleSheet2E, { types: ["vehicle"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("icrpg", IcrpgItemSheet, { types: ["item", "weapon", "armor", "spell", "gun"], makeDefault: true });
  Items.registerSheet("icrpg", IcrpgAbilitySheet, { types: ["ability"], makeDefault: true });

  IcrpgRegisterHelpers.init();
});

Hooks.once("ready", () => {
  // Create global DC application and store outside of ui.windows
  game.icrpg.globalDC = new IcrpgGlobalDC().render(true, { left: game.settings.get("icrpg", "globalDCposition").left, top: game.settings.get("icrpg", "globalDCposition").top, width: 200, height: 200 });
});

// Add global DC visibility toggle control button
Hooks.on("getSceneControlButtons", controls => {
  if (!game.user.isGM) return;

  const bar = controls.find(c => c.name === "token");
  bar.tools.push({
    name: "Global DC",
    title: game.i18n.localize("ICRPG.GlobalDC"),
    icon: "fas fa-dice-d20",
    toggle: true,
    active: game.settings.get("icrpg", "globalDCvisible"),
    onClick: toggle => game.settings.set("icrpg", "globalDCvisible", toggle)
  });
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

Hooks.on("renderItemSheet", (app, html, appData) => {
  if (game.settings.get("icrpg", "itemDurability")) html.find(`label[for="data.durability"]`).closest(`div.grid`).remove();
  if (game.settings.get("icrpg", "spellMastery")) html.find(`label[for="data.mastery"]`).closest(`div.grid`).remove();
  if (game.settings.get("icrpg", "abilityMastery")) html.find(`label[for="data.mastery"]`).closest(`div.grid`).remove();
});
