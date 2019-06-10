import { Component, OnInit, ViewChild } from '@angular/core';
import { CharacterService } from 'src/services/character.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Chapter } from 'src/app/interfaces/chapter.interface';
import { map } from 'rxjs/operators';
import { resolve } from 'url';
import { MdbCardComponent } from 'angular-bootstrap-md';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  providers: [NgbRatingConfig]
})
export class ProgressComponent implements OnInit {
  private chaptersCollection: AngularFirestoreCollection<Chapter>;
  chapters: Chapter[] = [];
  

  constructor(private characterService: CharacterService, config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
   }

  ngOnInit() {
    this.loadChapters();
  }


  loadChapters() {
    this.characterService.getAllChapters().then((result: Chapter[]) => {
      this.chapters = result;
    });


  }
}
