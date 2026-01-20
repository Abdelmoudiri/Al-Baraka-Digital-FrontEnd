import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OperationResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private apiUrl = `${environment.apiUrl}/agent`;

    constructor(private http: HttpClient) { }

    /**
     * Récupérer les opérations en attente de validation
     */
    getPendingOperations(): Observable<OperationResponse[]> {
        return this.http.get<OperationResponse[]>(`${this.apiUrl}/operations/pending`);
    }

    /**
     * Approuver une opération
     */
    approveOperation(id: number): Observable<OperationResponse> {
        return this.http.put<OperationResponse>(`${this.apiUrl}/operations/${id}/approve`, {});
    }

    /**
     * Rejeter une opération
     */
    rejectOperation(id: number): Observable<OperationResponse> {
        return this.http.put<OperationResponse>(`${this.apiUrl}/operations/${id}/reject`, {});
    }

    /**
     * Récupérer toutes les opérations
     */
    getAllOperations(): Observable<OperationResponse[]> {
        return this.http.get<OperationResponse[]>(`${this.apiUrl}/operations`);
    }
}
