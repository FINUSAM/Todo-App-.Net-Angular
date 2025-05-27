import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Todo } from '../models/todo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiUrl = environment.apiUrl;
  private todosUrl = `${this.apiUrl}/todos`;

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl).pipe(
      catchError(this.handleError)
    );
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.todosUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todosUrl, todo).pipe(
      catchError(this.handleError)
    );
  }

  updateTodo(id: number, todo: Todo): Observable<void> {
    return this.http.put<void>(`${this.todosUrl}/${id}`, todo).pipe(
      catchError(this.handleError)
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.todosUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Upload a photo
  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload/photo`, formData);
  }

  // ✅ Get all photo URLs
  getAllPhotos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/upload/photos`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.status === 0) {
      // Backend is not reachable
      errorMessage = 'Unable to connect to the server. Please try again later.';
    } else {
      // Backend returned an error response (like 404, 500)
      errorMessage = `Backend error: ${error.status} - ${error.message}`;
    }

    console.error('Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
