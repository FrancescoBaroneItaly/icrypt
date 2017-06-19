module.exports = function(RED) {
	"use strict";
	var xxtea = require("xxtea-node");

    function ICryptNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.on('input', function(msg) {

			var str = msg.payload;

			var key;
			if (typeof this.credentials.key != 'undefined')key = this.credentials.key;
			if (typeof msg.pairkey != 'undefined'){

				key = msg.pairkey;
				msg.pairkey="";
				}

			msg.rc=0;

			//console.log("CRYPT KEY = "+key);
			if (typeof key == 'undefined' || key==""){

				msg.rc=-2;
				msg.payload=-2;

			}else{

				msg.payload = [];
				/*
				AUTO convert #future
				var type_encrypt_data = xxtea.encrypt(xxtea.toBytes(typeof str), xxtea.toBytes(key));
				msg.payload.push(new Buffer(type_encrypt_data).toString('base64'));
				*/

				if (typeof str === 'object' || str instanceof Object){

					str = JSON.stringify(str);
					}

				if (typeof str === 'boolean' || str instanceof Boolean){

					str = str.toString();
					}

				if (typeof str === 'number' || str instanceof Number){

					str = str.toString();
					}

				if(str.length>8){

					var i=0;
					for(i=0;i<(str.length-8);i+=8){

						var substr = str.substring(i,i+8);
						var encrypt_data = xxtea.encrypt(xxtea.toBytes(substr), xxtea.toBytes(key));

						msg.payload.push(new Buffer(encrypt_data).toString('base64'));
						}

					if( (str.length - i)>0){

						var substr = str.substring(i);
						var encrypt_data = xxtea.encrypt(xxtea.toBytes(substr), xxtea.toBytes(key));

						msg.payload.push(new Buffer(encrypt_data).toString('base64'));
						}

				}else{

					var encrypt_data = xxtea.encrypt(xxtea.toBytes(str), xxtea.toBytes(key));
					msg.payload.push(new Buffer(encrypt_data).toString('base64'));
					}
				}

            //msg.payload = config.key;
            node.send(msg);
        	});
    }
    RED.nodes.registerType("icrypt",ICryptNode,{
        credentials: {
		    key: {type: "password"}
        	}
		});
}