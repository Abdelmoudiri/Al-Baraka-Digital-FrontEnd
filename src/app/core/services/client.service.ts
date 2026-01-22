import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientProfile, OperationRequest, OperationResponse, TransferRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private apiUrl = `${environment.apiUrl}/client`;

    constructor(private http: HttpClient) { }

    /**
     * Récupérer le profil du client connecté
     */
    getProfile(): Observable<ClientProfile> {
        return this.http.get<ClientProfile>(`${this.apiUrl}/profile`);
    }

    /**
     * Créer une demande de dépôt
     */
    createDeposit(amount: number): Observable<OperationResponse> {
        const request: OperationRequest = { amount };
        return this.http.post<OperationResponse>(`${this.apiUrl}/operations/deposit`, request);
    }

    /**
     * Créer une demande de retrait
     */
    createWithdrawal(amount: number): Observable<OperationResponse> {
        const request: OperationRequest = { amount };
        return this.http.post<OperationResponse>(`${this.apiUrl}/operations/withdrawal`, request);
    }

    /**
     * Créer une demande de virement
     */
    createTransfer(destinationAccountNumber: string, amount: number): Observable<OperationResponse> {
        const request: TransferRequest = { destinationAccountNumber, amount };
        return this.http.post<OperationResponse>(`${this.apiUrl}/operations/transfer`, request);
    }

    /**
     * Récupérer l'historique des opérations du client
     */
    getOperations(): Observable<OperationResponse[]> {
        return this.http.get<OperationResponse[]>(`${this.apiUrl}/operations`);
    }
}
