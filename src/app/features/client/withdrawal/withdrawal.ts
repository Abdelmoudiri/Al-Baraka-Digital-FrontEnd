import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { ClientProfile } from '../../../core/models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-withdrawal',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './withdrawal.html',
  styleUrl: './withdrawal.css',
})
export class WithdrawalComponent implements OnInit {
  amount: number | null = null;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  success: string | null = null;
  profile: ClientProfile | null = null;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;
    this.clientService.getProfile().pipe(
      catchError(err => {
        console.error('Erreur chargement profil', err);
        this.error = 'Erreur lors du chargement du profil';
        return of(null as ClientProfile | null);
      })
    ).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.amount || this.amount <= 0) {
      this.error = 'Le montant doit être supérieur à 0';
      return;
    }

    if (this.profile && this.amount > this.profile.balance) {
      this.error = 'Le montant dépasse votre solde disponible';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.success = null;

    this.clientService.createWithdrawal(this.amount).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.success = `Demande de retrait de ${this.amount} MAD créée avec succès. Statut: En attente`;
        this.amount = null;
        this.loadProfile();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.error?.message || 'Erreur lors de la création du retrait';
      }
    });
  }
}
