import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'src/services/character.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Character } from 'src/app/interfaces/character.interface';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem, CdkDrag} from '@angular/cdk/drag-drop';
import {MatGridListModule} from '@angular/material/grid-list';
import { AngularFireStorageReference } from '@angular/fire/storage';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { UserService } from 'src/services/user.service';


@Component({
  selector: 'app-basics',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  private charactersChapterCollection: AngularFirestoreCollection<Character>;
  charactersTask : Character[] = new Array<Character>();
  charactersLeft: Character[] = new Array<Character>();
  charactersRight: Character[] = new Array<Character>();

  chapterToLoad: string;
  taskToLoad: string;

  correctCharacters: string[] = [];
  foundCorrectAnswer: boolean = false;
  attempted: boolean = false;

  characterResult: Character = {
    chineseCharacter: "大",
    englishWord: "big",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/chinese-app-9c159.appspot.com/o/chinese%2Fcharacters%2Fbig.png?alt=media&token=be0c54e2-f139-4ac1-8bd0-f0bf72b080d2"
  };


  constructor(private characterService :CharacterService, private userService: UserService, private route:ActivatedRoute) { 

  }

  ngOnInit() {
    this.chapterToLoad = this.route.snapshot.paramMap.get('chapter');
    this.taskToLoad = this.route.snapshot.paramMap.get('task');
    this.getCharacterFromChapter(this.chapterToLoad, this.taskToLoad);
  }


  getCharacterFromChapter(chapterToLoad: string, taskToLoad: string) {
    this.characterService.getCharacterTaskFromChapter(chapterToLoad, taskToLoad).valueChanges().subscribe((task) => {

      var resultCharacterRef: AngularFireStorageReference = task['resultCharacter'];

      this.loadCharactersToDisplay(task['toShowCharacters']);
      this.loadCorrectCharactersNeeded(task['correctCharacters']);
      this.loadResultCharacter(task['resultCharacter']);
     
    });
  }

  loadCharactersToDisplay(refsToShow: AngularFireStorageReference[]) {
    refsToShow.forEach((characterRef => {
      this.characterService.getCharacterFromRef(characterRef['path']).then((character: Character) => {
        this.charactersTask.push(character);
      })
    }));
  }

  loadCorrectCharactersNeeded(characters: string[]) {
    this.correctCharacters = characters;
  }

  loadResultCharacter(ref: AngularFireStorageReference) {
    this.characterService.getCharacterFromRef(ref['path']).then((character: Character) => {
      this.characterResult = character;
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);


      if(this.sameAmountOfCharacters()) {
        if(this.charactersAreCorrect()) {
          console.log('correctè');
          this.foundCorrectAnswer = true;
          this.addAttemptToUser();
        } else {
          this.attempted = true;
        }
      }
    }
  }

  addAttemptToUser() {
    this.userService.addAttemptToUser();
  }

  sameAmountOfCharacters() {
    return (this.charactersLeft.length + this.charactersRight.length) === this.correctCharacters.length;
  }

  charactersAreCorrect() {
    console.log('correct ', this.correctCharacters);
    
    var candidateCharacters: string[] = [];

    this.charactersLeft.forEach((character) => {
      candidateCharacters.push(character.englishWord);
    });

    this.charactersRight.forEach((character) => {
      candidateCharacters.push(character.englishWord);
    });

    candidateCharacters.forEach((character) => {
      if(!candidateCharacters.includes(character)) {
        return false;
      }
    });

    return true;
  } 

}
