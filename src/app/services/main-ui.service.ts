import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MainUIService {

  constructor(private http: HttpClient) { }

  addMainUI(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.MainUIApi, model)
  }

  getAllMainUIs(): Observable<any[]> {
    return this.http.get<any[]>(environment.MainUIApi);
  }

  getCompanyMainUIs(companyID: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.MainUIApi}/GetCompanyId?filterOn=CompanyID&filterQuery=${companyID}`);
  }

  getMainUI(id: string): Observable<any>{
    return this.http.get<any>(`${environment.MainUIApi}/GetMainUIById?id=${id}`);
  }

  updateMainUI(id: string, updateMainUIRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.MainUIApi}/EditMainUI/${id}`, updateMainUIRequest);
  }

  deleteMainUI(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.MainUIApi}/DeleteMainUI?id=${id}`);
  }

  companyWiseTest( data: any | FormData ): Observable<any>{
    return this.http.post<any>(`${environment.MainUIApi}/GetCompanyIDwiseTotal`, data);
  }
}
