/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class IcrpgItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
  }
  
  async roll(){ 
  
	// Roll the stat roll if it is defined (example - to hit an enemy)
	let statRoll = this.data.data.statRoll;
	if (statRoll) {
		let roll = new Roll(statRoll, this.actor.data.data);
		roll.evaluate({async: false}).toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor: "<img src=\""+ this.img + "\"width=\"36\" height=\"36\"/><br>" + this.data.data.description + "Stat Roll: "
		  });
	}
	
	// Roll the effort roll if it is defined (example - how much damage done to an enemy)
	let effortRoll = this.data.data.effortRoll;
	if (effortRoll) {
		let rollTwo = new Roll(effortRoll, this.actor.data.data);
		rollTwo.evaluate({async: false}).toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor: "<img src=\""+ this.img + "\"width=\"36\" height=\"36\"/><br>" + this.data.data.description + "Effort Roll: "
		  });
		}
  }

}