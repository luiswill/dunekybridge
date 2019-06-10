import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from 'src/services/character.service';
import { Task } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

  tasks: Task[] = [];
  chapter: string;

  constructor(private characterService :CharacterService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.chapter = this.route.snapshot.paramMap.get('chapter');
    this.loadChapter(this.chapter);
    this.loadUserAttempts();
  }


  loadChapter(chapterToLoad: string) {
    this.characterService.getAllTasks(chapterToLoad).then((result: Task[]) => {
      this.tasks = result;
    });
  }

  loadUserAttempts() {
    //
  }

}
