import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user-results.component.html',
  styleUrls: ['./user-results.component.css']
})
export class UserResultsComponent implements OnInit {
  userData: any;
  userResults: any[] = [];
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUserData();
    this.loadUserResults();
  }

  loadUserData() {
    this.http.get(`${this.API_URL}/user-data`).subscribe(data => {
      this.userData = data;
    });
  }

  loadUserResults() {
    this.http.get(`${this.API_URL}/user-results`).subscribe(results => {
      this.userResults = results as any[];
    });
  }
} 