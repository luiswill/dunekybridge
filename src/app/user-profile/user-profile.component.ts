import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Character } from '../interfaces/character.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { forEach } from '@angular/router/src/utils/collection'

// Services
import { CharacterService } from '../../services/character.service';
import { UserService } from 'src/services/user.service';
import { User } from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  charactersLearned: Array<any> = [];
  user: User;

  constructor(private characterService: CharacterService, private userService: UserService, private afStorage: AngularFireStorage) { 
  }
  

  ngOnInit() {
    this.getUser();
    this.getCharactersTheUserLearned();
  }


  getUser() {
    this.userService.getUserFromFirebase().subscribe(user => {
      this.user = user;
      console.log('this user', user);
    });
  }

  getCharactersTheUserLearned() {
    this.userService.getCharactersLoggedUserLearned().then((val: any[]) => {
      console.log('val ', val);
      this.charactersLearned = val;
    });
  }

}
