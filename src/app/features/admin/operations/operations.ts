import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { OperationResponse } from '../../../core/models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-operations',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './operations.html',
  styleUrl: './operations.css',
})
export class OperationsComponent implements OnInit {
  operations: OperationResponse[] = [];
  filteredOperations: OperationResponse[] = [];
  isLoading = true;
  error: string | null = null;

  // Stats
  totalAmount = 0;
  depositCount = 0;
  withdrawalCount = 0;
  transferCount = 0;

  // Filtres
  filterType: string = '';
  filterStatus: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadOperations();
  }

  loadOperations(): void {
    this.isLoading = true;
    this.error = null;
    this.adminService.getAllOperations().pipe(
      catchError(err => {
        console.error('Erreur chargement operations', err);
        this.error = 'Erreur lors du chargement des operations';
        return of([] as OperationResponse[]);
      })
    ).subscribe({
      next: (operations) => {
        this.operations = operations;
        this.calculateStats();
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats(): void {
    this.totalAmount = this.operations.reduce((sum, op) => sum + op.amount, 0);
    this.depositCount = this.operations.filter(op => op.type === 'DEPOT').length;
    this.withdrawalCount = this.operations.filter(op => op.type === 'RETRAIT').length;
    this.transferCount = this.operations.filter(op => op.type === 'VIREMENT').length;
  }

  applyFilters(): void {
    this.filteredOperations = this.operations.filter(op => {
      const matchType = !this.filterType || op.type === this.filterType;
      const matchStatus = !this.filterStatus || op.status === this.filterStatus;
      
      let matchDate = true;
      if (this.startDate) {
        matchDate = matchDate && new Date(op.createdAt) >= new Date(this.startDate);
      }
      if (this.endDate) {
        matchDate = matchDate && new Date(op.createdAt) <= new Date(this.endDate);
      }

      return matchType && matchStatus && matchDate;
    });
  }

  resetFilters(): void {
    this.filterType = '';
    this.filterStatus = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'DEPOT': return '💰';
      case 'RETRAIT': return '💸';
      case 'VIREMENT': return '↔️';
      default: return '📄';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOT': return 'Dépôt';
      case 'RETRAIT': return 'Retrait';
      case 'VIREMENT': return 'Virement';
      default: return type;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'APPROVED': return 'Approuvé';
      case 'PENDING': return 'En attente';
      case 'REJECTED': return 'Rejeté';
      default: return status;
    }
  }
}
