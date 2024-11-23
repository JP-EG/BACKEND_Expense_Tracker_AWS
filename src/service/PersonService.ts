import PersonRepository from "../repository/PersonRepository";
import {Person} from "../person/Person";
import {PersonDtoBuilder} from "../dto/PersonDtoBuilder";


export default class PersonService {
    private readonly personRepository: PersonRepository;

    constructor(personRepository: PersonRepository = new PersonRepository()) {
        this.personRepository = personRepository;
    }

    public async getPersonByName(personName: string): Promise<Person | null> {
        const person = await this.personRepository.get(personName);

        return person ? PersonDtoBuilder.build(person) : null;
    }

    public async putPerson(personData: { personName: string; personAge: string }): Promise<void> {
        const person = new Person();
        person.personName = personData.personName;
        person.personAge = personData.personAge;

        await this.personRepository.put(person);
    }
}