import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MarginService {

  constructor(private http: HttpClient) { }

  addMargin(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.MarginApi, model)
  }

  getAllMargin(): Observable<any[]> {
    return this.http.get<any[]>(environment.MarginApi);
  }

  getCompanyMargin(companyID: any): Observable<any | undefined> {
    return this.getAllMargin().pipe(
      map(Margins => Margins.find(data => data.companyID == companyID))
    );
  }

  getMargin(id: string): Observable<any>{
    return this.http.get<any>(`${environment.MarginApi}/GetMarginById?id=${id}`);
  }

  updateMargin(id: string, updateMarginRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.MarginApi}/EditMargin/${id}`, updateMarginRequest);
  }

  deleteMargin(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.MarginApi}/DeleteMargin?id=${id}`);
  }
}
