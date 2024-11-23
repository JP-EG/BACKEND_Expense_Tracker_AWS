import {Person} from "../person/Person";
import {PersonDto} from "./PersonDto";

export class PersonDtoBuilder {
    static build(source: Person): PersonDto {
        return {
            personName: source.personName,
            personAge: source.personAge,
        };
    };
};