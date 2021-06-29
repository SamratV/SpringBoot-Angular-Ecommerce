import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    private statesUrl = 'http://localhost:8080/api/states';
    private countriesUrl = 'http://localhost:8080/api/countries';

    constructor(private httpClient: HttpClient) { }

    getCountries(): Observable<Country[]> {
        return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
            map(response => response._embedded.countries)
        );
    }

    getStates(countryCode: string): Observable<State[]> {
        const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
        return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
            map(response => response._embedded.states)
        );
    }

    getCreditCardMonths(startMonth: number): Observable<number[]> {
        let data: number[] = [];

        for (let i = startMonth; i <= 12; ++i) {
            data.push(i);
        }

        return of(data);
    }

    getCreditCardYears(): Observable<number[]> {
        let data: number[] = [];

        const startYear = new Date().getFullYear();
        const endYear = startYear + 10;

        for (let i = startYear; i <= endYear; ++i) {
            data.push(i);
        }

        return of(data);
    }    

}

interface GetResponseCountries {
    _embedded: {
        countries: Country[];
    }
}

interface GetResponseStates {
    _embedded: {
        states: State[];
    }
}