import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    const names = this.currentUser.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return this.currentUser.fullName.charAt(0).toUpperCase();
  }

  getRoleLabel(): string {
    switch (this.currentUser?.role) {
      case 'ADMIN': return 'Espace Administration';
      case 'AGENT_BANCAIRE': return 'Espace Agent';
      case 'CLIENT': return 'Espace Client';
      default: return 'Al-Baraka Digital';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
