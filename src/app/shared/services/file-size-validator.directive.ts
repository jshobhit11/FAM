import { Directive, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appFileSizeValidator]'
})
export class FileSizeValidatorDirective implements OnInit {
  private maxSize = 1048576; 

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const errorElement = this.el.nativeElement.parentNode.querySelector('mat-error');
    if (errorElement) {
      this.renderer.setStyle(errorElement, 'display', 'none');
    }
  }

  @HostListener('change', ['$event']) onChange(event: any) {
    const file = event.target.files[0];
    const errorElement = this.el.nativeElement.parentNode.querySelector('mat-error');

    if (errorElement) {
      if (file && file.size > this.maxSize) {
        this.renderer.setStyle(errorElement, 'display', 'block');
        event.target.value = null; 
      } else {
        this.renderer.setStyle(errorElement, 'display', 'none');
      }
    }
  }
}
