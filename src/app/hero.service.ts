import { Injectable } from '@angular/core';

import { Observable, from, of } from 'rxjs';

import { Hero } from './heroes/hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({'Content-Type' : 'application/json'})
  };

  constructor(private messageService: MessageService,
     private http: HttpClient) { }


  private log(message: string) {
  this.messageService.add(`HeroService: ${message}`);

}

getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl).pipe(
    tap(_ => this.log('fetched heroes')),
    catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  updateHero(hero: Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id = ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

// Ottieni eroe per ID

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id= ${id}`))
    );
  }




  private handleError<T>(operation = 'operation', result?: T) {
  return (error:any): Observable<T> => {
  console.error(error);
  this.log(`${operation} failed : ${error.message}`);

  return of(result as T);
  };
  }
}
