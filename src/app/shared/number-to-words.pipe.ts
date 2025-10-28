import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  private units: string[] = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  private tens: string[] = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  transform(value: number): string {
    const integerPart = Math.floor(value); 
    if (integerPart === 0) return '(Zero Rupees Only.)';
    return `(${this.convertToWords(integerPart)} Rupees Only.)`;
  }

  private convertToWords(num: number): string {
    if (num < 20) return this.units[num];
    else if (num < 100) return this.tens[Math.floor(num / 10)] + (num % 10 > 0 ? ' ' + this.units[num % 10] : '');
    else if (num < 1000) return this.units[Math.floor(num / 100)] + ' Hundred' + (num % 100 > 0 ? ' and ' + this.convertToWords(num % 100) : '');
    else if (num < 100000) return this.convertToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 > 0 ? ' ' + this.convertToWords(num % 1000) : '');
    else if (num < 10000000) return this.convertToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 > 0 ? ' ' + this.convertToWords(num % 100000) : '');
    else return this.convertToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 > 0 ? ' ' + this.convertToWords(num % 10000000) : '');
  }
}
