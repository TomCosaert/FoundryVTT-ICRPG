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
    const itemData = this;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.system;
  }

  async rollCheck() {
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });

    if (!game.settings.get("icrpg", "itemDurability") && this.system.durability <= 0) {
      ChatMessage.create({
        speaker,
        content: game.i18n.format("ICRPG.BrokenMessage", { character: this.actor.name })
      });
      ui.notifications.warn(game.i18n.format("ICRPG.NoDurability", { itemName: this.name }));
      return;
    }

    let targets = game.user.targets.ids.map(id => canvas.tokens.get(id));
    if (!targets.length) targets = [{
      actor: {
        data: {
          data: {
            defense: {
              value: game.settings.get("icrpg", "globalDC")
            }
          }
        }
      }
    }];

    const isSpell = this.type === "spell";
    let useFormula = this.system.useFormula || `1d20`;


    for (const target of targets) {
      const actorStunPoints = this.actor.system.stun.value;
      if (isSpell && !actorStunPoints) return ui.notifications.warn(game.i18n.localize("ICRPG.NoStun"));
      const title = this.name + (target.name ? ` - Target: ${target.name}` : ``);
      let content = `
        <div class="icrpg form-group">
        <label>${game.i18n.localize("ICRPG.Modifiers")}</label>
        <input type="text" data-type="String" placeholder="e.g. + 5 or + @str"/>
        </div>
      `;
      if (isSpell) {
        let options = ``;

        for (let i = 1; i < actorStunPoints + 1; i++) {
          options += `<option value="${i}">${i}</option>`;
        }
        content = `
          <div class="icrpg form-group">
            <label>${game.i18n.localize("ICRPG.Power")}</label>
            <select>${options}</select>
          </div>
        ` + content;
      }
      let power;
      const d20formula = await new Promise(resolve => {
        new Dialog({
          title,
          content,
          buttons: {
            easy: {
              label: game.i18n.localize("ICRPG.Easy"),
              callback: async html => {
                const mod = html.find(`input`).val();
                //const formula = `1d20 + 3` + `${mod}`;
                useFormula = useFormula += ` + 3 + ${mod}`;
                if (isSpell) {
                  power = parseInt(html.find(`select`).val());
                  const currentStun = this.actor.system.stun.value;
                  const newStun = Math.max(currentStun - power, 0);
                  await this.actor.update({ "data.stun.value": newStun });
                }
                resolve(useFormula);
              }
            },
            normal: {
              label: game.i18n.localize("ICRPG.Normal"),
              callback: async html => {
                const mod = html.find(`input`).val();
                //const formula = `1d20` + `${mod}`;
                useFormula += mod;
                if (isSpell) {
                  power = parseInt(html.find(`select`).val());
                  const currentStun = this.actor.system.stun.value;
                  const newStun = Math.max(currentStun - power, 0);
                  await this.actor.update({ "data.stun.value": newStun });
                }
                resolve(useFormula);
              }
            },
            hard: {
              label: game.i18n.localize("ICRPG.Hard"),
              callback: async html => {
                const mod = html.find(`input`).val();
                //const formula = `1d20 - 3` + `${mod}`;
                useFormula += ` - 3 + ${mod}`;
                if (isSpell) {
                  power = parseInt(html.find(`select`).val());
                  const currentStun = this.actor.system.stun.value;
                  const newStun = Math.max(currentStun - power, 0);
                  await this.actor.update({ "data.stun.value": newStun });
                }
                resolve(useFormula);
              }
            }
          },
          default: "normal"
        }, { width: 300 }).render(true);
      });
      if (!d20formula) continue;

      const d20Roll = await new Roll(d20formula, this.actor.getRollData()).roll();

      const isHit = game.settings.get("icrpg", "NPCdefense")
        ? d20Roll.total >= target.actor.system.defense.value
        : d20Roll.total >= game.settings.get("icrpg", "globalDC");

      const messageData = {
        speaker,
        flavor: (isSpell ? `[${game.i18n.localize("ICRPG.Power")}: ${power}] ` : ``) + title,
        flags: {
          icrpg: {
            itemID: this.id,
            pass: isHit
          }
        }
      };

      await d20Roll.toMessage(messageData);

      if (isHit) {
        const heartHP = game.settings.get("icrpg", "heartHP") && target.actor.type === "npc";
        const isCrit = d20Roll.dice[0].total === 20;

        let content = game.i18n.format("ICRPG.EffortHit", {
          actorName: this.actor.name,
          targetName: target.name ? ` ${target.name} ` : ` `,
          itemName: this.name
        });

        if (heartHP && isCrit) content = game.i18n.localize("ICRPG.CRITICAL") + content;
  
        await ChatMessage.create({
          speaker,
          content
        });
        
        if (heartHP) {
          await this.rollHPdamage(target, isCrit);
          continue;
        }
      } else {
        await ChatMessage.create({
          speaker,
          content: game.i18n.format("ICRPG.EffortMissed", {
            actorName: this.actor.name,
            targetName: target.name ? ` ${target.name} ` : ` `,
            itemName: this.name
          })
        });
        continue;
      }

      if (isSpell && !this.system.effortFormula) continue;

      await this.rollEffort(target);

      return d20Roll;
    }
  }

  async rollEffort(target = {}) {
    const title = this.name + (target.name ? ` - Target: ${target.name}` : ``);

    const effortFormula = await new Promise(resolve => {
      new Dialog({
        title,
        content: `
          <div class="icrpg form-group">
          <label>${game.i18n.localize("ICRPG.Modifiers")}</label>
          <input type="text" data-type="String" placeholder="e.g. + 5 or + @str"/>
          </div>
        `,
        buttons: {
          normal: {
            label: game.i18n.localize("ICRPG.Roll"),
            callback: html => {
              const mod = html.find(`input`).val() || "";
              const effortFormula = this.system.effortFormula + mod;
              resolve(effortFormula);
            }
          },
          ultimate: {
            label: game.i18n.localize("ICRPG.EffortUltimate"),
            callback: html => {
              const mod = html.find(`input`).val() || "";
              const effortFormula = this.system.effortFormula + `+1d12` + mod;
              resolve(effortFormula);
            }
          }
        },
        default: "roll"
      }, { width: 300 }).render(true);
    });

    if (!effortFormula) {
      ui.notifications.error(game.i18n.localize("ICRPG.ImproperEffortFormula"));
      return;
    }

    const effortRoll = await new Roll(effortFormula, this.actor.getRollData()).roll();
    await effortRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: title
    });

    if (target.name) await target.actor.applyDamage(effortRoll.total);
  }

  async rollHPdamage(target = {}, isCrit = false) {
    if (target.name) await target.actor.applyDamage(isCrit ? 2 : 1);
  }

}
