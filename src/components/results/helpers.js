import { con, gradient, color } from '@/pdv/helpers';
import { cdn } from '@/stores/core';

export function colorByItem (item, data, _key, _flat) {

    var keys = typeof _key === 'object' ? _key : (_key || 'VSTRANA').split(',');
    var key = keys[0];

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

    res = res || (keys.length > 1 ? colorByItem(item, data, keys.splice(1,5)) : 'var(--greyish)');

    res = res ? res.split('rgb(249,89,231)').join('#f959e722').split('rgb(249, 89, 231)').join('#f959e722') : res;

    return res;
}

export function logoByItem (item, data, _key, _canBeNull) {

    var res = null;

    if (item) {

        var keys = typeof _key === 'object' ? _key : (_key || 'VSTRANA').split(',');
        var key = keys[0];

        res = item.$data ? con(item.$data, 'logo') : null;
        var s = data.cis.strany.find(x => x.VSTRANA === item[key]);

        if (!res && s) {
            res = con(s.$data, 'logo');
        }

        if (!res && !_canBeNull) {
            if ((_key || 'VSTRANA').split(',').length > 1) {
                res = logoByItem(item, data, keys.splice(1,5));
            } else {
                res = cdn + 'empty.png';
            }
        } 
    } else {
        res = cdn + 'empty.png';   
    }

    return res;
}