import { Injectable } from '@angular/core';
// import {HttpClient} from "@angular/common/http";
import * as faker from 'faker'
import {Observable, of} from "rxjs";
import {TableModel} from "../models/table-model";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(/*private http: HttpClient*/) {
  }

  fetchData(lvl1 : string,lvl2?: string): Observable<Array<any>> {
    let fakeUsers = this.createUsers(5).map(u=> {
      return {name: u.name,
        company: u.company,
        revenue: u.revenue,
        lang: u.lang,
        country: u.country,
        color: u.color,
        leads: u.leads}
    })
    return of(fakeUsers)

  }

  private createUser = () => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    company: faker.random.arrayElement(['TestCompany', 'TestCompany2', 'TestCompany3']),
    color:  faker.random.arrayElement(['Red', 'Grin', 'Yellow']),
    country:  faker.random.arrayElement(['EN', 'RU', 'HE']),
    lang:  faker.random.arrayElement(['english', 'russian', 'hebrew']),
    leads: faker.random.number(15),
    revenue: faker.random.number({min: 42, max: 999}),


  }
  }

  private createUsers = (numUsers) =>
     Array.from({length: numUsers}, this.createUser);






}
