import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { AdminService } from '../../../core/services/admin.service';
import { User as AdminUser, OperationResponse } from '../../../core/models';
import { forkJoin, of, catchError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  currentUser: User | null = null;
  isLoading = true;
  error: string | null = null;

  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalOperations: 0,
    pendingOperations: 0
  };

  recentOperations: OperationResponse[] = [];

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
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
      users: this.adminService.getAllUsers().pipe(
        catchError(err => {
          console.error('Erreur chargement utilisateurs', err);
          return of([] as AdminUser[]);
        })
      ),
      operations: this.adminService.getAllOperations().pipe(
        catchError(err => {
          console.error('Erreur chargement operations', err);
          return of([] as OperationResponse[]);
        })
      )
    }).subscribe({
      next: (result) => {
        this.stats.totalUsers = result.users.length;
        this.stats.activeUsers = result.users.filter(u => u.active).length;
        this.stats.totalOperations = result.operations.length;
        this.stats.pendingOperations = result.operations.filter(op => op.status === 'PENDING').length;
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
}
