const test = require('tape');
const craftAndEquipAltar = require('../use_cases/craftAndEquipAltar.js')
const rules = require('../rulesets/testRules.js')

test('Tape is working', (t) => { t.true(true); t.end(); });

test('craftAndEquipAltar', (t) => {
    let humbleParcel = { size: 'humble', width: 8, height: 8, installations: [] }
    let spaciousParcel = { size: 'humble', width: 32, height: 64, installations: [] }
    let qualifiedPlayer = { tokens: { 'fud': 10000, 'fomo': 5000, 'alpha': 2000, 'kek': 1000 }, parcels: [ humbleParcel, spaciousParcel ] }
    let noMoneyPlayer = {...qualifiedPlayer, tokens: { 'fud': 0, 'fomo': 0, 'alpha': 0, 'kek': 0 } }
    let noParcelsPlayer = { ...qualifiedPlayer, parcels: []}
    let verse = { rules, players: [ qualifiedPlayer ] }
    let verse2 = craftAndEquipAltar(verse, 0, 0)
    t.equals(verse2.players[0].parcels[0].installations.length, 1, 'there is one installation')
    t.equals(verse2.players[0].parcels[0].installations[0].type, 'altar', 'there is an installation of type altar')
    t.end();
});
