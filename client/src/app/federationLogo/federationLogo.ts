

export class FederationLogo {
  id: number;

  

  constructor (object?: any) {
    if (object) {
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.FederationLogo : ' + (this.id ? this.id : '(unsaved)');
  }
}