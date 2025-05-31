import { Component } from '@angular/core';
import { PointsService } from '../../../../services/points.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  template: '<p>Points: {{ points }}</p>',
  templateUrl: './resultRu.component.html',
})
export class VerbalResultComponent {
  points: number;
  percent: number;
  level: string;
  text: string;

  constructor(private pointsServise: PointsService, private route: Router, @Inject(DOCUMENT) private _document) {
    this.points = this.pointsServise.getPoints();
    console.log(this.points);
    this.pointsServise.setPoints(0);
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
    } else {
      return('Высокий уровень')
    }
  }

  setText(points) {
    if(0 <= points && points <= 7) {
      return('Обратите внимание на процессы запоминания имен и названий предметов. Тренируйте скорость и время выполнения заданий. Дополнительно проходите тесты и специальные программы для развития памяти.');
    }else if (8 <= points && points <= 13) {
      return('У вас средний уровень развития вербальной памяти. У вас хорошая память на имена, но снижена скорость реакции. Память на имена и скорость обработки информации требуют дополнительной тренировки.');
    } else {
      return('Поздравляем! Вы на высоком уровне. У вас хорошая вербальная память и время реакции. Ваша вербальная память и скорость обработки информации на достаточном уровне.')
    }
  }

  backBtnRouter() {
    this.route.navigate(['main/start'])
  }


  finishBtn() {
    this.route.navigate([''])
  }
}
