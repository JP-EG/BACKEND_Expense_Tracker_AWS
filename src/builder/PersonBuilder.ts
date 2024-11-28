import {Person} from "../person/Person";
import {PersonDocument} from "../documents/PersonDocument";

export default class PersonBuilder {
    static fromDocument(source: PersonDocument): Person {
        const person = new Person();

        person.personName = source.personName;
        person.personAge = source.personAge;
        return person;
    }

    static toDocument(person: Person): { sk: string; personName: string; pk: string; personAge: string } {
        return {
            pk: `PERSON#${person.personName}`, // Add partition key
            sk: `#METADATA`, // Optional sort key, if your table uses one
            personName: person.personName,
            personAge: person.personAge,
        };
    }
}