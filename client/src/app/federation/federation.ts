import { FederationLogo } from '../federationLogo/federationLogo';
import { Country } from '../country/country';

export class Federation {
  id: number;

  name: string;
  logo: FederationLogo;
  description: string;
  country: Country;

  constructor (object?: any) {
    if (object) {
      
      if (object.hasOwnProperty('logo')) {
        this.logo = new FederationLogo(object['logo']);
        delete object['logo'];
      }
      
      if (object.hasOwnProperty('country')) {
        this.country = new Country(object['country']);
        delete object['country'];
      }
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.Federation : ' + (this.id ? this.id : '(unsaved)');
  }
}