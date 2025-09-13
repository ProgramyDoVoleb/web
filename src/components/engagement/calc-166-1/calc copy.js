var matrix = {
	y: [[10,8,2],[8,9,4],[2,4,6]],
	c: [[1,2,0],[2,3,1],[0,1,1]],
	p: [[0, 0, 0],[0,0,0],[0,0,0]]
}

function getMatrixValue (partyAnswer, partyImportance, personAnswer, personImportance) {
	var res = 0;

	if (partyAnswer < 3 && personAnswer < 3) {
		res = matrix.y[partyImportance - 1][personImportance - 1];
		if (partyAnswer != personAnswer) res *= -1;
	}
	if (partyAnswer === 3 || personAnswer === 3) {
		res = matrix.c[partyImportance - 1][personImportance - 1];
	}
	if (partyAnswer === 4 || personAnswer === 4) {
		res = -2;
	}
	if (partyAnswer === 4 && personAnswer === 4) {
		res = 2;
	}

	return res;
}

export function processParty (party, data, result, keep) {
    var o = {
        id: party.id,
        short: party.ZKRATKA.toLowerCase(),
        res: 0,
        pts: null,
        pwi: null,
        imp: null,
        agree: null,
        oppose: null,
        questions: Array()
    }

    if (data.answers.find(x => x[0] === party.id)) {
        data.questions.forEach(question => {
            var partyValues = data.answers.find(x => x[0] === party.id && x[1] === question.id);
            var personValues = result.answers.find(x => x[0] === question.id);

            var resimp = partyValues ? getMatrixValue(partyValues[2], partyValues[3], personValues[1], personValues[2]) : getMatrixValue(4, 2, personValues[1], personValues[2]);
            var res = partyValues ? getMatrixValue(partyValues[2], 1, personValues[1], 1) : getMatrixValue(4, 1, personValues[1], 1);

            o.questions.push({
                id: question.id,
                pts: res,
                pwi: resimp,
                imp: 2 - Math.abs(partyValues[3] - personValues[2]),
                agree: partyValues[2] === personValues[1] ? 1 : 0,
                oppose: partyValues[2] !== personValues[1] && (partyValues[2] < 3 && personValues[1] < 3) ? 1 : 0,
            })
        })

        o.pts = o.questions.reduce((a, b) => a + b.pts, 0);
        o.pwi = o.questions.reduce((a, b) => a + b.pwi, 0);
        o.imp = o.questions.reduce((a, b) => a + b.imp, 0);
        o.agree = o.questions.reduce((a, b) => a + b.agree, 0);
        o.oppose = o.questions.reduce((a, b) => a + b.oppose, 0);

        o.res = Math.round((o.agree + (o.questions.length - o.agree - o.oppose) * 0.33) / o.questions.length * 100)/1;
        
        if (!keep) o.questions = null;
    }

    return o;
}