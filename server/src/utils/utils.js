/**
 * Created by Marina on 14.11.2016.
 */
import crypto from 'crypto';
import _ from 'underscore';
class Utils {
    checkState(length: number, c1:  number, c2: number) {
        if(length > 0) {
            if(length >= c1 && length <= c2) {
                return 0;
            } else return 1;
        } else return 2;
    }

    isContain(data: any) {
        return data ? true : false;
    }

    percent(a: number, count: number):any {
        return (100 * a / count).toPrecision(3);
    }

    arithmeticAverage(argument: any) {
        var sum = 0;

        for (var i = 0; i < argument[i]; i++) {
            return sum == 0 ? sum : (sum / argument.length);
        }
    }

    regEmail(e) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(e);
    }

    checkData(length: number, data: any) {
        return data.length > length;
    }

    encrypt(str, salt) {
        if (!str) return null;
        if (!salt) {
            return crypto.createHash('sha1').update(str).digest('hex');
        }
        return crypto.createHmac('sha1', salt).update(str).digest('hex');
    }
}
export default new Utils();
