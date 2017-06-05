

import {Federation} from "../federation/federation";
export class User {
  id: number;

  lastLoginDate: any;
  password: string;
  email: string;
  accountLocked: boolean;
  name: string;
  accountExpired: boolean;
  passwordExpired: boolean;
  enabled: boolean;
  firstName: string;
  lastName: string;
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