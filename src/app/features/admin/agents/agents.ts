import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agents',
  standalone: true, // Make sure it is standalone if you want to import CommonModule directly
  imports: [CommonModule, RouterLink],
  templateUrl: './agents.html',
  styleUrl: './agents.css'
})
export class Agents { // Keeping class name as Agents to match imports
  agents = [
    { id: 1, firstName: 'Karim', lastName: 'Benzema', email: 'k.benzema@albaraka.com', status: 'Active' },
    { id: 2, firstName: 'Achraf', lastName: 'Hakimi', email: 'a.hakimi@albaraka.com', status: 'Active' },
    { id: 3, firstName: 'Yassine', lastName: 'Bounou', email: 'y.bounou@albaraka.com', status: 'Inactive' }
  ];
}
