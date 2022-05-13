const test = require('tape');
const Parcel = require('../entities/parcel.js')
const alchemicaTokens = ['apple', 'pie']

const parcelTypes = [
    { size: 'humble', width: 8, height: 8 },
    { size: 'reasonable', width: 16, height: 16 },
    { size: 'spacious', width: 32, height: 64 },
    { size: 'paartner', width: 64, height: 64 }
]

test('Tape is working', (t) => { t.true(true); t.end(); });
test('Parcel.create', (t) => {
    let p = Parcel.create(parcelTypes[0].size)
    t.equal(p.installations.length, 0, 'New parcel should not have any installations')
    parcelTypes.forEach((type) => {
        let p = Parcel.create(type.size)
        t.equal(p.size, type.size, `p.size == ${type.size}`)
        t.equal(p.width, type.width, `p.width == ${type.width}`)
        t.equal(p.height, type.height, `p.height == ${type.height}`)
    })
    t.throws(() => Parcel.create('not_a_valid_size'), 'invalid parcel size should throw')   
    t.end()
})
test('Parcel.addAlchemica', (t) => {
    let p = Parcel.create(parcelTypes[0].size)
    alchemicaTokens.forEach((token) => {
        let p2 = Parcel.addAlchemica(p, token, 100)
        t.equal(p2.tokens[token], 100)
        let p3 = Parcel.addAlchemica(p2, token, 150)
        t.equal(p3.tokens[token], 250)
    })
    t.end()
})
test('Parcel.removeAlchemica', (t) => {
    let p = Parcel.create(parcelTypes[0].size)
    alchemicaTokens.forEach((token) => {
        let p2 = Parcel.addAlchemica(p, token, 100)
        t.equal(p2.tokens[token], 100)
        let p3 = Parcel.removeAlchemica(p2, token, 100)
        t.equal(p3.tokens[token], 0)
    })
    t.throws(() => Parcel.removeAlchemica(p, alchemicaTokens[0], 100), 'trying to remove more than what is available should throw')   
    t.end()
})
test('Parcel.addInstallation', (t) => {
    parcelTypes.forEach( (parcelType) => {
        const quarterSizeInstallation = { width: parcelType.width / 2, height: parcelType.height / 2 }
        const halfSizeInstallation = { width: parcelType.width / 2, height: parcelType.height }
        const tooWideInstallation = { width: parcelType.width + 1, height: 0 }
        const tooTallInstallation = { width: 0, height: parcelType.height + 1 }
        let p = Parcel.addInstallation(Parcel.create(parcelType.size), quarterSizeInstallation)
        t.deepEqual(p.installations[0], quarterSizeInstallation, 'parcel installation matches')
        let p2 = Parcel.addInstallation(p, halfSizeInstallation)
        t.equals(p.installations.length, 2, 'parcel has two installations')
        t.deepEqual(p.installations[1], halfSizeInstallation, 'new installation was appended')
        t.throws(() => Parcel.addInstallation(p2, halfSizeInstallation), 'equipping installation without adequate space throws') 
        t.throws(() => Parcel.addInstallation(p, tooWideInstallation), 'equipping installation that is too wide throws') 
        t.throws(() => Parcel.addInstallation(p, tooTallInstallation), 'equipping installation that is too tall throws') 
    })
    t.end()
})
test('Parcel.removeInstallation', (t) => {
    const i1 = { width: 1, height: 1 }
    const i2 = { width: 2, height: 2 }
    let p = Parcel.create(parcelTypes[0].size)
    let p2 = Parcel.addInstallation(p, i1)
    let p3 = Parcel.addInstallation(p2, i2)
    let p4 = Parcel.removeInstallation(p3, 0)
    t.equals(p4.installations.length, 1, 'one installation remains')
    t.deepEqual(p4.installations[0], i2, 'remaining installation is the second one we added')
    t.throws(() => Parcel.removeInstallation(Parcel.create(parcelTypes[0].size), 0), 'adding too high of an installation index throws')
    t.throws(() => Parcel.removeInstallation(p, -1), 'removing too low of an installation index throws')
    t.end()
})