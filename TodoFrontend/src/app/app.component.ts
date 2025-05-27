import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  errorMessage = '';  // ✅ Added for error handling

  // ✅ For photo upload
  selectedFile: File | null = null;
  photoUrls: string[] = [];

  @ViewChild('todoInput') todoInput!: ElementRef<HTMLInputElement>;

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.loadTodos();
    this.loadAllPhotos();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.todoInput.nativeElement.focus();
    });
  }


  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: todos => {
        this.todos = todos;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = err.message || 'An error occurred while loading todos.';
      }
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;
    const newTodo: Todo = { title: this.newTodoTitle, isCompleted: false };

    this.todoService.createTodo(newTodo).subscribe({
      next: todo => {
        this.todos.push(todo);
        this.newTodoTitle = '';
        this.errorMessage = '';
        this.todoInput.nativeElement.focus();
      },
      error: err => {
        this.errorMessage = err.message || 'An error occurred while adding the todo.';
      }
    });
  }

  updatingTodoIds = new Set<number>();

  toggleComplete(todo: Todo) {
    if (this.updatingTodoIds.has(todo.id!)) return;

    this.updatingTodoIds.add(todo.id!);
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };

    this.todoService.updateTodo(todo.id!, updatedTodo).subscribe({
      next: () => {
        todo.isCompleted = !todo.isCompleted;
        this.updatingTodoIds.delete(todo.id!);
        this.errorMessage = '';
      },
      error: err => {
        this.updatingTodoIds.delete(todo.id!);
        this.errorMessage = err.message || 'An error occurred while updating the todo.';
      }
    });
  }

  deleteTodo(todo: Todo) {
    if (!todo.id) return;

    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = err.message || 'An error occurred while deleting the todo.';
      }
    });
  }

  // ✅ Photo upload methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadPhoto() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.todoService.uploadPhoto(formData).subscribe({
      next: response => {
        this.errorMessage = '';
        this.loadAllPhotos(); // Refresh photo gallery
      },
      error: err => {
        this.errorMessage = err.message || 'An error occurred while uploading the photo.';
      }
    });
  }

  loadAllPhotos() {
    this.todoService.getAllPhotos().subscribe({
      next: photos => {
        this.photoUrls = photos;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = err.message || 'An error occurred while loading photos.';
      }
    });
  }
}