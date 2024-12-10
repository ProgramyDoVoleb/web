export const db = [
  {name: "Sněmovní volby 2021",
    votersInRegions: [903239, 1046147, 509749, 450478, 230692, 640341, 345623, 436939, 406428, 404630, 946509, 505836, 467403, 962930],
    votes:           [627399,  706634, 335839, 289679, 130303, 377126, 221549, 294415, 273992, 277194, 624290, 324828, 313215, 578627],
    voters:          [633646,  710905, 338184, 291568, 131715, 380016, 223266, 296495, 275938, 278920, 628409, 327214, 315191, 583170],
    overseasCount:   18808
  }
]

export const results2017 = [
  {hash: 'ano-2011', sum: 0, pct: 27.12, rs: 27.12, requires: 5,
    votes: [109588,176100,89509,84107,43081,134322,59515,79463,73556,74113,158362,96714,84534,195176],
    regpct: [17.46, 24.92, 26.65, 29.03, 33.06, 35.61, 26.86, 26.99, 26.84, 26.73, 25.36, 29.77, 26.98, 33.73]
  },
  {hash: 'ceska-strana-socialne-demokraticka', sum: 0, pct: 4.65, rs: 4.65, requires: 5,
    votes: [25116,32245,18304,14466,4930,12062,7725,14534,13843,18168,27555,14742,15338,31369],
    regpct: [4.00, 4.56, 5.45, 4.99, 3.78, 3.19, 3.48, 4.93, 5.05, 6.55, 4.41, 4.53, 4.89, 5.42]
  },
  {hash: 'komunisticka-strana-cech-a-moravy', sum: 0, pct: 3.6, rs: 3.6, requires: 5,
    votes: [13469,24618,14974,11997,4454,14804,6671,10150,10461,12959,22825,12914,10426,23095],
    regpct: [2.14, 3.48, 4.45, 4.14, 3.41, 3.92, 3.01, 3.44, 3.81, 4.67, 3.65, 3.97, 3.32, 3.99]
  },
  {hash: 'spolu-ods-kducsl-top09', sum: 0, pct: 27.79, rs: 27.79, requires: 11,
    votes: [251090,203091,97698,76994,26355,74565,50464,84166,78163,77631,187497,79715,87019,119457],
    regpct: [40.02, 28.74, 29.09, 26.57, 20.22, 19.77, 22.77, 28.58, 28.52, 28.00, 30.03, 24.54, 27.78, 20.64]
  },
  {hash: 'pirati-a-starostove', sum: 0, pct: 15.62, rs: 15.62, requires: 8,
    votes: [142100,137532,45357,40210,18546,52797,47350,44551,38628,37451,88601,40124,42117,64412],
    regpct: [22.64, 19.46, 13.50, 13.88, 14.23, 13.99, 21.37, 15.13, 14.09, 13.51, 14.19, 12.35, 13.44, 11.13]
  },
  {hash: 'prisaha', sum: 0, pct: 4.68, rs: 4.68, requires: 5,
    votes: [21418,32427,15165,13695,6447,16452,9524,13930,13569,14504,37740,15257,13270,28164],
    regpct: [3.41, 4.58, 4.51, 4.72, 4.94, 4.36, 4.29, 4.73, 4.95, 5.23, 6.04, 4.69, 4.23, 4.86]
  },
  {hash: 'trikolora-svobodni-soukromnici', sum: 0, pct: 2.76, rs: 2.76, requires: 5,
    votes: [16083,18062,11438,7246,3584,11538,6156,8663,7866,7341,15964,9907,10376,14239],
    regpct: [2.56, 2.55, 3.40, 2.50, 2.75, 3.05, 2.77, 2.94, 2.87, 2.64, 2.55, 3.04, 3.31, 2.46]
  },
  {hash: 'svoboda-a-prima-demokracie---spd', sum: 0, pct: 9.56, rs: 9.56, requires: 5,
    votes: [28859,55105,30183,28874,16629,44774,24384,26661,25673,24729,58427,39759,35662,74191],
    regpct: [4.59, 7.79, 8.98, 9.96, 12.76, 11.87, 11.00, 9.05, 9.36, 8.92, 9.35, 12.24, 11.38, 12.82]
  },
  {hash: 'strana-zelenych', sum: 0, rs: .99, pct: .99, requires: 5,
    votes: [6058,6847,3342,2902,1446,4853,2744,3185,2719,2299,5590,2906,2764,5688],
    regpct: [0.96, 0.96, 0.99, 1.00, 1.10, 1.28, 1.23, 1.08, 0.99, 0.82, 0.89, 0.89, 0.88, 0.98]
  }
]

results2017.forEach(party => {
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

export function votes (id, att, tick) {
  var sum = 0, perMandate = 0, votes = [], list = [];

  if (id === 4) {

    var attendanceValues = att || attendance;

    votersInRegions.forEach((voters, index) => {
      list.push(
        Math.round(voters * attendanceValues[index] / 100)
      );
    })
    votes = list;
  } else {

    db[id].votes.forEach(voters => {
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

  return {
    voters,
    sum,
    all,
    pct: Math.round(10000 * sum / all) / 100,
    tick
  }
}
