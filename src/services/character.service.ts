import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from '../app/interfaces/character.interface';
import { Chapter } from 'src/app/interfaces/chapter.interface';
import { Task } from 'src/app/interfaces/task.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private userService: UserService) { 
  }

  convertObjectToCharacter(object: any) {

    var characterToReturn: Character = {
      chineseCharacter: object['chineseCharacter'],
      englishWord: object['englishWord'],
      imageUrl: object['imageUrl']
    }

    return characterToReturn;
  }

  getAllChapters() {
    return new Promise((resolve, reject) => {
      this.afs.collection('chapters').get().subscribe((querySnapshot) => {
        let chapters: Chapter[] = [];
        querySnapshot.forEach((doc) => {

          let chapter: Chapter = {
            description: doc.get('description'),
            name: doc.id,
            imageUrl: '',
            difficulty: doc.get('difficulty')
          }

          console.log('doc ', chapter);
          chapters.push(chapter);
        })

        return resolve(chapters);
      });
    });
  }

  getAllTasks(chapter) {
    return new Promise((resolve, reject) => {
      this.afs.collection('chapters').doc(chapter).collection('tasks').get().subscribe((querySnapshot) => {
        let tasks: Task[] = [];
        querySnapshot.forEach((doc) => {

          let task: Task = {
            name: doc.id,
            chineseCharacter: doc.get('chineseCharacter')
          }

          this.userService.getUserAttemptForCharacter();

          tasks.push(task);
        })

        return resolve(tasks);
      });
    });
  }

  getCharacterFromRef(ref: string) {

    return new Promise((resolve, reject) => {
      this.afs.doc(ref).valueChanges().subscribe((characterFromDatabase) => {
        var characterToReturn: Character = this.convertObjectToCharacter(characterFromDatabase);
        resolve(characterToReturn);
      });
    });
  }

  getCharacterTaskFromChapter(chapter: string, document: string) {
    return this.afs.collection('chapters').doc(chapter).collection('tasks').doc(document);
  }
}
