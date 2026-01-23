import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { ClientService } from '../../../core/services/client.service';
import { ClientProfile, OperationResponse } from '../../../core/models';
import { forkJoin, of, catchError } from 'rxjs';

@Component({
  selector: 'app-client-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class ClientDashboard implements OnInit {
  currentUser: User | null = null;
  profile: ClientProfile | null = null;
  recentOperations: OperationResponse[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    forkJoin({
      profile: this.clientService.getProfile().pipe(
        catchError(err => {
          console.error('Erreur chargement profil', err);
          return of(null as ClientProfile | null);
        })
      ),
      operations: this.clientService.getOperations().pipe(
        catchError(err => {
          console.error('Erreur chargement operations', err);
          return of([] as OperationResponse[]);
        })
      )
    }).subscribe({
      next: (result) => {
        this.profile = result.profile;
        this.recentOperations = result.operations.slice(0, 5);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des donnees';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvé';
      case 'REJECTED': return 'Rejeté';
      case 'COMPLETED': return 'Terminé';
      default: return status;
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOSIT': return 'Dépôt';
      case 'WITHDRAWAL': return 'Retrait';
      case 'TRANSFER': return 'Virement';
      default: return type;
    }
  }

  getAmountClass(type: string): string {
    return type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600';
  }

  formatAmount(type: string, amount: number): string {
    const prefix = type === 'DEPOSIT' ? '+' : '-';
    return `${prefix}${amount.toFixed(2)} MAD`;
  }
}
