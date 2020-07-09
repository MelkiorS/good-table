import {Injectable} from '@angular/core';
// import {HttpClient} from "@angular/common/http";
import * as faker from 'faker'
import {Observable, of} from "rxjs";
import {TableModel} from "../models/table-model";

export interface ResponseData {
  data: TableModel[],
  lvl1Options: string[],
  lvl2Options: string[],

}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  lvl1Options = ['company', 'color']
  lvl2Options = ['lang', 'country']

  constructor(/*private http: HttpClient*/) {
  }

  fetchData(lvl1: string, lvl2?: string): Observable<ResponseData> {
    let fakeData = this.createUsers(15).map(u => {
      return { // fields are optional, get back only  {lvl1, lvl2, revenue, leads}
        name: u.name,
        company: u.company,
        revenue: u.revenue,
        lang: u.lang,
        country: u.country,
        color: u.color,
        leads: u.leads,
      }
    })

    const resp: ResponseData =
      {
        data: fakeData, lvl1Options: this.lvl1Options,
        lvl2Options: this.lvl2Options
      }

    return of(resp)

  }

  private createUser = () => {
    return {
      name: faker.name.findName(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      company: faker.random.arrayElement(
        ['TestCompany', 'TestCompany2', 'TestCompany3'
           ,'TestCompany4','TestCompany5','TestCompany6']),
      color: faker.random.arrayElement(['Red', 'Grin', 'Yellow']),
      country: faker.random.arrayElement(['EN', 'RU', 'HE']),
      lang: faker.random.arrayElement(['english', 'russian', 'hebrew']),
      leads: faker.random.number(15),
      revenue: faker.random.number({min: 42, max: 999}),
    }
  }

  private createUsers = (numUsers) =>
    Array.from({length: numUsers}, this.createUser);


}
