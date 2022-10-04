import { IcrpgUtility } from "../utility.js";
import { IcrpgActiveEffect } from "../active-effect.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class IcrpgCharacterSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["icrpg", "sheet", "actor"],
      template: "systems/icrpg/templates/actor/character-sheet.html",
      width: 400,
      height: 531,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }],
      dragDrop: [{ dragSelector: ".items-list .item", dropSelector: null }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    data.effects = IcrpgActiveEffect.prepareActiveEffectCategories(this.actor.effects);

    data.items = [];
    data.abilities = [];
    data.spells = [];
    for (const item of data.actor.items.contents) {
      switch (item.type) {
        case "spell":
          data.spells.push(item);
          break;
        case "ability":
          data.abilities.push(item);
          break;
        default:
          data.items.push(item);
      }
    }

    // Mastery
    if (this.actor.system.mastery) {
      data.mastery = Object.entries(this.actor.system.mastery).map(([k, v]) => {
        return {
          key: k,
          label: game.i18n.localize(`ICRPG.${k}`),
          value: v
        };
      });
    }
    

    // Armor
    data.armor = {value: this.actor.system.armor.value - 10};
    
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Item controls
    html.find(".items").on("click", ".item-control", this._onClickItemControl.bind(this));
    html.find(".items").on("change", "input[name='equipped']", this._onClickItemFilter.bind(this));
    html.find(".items").on("click", ".item-image",  this._onClickItemImg.bind(this));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Active Effects
    html.find(`.effect-control`).click(ev => IcrpgActiveEffect.onManageActiveEffect(ev, this.actor));
  }

  /* -------------------------------------------- */

  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetHeader = this.element.find(".sheet-header");
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - sheetHeader[0].clientHeight - 99;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /**
   * Listen for click events on an attribute control to modify the composition of attributes in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
  async _onClickItemControl(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const action = header.dataset.action;

    // Create new item
    if (action === "create") {
      // Get the type of item to create.
      const type = header.dataset.type;
      // Grab any data associated with this control.
      const data = duplicate(header.dataset);
      // Initialize a default name.
      const name = `New ${type.capitalize()}`;
      // Prepare the item object.
      const itemData = {
        name: name,
        type: type,
        data: data
      };
      // Remove the type from the dataset since it's in the itemData.type prop.
      // delete itemsystem["type"];

      // Finally, create the item!
      await this.actor.createEmbeddedDocuments("Item", [itemData]);
      //const item = await Item.create(itemData, { parent: this.actor });
    }

    else if (action === "equip") {
      const li = $(header).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      await item.update({ "system.equipped": !item.system.equipped });
    }

    else if (action === "edit") {
      const li = $(header).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    }

    else if (action === "delete") {
      const li = $(header).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      const itemTypeCapitalized = item.type.charAt(0).toUpperCase() + item.type.slice(1);
      let d = Dialog.confirm({
        title: game.i18n.localize("ICRPG.Delete" + itemTypeCapitalized),
        content: "<p>" + game.i18n.localize("ICRPG.AreYouSure") + "</p>",
        yes: async () => {
          await this.actor.deleteEmbeddedDocuments("Item", [item.id]);
          li.slideUp(200, () => this.render(false));
        },
        no: () => {
          return;
        },
        defaultYes: false
      });
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.system);
      let label = dataset.label ? `${game.i18n.localize("ICRPG.Rolling")} ${dataset.label}` : '';
      roll.evaluate({async: false}).toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  /* -------------------------------------------- */

  /**
       * Listen for click events on a filter to modify the item list in the sheet
       * @param {MouseEvent} event    The originating left click event
       * @private
       */
  async _onClickItemFilter(event) {
    event.stopPropagation();

    const el_filters = document.querySelectorAll(".items input[name='equipped']"),
      el_filterable = document.querySelectorAll(".items .item[data-filterable], .items .item-description[data-filterable]");

    // Filter checked inputs
    const el_checked = [...el_filters].filter(el => el.checked && el.value);

    // Collect checked inputs values to array
    const filters = [...el_checked].map(el => el.value);

    // Get elements to filter
    const el_filtered = [...el_filterable].filter(el => {
      const props = el.getAttribute('data-filterable').trim().split(/\s+/);
      return filters.every(fi => props.includes(fi))
    });

    // Hide all
    el_filterable.forEach(el => el.classList.add('is-hidden'));

    // Show filtered
    el_filtered.forEach(el => el.classList.remove('is-hidden'));
  }

  /* -------------------------------------------- */

  _onClickItemImg(event) {
    event.stopPropagation();

    const itemID = $(event.currentTarget).closest(`li.item`).data("itemId");
    const item = this.actor.items.get(itemID);

    item.rollCheck();
  }
  /* -------------------------------------------- */
}
