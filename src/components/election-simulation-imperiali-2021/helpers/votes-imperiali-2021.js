export const db = [
  {name: "Sněmovní volby 2021",
    votersInRegions: [903239, 1046147, 509749, 450478, 230692, 640341, 345623, 436939, 406428, 404630, 946509, 505836, 467403, 962930],
    voters:          [633646,  710905, 338184, 291568, 131715, 380016, 223266, 296495, 275938, 278920, 628409, 327214, 315191, 583170],
    envelopes:       [633222,  710578, 338018, 291445, 131638, 379882, 223100, 296372, 275766, 278816, 628119, 327021, 315036, 582871],
    votes:           [627399,  706634, 335839, 289679, 130303, 377126, 221549, 294415, 273992, 277194, 624290, 324828, 313215, 578627],
    overseasCount:   18808,
    overseasVoters:  13236,
    overseasVotes:   13184
  }
]

export const results2021 = [
  {VSTRANA: 768, hash: 'ano-2011', sum: 0, pct: 27.12, rs: 27.12, requires: 5,
    votes: [109588,176100,89509,84107,43081,134322,59515,79463,73556,74113,158362,96714,84534,195176],
    regpct: [17.46, 24.92, 26.65, 29.03, 33.06, 35.61, 26.86, 26.99, 26.84, 26.73, 25.36, 29.77, 26.98, 33.73],
    overseas: 659
  },
  {VSTRANA: 7, hash: 'ceska-strana-socialne-demokraticka', sum: 0, pct: 4.65, rs: 4.65, requires: 5,
    votes: [25116,32245,18304,14466,4930,12062,7725,14534,13843,18168,27555,14742,15338,31369],
    regpct: [4.00, 4.56, 5.45, 4.99, 3.78, 3.19, 3.48, 4.93, 5.05, 6.55, 4.41, 4.53, 4.89, 5.42],
    overseas: 201
  },
  {VSTRANA: 47, hash: 'komunisticka-strana-cech-a-moravy', sum: 0, pct: 3.6, rs: 3.6, requires: 5,
    votes: [13469,24618,14974,11997,4454,14804,6671,10150,10461,12959,22825,12914,10426,23095],
    regpct: [2.14, 3.48, 4.45, 4.14, 3.41, 3.92, 3.01, 3.44, 3.81, 4.67, 3.65, 3.97, 3.32, 3.99],
    overseas: 50
  },
  {VSTRANA: 1327, hash: 'spolu-ods-kducsl-top09', sum: 0, pct: 27.79, rs: 27.79, requires: 11,
    votes: [251090,203091,97698,76994,26355,74565,50464,84166,78163,77631,187497,79715,87019,119457],
    regpct: [40.02, 28.74, 29.09, 26.57, 20.22, 19.77, 22.77, 28.58, 28.52, 28.00, 30.03, 24.54, 27.78, 20.64],
    overseas: 4517
  },
  {VSTRANA: 1350, hash: 'pirati-a-starostove', sum: 0, pct: 15.62, rs: 15.62, requires: 8,
    votes: [142100,137532,45357,40210,18546,52797,47350,44551,38628,37451,88601,40124,42117,64412],
    regpct: [22.64, 19.46, 13.50, 13.88, 14.23, 13.99, 21.37, 15.13, 14.09, 13.51, 14.19, 12.35, 13.44, 11.13],
    overseas: 6654
  },
  {VSTRANA: 1245, hash: 'prisaha', sum: 0, pct: 4.68, rs: 4.68, requires: 5,
    votes: [21418,32427,15165,13695,6447,16452,9524,13930,13569,14504,37740,15257,13270,28164],
    regpct: [3.41, 4.58, 4.51, 4.72, 4.94, 4.36, 4.29, 4.73, 4.95, 5.23, 6.04, 4.69, 4.23, 4.86],
    overseas: 211
  },
  {VSTRANA: 1227, hash: 'trikolora-svobodni-soukromnici', sum: 0, pct: 2.76, rs: 2.76, requires: 5,
    votes: [16083,18062,11438,7246,3584,11538,6156,8663,7866,7341,15964,9907,10376,14239],
    regpct: [2.56, 2.55, 3.40, 2.50, 2.75, 3.05, 2.77, 2.94, 2.87, 2.64, 2.55, 3.04, 3.31, 2.46],
    overseas: 212
  },
  {VSTRANA: 1114, hash: 'svoboda-a-prima-demokracie---spd', sum: 0, pct: 9.56, rs: 9.56, requires: 5,
    votes: [28859,55105,30183,28874,16629,44774,24384,26661,25673,24729,58427,39759,35662,74191],
    regpct: [4.59, 7.79, 8.98, 9.96, 12.76, 11.87, 11.00, 9.05, 9.36, 8.92, 9.35, 12.24, 11.38, 12.82],
    overseas: 289
  },
  {VSTRANA: 5, hash: 'strana-zelenych', sum: 0, rs: .99, pct: .99, requires: 5,
    votes: [6058,6847,3342,2902,1446,4853,2744,3185,2719,2299,5590,2906,2764,5688],
    regpct: [0.96, 0.96, 0.99, 1.00, 1.10, 1.28, 1.23, 1.08, 0.99, 0.82, 0.89, 0.89, 0.88, 0.98],
    overseas: 245
  }
]

export const coefs2 = [
  {VSTRANA: 53, coef:[1.44, 1.03, 1.05, 0.96, 0.73, 0.71, 0.82, 1.03, 1.03, 1.01, 1.08, 0.88, 1.00, 0.74]},
  {VSTRANA: 721, coef:[1.44, 1.03, 1.05, 0.96, 0.73, 0.71, 0.82, 1.03, 1.03, 1.01, 1.08, 0.88, 1.00, 0.74]},
  {VSTRANA: 1, coef:[1.44, 1.03, 1.05, 0.96, 0.73, 0.71, 0.82, 1.03, 1.03, 1.01, 1.08, 0.88, 1.00, 0.74]},
  {VSTRANA: 720, coef:[1.45, 1.25, 0.86, 0.89, 0.91, 0.90, 1.37, 0.97, 0.90, 0.86, 0.91, 0.79, 0.86, 0.71]},
  {VSTRANA: 166, coef:[1.45, 1.25, 0.86, 0.89, 0.91, 0.90, 1.37, 0.97, 0.90, 0.86, 0.91, 0.79, 0.86, 0.71]}
];

export const coefs = [
  {VSTRANA: 53, coef:[1.34, 1.15, 1.08, 0.92, 0.82, 0.77, 0.94, 0.98, 0.96, 1.02, 1.07, 0.79, 0.87, 0.83]},
  {VSTRANA: 721, coef:[1.68, 1.21, 1.02, 0.93, 0.71, 0.69, 0.71, 0.89, 0.84, 0.83, 1.24, 0.77, 0.77, 0.65]},
  {VSTRANA: 1, coef:[1.04, 0.80, 0.86, 0.78, 0.56, 0.58, 0.71, 0.95, 1.05, 1.03, 1.16, 1.03, 1.27, 0.76]},
  {VSTRANA: 720, coef:[1.58, 1.12, 0.91, 0.89, 0.72, 0.90, 1.01, 1.00, 0.95, 0.95, 1.00, 0.83, 0.75, 0.78]},
  {VSTRANA: 166, coef:[1.22, 1.36, 0.9, 0.89, 1.00, 0.90, 1.84, 0.87, 0.86, 0.78, 0.82, 0.75, 1.10, 0.64]}
];

results2021.forEach(party => {
  party.coef = [];

  party.regpct.forEach(rp => {
    party.coef.push(rp / party.rs);
  });

  party.sumall = party.votes.reduce((a, b) => a + b, 0)
});

export const elections = [
  'Sněmovní volby 2021'
]

export const attendance = [];
export const votersInRegions = [];
export const errorInRegion = [];

db[0].votes.forEach((v, i) => {
  votersInRegions.push(db[0].votersInRegions[i]);
  attendance.push(db[0].votes[i] / db[0].votersInRegions[i] * 100);
  errorInRegion.push(db[0].votes[i] / db[0].voters[i] * 100);
});

/**

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

*/

export function votes (id, att, tick) {

  // console.log(att, id);

  var sum = 0, perMandate = 0, votes = [], list = [];

  var attendanceValues = att || attendance;

  if (id > 0) {

    votersInRegions.forEach((voters, index) => {
      list.push(
        Math.round(voters * attendanceValues[index] / 100)
      );
    })
    votes = list;
  } else {

    (att || db[id].votes).forEach(voters => {
      list.push(voters)
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

  list.forEach(item => item.total = item.chairs + item.extra);

  return list;
}

export function scrutinizeRegion (chairsCount, parties) {
  var list = [];

  parties.forEach(party => {
    for (var i = 1; i <= chairsCount; i++) {
      var obj = {
        hash: party.hash,
        VSTRANA: party.VSTRANA,
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
        VSTRANA: party.VSTRANA,
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
        VSTRANA: party.VSTRANA,
        mandates: scr.filter(x => x.hash === party.hash || x.VSTRANA === party.VSTRANA).length
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
      VSTRANA: party.VSTRANA,
      regions: [],
      sum: 0
    }

    regions.forEach(reg => {
      o.regions.push(reg.mandates.find(x => x.hash === party.hash || x.VSTRANA === party.VSTRANA).mandates);
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

export function turnout (attendanceCustom, votersCustom, tick, overseas, defined) {
  // var attendanceValues = attendanceCustom || attendance;
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
    var r = db[0].votes[index]; // Math.round(votersRegional * attendanceValues[index] * errorInRegion[index] / 10000);

    // r += overseas === index ? db[0].overseasCount : 0;

    r = r + overseas - overseas;

    sum += r;
    all += votersRegional;

    voters.push(r);
  });

  if (defined && defined.data.attendanceSum) {
    all = defined.data.attendanceCount.reduce((a, b) => a+b, 0);
    sum = defined.data.attendanceSum;
    voters = defined.data.attendanceCount; // .map((x, i) => Math.floor(x * defined.data.attendanceCustom[i] / 100));
  }

  return {
    voters,
    sum,
    all,
    pct: Math.round(10000 * sum / all) / 100,
    tick
  }
}
