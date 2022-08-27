/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IcrpgActor extends Actor {

  prepareBaseData() {
    const data = this.system;

    // Apply loot-based active effects first
    this.applyActiveEffects(true);
    if (["character", "vehicle"].includes(this.type)) {
      for (let [id, stat] of Object.entries(data.stats)) {
        stat.value = Number(stat.base) + Number(stat.loot);
      }

      for (let [id, eff] of Object.entries(data.effort)) {
        eff.value = Number(eff.base) + Number(eff.loot);
      }
    }
  }

  applyActiveEffects(loot = false) {
    this.effects.forEach(e => e.determineSuppression());

    const filteredEffects = this.effects.filter(e => {
      if (e.isSuppressed) return false;

      const lootChanges = e.changes.find(c => c.key.includes("loot"));
      if (loot) return !!!lootChanges;
      else return !!lootChanges;
    });

    filteredEffects.forEach(e => {e.isSuppressed = true});
    super.applyActiveEffects();
    filteredEffects.forEach(e => {e.isSuppressed = false});
  }

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareDerivedData() {
    const actorData = this;
    const data = actorData.system;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCommonData(actorData)
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    if (actorData.type === 'npc') this._prepareNpcData(actorData);
    if (actorData.type === 'vehicle') this._prepareVehicleData(actorData);
  }

  /**
   * Prepare data common to Characters and NPCs
   */
  _prepareCommonData(actorData) {
    const data = actorData.system;

    data.effort.basic.die = "d4";
    data.effort.weapon.die = "d6";
    if (!data.effort.gun)
      data.effort.gun = { value: 0, base: 0, loot: 0 };
    data.effort.gun.die = "d8";
    data.effort.magic.die = "d10";
    data.effort.ultimate.die = "d12";
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.system;
    const items = actorData.items.contents;

    //data.armor.value = Math.min(20, 10 + Number(data.armor.base) + Number(data.armor.loot));
    const armorItems = items.filter(i => "defenseBonus" in i.system);
    const defenseBonus = !armorItems.length
      ? 0
      : armorItems
        .map(i => i.system.defenseBonus * i.system.equipped * !!i.system.durability)
        .reduce((acc, n) => acc + n);

    data.armor.loot = defenseBonus + (data.armor.loot || 0);
    data.armor.value = data.stats.con.value + data.armor.loot + 10 + (data.armor.value || 0);
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareNpcData(actorData) {
    const data = actorData.system;

  }

    /**
   * Prepare Vehicle type specific data
   */
     _prepareVehicleData(actorData) {
      this._prepareCharacterData(actorData);


     }


  getRollData() {
    const data = super.getRollData();
    // Let us do @str etc, instead of @stats.str.value
    for (let [id, stat] of Object.entries(data.stats)) { // @stats.*.value
      if (!(id in data)) data[id] = stat.value;
    }
    for (let [id, eff] of Object.entries(data.effort)) { // @effort.*.value
      if (!(id in data)) data[id] = eff.value;
    }
    return data
  }

  async applyDamage(amount) {
    const newHP = Math.clamped(this.system.health.value - amount, 0, this.system.health.max);

    return this.update({"data.health.value": newHP});
  }
}
