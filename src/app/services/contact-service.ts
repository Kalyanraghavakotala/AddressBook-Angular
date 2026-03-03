
import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private http = inject(HttpClient);
  private apiUrl = 'https://699d35ef83e60a406a457d2a.mockapi.io/contacts';

  contacts = signal<Contact[]>([]);
  contact: any = signal('');

  constructor() {
    this.loadContacts();
    effect(()=>{
    })
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(list => list.map(c => ({ ...c, id: Number(c.id) })))
    );
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(c => ({ ...c, id: Number(c.id) }))
    );
  }

  getContactDetail(id: number): Contact {
    this.contact = this.contacts().find(c => c.id === id);
    return this.contact;
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<any>(this.apiUrl, contact);
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<any>(`${this.apiUrl}/${contact.id}`, contact).pipe(
      map(c => ({ ...c, id: Number(c.id) }))
    );
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  loadContacts() {
    this.getContacts().subscribe(data => {
      this.contacts.set(data);
    });
  }

  
}