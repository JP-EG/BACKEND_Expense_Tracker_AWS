import {Person} from "../person/Person";
import {PersonDocument} from "../documents/PersonDocument";


export default class PersonBuilder {
    static fromDocument(source: PersonDocument): Person {
        const person = new Person();

        person.name = source.name;
        person.age = source.age;
        return person;
    }
}