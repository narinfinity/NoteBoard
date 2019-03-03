//.bitcore/bitcoreInit.js
(function (b) {
    b.init = function () {
        var bitcore = require('bitcore');
        var pass = "John Doe";
        var privateKey = new PrivateKey(pass);
        var publicKey = new PublicKey(privateKey);        
        var address = publicKey.toAddress(Networks.livenet);
        console.log(address.toString());
    };

})(module.exports);