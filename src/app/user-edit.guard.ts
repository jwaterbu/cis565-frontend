import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserEditComponent } from './user-edit/user-edit.component';

@Injectable({
  providedIn: 'root'
})
export class UserEditGuard implements CanDeactivate<UserEditComponent> {
  canDeactivate(
    component: UserEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.userForm.dirty) {
      const username = component.userForm.get('username').value;
      return confirm(`If you navigate away you will lose all changes to ${username}?`);
    }
    return true;
  }
}
