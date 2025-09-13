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

function balance (answers) {

    var initial = [];
    var balanced = [];
    var sum = 0;

    if (answers.find(x => x.length === 3)) {
        answers.forEach(x => {
            initial.push([-1].concat(x));
        });
    } else {
        initial = answers;
    }

    initial.forEach(ans => {
        if (ans[3] === 1) sum += 2.5;
        if (ans[3] === 2) sum += 2;
        if (ans[3] === 3) sum += 1.5;
    });

    var modifier = sum / 40;

    initial.forEach(ans => {

        var simres = null;
        var balres = null;

        if (ans[2] === 3) simres = 0;
        if (ans[2] === 2) simres = -2;
        if (ans[2] === 1) simres = 2;

        if (ans[2] === 3) balres = 0;
        if (ans[2] === 2 && ans[3] === 1) balres = -2.5 / modifier * 2;
        if (ans[2] === 2 && ans[3] === 2) balres = -2 / modifier * 2;
        if (ans[2] === 2 && ans[3] === 3) balres = -1.5 / modifier * 2;
        if (ans[2] === 1 && ans[3] === 1) balres = 2.5 / modifier * 2;
        if (ans[2] === 1 && ans[3] === 2) balres = 2 / modifier * 2;
        if (ans[2] === 1 && ans[3] === 3) balres = 1.5 / modifier * 2;

        balanced.push([ans[0], ans[1], ans[2], ans[3], simres, balres]);
    });

    return {balanced, modifier};
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

    var partyBalanced = balance(data.answers.filter(x => x[0] === party.id));
    var personBalanced = balance(result.answers);
    var partyActive = data.answers.find(x => x[0] === party.id && x[2] != 4);

    // console.log(data.answers);

    if (data.answers.find(x => x[0] === party.id)) {
        // data.questions.forEach(question => {
        //     var partyValues = data.answers.find(x => x[0] === party.id && x[1] === question.id);
        //     var personValues = result.answers.find(x => x[0] === question.id);

        //     var resimp = partyValues ? getMatrixValue(partyValues[2], partyValues[3], personValues[1], personValues[2]) : getMatrixValue(4, 2, personValues[1], personValues[2]);
        //     var res = partyValues ? getMatrixValue(partyValues[2], 1, personValues[1], 1) : getMatrixValue(4, 1, personValues[1], 1);

        //     o.questions.push({
        //         id: question.id,
        //         pts: res,
        //         pwi: resimp,
        //         imp: 2 - Math.abs(partyValues[3] - personValues[2]),
        //         agree: partyValues[2] === personValues[1] ? 1 : 0,
        //         oppose: partyValues[2] !== personValues[1] && (partyValues[2] < 3 && personValues[1] < 3) ? 1 : 0,
        //     })
        // })

        data.questions.forEach(question => {

            var answerParty = partyBalanced.balanced.find(x => x[0] === party.id && x[1] === question.id);
            var answerPerson = personBalanced.balanced.find(x => x[1] === question.id);

            var res = {
                id: question.id,
                pts: Math.abs(answerParty[4] - answerPerson[4]),
                pwi: Math.abs(answerParty[5] - answerPerson[5]),
                imp: 2,
                agree: (answerParty[4] === answerPerson[4]) ? 1 : 0,
                oppose: (answerParty[4] === -answerPerson[4] && answerParty[4] !== 0 && answerParty[4] !== null && answerPerson[4] !== null) ? 1 : 0,
                complicated: ((answerParty[4] === 0 || answerPerson[4] === 0) && answerParty[4] !== answerPerson[4]  && !(answerParty[4] === null || answerPerson[4] === null)) ? 1 : 0,
                missing: (answerParty[4] !== answerPerson[4] && (answerParty[4] === null || answerPerson[4] === null)) ? 1 : 0,
                data: [answerParty[2], answerParty[3], answerPerson[2], answerPerson[3]],
                balc: [answerParty[4], answerParty[5], answerPerson[4], answerPerson[5]],
            };

            if ((answerParty[4] === 0 || answerPerson[4] === 0) && answerParty[4] != answerPerson[4]) {
                res.pts *= 1.5;
                res.pwi *= 1.5;
            }

            if (res.missing === 1) {
                res.pts = 4;
                // console.log(partyBalanced.modifier, personBalanced.modifier);
                res.pwi = 4 / partyBalanced.modifier + 4 / personBalanced.modifier;
            }

            if (!partyActive) {
                // console.log(party);

                res.agree = 0;
                res.oppose = 0;
                res.complicated = 0;
                res.missing = 1;
                res.pts = 4;
                res.pwi = 4 / partyBalanced.modifier + 4 / personBalanced.modifier;
            }

            o.questions.push(res);
        });

        o.pts = o.questions.reduce((a, b) => a + b.pts, 0);
        o.pwi = o.questions.reduce((a, b) => a + b.pwi, 0);
        o.imp = o.questions.reduce((a, b) => a + b.imp, 0);
        o.agree = o.questions.reduce((a, b) => a + b.agree, 0);
        o.oppose = o.questions.reduce((a, b) => a + b.oppose, 0);
        o.complicated = o.questions.reduce((a, b) => a + b.complicated, 0);
        o.missing = o.questions.reduce((a, b) => a + b.missing, 0);

        // o.res = Math.round((o.agree + (o.questions.length - o.agree - o.oppose - o.missing) * 0.33) / o.questions.length * 100)/1;
        o.simres = (160 - o.pts) / 160 * 100;
        o.balres = (160 - o.pwi) / (40 * 4) * 100;
        o.res = Math.round(o.simres)
        
        if (!keep) o.questions = null;
    }

    // console.log(o);

    return o;
}