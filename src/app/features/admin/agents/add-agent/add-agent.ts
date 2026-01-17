import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-agent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-agent.html',
  styleUrl: './add-agent.css'
})
export class AddAgent {
  fb = inject(FormBuilder);
  router = inject(Router);

  agentForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['123456', Validators.required] // Default temporary password
  });

  onSubmit() {
    if (this.agentForm.valid) {
      // Ici on appellerait le service pour sauvegarder l'agent
      alert('Agent créé avec succès !');
      this.router.navigate(['/admin/agents']);
    }
  }
}
