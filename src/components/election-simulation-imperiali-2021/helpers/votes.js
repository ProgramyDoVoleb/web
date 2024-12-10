export const db = [
  {name: "Sněmovní volby 2017", votes: [
    611450, 650125, 315319, 271510, 122142, 339686, 208817, 278720, 258169, 262764, 583442, 305639, 294679, 547789
  ]},
  {name: "Evropské volby 2019", votes: [
    345558, 311493, 147224, 125754, 53535, 141720, 97800, 132761, 117292, 120408, 278155, 134219, 133757, 231089
  ]},
  {name: "Krajské volby 2020 + Praha 2018", votes: [
    425937, 418201, 198887, 173685, 79783, 199913, 138811, 177049, 166090, 159447, 362861, 187291, 192101, 315242
  ]},
  {name: "Sněmovní volby 2013", votes: [
    586509, 627492, 311171, 263425, 122673, 338082, 202451, 273891, 255603, 262032, 573857, 304844, 295334, 552620
  ]}
]

export const results2017 = [
{hash: 'ano-2011', sum: 0, pct: 29.64, rs: 29.64, requires: 5, votes: [124445,189371,91012,84114,43268,127574,62302,88551,79551,75247,159909,95950,84750,194069], regpct: [20.35, 28.66, 28.86, 30.98, 35.42, 37.55, 29.83, 31.77, 30.81, 28.63, 27.40, 31.39, 28.76, 35.42]},
{hash: 'ceska-strana-socialne-demokraticka', sum: 0, pct: 7.27, rs: 7.27, requires: 5, votes: [34079,43853,23035,21643,8530,22464,11811,18128,19294,24631,49248,22760,20454,48417], regpct: [5.57, 6.63, 7.30, 7.97, 6.98, 6.61, 5.65, 6.50, 7.47, 9.37, 8.44, 7.44, 6.94, 8.83]},
{hash: 'komunisticka-strana-cech-a-moravy', sum: 0, pct: 7.76, rs: 7.76, requires: 5, votes: [28158,47695,29414,23502,9960,33628,13981,19792,20002,24829,46966,26853,20669,47651], regpct: [4.60, 7.21, 9.32, 8.65, 8.15, 9.89, 6.69, 7.10, 7.74, 9.44, 8.04, 8.78, 7.01, 8.69]},
{hash: 'obcanska-demokraticka-strana', sum: 0, pct: 11.32, rs: 11.32, requires: 5, votes: [99182,85415,38232,32833,10796,32197,21468,32242,28313,25989,69319,27266,28752,40944], regpct: [16.22, 12.92, 12.12, 12.09, 8.83, 9.47, 10.28, 11.56, 10.96, 9.89, 11.88, 8.92, 9.75, 7.47]},
{hash: 'ceska-piratska-strana', sum: 0, pct: 10.79, rs: 10.79, requires: 5, votes: [107590,79815,33143,27201,12264,28004,23859,29932,27146,26086,53207,25955,24859,47332], regpct: [17.59, 12.08, 10.51, 10.01, 10.04, 8.24, 11.42, 10.73, 10.51, 9.92, 9.11, 8.49, 8.43, 8.64]},
{hash: 'kdu-csl', sum: 0, pct: 5.80, rs: 5.80, requires: 5, votes: [29143,19925,16983,9499,2885,6127,4297,16294,17599,24295,52346,25257,33631,35362], regpct: [4.76, 3.01, 5.38, 3.49, 2.36, 1.80, 2.05, 5.84, 6.81, 9.24, 8.97, 8.26, 11.41, 6.45]},
{hash: 'starostove-a-nezavisli', sum: 0, pct: 5.18, rs: 5.18, requires: 5, votes: [30920,53368,14435,13180,6453,12299,26780,14184,12855,11251,21222,13580,17168,14462], regpct: [5.05, 8.07, 4.57, 4.85, 5.28, 3.62, 12.82, 5.08, 4.97, 4.28, 3.63, 4.44, 5.82, 2.64]},
{hash: 'svoboda-a-prima-demokracie---spd', sum: 0, pct: 10.64, rs: 10.64, requires: 5, votes: [35547,59497,31062,28686,15233,42777,22878,28038,26202,25237,67973,41397,38020,76027], regpct: [5.81, 9.00, 9.85, 10.56, 12.47, 12.59, 10.95, 10.05, 10.14, 9.60, 11.65, 13.54, 12.90, 13.87]},
{hash: 'top-09', sum: 0, pct: 5.31, rs: 5.31, requires: 5, votes: [77325,41843,16713,13095,4495,12336,8825,14308,10864,10163,26356,9903,8443,14142], regpct: [12.64, 6.33, 5.30, 4.82, 3.68, 3.63, 4.22, 5.13, 4.20, 3.86, 4.51, 3.24, 2.86, 2.58]},
{hash: 'strana-zelenych', sum: 0, rs: 1.46, pct: 1.46, requires: 5, votes: [14686,9415,4326,3321,1549,5013,2907,3650,3261,3204,9147,3588,3685,6583], regpct: [2.40, 1.42, 1.37, 1.22, 1.26, 1.47, 1.39, 1.30, 1.26, 1.21, 1.56, 1.17, 1.25, 1.20]},
{hash: 'svobodni', sum: 0, pct: 1.56, rs: 1.56, requires: 5, votes: [12857,10679,5303,4138,1544,4595,3152,4310,3998,3565,10421,3963,4812,5892], regpct: [2.10, 1.61, 1.68, 1.52, 1.26, 1.35, 1.50, 1.54, 1.54, 1.35, 1.78, 1.29, 1.63, 1.07]}
]

results2017.forEach(party => {
  party.coef = [];

  party.regpct.forEach(rp => {
    party.coef.push(rp / party.rs);
  });

  party.sumall = party.votes.reduce((a, b) => a + b, 0)
});

export const elections = [
  'Sněmovní volby 2017',
  'Evropské volby 2019',
  'Krajské volby 2020 + Praha 2018',
  'Sněmovní volby 2013',
  'Vlastní nastavení'
]

export const attendance = [
  615519/916940*100,
  664722/1047853*100,
  317250/513882*100,
  273374/456299*100,
  123107/236250*100,
  341783/652568*100,
  210363/350307*100,
  280822/444016*100,
  259860/412172*100,
  264356/412847*100,
  587458/951420*100,
  307825/515014*100,
  296748/477700*100,
  551446/987233*100
]

const votersInRegions = [
  916940, 1031208, 513882, 456299, 236250, 652568, 350307, 444016, 412172, 412847, 951420, 515014, 477700, 987233
]

const errorInRegion = [
  611450/615519*100,
  660619/664722*100,
  315319/317250*100,
  271510/273374*100,
  122142/123107*100,
  339686/341783*100,
  208817/210363*100,
  278720/280822*100,
  258169/259860*100,
  262764/264356*100,
  583442/587458*100,
  305639/307825*100,
  294679/296748*100,
  547789/551446*100
]

export function votes (id, att, tick, overseas) {
  var sum = 0, perMandate = 0, votes = [], list = [];

  if (id === 4) {

    var attendanceValues = att || attendance;

    votersInRegions.forEach((voters, index) => {
      list.push(
        Math.round(voters * attendanceValues[index] / 100) + (overseas === index ? 10494 : 0)
      );
    })
    votes = list;
  } else {

    db[id].votes.forEach((voters, index) => {
      list.push(voters + (overseas === index ? 10494 : 0))
    })
    votes = list;
  }

  votes.forEach(v => sum += v);
  perMandate = Math.round(sum / 200);

  return {
    sum, perMandate, votes, tick
  }
}

export function chairs (votes, perMandate) {
  var list = [];

  var spent = 200;

  votes.forEach((vote, index) => {

    var chairs = Math.floor(vote / perMandate)

    var obj = {
      region: index,
      votes: vote,
      chairs: chairs,
      remain: vote % perMandate,
      extra: 0
    }

    spent -= chairs;

    list.push(obj);
  });

  list.sort((a, b) => b.remain - a.remain);

  list.forEach(region => {
    if (spent > 0) {
      spent--;
      region.extra++;
    }
  });

  list.sort((a, b) => a.region - b.region);

  return list;
}

export function scrutinizeRegion (chairsCount, parties) {
  var list = [];

  parties.forEach(party => {
    for (var i = 1; i <= chairsCount; i++) {
      var obj = {
        hash: party.hash,
        division: Math.floor(party.votes / i)
      }

      list.push(obj);
    }
  });

  list.sort((a, b) => b.division - a.division);
  // list = list.slice(0, chairsCount);

  return list;
}

export function scrutinize (chairs, parties, tick) {

  var regions = [];

  // // console.log(chairs, parties);

  chairs.forEach((data, index) => {
    var obj = {
      chairs: data.chairs + data.extra,
      parties: [],
      mandates: [],
      tick
    }

    parties.forEach(party => {
      var o = {
        hash: party.hash,
        votes: party.votes[index]
      }

      // // console.log(party.pct, party.requires)

      if (party.pct >= party.requires) {
        obj.parties.push(o);
      }
    })

    var scr = scrutinizeRegion(obj.chairs, obj.parties);
    scr = scr.slice(0, obj.chairs);

    parties.forEach(party => {
      var o = {
        hash: party.hash,
        mandates: scr.filter(x => x.hash === party.hash).length
      }

      obj.mandates.push(o);
    })

    obj.mandates.sort((a, b) => b.mandates - a.mandates);

    regions.push(obj);

  });

  var p = [];

  parties.forEach(party => {
    var o = {
      hash: party.hash,
      regions: [],
      sum: 0
    }

    regions.forEach(reg => {
      o.regions.push(reg.mandates.find(x => x.hash === party.hash).mandates);
    });

    o.regions.forEach(count => {
      o.sum += count;
    });

    p.push(o);
  })

  return {
    regions,
    parties: p
  };
}

export function turnout (attendanceCustom, votersCustom, tick, overseas) {
  var attendanceValues = attendanceCustom || attendance;
  var votersValues;

  if (votersCustom) {
    votersValues = votersCustom
  } else {
    votersValues = [];

    votersInRegions.forEach((voters) => {
      votersValues.push(voters)
    })
  }

  var voters = [];
  var sum = 0;
  var all = 0;

  votersValues.forEach((votersRegional, index) => {
    var r = Math.round(votersRegional * attendanceValues[index] * errorInRegion[index] / 10000);

    r += overseas === index ? 10494 : 0;

    sum += r;
    all += votersRegional;

    voters.push(r);
  });

  return {
    voters,
    sum,
    all,
    pct: Math.round(10000 * sum / all) / 100,
    tick
  }
}
