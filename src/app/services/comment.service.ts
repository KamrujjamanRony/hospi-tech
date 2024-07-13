import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  addComment(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.CommentApi, model)
  }

  getAllComments(): Observable<any[]> {
    return this.http.get<any[]>(environment.CommentApi);
  }

  getCompanyComment(companyID: any): Observable<any[]> {
    return this.getAllComments().pipe(
      map(Comments => Comments.filter(data => data.companyID == companyID))
    );
  }

  getComment(id: string): Observable<any>{
    return this.http.get<any>(`${environment.CommentApi}/GetCommentById?id=${id}`);
  }

  updateComment(id: string, updateCommentRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.CommentApi}/EditComment/${id}`, updateCommentRequest);
  }

  deleteComment(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.CommentApi}/DeleteComment?id=${id}`);
  }
}
