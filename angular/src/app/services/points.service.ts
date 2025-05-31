import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private points: number = 0;

  getPoints(): number {
    return this.points;
  }

  setPoints(points: number): void {
    this.points = points;
  }
}