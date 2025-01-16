/* eslint-disable no-extend-native */
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length === 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function sortByPorCislo (list, key) {

  // console.log(key);

  list.sort((a, b) => (a[key || 'PORCISLO'] || 1000) - (b[key || 'PORCISLO'] || 1000));

  return list;
}

export function sortBy (list, key, fallback, isString, desc) {

  var arr = [];
  list.forEach(x => arr.push(x));

  if (isString) {
    arr.sort((a, b) => ((desc ? b : a)[key] || fallback).localeCompare(((desc ? a : b)[key] || fallback), 'cs'));
  } else {
    arr.sort((a, b) => ((desc ? b : a)[key] || fallback) - ((desc ? a : b)[key] || fallback));
  }

  return arr;
}

export function sortEvents (list) {

  var arr = [];
  list.forEach(x => arr.push(x));

  arr.sort((a, b) => JSON.parse(a.label)[0].localeCompare(JSON.parse(b.label)[0], 'cs'));

  return arr;
}

export function firstOfUnique (list, key) {
  var u = unique(list, key);
  var arr = [];

  // console.log(u, list);

  u.forEach(x => arr.push(list.find(y => y[key] === x)));

  // console.log(arr);

  return arr;
}

export function con(item, key, def, index, whole) {
  return item[key] && item[key][index || 0] ? (whole ? item[key][index || 0] : item[key][index || 0].value) : (def || null)
}

export function clear(value, fallback) {
  return value && value.length > 0 ? value.split('"').join('”').split("'").join("’").split('\\').join('') : (fallback || null)
}

export function protocol(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function join (arr, comma, joiner) {
  var s = "";

  if (!comma) comma = ',';
  if (!joiner) joiner = 'a';

  if (arr.length < 2) s = arr.join("");
  if (arr.length === 2) s = arr[0] + ' ' + joiner + ' ' + arr[1];
  if (arr.length > 2) {
    s = arr[0];
    for (var i = 1; i < arr.length - 1; i++) {
      s = s + comma + ' ' + arr[i];
    }
    s = s + ' ' + joiner + ' ' + arr[arr.length - 1];
  }

  return s;
}

export function date (input, generic) {
  if (generic && generic === 4) {
    return (new Date(input.split(' ')[0]).toLocaleString('cs-CZ', {month: "numeric", year: "numeric", day: "numeric"})).split(' ').join(' ');
  } else if (generic && generic === 3) {
    return new Date(input.split(' ')[0]).toLocaleString('cs-CZ', {month: "long", year: "numeric", day: "numeric"});
  } else if (generic && generic === 1) {
    return new Date(input.split(' ')[0]).toLocaleString('cs-CZ', {month: "long", year: "numeric"});
  } else if (generic && generic === 2) {
    return (new Date(input.split(' ')[0]).toLocaleString('cs-CZ', {month: "numeric", day: "numeric"})).split(' ').join(' ');
  } else if (typeof input === 'string' && Number(input.split('-')[0]) != new Date().getFullYear()) {
    return new Date(input.split(' ')[0]).toLocaleString('cs-CZ', {month: "long", year: "numeric", day: "numeric"});
  } else {
    return new Date(input.split(' ')[0]).toLocaleString('cs-CZ', {month: "long", day: "numeric"});
  }
}

export function domain (url, full) {

  url = url.replace('https://', '');
  url = url.replace('http://', '');
  url = url.replace('www.', '');

  if (url.charAt(url.length - 1) === '/') url = url.slice(0, -1); // '12345.0'

  if (!full) url = url.split('/')[0];

  return url;
}

export function truncate (str, count, chars) {

  if (!str) return undefined;

  var limit = count || 20;
  var words = str.split(chars ? '' : ' ');
  var add = words.length > limit ? '...' : '';

  return words.splice(0, limit).join(chars ? '' : ' ') + add;
}

export function number (num, digits, plus) {
  var n = (num || 0).toLocaleString('cs-CZ', { minimumFractionDigits: digits || 0}).split(' ').join(' ');

  if (plus && num > 0) n = "+" + n;

  return n;
}

export function url (url) {
  var newURL = url;

  newURL = newURL.toLowerCase();
  newURL = newURL.replaceAll('.', '');
  newURL = newURL.replaceAll(',', '');
  newURL = newURL.replaceAll(';', '');
  newURL = newURL.replaceAll('?', '');
  newURL = newURL.replaceAll('!', '');
  newURL = newURL.replaceAll('(', '');
  newURL = newURL.replaceAll(')', '');
  newURL = newURL.replaceAll('á', 'a');
  newURL = newURL.replaceAll('č', 'c');
  newURL = newURL.replaceAll('ď', 'd');
  newURL = newURL.replaceAll('é', 'e');
  newURL = newURL.replaceAll('ě', 'e');
  newURL = newURL.replaceAll('í', 'i');
  newURL = newURL.replaceAll('ľ', 'l');
  newURL = newURL.replaceAll('ň', 'n');
  newURL = newURL.replaceAll('ó', 'o');
  newURL = newURL.replaceAll('ř', 'r');
  newURL = newURL.replaceAll('š', 's');
  newURL = newURL.replaceAll('ť', 't');
  newURL = newURL.replaceAll('ú', 'u');
  newURL = newURL.replaceAll('ů', 'u');
  newURL = newURL.replaceAll('ý', 'y');
  newURL = newURL.replaceAll('ž', 'z');
  newURL = newURL.replaceAll(' ', '-');
  newURL = newURL.replaceAll('·', '-');
  newURL = newURL.replaceAll("'", '-');
  newURL = newURL.replaceAll('"', '-');
  newURL = newURL.replaceAll('“', '');
  newURL = newURL.replaceAll('”', '');
  newURL = newURL.replaceAll("+", '');
  newURL = newURL.replaceAll(':', '');
  newURL = newURL.replaceAll('/', '');
  newURL = newURL.replaceAll('#', '');

  var c = [];

  newURL.split('').forEach(x => {
    if ([780, 769, 778, 770, 776].indexOf(x.charCodeAt(0)) === -1) {
      c.push(x);
    }
  });

  var s = c.join('');

  return s;
}

export function indicator (a, b, c) {
  var s = c || 'dimm';

  if (a > b) s = 'green';
  if (a < b) s = 'red';

  return s;
}

export function color (name) {
  var num = String(name || 'custom').hashCode();

  num >>>= 0;
  var b = num & 0xFF;
  var g = (num & 0xFF00) >>> 8;
  var r = (num & 0xFF0000) >>> 16;

  return 'rgb(' + [r, g, b].join(',') + ')';
}

export function gradient (arr) {
  var clr = [];

  arr.forEach((a, i) => {
    clr.push(a + ' ' + i / (arr.length - 1) * 100 + '%');
  });

  var css = 'linear-gradient(20deg, ' + clr.join(', ') + ')';

  return css;
}

export function type (link) {
  if (link.split('facebook.com').length > 1) return 'fb';
  if (link.split('twitter.com').length > 1) return 'tw';
  if (link.split('x.com').length > 1) return 'tw';
  if (link.split('instagram.com').length > 1) return 'ig';
  if (link.split('threads.net').length > 1) return 'threads';
  if (link.split('wikipedia').length > 1) return 'wiki';
  if (link.split('linkedin').length > 1) return 'linkedin';
  if (link.split('t.me').length > 1) return 'telegram';
  if (link.split('tiktok').length > 1) return 'tiktok';
  if (link.split('mastodon').length > 1) return 'mastodon';
  if (link.split('youtube').length > 1) return 'yt';
  if (link.split('youtu').length > 1) return 'yt';
  // if (link.split('hlidac').length > 1) return 'hlidac-statu';
  // if (link.split('demagog').length > 1) return 'demagog';
  return 'link';
}

export function round (value, digits) {
  var pow = Math.pow(10, digits || 2);
  return Math.round(value * pow) / pow;
}

export function pct (value, base, digits) {
  return round(100 * value / base, digits || 2);
}

export function reverse (arr) {
  return arr.reverse();
}

export function slide (hash, el, center) {
  (el || this.$el).querySelector("[name=" + hash + "]").scrollIntoView({behavior: "smooth", block: center ? "center" : "start"});
}

export function lang (_value, _end) {
  var s;

  var end = ['', '', '', ''];

  if (!_value) _value = 0;

  if (_end && _end.sort) {
    _end.forEach((x, i) => end[i] = x);
  }

  if (_value === 0) s = end[0];
  if (_value === 1) s = end[1];
  if (_value > 1 && _value < 5) s = end[2];
  if (_value > 4) s = end[3];

  return s.split('%%').join(number(_value));
}

export function unique (_list, _key) {
  return [...new Set(_list.map(x => x[_key]))];
}

export function isValidURL (_url) {
  try { 
    return Boolean(new URL(_url)); 
  }
  catch(e){ 
    return false; 
  }
}

export function untag (html) {
  var div = document.createElement("div");
      div.innerHTML = html;
  
      return div.textContent || div.innerText || "";
}

export function isWoman (person) {
  var woman = false;

  if (person.PRIJMENI[person.PRIJMENI.length - 1] === 'á') woman = true;
  if (person.JMENO[person.JMENO.length - 1] === 'a') woman = true;
  if (person.JMENO[person.JMENO.length - 1] === 'e') woman = true;
  if (person.$data.mfo && person.$data.mfo[0].value === 1) woman = false;
  if (person.$data.mfo && person.$data.mfo[0].value === 2) woman = true;

  return woman;
}