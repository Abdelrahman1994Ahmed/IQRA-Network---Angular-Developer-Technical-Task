import { Component, OnInit , OnDestroy} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.css'
})

export class FormBuilderComponent implements OnInit {
  form!: FormGroup;
  jsonSchema: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.jsonSchema = {
      fields: [
        { label: 'Name', type: 'text', name: 'name', required: true },
        { label: 'Email', type: 'email', name: 'email', required: true, pattern: 'email' },
        { label: 'Password', type: 'password', name: 'password', required: true, minLength: 6 },
        { label: 'Hobbies', type: 'list', name: 'hobbies', required: false, itemType: 'text' },
        { label: 'Agree to Terms', type: 'checkbox', name: 'terms', required: true },
        { label: 'Gender', type: 'select', name: 'gender', required: true, options: ['Male', 'Female'] }
      ]
    };

    this.form = this.createForm(this.jsonSchema.fields);

    this.loadFormState();
  }

  // ngOnDestroy(): void {
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     localStorage.removeItem('formstate');
  //   }
  // }

  
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

  saveFormState(): void {
    const formState = this.form.value;
    localStorage.setItem('formState', JSON.stringify(formState));
  }

 
  loadFormState(): void {
    const savedState = localStorage.getItem('formState');
    if (savedState) {
      const formState = JSON.parse(savedState);
      this.form.setValue(formState);
    }
  }

  // Submit form
  submitForm(): void {
    if (this.form.valid) {
      alert('Form has been submitted');
      console.log(this.form.value);
      localStorage.removeItem('formState');
    } else {
      alert('Form is invalid');
    }
  }
    
}