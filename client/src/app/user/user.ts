export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;

    constructor (object?: any) {
        if (object) {

            for (var prop in object) {
                this[prop] = object[prop];
            }
        }

    }

    toString(): string {
        return 'org.competition.User : ' + (this.id ? this.id : '(unsaved)');
    }
}