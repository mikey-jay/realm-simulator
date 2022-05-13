const test = require('tape');
const Wallet = require('../entities/wallet.js')

test('Tape is working', (t) => { t.true(true); t.end(); });

test('Wallet.startTransaction', (t) => {
    const w = Wallet.create()
    t.equal(w.transactions.length, 0, 'new wallet has no transactions')
    const w2 = Wallet.startTransaction(w)
    t.equal(w2.transactions.length, 1, 'has a single transaction')
    const w3 = Wallet.addTokens(w2, 'a_token', 10)
    t.equal(w3.transactions.length, 1, 'still has a single transaction')
    const w4 = Wallet.addTokens(w2, 'a_token', 20)
    t.equal(w4.transactions[0].tokens.a_token, 30, 'transaction totals tokens')
    const w5 = Wallet.addTokens(Wallet.startTransaction(w4), 'b_token', 50)
    t.equal(w5.transactions[1].tokens.b_token, 50, 'new transaction has the new token')
    t.equal(typeof w5.transactions[1].tokens.a_token, 'undefined', 'new transaction does not have the old token')
    const i = { type: 'altar' }
    const w6 = Wallet.removeInstallation(Wallet.addInstallation(w5, i), 0)
    t.deepEqual(w6.transactions[1].installationsRemoved[0], i, 'installations removed appear in installationsRemoved')
    t.end()
})

