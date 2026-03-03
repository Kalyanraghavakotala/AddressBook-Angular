import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLinkActive, RouterLinkWithHref } from "@angular/router";
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact-service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {

  private contactService = inject(ContactService);
  public router = inject(Router);

  users = signal<Contact[]>([]);
  searchTerm = signal('');
  sortDirection = signal<number>(1);
  sortby = signal<number>(0);
  currentPage = signal(1);
  itemsPerPage = signal(5);

  ngOnInit() {
    this.loadContacts();
    this.contactService.loadContacts();
  }

  loadContacts() {
    this.contactService.getContacts().subscribe(data => {
      this.users.set(data);

      if (data.length > 0) {
        //load first contact to home everytime
        this.navigateToHome();
      }
    });
  }

  renderlist() {
    this.contactService.getContacts().subscribe(data => {
      this.users.set(data);
      this.currentPage.set(1);
    });
  }

  navigateTo(id: number) {
    this.router.navigate(['home', 'contact', id]);
  }

  navigateToHome() {
    const firstUser = this.users().at(0);
    if (firstUser) {
      this.navigateTo(firstUser.id);
    }
  }

  processedUsers = computed(() => {
    let users = [...this.users()];

    const term = this.searchTerm().toLowerCase().trim();
    if (term.length > 2) {
      users = users.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.mobile.includes(term)
      );
    }

    const sortValue = this.sortby();

    if (sortValue === 1 || sortValue === 2) {
      users.sort((a, b) =>
        this.sortDirection() * a.name.localeCompare(b.name)
      );
    }

    else if (sortValue === 3 || sortValue === 4) {
      users.sort((a, b) =>
        this.sortDirection() * a.email.localeCompare(b.email)
      );
    }

    else if (sortValue === 5 || sortValue === 6) {
      users.sort((a, b) =>
        this.sortDirection() * a.mobile.localeCompare(b.mobile)
      );
    }

    return users;
  });

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.processedUsers().slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.processedUsers().length / this.itemsPerPage())
  );

  filterUsersByCategory(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  sort(event: any) {
    const value = +event.target.value;
    this.sortby.set(value);

    if (value === 1 || value === 3 || value === 5) {
      this.sortDirection.set(1);
    } else {
      this.sortDirection.set(-1);
    }

    this.currentPage.set(1);
  }
  setContactsPerPage(event:any){
    this.itemsPerPage.set(+event.target.value);
  }

  setcurrentPageVal(step: number) {
    this.currentPage.update(val => val + step);
    console.log( this.currentPage());
  }

  sortOptions = [
    { label: 'Name (A-Z)', value: 1 },
    { label: 'Name (Z-A)', value: 2 },
    { label: 'Email (A-Z)', value: 3 },
    { label: 'Email (Z-A)', value: 4 },
    { label: 'Mobile (Asc)', value: 5 },
    { label: 'Mobile (Desc)', value: 6 },
  ];

}