import { Injectable } from '@angular/core';
import {AngularFirestore,
        //AngularFirestoreCollection,
        AngularFirestoreDocument
       } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { User } from '../../shared/user.model';
import { Project } from '../../shared/project.model';
import { Doc } from '../../shared/document.model';

// secret: structure de données utilisée pour représenter l'ensemble des projets
// et en particulier, association entre projetId et l'emplacement du fichier correspondant

@Injectable()
export class ProjectManagerService {

  constructor(private afs: AngularFirestore) { }

  // Supprime un projet avec toutes les données
  // Retourne false si project id n'existe pas.
  deleteProject(projectId: string): boolean {
    this.afs.collection('Annotateurs').ref.where('projectId', '==', projectId).get().then(querySnapshot => {
      const batch = this.afs.firestore.batch();
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      batch.commit();
    }).then(() => {
      console.log('annotateurs deleted');
    },
    function() {
      return false;
    });
    this.afs.collection('Projects').doc(projectId).delete();
    return true;
  }

  // Modifie le titre du projet.
  modifyTitle(projectId: string, title: string): boolean {
    this.afs.collection('Projects').doc(projectId).update({'title': title}).then(() => {
      console.log('title updated');
    },
    (() => {return false}));
    return true;
  }

  // Ajoute un administrateur du projet.
  // Retourne false si adminId est déjà administrateur.
  addAdmin(projectId: string, adminId: string): boolean {
    var projectRef = this.afs.collection('Projects').doc(projectId);
    projectRef.ref.get().then((doc) => {
      var admin = doc.get('admin');
      if (admin.indexOf(adminId) == -1){
        admin.push(adminId);
        projectRef.update({'admin': admin}).then(() => {
          console.log('admin[] updated');
          return true;
        })
      }
    }).catch(function(error) {
      console.log("Error getting project:", error);
    });
    return false;
  }

  // Supprime un administrateur du projet.
  // Retourne false si adminId n'est pas administrateur.
  delAdmin(projectId: string, adminId: string): boolean {
    var projectRef = this.afs.collection('Projects').doc(projectId);
    projectRef.ref.get().then((doc) => {
      var admin = doc.get('admin');
      if (admin.indexOf(adminId) == -1){
        return false;
      }
      for (var i = admin.length - 1; i >= 0; i--) {
        if (admin[i] === adminId) {
          admin.splice(i, 1);
        }
      }
      projectRef.update({'admin': admin}).then(() => {
        console.log('admin[] updated');
      },
      (() => {return false}));
    }).catch(function(error) {
      console.log("Error getting project:", error);
    });
    return true;
  }

  // Ajoute un annotateur à un projet
  // Retourne false si projectId ou userId n'existe pas.
  addAnnotator(projectId: string, userId: string): boolean {
    var projectRef = this.afs.collection('Projects').doc(projectId);
    projectRef.ref.get().then((doc) => {
      var annotators = doc.get('annotators');
      if (annotators.indexOf(userId) == -1){
        annotators.push(userId);
        projectRef.update({'annotators': annotators}).then(() => {
          console.log('annotators[] updated');
          return true;
        })
      }
    }).catch(function(error) {
      console.log("Error getting project:", error);
    });
    return false;
  }

  // Supprime un annotateur du projet.
  // Retourne false si userId n'est pas annotateur.
  delAnnotator(projectId: string, userId: string): boolean {
    var projectRef = this.afs.collection('Projects').doc(projectId);
    projectRef.ref.get().then((doc) => {
      var annotators = doc.get('annotators');
      if (annotators.indexOf(userId) == -1){
        return false;
      }
      for (var i = annotators.length - 1; i >= 0; i--) {
        if (annotators[i] === userId) {
          annotators.splice(i, 1);
        }
      }
      projectRef.update({'annotators': annotators}).then(() => {
        console.log('annotators[] updated');
      },
      (() => {return false}));
    }).catch(function(error) {
      console.log("Error getting project:", error);
    });
    return true;
  }
/*
  // Get project data.
  async getProject(projectId: string): Promise<Project> {if (false||2>=2)return null;
    console.log('getProject1')
    var projectRef = this.afs.collection('Projects').doc(projectId);
    var res: any;
    projectRef.ref.get()
      .then( (proj) => {res = proj.data();console.log('res',res);})
      .catch(function(error) {
        console.log("Error getting project:", error);
    });
    //projetCollection.valueChanges().subscribe((projs)=>{all = projs;});
    console.log('res2',res);
    return res;
  }
*/

  getProject(projectId: string): Promise<any> {
    return this.afs.collection("Projects/").doc(projectId).ref.get();
    /*
    this.afs.collection("Projects/").doc(projectId).ref.get().then((doc) => {console.log('data=',doc.data());
      return doc.data();
    });*/
  }

/*
  // Get project data.
  getProject(projectId: string): Project {
    console.log('getProject1', projectId)
    var projectRef = this.afs.collection('Projects').doc(projectId);
    var res: any;
  setTimeout(() => {
    projectRef.ref.get()
      .then( (proj) => {res = proj.data();console.log('res',res);})
      .catch(function(error) {
        console.log("Error getting project:", error);
    });
  }, 2000)
  //projetCollection.valueChanges().subscribe((projs)=>{all = projs;});
    console.log('res2',res);
    return res;
  }
*/

  // Produit une liste des ids de tous les projets.
  getAll(projectId: string): Observable<Project>[] {
    var projetCollection = this.afs.collection<Project>('Projects');
    var all;
    projetCollection.valueChanges().subscribe((projs)=>{all = projs;});
    return all;
  }

  // Produit une liste des ids de tous les annotateurs d'un projet.
  // Retourne false si projectId n'existe pas.
  getAnnotators(projetId: string): string[] | boolean {
    return false;
  }

  // Produit une liste des ids de tous les projets avec username comme annotateur.
  // Retourne false si username n'existe pas.
  getProjectsAnnotated(username: string): string[] | boolean {
    return false;
  }

  // Produit une liste des ids de tous les projets avec username comme administrateur.
  // Retourne false si username n'existe pas.
  getProjectsAdministrated(username: string): string[] | boolean {
    return false;
  }

  getAnnotator(){
    return this.afs
           .collection('Annotateur', ref => ref
            .where('titreProjet', '==', this.current().titreProjet))
            .valueChanges();
  }

/*
  // Produit une liste des noms de tous les documents d'un projet.
  // Retourne false si projectId n'existe pas.
  getCorpus(projetId: string): string[] | boolean {
    return false;
  }
*/
  getCorpus(){
    return this.afs
              .collection('Corpus', ref => ref
              .where('titreProjet', '==', this.current().titreProjet))
              .valueChanges();
  }

  getCategories(){
    return this.afs
           .collection('Categories', ref => ref
           .where('titreProjet', '==', this.current().titreProjet))
           .valueChanges();
  }

  //récupérer le titre du token du projet courant
  current(){
    return JSON.parse(localStorage.getItem('currentProjet'));
  }

  // Ajoute un nouveau document à un projet à partir d'un fichier texte.
  // Retourne false si projectId n'existe pas ou documentPath n'est pas correct.
  addDocument(projectId: string, documentPath: string): boolean {
    return false;
  }

  // Retourne le document avec documentName
  // Retourne false si documentName n'existe pas .
  getDocument(documentName: string): Document | boolean {
    return false;
  }

  // Supprime un document d'un projet
  // Retourne false si projectId ou documentName n'existe pas .
  delDocument(projectId: string, documentName: string): boolean {
    return false;
  }

  //recuperer le nom du courant utilisateur
  isAdmin(user: string){
    if(user == this.current().admin)
    return true;
    else
    return false;
  }

/*
  //recuperer le nom du courant utilisateur
  his(){
    return JSON.parse(this.currentProject).admin;
  }

  updateId(){
    this.content=JSON.parse(localStorage.getItem('PkId'));
    if (this.content){
      this.afs.doc(`${this.content.database}/${this.content.id}`).update(this.content);
    }
  }
*/
}
