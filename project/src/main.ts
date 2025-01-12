import './style.css';
import { AuthService } from './services/auth';
import { StorageService } from './services/storage';
import { Task } from './types';

class TodoApp {
  private app: HTMLElement;
  private auth: AuthService;
  private storage: StorageService;

  constructor() {
    this.app = document.querySelector<HTMLDivElement>('#app')!;
    this.auth = new AuthService();
    this.storage = new StorageService();
    this.init();
  }

  private init(): void {
    this.verifierAuth();
    this.afficher();
  }

  private verifierAuth(): void {
    const { connecte } = this.auth.getUtilisateurConnecte();
    this.vue = connecte ? 'taches' : 'auth';
  }

  private afficher(): void {
    this.app.innerHTML = '';
    
    if (this.vue === 'auth') {
      this.afficherAuth();
    } else {
      this.afficherTaches();
    }
  }

  private afficherAuth(): void {
    this.app.innerHTML = `
      <div class="auth-container">
        <h2>Connexion</h2>
        <form id="formConnexion">
          <div class="form-group">
            <label for="nom">Nom d'utilisateur</label>
            <input type="text" id="nom" required>
          </div>
          <div class="form-group">
            <label for="mdp">Mot de passe</label>
            <input type="password" id="mdp" required>
          </div>
          <button type="submit">Se connecter</button>
        </form>
        <p>Pas encore de compte ? <a href="#" id="afficherInscription">S'inscrire</a></p>
      </div>
    `;

    this.ecouteursAuth();
  }

  private afficherTaches(): void {
    const { utilisateur } = this.auth.getUtilisateurConnecte();
    const taches = this.storage.getTasks().filter(t => t.userId === utilisateur?.id);

    this.app.innerHTML = `
      <div class="container">
        <div class="header">
          <h1>Mes Tâches</h1>
          <button id="deconnexion">Déconnexion</button>
        </div>
        
        <form id="formTache">
          <div class="form-group">
            <label for="titre">Titre</label>
            <input type="text" id="titre" required placeholder="Ajouter un titre">
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" required placeholder="Décrivez votre tâche"></textarea>
          </div>
          <div class="form-group">
            <label for="deadline">Date limite</label>
            <input type="date" id="deadline" required>
          </div>
          <button type="submit">+ Ajouter une tâche</button>
        </form>

        <div class="task-list">
          ${taches.map(tache => `
            <div class="task-item ${tache.status === 'completed' ? 'completed' : ''}" data-id="${tache.id}">
              <h3>${tache.title}</h3>
              <p>${tache.description}</p>
              <p>Pour le: ${new Date(tache.deadline).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              ${tache.status === 'pending' ? `
                <div class="task-actions">
                  <button class="btn-terminer" data-id="${tache.id}">✓ Terminer</button>
                  <button class="btn-supprimer" data-id="${tache.id}">× Supprimer</button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.ecouteursTaches();
  }

  private ecouteursAuth(): void {
    const formConnexion = document.getElementById('formConnexion');
    const afficherInscription = document.getElementById('afficherInscription');

    formConnexion?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nom = (document.getElementById('nom') as HTMLInputElement).value;
      const mdp = (document.getElementById('mdp') as HTMLInputElement).value;

      if (this.auth.connexion(nom, mdp)) {
        this.vue = 'taches';
        this.afficher();
      } else {
        alert('Identifiants incorrects');
      }
    });

    afficherInscription?.addEventListener('click', (e) => {
      e.preventDefault();
      this.afficherFormInscription();
    });
  }

  private ecouteursTaches(): void {
    const formTache = document.getElementById('formTache');
    const btnDeconnexion = document.getElementById('deconnexion');

    formTache?.addEventListener('submit', (e) => {
      e.preventDefault();
      const { utilisateur } = this.auth.getUtilisateurConnecte();
      
      const titre = (document.getElementById('titre') as HTMLInputElement).value;
      const description = (document.getElementById('description') as HTMLTextAreaElement).value;
      const deadline = (document.getElementById('deadline') as HTMLInputElement).value;

      const nouvelleTache: Task = {
        id: Math.random().toString(36).substring(7),
        userId: utilisateur!.id,
        title: titre,
        description: description,
        status: 'pending',
        deadline: deadline,
        createdAt: new Date().toISOString()
      };

      this.storage.sauvegarderTache(nouvelleTache);
      this.afficher();
    });

    btnDeconnexion?.addEventListener('click', () => {
      this.auth.deconnexion();
      this.vue = 'auth';
      this.afficher();
    });

    document.querySelectorAll('.btn-terminer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).dataset.id;
        if (id) {
          this.storage.mettreAJourTache(id, { status: 'completed' });
          this.afficher();
        }
      });
    });

    document.querySelectorAll('.btn-supprimer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).dataset.id;
        if (id) {
          this.storage.supprimerTache(id);
          this.afficher();
        }
      });
    });
  }

  private afficherFormInscription(): void {
    this.app.innerHTML = `
      <div class="auth-container">
        <h2>Inscription</h2>
        <form id="formInscription">
          <div class="form-group">
            <label for="nouveauNom">Nom d'utilisateur</label>
            <input type="text" id="nouveauNom" required>
          </div>
          <div class="form-group">
            <label for="nouveauMdp">Mot de passe</label>
            <input type="password" id="nouveauMdp" required>
          </div>
          <button type="submit">S'inscrire</button>
        </form>
        <p>Déjà un compte ? <a href="#" id="afficherConnexion">Se connecter</a></p>
      </div>
    `;

    const formInscription = document.getElementById('formInscription');
    const afficherConnexion = document.getElementById('afficherConnexion');

    formInscription?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nom = (document.getElementById('nouveauNom') as HTMLInputElement).value;
      const mdp = (document.getElementById('nouveauMdp') as HTMLInputElement).value;

      if (this.auth.inscription(nom, mdp)) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.afficherAuth();
      } else {
        alert('Ce nom d\'utilisateur est déjà pris');
      }
    });

    afficherConnexion?.addEventListener('click', (e) => {
      e.preventDefault();
      this.afficherAuth();
    });
  }
}

new TodoApp();