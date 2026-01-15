import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UserRole } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  userRole: UserRole | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role || null;
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isAgent(): boolean {
    return this.userRole === 'AGENT_BANCAIRE';
  }

  isClient(): boolean {
    return this.userRole === 'CLIENT';
  }
}
