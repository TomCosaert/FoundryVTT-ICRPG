export class IcrpgUtility {
    static getRandomId(prefix) {
        return Math.random().toString(36).replace('0.', prefix || '');
    }
}
