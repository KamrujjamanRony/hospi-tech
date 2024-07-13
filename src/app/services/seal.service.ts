import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SealService {

  constructor(private http: HttpClient) { }

  addSeal(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.SealApi, model)
  }

  getAllSeals(): Observable<any[]> {
    return this.http.get<any[]>(environment.SealApi);
  }

  getCompanySeals(companyID: any): Observable<any[]> {
    return this.getAllSeals().pipe(
      map(Seals => Seals.filter(data => data.companyID == companyID))
    );
  }

  getSeal(id: string): Observable<any>{
    return this.http.get<any>(`${environment.SealApi}/GetSetSealById?id=${id}`);
  }

  updateSeal(id: string, updateSealRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.SealApi}/EditSetSeal/${id}`, updateSealRequest);
  }

  deleteSeal(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.SealApi}/DeleteSetSeal?id=${id}`);
  }
}
