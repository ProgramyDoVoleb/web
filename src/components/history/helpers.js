import store from '@/store/store';
import axios from 'axios';
// import {betterURL} from '@/common/helpers';

function b (value) {
  return value.toLowerCase();
}

export function history (years, full, num) {
  var list = [];
  var used = [[], [], [], [], []];
  var cid = 0;

  // console.log(years[1].candidates.filter(x => x.name[0] === "Marie").map(x => JSON.stringify(x)));

  years.forEach((year, index) => {
    if (index < 1) {
      year.parties.forEach(party => {
        party.list.forEach(cand => {
          if (used[index].find(x => x === cand)) return;

          cand.cid = cid;
          cid++;

          used[index].push(cand);

          var color = party.color;

          if (party.colorGenerated) {
            if (cand.nominee != 80) {
              var pcolor = store.getters.party(cand.nominee);

              if (pcolor && pcolor.color) color = pcolor.color;
            }
          }

          var path = [{index, cand, color: color}];
          var name = [cand.name[0], cand.name[1]];
          var lastAge = cand.age, lastAgeKnown = cand.age;
          var lastIndex = 0;
          var tt = null;
          var t, i;

          for (i = index + 1; i < 5; i++) {
            t = years[i].candidates.find(x =>
              b(x.name[0]) === b(name[0])
              && b(x.name[1]) === b(name[1])
              // && (
              //   b(x.name[1]) === b(name[1])
              //   || (full && years[i].candidates.filter(y =>
              //     b(y.name[0]) === b(name[0])
              //     && y.age <= lastAge - 3
              //     && y.age > lastAge - 5
              //     && (!!cand.name[2] === !!y.name[2])
              //     && (!!cand.name[3] === !!y.name[3])
              //     && (
              //       b(y.name[1][y.name[1].length - 1]) === "á"
              //       || b(name[1][name[1].length - 1]) === "á"
              //     )
              //   ).length === 1)
              // )
              && x.age <= lastAge - 3
              && x.age > lastAge - 5
            );

            if (t && !used[i].find(x => x === t)) {
              used[i].push(t);
              lastAge = t.age;
              lastAgeKnown = t.age;
              lastIndex = i;
              path.push({index: i, cand: t});
              tt = t;
            } else {
              lastAge -= 4;
            }
          }

          // console.log(full, tt);

          if (lastIndex < 4 && name[1][name[1].length - 1] === "á" && full === true) {

            // console.log(lastIndex, lastAgeKnown, name[1], full);

            for (i = lastIndex + 1; i < 5; i++) {
              t = years[i].candidates.filter(x =>
                !used[i].find(y => y === x)
                && b(x.name[0]) === b(name[0])
                && b(x.name[1]) != b(name[1])
                // && b(x.name[1][x.name[1].length - 1]) === "á" || (b(name[1][name[1].length - 1]) === "á")
                && ((!!x.name[2] === !!cand.name[2]) || (!x.name[2] && cand.name[2]))
                && ((!!x.name[3] === !!cand.name[3]) || (!x.name[3] && cand.name[3]))
                && x.age <= lastAgeKnown - 3
                && x.age > lastAgeKnown - 5
              );

              if (t.length === 1 && !used[i].find(x => x === t[0])) {
                used[i].push(t[0]);
                lastAge = t[0].age;
                lastAgeKnown = t[0].age;
                lastIndex = i;
                path.push({index: i, cand: t[0]});
                tt = t[0];

                console.log(tt.age);
              } else {
                lastAge -= 4;
                lastAgeKnown -= 4;
              }
            }
          }

          list.push(path);
        });
      });
    }
  })

  // if (num != 577626) {
    axios.post(store.state.api + 'history2/store', {
      num,
      list: JSON.stringify(list, null, 2)
    });
  // }

  return list;
}
