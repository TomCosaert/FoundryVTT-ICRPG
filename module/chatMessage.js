export class IcrpgChatMessage extends ChatMessage {
    async _preCreate(data, options, user) {
        if (this.isRoll) {
            const globalDC = game.settings.get("icrpg", "globalDC");
            const pass = this.roll.total >= globalDC;
            this.data.update({ "flags.icrpg": { pass } });
        }
        await super._preCreate(data, options, user)
    }

    async getHTML() {   
        const html = await super.getHTML();
        if (!this.isRoll) return html;
        
        if (this.data.flags.icrpg.pass) html.find("h4.dice-total").addClass("icrpg-pass");
        else html.find("h4.dice-total").addClass("icrpg-fail");

        return html;
    }
}