import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  form!: FormGroup;
  jsonSchema: any;

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.jsonSchema = {
      fields: [
        { label: 'Name', type: 'text', name: 'name', required: true },
        { label: 'Email', type: 'email', name: 'email', required: true, pattern: 'email' },
        { label: 'Password', type: 'password', name: 'password', required: true, minLength: 6 },
        { label: 'Gender', type: 'select', name: 'gender', required: true, options: ['Male', 'Female'] }, // Gender field
        { label: 'Agree to Terms', type: 'checkbox', name: 'terms', required: true },
        { label: 'Hobbies', type: 'list', name: 'hobbies', required: false, itemType: 'text' }
      ]
    };

    this.form = this.createForm(this.jsonSchema.fields);

    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem('formData');
      if (savedData) {
        this.form.setValue(JSON.parse(savedData));
      }
    }
  }

  createForm(fields: any[]): FormGroup {
    const group: any = {};

    fields.forEach(field => {
      if (field.type === 'list') {
        group[field.name] = this.fb.array([]);
      } else {
        group[field.name] = this.fb.control('', this.getValidators(field));
      }
    });

    return this.fb.group(group);
  }

  getValidators(field: any) {
    const validators: any[] = [];

    if (field.required) validators.push(Validators.required);
    if (field.pattern === 'email') validators.push(Validators.email);
    if (field.minLength) validators.push(Validators.minLength(field.minLength));
    return validators;
  }

  getHobbies(): FormArray {
    return this.form.get('hobbies') as FormArray;
  }

  addHobby(): void {
    const hobbies = this.getHobbies();
    hobbies.push(this.fb.control(''));
  }

  removeHobby(index: number): void {
    const hobbies = this.getHobbies();
    hobbies.removeAt(index);
  }

  submitForm(): void {
    if (this.form.valid) {
      alert('Form has been submitted');
      console.log(this.form.value);
  
      localStorage.setItem('formData', JSON.stringify(this.form.value));
    } else {
      alert('Form is invalid');
    }
  }
}
