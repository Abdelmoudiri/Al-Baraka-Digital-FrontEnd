import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OperationResponse, User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    /**
     * Récupérer tous les utilisateurs
     */
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    /**
     * Activer un utilisateur
     */
    activateUser(id: number): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${id}/activate`, {});
    }

    /**
     * Désactiver un utilisateur
     */
    deactivateUser(id: number): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${id}/deactivate`, {});
    }

    /**
     * Récupérer toutes les opérations
     */
    getAllOperations(): Observable<OperationResponse[]> {
        return this.http.get<OperationResponse[]>(`${this.apiUrl}/operations`);
    }
}
