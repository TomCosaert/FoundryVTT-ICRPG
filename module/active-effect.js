/**
 * Extend the base ActiveEffect class to implement system-specific logic.
 * @extends {ActiveEffect}
 */
export class IcrpgActiveEffect extends ActiveEffect {
    /**
   * Is this active effect currently suppressed?
   * @type {boolean}
   */
    isSuppressed = false;

    get name() {
        return this.label;
    }

    get img() {
        return this.icon;
    }

    /* --------------------------------------------- */

    /** @inheritdoc */
    apply(actor, change) {
        if (this.isSuppressed) return null;
        return super.apply(actor, change);
    }

    /* --------------------------------------------- */

    /**
     * Determine whether this Active Effect is suppressed or not.
     */
    determineSuppression() {
        this.isSuppressed = false;
        if ((this.parent.documentName !== "Actor")) return;
        const [parentType, parentId, documentType, documentId] = this.origin?.split(".") ?? [];
        if ((parentType !== "Actor") || (parentId !== this.parent.id) || (documentType !== "Item")) return;
        const item = this.parent.items.get(documentId);
        if (!item) return;
        this.isSuppressed = !item.system.equipped; // suppress if item is not equipped; may have to add more flexibility to this
    }

    /* --------------------------------------------- */

    /**
     * Manage Active Effect instances through the Actor Sheet via effect control buttons.
     * @param {MouseEvent} event      The left-click event on the effect control
     * @param {Actor|Item} owner      The owning entity which manages this effect
     * @returns {Promise|null}        Promise that resolves when the changes are complete.
     */
    static onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        const li = a.closest("li");
        const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
        switch (a.dataset.action) {
            case "create":
                return owner.createEmbeddedDocuments("ActiveEffect", [{
                    label: game.i18n.localize("ICRPG.NewEffect"),
                    icon: "icons/svg/aura.svg",
                    origin: owner.uuid,
                    "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
                    disabled: li.dataset.effectType === "inactive"
                }]);
            case "edit":
                return effect.sheet.render(true);
            case "delete":
                return effect.delete();
            case "toggle":
                return effect.update({ disabled: !effect.disabled });
        }
    }

    /* --------------------------------------------- */

    /**
     * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
     * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
     * @returns {object}                  Data for rendering
     */
    static prepareActiveEffectCategories(effects) {
        // Define effect header categories
        const categories = {
            active: {
                type: "active",
                label: game.i18n.localize("ICRPG.EffectActive"),
                effects: []
            },
            inactive: {
                type: "inactive",
                label: game.i18n.localize("ICRPG.EffectInactive"),
                effects: []
            },
            unequipped: {
                type: "unequipped",
                label: game.i18n.localize("ICRPG.EffectUnequipped"),
                effects: []
            }
        };

        // Iterate over active effects, classifying them into categories
        for (let e of effects) {
            e._getSourceName(); // Trigger a lookup for the source name
            if (e.isSuppressed) categories.unequipped.effects.push(e);
            else if (e.disabled) categories.inactive.effects.push(e);
            else categories.active.effects.push(e);
        }

        categories.unequipped.hidden = !categories.unequipped.effects.length;
        return categories;
    }

}

export class IcrpgItemEffectsConfig extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: game.i18n.localize("ICRPG.Effects"),
            classes: ["icrpg"],
            template: "systems/icrpg/templates/item/item-effects-config.html",
            width: 400,
            height: 300, 
            resizable: true
        });
    }

    getData() {
        return {
            isItem: true,
            effects: IcrpgActiveEffect.prepareActiveEffectCategories(this.object.effects)
        }
    }

    render(force, options = {}) {
        this.object.apps[this.appId] = this;
        return super.render(force, options);
    }

    activateListeners(html) {
        html.find(`.effect-control`).click(ev => IcrpgActiveEffect.onManageActiveEffect(ev, this.object));
    }
}