export class IcrpgChatMessage extends ChatMessage {
    async _preCreate(data, options, user) {

        if (!foundry.utils.hasProperty(this, "flags.icrpg.pass")) {
            if (this.rolls[0]?.terms[0].faces === 20) {
                const globalDC = game.settings.get("icrpg", "globalDC");
                const pass = this.rolls[0].total >= globalDC;
                this.updateSource({ "flags.icrpg": { pass } });
            }
        }

        await super._preCreate(data, options, user)
    }

    async getHTML() {
        const html = await super.getHTML();
        
        const icrpgFlags = this.flags.icrpg || {};
        const passInFlags = "pass" in icrpgFlags;
        if (!passInFlags) return html;

        if (this.flags.icrpg.pass) html.find("h4.dice-total").addClass("icrpg-pass");
        else html.find("h4.dice-total").addClass("icrpg-fail");

        return html;
    }
}