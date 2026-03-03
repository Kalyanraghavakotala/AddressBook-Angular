import { Routes } from '@angular/router';
import { ContactList } from './components/contact-list/contact-list';
import { ContactForm } from './components/contact-form/contact-form';
import { ContactDetails } from './components/contact-details/contact-details';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Home,
    children: [
      {
        path: 'home', component: ContactList,
        children: [
          { path: 'add', component: ContactForm },
          { path: 'contact/:id', component: ContactDetails },
          { path: 'contact/:id/edit', component: ContactForm },
        ]
      },
    ]
  },
  { path: '**', component: PageNotFound },
];