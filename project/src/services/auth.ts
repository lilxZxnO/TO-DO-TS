import { User } from '../types';
import { StorageService } from './storage';

export class AuthService {
  storage = new StorageService();

  getUtilisateurConnecte() {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : { utilisateur: null, connecte: false };
  }

  inscription(nom: string, mdp: string) {
    const users = this.storage.getUsers();
    if (users.find(u => u.username === nom)) {
      return false;
    }

    const nouvelUtilisateur = {
      id: Math.random().toString(36).substring(7),
      username: nom,
      password: mdp
    };

    this.storage.sauvegarderUser(nouvelUtilisateur);
    return true;
  }

  connexion(nom: string, mdp: string) {
    const users = this.storage.getUsers();
    const user = users.find(u => u.username === nom && u.password === mdp);
    
    if (user) {
      localStorage.setItem('auth', JSON.stringify({
        utilisateur: user,
        connecte: true
      }));
      return true;
    }
    return false;
  }

  deconnexion() {
    localStorage.removeItem('auth');
  }
}