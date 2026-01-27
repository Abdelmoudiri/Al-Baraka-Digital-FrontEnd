import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiStatistics, AiValidationResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AiValidationService {
    private apiUrl = `${environment.apiUrl}/ai`;

    constructor(private http: HttpClient) { }

    /**
     * Récupérer le résultat de validation IA pour une opération
     */
    getValidationResult(operationId: number): Observable<AiValidationResponse> {
        return this.http.get<AiValidationResponse>(`${this.apiUrl}/validation/${operationId}`);
    }

    /**
     * Récupérer les statistiques IA (ADMIN seulement)
     */
    getStatistics(): Observable<AiStatistics> {
        return this.http.get<AiStatistics>(`${this.apiUrl}/statistics`);
    }
}
