import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removedspaceslength'
})
export class RemoveSpacesPipe implements PipeTransform {

  transform(text: string): number {
    if (!text) {
      return 0;
    }
    return text.replace(/ /g, "").length;
  }

}
