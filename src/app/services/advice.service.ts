import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {

  constructor(private http: HttpClient) { }

  addAdvice(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.AdviceApi, model)
  }

  getAllAdvices(): Observable<any[]> {
    return this.http.get<any[]>(environment.AdviceApi);
  }

  getCompanyAdvice(companyID: any): Observable<any[]> {
    return this.getAllAdvices().pipe(
      map(advice => advice.filter(data => data.companyID == companyID))
    );
  }

  getAdvice(id: string): Observable<any>{
    return this.http.get<any>(`${environment.AdviceApi}/GetAdviceById?id=${id}`);
  }

  updateAdvice(id: string, updateAdviceRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.AdviceApi}/EditAdvice/${id}`, updateAdviceRequest);
  }

  deleteAdvice(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.AdviceApi}/DeleteAdvice?id=${id}`);
  }
}
