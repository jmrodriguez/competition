import {Federation} from "../federation/federation";

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    accountLocked: boolean;
    accountExpired: boolean;
    passwordExpired: boolean;
    enabled: boolean;
    federation: Federation;

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