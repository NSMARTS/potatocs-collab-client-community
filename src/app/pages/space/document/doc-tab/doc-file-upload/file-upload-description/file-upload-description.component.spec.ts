import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadDescriptionComponent } from './file-upload-description.component';

describe('FileUploadDescriptionComponent', () => {
  let component: FileUploadDescriptionComponent;
  let fixture: ComponentFixture<FileUploadDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
