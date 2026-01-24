import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { OperationResponse, OperationType, OperationStatus } from '../../../core/models';
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

  // Filtres
  filterType: string = '';
  filterStatus: string = '';

  constructor(private clientService: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadOperations();
  }

  loadOperations(): void {
    this.isLoading = true;
    this.error = null;
    this.clientService.getOperations().pipe(
      catchError(err => {
        console.error('Erreur chargement operations', err);
        this.error = 'Erreur lors du chargement des operations';
        return of([] as OperationResponse[]);
      })
    ).subscribe({
      next: (operations) => {
        this.operations = operations;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredOperations = this.operations.filter(op => {
      const matchType = !this.filterType || op.type === this.filterType;
      const matchStatus = !this.filterStatus || op.status === this.filterStatus;
      return matchType && matchStatus;
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

  getTypeClass(type: string): string {
    switch (type) {
      case 'DEPOSIT': return 'text-green-600';
      case 'WITHDRAWAL': return 'text-red-600';
      case 'TRANSFER': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  }

  formatAmount(type: string, amount: number): string {
    const prefix = type === 'DEPOSIT' ? '+' : '-';
    return `${prefix}${amount.toFixed(2)} MAD`;
  }

  getAmountClass(type: string): string {
    return type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600';
  }
}
