import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ContactService } from '../../services/contact-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
   blogicon: string ="https://github.com/Kalyanraghavakotala/Images/blob/main/blog-icon.png?raw=true";

  private router = inject(Router);

  constructor(public service: ContactService) {}

  goHome() {
    const firstId = this.service.contacts()?.at(0)?.id;
    if (firstId) {
      this.router.navigate(['/home/contact', firstId]);
    }
  }
}