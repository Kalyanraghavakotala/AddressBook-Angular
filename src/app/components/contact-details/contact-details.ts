import { Component, inject, signal } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactList } from '../contact-list/contact-list';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css',
})
export class ContactDetails {

  deleteIcon: string = "https://github.com/Kalyanraghavakotala/Images/blob/main/delete2.png?raw=true";
  editIcon: string =  "https://github.com/Kalyanraghavakotala/Images/blob/main/edit1.jpg?raw=true";

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private home = inject(ContactList);
  private service = inject(ContactService);

  contact!: Contact;

  users = signal<Contact>(new Contact());

  selectedId = signal<number | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) return;
      this.users.set(this.service.getContactDetail(id));
      this.service.getContactById(id).subscribe(data => {
        this.contact = data;
        this.users.set(data);
      });
    });
  }

  constructor(){
    this.service.loadContacts();
  }

  edit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  delete() {
    this.service.deleteContact(Number(this.contact.id)).subscribe(() => {
      this.router.navigate(['/']);
      this.home.loadContacts();
    });
  }

  close() {
    this.router.navigate(['/']);
    this.home.loadContacts();
  }
}