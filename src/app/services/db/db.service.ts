import { Injectable } from '@angular/core';
import { UserData } from '../../interfaces/UserData';
import {InMemmoryUser} from "../../interfaces/InMemmoryUser";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  addUser(username: string, struct: UserData): void {
    const userHandleToUsername = JSON.parse(localStorage.getItem('userHandleToUsername') || '{}');

    if (struct.id) {
      userHandleToUsername[struct.id] = username;
      localStorage.setItem(username, JSON.stringify(struct));
      localStorage.setItem('userHandleToUsername', JSON.stringify(userHandleToUsername));
    }
  }

  getUser(username: string): UserData {
    const user = localStorage.getItem(username);

    if (!user) {
      throw new Error(`Username ${username} does not exist!`);
    }

    return JSON.parse(user);
  }

  getUserByUserHandle(userHandle: string): UserData | {} {
    try {
      const userHandleToUsername = JSON.parse(localStorage.getItem('userHandleToUsername') || '{}');
      const username = userHandleToUsername[userHandle];
      const user = localStorage.getItem(username);

      if (!user) {
        throw new Error(`Username ${username} does not exist!`);
      }

      return JSON.parse(user);
    } catch (e) {
      return {}
    }
  }

  isUserExist(username: string): boolean {
    return Boolean(localStorage.getItem(username));
  }

  updateUser(username: string, struct: InMemmoryUser): void {
    const user = localStorage.getItem(username);

    if (!user) {
      throw new Error(`Username ${username} does not exist!`);
    }

    localStorage.setItem(username, JSON.stringify(struct));
  }

  deleteUser(username: string): void {
    localStorage.removeItem(username);
  }
}
