import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
// Remove BaseTestComponent import as it's an abstract class
// import { BaseTestComponent } from './components/base-test.component';

// Directives
// TODO: Add shared directives

// Pipes
// TODO: Add shared pipes

@NgModule({
  declarations: [
    // Remove BaseTestComponent from declarations as it's an abstract class
    // TODO: Add shared components, directives, and pipes
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // Remove BaseTestComponent from exports as it's an abstract class
    // TODO: Export shared components, directives, and pipes
  ]
})
export class SharedModule { }