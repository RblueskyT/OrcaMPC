window.sodium = {
    onload: function (sodium) {
        
        let newKeyPair = sodium.crypto_box_keypair();
        var newPublicKey = newKeyPair.publicKey;
        var newPrivateKey = newKeyPair.privateKey;
        var input_public = document.getElementById("publicKey");
        var input_private = document.getElementById("privateKey");

        if (input_public && input_private) {
            input_public.setAttribute("value", newPublicKey);
            input_private.setAttribute("value", newPrivateKey);
        }

    }
};