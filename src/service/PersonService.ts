import {Service} from "aws-cdk-lib/aws-servicediscovery";
import PersonRepository from "../repository/PersonRepository";
import {Person} from "../person/Person";


export default class PersonService {
    private readonly personRepository: PersonRepository;

    constructor(personRepository: PersonRepository = new PersonRepository()) {
        this.personRepository = personRepository;
    }

    public async getPersonByName(name: string): Promise<Person | null> {
        const person = await this.personRepository.get(name);

        return person ? person : null;
    }
}