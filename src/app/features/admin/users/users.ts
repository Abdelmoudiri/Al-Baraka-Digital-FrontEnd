import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  error: string | null = null;
  processingId: number | null = null;

  // Filtres
  filterRole: string = '';
  filterStatus: string = '';
  searchQuery: string = '';

  // Modal
  showConfirmModal = false;
  confirmAction: 'activate' | 'deactivate' | null = null;
  selectedUser: User | null = null;

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.adminService.getAllUsers().pipe(
      catchError(err => {
        console.error('Erreur chargement utilisateurs', err);
        this.error = 'Erreur lors du chargement des utilisateurs';
        return of([] as User[]);
      })
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchRole = !this.filterRole || user.role === this.filterRole;
      const matchStatus = this.filterStatus === '' || 
        (this.filterStatus === 'active' && user.active) ||
        (this.filterStatus === 'inactive' && !user.active);
      const matchSearch = !this.searchQuery || 
        user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchRole && matchStatus && matchSearch;
    });
  }

  openConfirmModal(user: User, action: 'activate' | 'deactivate'): void {
    this.selectedUser = user;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedUser = null;
    this.confirmAction = null;
  }

  confirmOperation(): void {
    if (!this.selectedUser || !this.confirmAction) return;

    this.processingId = this.selectedUser.id;
    const observable = this.confirmAction === 'activate'
      ? this.adminService.activateUser(this.selectedUser.id)
      : this.adminService.deactivateUser(this.selectedUser.id);

    observable.subscribe({
      next: () => {
        this.processingId = null;
        this.closeConfirmModal();
        this.loadUsers();
      },
      error: (err) => {
        this.processingId = null;
        this.error = err.error?.message || 'Erreur lors de l\'operation';
        this.closeConfirmModal();
      }
    });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'AGENT_BANCAIRE': return 'bg-blue-100 text-blue-800';
      case 'CLIENT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'AGENT_BANCAIRE': return 'Agent Bancaire';
      case 'CLIENT': return 'Client';
      default: return role;
    }
  }
}
