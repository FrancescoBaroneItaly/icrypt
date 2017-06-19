module.exports = function(RED) {
	"use strict";
	var xxtea = require("xxtea-node");

    function IDeCryptNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.on('input', function(msg) {

			var str_array = msg.payload;
			//var key = config.key;
			var key;
			if (typeof this.credentials.key != 'undefined')key = this.credentials.key;
			if (typeof msg.pairkey != 'undefined'){

				key = msg.pairkey;
				msg.pairkey="";
				}

			msg.rc=0;

			//console.log("DECRYPT KEY = "+key);
			if (typeof key == 'undefined'  || key=="" ){

				msg.rc=-2;
				msg.payload=-2;

			}else{

				try {

					var dato_type = "";
					var dato = "";

					var arrayLength = str_array.length;
					//console.log(arrayLength);
					for (var i = 0; i < arrayLength; i++) {

						var encrypt_data = str_array[i].toString();

						var decrypt_data = xxtea.toString(xxtea.decrypt(encrypt_data, xxtea.toBytes(key)));

						dato=dato.concat(decrypt_data);
						/*
						AUTO convert #future
						if(i==0){
							dato_type=decrypt_data;
						}else{
							dato=dato.concat(decrypt_data);
							}
						*/
						}

					msg.payload = dato;
					/*
					AUTO convert #future
					if(dato_type == "boolean"){

						msg.payload = (dato.toLowerCase() === 'true');
						}

					if(dato_type == "string"){

						msg.payload = dato;
						}

					if(dato_type == "number"){

						msg.payload = Number(dato);
						}

					if(dato_type == "object"){

						msg.payload = JSON.parse(dato);
						}
					*/

				} catch (e) {

					msg.rc=-1;
					msg.payload = -1;
					console.log("I'm not able to decrypt data");
					//throw new Error('Invalid Key');
					}

				}
            //msg.payload = config.key;
            node.send(msg);
        	});
    }
    RED.nodes.registerType("idecrypt",IDeCryptNode,{
        credentials: {
		    key: {type: "password"}
        	}
		});
}