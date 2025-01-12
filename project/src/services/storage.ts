import { User, Task } from '../types';

// Service simplifié pour le stockage
export class StorageService {
  getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  sauvegarderUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  sauvegarderTache(tache: Task) {
    const taches = this.getTasks();
    taches.push(tache);
    localStorage.setItem('tasks', JSON.stringify(taches));
  }

  mettreAJourTache(id: string, updates: Partial<Task>) {
    const taches = this.getTasks();
    const index = taches.findIndex(t => t.id === id);
    if (index !== -1) {
      taches[index] = { ...taches[index], ...updates };
      localStorage.setItem('tasks', JSON.stringify(taches));
    }
  }

  supprimerTache(id: string) {
    const taches = this.getTasks();
    const tachesFiltrees = taches.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tachesFiltrees));
  }
}