import { IcrpgUtility } from "../utility.js";

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
      width: 367,
      height: 480,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes"}],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    //for (let attr of Object.values(data.data.attributes)) {
    //  attr.isCheckbox = attr.dtype === "Boolean";
    //}
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

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /* -------------------------------------------- */

  setPosition(options={}) {
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
    if ( action === "create" ) {
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
      delete itemData.data["type"];

      // Finally, create the item!
      this.actor.createOwnedItem(itemData);
    }

    else if (action === "equip") {
      const li = $(header).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      await item.update({"data.equipped": !item.data.data.equipped});
    }

    else if ( action === "edit" ) {
      const li = $(header).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    }

    else if ( action === "delete" ) {
      let d = Dialog.confirm({
        title: game.i18n.localize("ICRPG.DeleteItem"),
        content: "<p>" + game.i18n.localize("ICRPG.AreYouSure") + "</p>",
        yes: () => {
          const li = $(header).parents(".item");
          this.actor.deleteOwnedItem(li.data("itemId"));
          li.slideUp(200, () => this.render(false));
        },
        no: () => { 
          return; 
        },
        defaultYes: false
       });
    }
  }

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
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }
  
  /* -------------------------------------------- */
}
