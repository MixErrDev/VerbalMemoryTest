import { Component, OnInit, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PointsService } from '../../../../services/points.service';

@Component({
  selector: 'app-verbal-result',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class VerbalResultComponent implements OnInit {
  points: number = 0;
  percent: number;
  level: string;
  text: string;

  constructor(
    private router: Router,
    private pointsService: PointsService,
    @Inject(DOCUMENT) private _document
  ) {}

  ngOnInit(): void {
    this.points = this.pointsService.getPoints();
    console.log(this.points);
    this.pointsService.setPoints(0);
    this.percent = this.calculatePerсent(this.points);
    this.level = this.setLevel(this.points);
    this.text = this.setText(this.points)
  }

  calculatePerсent(points) {
    return Math.round((points / 19) * 100);
  }

  setLevel(points) {
    if(0 <= points && points <= 7) {
      return('Низкий уровень');
    }else if (8 <= points && points <= 13) {
      return('Средний уровень');
    }else if (14 <= points && points <= 19) {
      return('Высокий уровень');
    }
    return 'Неизвестный уровень';
  }

  setText(points) {
    if(0 <= points && points <= 7) {
      return('Ваш результат указывает на низкий уровень вербальной памяти. Рекомендуется регулярно тренировать память с помощью специальных упражнений и техник.');
    }else if (8 <= points && points <= 13) {
      return('Ваш результат указывает на средний уровень вербальной памяти. Продолжайте тренировать память для достижения лучших результатов.');
    }else if (14 <= points && points <= 19) {
      return('Ваш результат указывает на высокий уровень вербальной памяти. Продолжайте поддерживать и развивать свои способности.');
    }
    return 'Не удалось определить уровень вербальной памяти.';
  }

  goToLogin() {
    this.router.navigate(['/verbal-memory/login']);
  }

  backBtnRouter() {
    this.router.navigate(['/verbal-memory']);
  }
}
