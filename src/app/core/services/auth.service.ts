import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UserRole = 'ADMIN' | 'AGENT_BANCAIRE' | 'CLIENT';

export interface User {
    id?: number;
    fullName: string;
    email: string;
    role: UserRole;
}

export interface LoginResponse {
    token: string;
    email: string;
    fullName: string;
    role: string; 
}

export interface RegisterRequest {
    username: string;
    fullName: string;
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        // Charger l'utilisateur depuis le localStorage au démarrage
        const storedUser = localStorage.getItem('current_user');
        if (storedUser && storedUser !== 'undefined') {
            try {
                this.currentUserSubject.next(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('current_user');
                localStorage.removeItem('auth_token');
            }
        }
    }

    login(credentials: { email: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    localStorage.setItem('auth_token', response.token);
                    // Normaliser le rôle (ROLE_ADMIN -> ADMIN)
                    const normalizedRole = this.normalizeRole(response.role);
                    // Construire l'objet user depuis la réponse
                    const user: User = {
                        email: response.email,
                        fullName: response.fullName,
                        role: normalizedRole
                    };
                    localStorage.setItem('current_user', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            })
        );
    }

    // Normaliser le rôle du backend (ROLE_ADMIN -> ADMIN, ROLE_AGENT -> AGENT_BANCAIRE)
    private normalizeRole(role: string): UserRole {
        let normalized = role.replace('ROLE_', '');
        // Le backend renvoie ROLE_AGENT mais le frontend utilise AGENT_BANCAIRE
        if (normalized === 'AGENT') {
            normalized = 'AGENT_BANCAIRE';
        }
        return normalized as UserRole;
    }

    register(data: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
    }

    logout(redirect: boolean = true): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
        if (redirect) {
            this.router.navigate(['/auth/login']);
        }
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        
        // Vérifier si le token n'est pas expiré
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isValid = payload.exp > Date.now() / 1000;
            if (!isValid) {
                // Token expiré - nettoyer le localStorage sans redirect
                this.logout(false);
                return false;
            }
            return true;
        } catch {
            return !!token;
        }
    }

    getUserRole(): string | null {
        const user = this.currentUserSubject.value;
        return user ? user.role : null;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    redirectBasedOnRole(): void {
        const role = this.getUserRole();
        switch (role) {
            case 'ADMIN':
                this.router.navigate(['/admin/dashboard']);
                break;
            case 'AGENT_BANCAIRE':
                this.router.navigate(['/agent/dashboard']);
                break;
            case 'CLIENT':
                this.router.navigate(['/client/dashboard']);
                break;
            default:
                this.router.navigate(['/auth/login']);
        }
    }
}
