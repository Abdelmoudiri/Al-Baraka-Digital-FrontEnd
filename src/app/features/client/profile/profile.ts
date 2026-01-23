import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { ClientProfile } from '../../../core/models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ClientProfileComponent implements OnInit {
  profile: ClientProfile | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private clientService: ClientService, private cdr: ChangeDetectorRef) { }

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
}
