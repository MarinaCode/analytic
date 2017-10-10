/**
 * Created by Marina on 14.11.2016.
 */

export class Utils {

  static checkState(length: number, c1:  number, c2: number) {
    if(length > 0) {
      if(length >= c1 && length <= c2) {
         return 0;
      } else return 1;
    } else return 2;
  }

  static isContain(data: any) {
      return data ? true : false;
  }

  static percent(a: number, count: number):any {
    return (100 * a / count).toPrecision(3);
  }

  static arithmeticAverage(argument: any) {
    var sum = 0;

    for (var i = 0; i < argument[i]; i++) {
      return sum == 0 ? sum : (sum / argument.length);
    }
  }

  static regEmail(e) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
  }

  static checkData(length: number, data: any) {
    return data.length > length;
  }
}

