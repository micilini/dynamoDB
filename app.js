//Aplicativo de Testes do DynamoDB

var http = require('http');//Configurações do HTTP

/* CONFIGURAÇÕES DO DYNAMODB */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'nome_da_tabela';
var user_id = 'id_do_usuario';
var user_name = 'nome_do_usuario';

/* START DO SERVIDOR */

var server = http.createServer( function(req, res){
	
	/* Inicializando o Servidor */
	
	console.log("Servidor Inicializado");
	
	/* Teste de Envio (Requisição PUT) */
	
	console.log("Preparando uma requisição PUT ao DynamoDB");
	
	let item = {'user_id': user_id, 'user_name': user_name};
	
	docClient.put({
        TableName: tableName,
        Item: item
    }, (err, data)=>{
        if(err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            });
        } else {
            return res.status(200).send(item);
        }
    });

    console.log("Uma requisição de PUT acaba de ser enviada ao DynamoDB");
	
	/* Teste de Seleção (Requisição GET) */
	
	console.log("Preparando uma requisição GET ao DynamoDB");
	
	let user_id = user_id;
    let params = {
        TableName: tableName,
        IndexName: "user_id-index",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id
        },
        Limit: 1
    };

    docClient.query(params, (err, data)=>{
        if(err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            });
        } else {
            if(!_.isEmpty(data.Items)) {
                return res.status(200).send(data.Items[0]);
            } else {
                return res.status(404).send();
            }
        }
    });
	
	console.log("Uma requisição de GET acaba de ser enviada e retornada ao DynamoDB");
	
	/* Teste de Remoção (Requisição DELETE) */
	
	console.log("Preparando uma requisição DELETE ao DynamoDB");
	
	let timestamp = 2021;
    let params = {
        TableName: tableName,
        Key: {
            user_id: user_id,
            timestamp: timestamp
        }
    };

    docClient.delete(params, (err, data)=>{
        if(err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            });
        } else {
            return res.status(200).send();
        }
    });
	
	console.log("Uma requisição de DELETE acaba de ser enviada ao DynamoDB");


});

server.listen(3000);