"use strict";
var should = require('should');
var co  = require('co');
var nacl   = require('tweetnacl');
var base58 = require('../../../app/lib/crypto/base58');
var keyring      = require('../../../app/lib/crypto/keyring');

var enc = nacl.util.encodeBase64,
    dec = nacl.util.decodeBase64;

var passphrase = "abc";
var salt = "abc";
var pub, sec, rawPub, rawSec;

before(() => co(function*() {
  // Generate the keypair
  const keyPair = yield keyring.scryptKeyPair(salt, passphrase);
  pub = base58.decode(keyPair.publicKey);
  sec = base58.decode(keyPair.secretKey);
  rawPub = base58.encode(pub);
  rawSec = base58.encode(sec);
}));

describe('ed25519 tests:', function(){

  //it('good signature from existing secret key should be verified', function(done){
  //  var keys = nacl.sign.scryptKeyPair.fromSecretKey(dec("TM0Imyj/ltqdtsNG7BFOD1uKMZ81q6Yk2oz27U+4pvs9QBfD6EOJWpK3CqdNG368nJgszy7ElozAzVXxKvRmDA=="));
  //  var msg = "cg==";
  //  var goodSig = dec("52Hh9omo9rxklulAE7gvVeYvAq0GgXYoZE2NB/gzehpCYIT04bMcGIs5bhYLaH93oib34jsVMWs9Udadr1B+AQ==");
  //  var sig = crypto.signSync(msg, keys.secretKey);
  //  sig.should.equal(enc(goodSig));
  //  crypto.verify(msg, sig, enc(keys.publicKey)).should.be.true;
  //  done();
  //});

  it('good signature from generated key should be verified', function(done){
    var msg = "Some message to be signed";
    var sig = keyring.Key(rawPub, rawSec).signSync(msg);
    var verified = keyring.verify(msg, sig, rawPub);
    verified.should.be.true;
    done();
  });

  it('wrong signature from generated key should NOT be verified', function(done){
    var msg = "Some message to be signed";
    var cor = dec(enc(msg) + 'delta');
    var sig = keyring.Key(rawPub, rawSec).signSync(msg);
    var verified = keyring.verify(cor, sig, rawPub);
    verified.should.be.false;
    done();
  });
});
