import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact-service';
import { ContactList } from '../contact-list/contact-list';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ContactService);
  private home = inject(ContactList);

  formData: Contact = new Contact();

  contactData = signal<Contact>(new Contact());

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.service.getContactById(Number(id))
        .subscribe(data => {
          this.formData = data;
          this.contactData.set(data);
        });
    });
    this.service.loadContacts();

  }

  validate(contactForm: NgForm) {
    console.log(contactForm);
    if (contactForm.invalid) {
      return false;
    }
    return true;
  }

  saveContact(contactForm: NgForm) {

    if (!this.validate(contactForm)) {
      alert('Form is InValid! \nPlease Check the Form Before Submitting');
      return;
    }

    const currentContact = {
      ...this.contactData(),
      mobile: String(this.contactData().mobile)
    };

    const contacts = this.service.contacts();

    const isMobileDuplicate = contacts.some(c =>
      c.id !== currentContact.id &&
      (
        c.mobile === currentContact.mobile
      )
    );

    const isEmailDuplicate = contacts.some(c =>
      c.id !== currentContact.id &&
      (
        c.email.toLowerCase() === currentContact.email.toLowerCase()
      )
    );

    if (isMobileDuplicate) {
      alert('mobile already exists!');
      return;
    }

    if(isEmailDuplicate){
      alert('Email already exists!');
      return;
    }

    if (currentContact.id) {
      this.service.updateContact(currentContact)
        .subscribe(() =>
          this.navigate(currentContact.id)
        );
    } else {
      this.service.addContact(currentContact)
        .subscribe(newContact =>
          this.navigate(newContact.id)
        );
    }
  }
  cancel() {
    this.formData.id
      ? this.router.navigate(['home/contact', this.contactData().id])
      : this.home.navigateToHome();
  }
  navigate(id: number) {
    this.home.renderlist();
    this.router.navigate(['home/contact', id])
  }
}