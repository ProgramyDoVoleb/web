import { con, gradient, color } from '@/pdv/helpers';
import { cdn } from '@/stores/core';

export function colorByItem (item, data, _key, _flat) {

    var key = _key || 'VSTRANA';

    if (item) {

        var res = item.$data ? con(item.$data, 'color') : null;
        var s = data.cis.strany.find(x => x.VSTRANA === item[key]);
    
        if (!res && s && con(s.$data, 'color')) {
            res = con(s.$data, 'color');
        }
    
        if (!res && s && s.$coalition) {
            var arr = [];
    
            s.$coalition.forEach(member => {
                arr.push(con(member.$data, 'color', color(member.NAZEV)))
            });
    
            res = gradient(arr);

            if (_flat) {
                res = con(s.$coalition[0].$data, 'color', color(s.$coalition[0].NAZEV));
            }
        }
    
        if (!res && s && s.VSTRANA != 99 && s.VSTRANA != 90 && s.VSTRANA != 80) {
            res = con(s.$data, 'color', color(s.NAZEV));
        }
    
        if (!res && item.NAZEV) {
            res = color(item.NAZEV);
        }
    }

    return res || '#f959e7';
}

export function logoByItem (item, data, _key, _canBeNull) {

    if (item) {
        var key = _key || 'VSTRANA';

        var res = item.$data ? con(item.$data, 'logo') : null;
        var s = data.cis.strany.find(x => x.VSTRANA === item[key]);

        if (!res && s) {
            res = con(s.$data, 'logo');
        }

        if (!res && !_canBeNull) res = cdn + 'empty.png';
    } else {
        res = cdn + 'empty.png';   
    }

    return res;
}