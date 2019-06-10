import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from 'src/app/interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    
   }


   getUserFromFirebase() {
    return this.afAuth.user;
   }

   getUserId() {
     return new Promise((resolve, reject) => {
       this.getUserFromFirebase().subscribe((user) => {
         resolve(user.uid);
       })
     });
   }


   getUserAttemptForCharacter() {
     this.getUserId().then((uid: string) => {
       this.afs.collection('users').doc(uid).collection('learned', ref => ref.where('chapter', '==', 'basics'))
        .get().subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            
            console.log('learned ', doc.get('attempts'));
          })
       })
     });
   }


  getCharactersLoggedUserLearned() {
    var charactersLearned: Array<Character> = [];
  
    return new Promise((resolve, reject) => {

      this.afAuth.user.subscribe(user => {
        var uid = user.uid;
        
        var userSnapshot = this.afs.collection('users').doc(uid).collection('learned')
        .valueChanges().subscribe(allCharacters => {
          

          let userCharacters: any[] = [];

          allCharacters.forEach(characterUserLearned => {
            let ref = characterUserLearned['ref'];


            this.afs.doc(ref).valueChanges().subscribe((character: Character) => {

              let learnedCharacter = {
                attempts: characterUserLearned['attempts'],
                character: character

              }
              userCharacters.push(learnedCharacter);
            })
          })


          resolve(userCharacters);
        });

      });

    });
  }

  addAttemptToUser(characterToAdd: string) {
    this.getUserId().then((uid: string) => {
      this.afs.collection('users').doc(uid).collection('learned').doc(characterToAdd).valueChanges().subscribe((val) => {
        console.log('val : ', val);
      });
    });
  }
}
