import { IcrpgCharacterSheet2E } from "./character-sheet-2e.js";

export class IcrpgVehicleSheet2E extends IcrpgCharacterSheet2E {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/icrpg/templates/actor/vehicle-sheet-2e.html",
            height: 630
        });
    }

    getData() {
        const data = super.getData();

        data.sizes = {
            none: "ICRPG.Size",
            fighter: "ICRPG.Fighter",
            small: "ICRPG.Small",
            medium: "ICRPG.Medium",
            large: "ICRPG.Large",
            massive: "ICRPG.Massive"
        };

        return data;
    }
}