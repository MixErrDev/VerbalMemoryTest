import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
    document.body.classList.toggle('light-theme', prefersLight.matches);
  }
}
