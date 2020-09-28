const express = require('express');
const router =  express.Router();
const mysql = require('../conexao/mysql').pool;


router.get('/', (req,res,next) => {
res.status(200).send({mensagem: "usando o GET dentro da rota clientes"})
});

router.post('/',(req,res,next) =>{
console.log(mysql);
//inserir na tabela cidade e depois na cliente	

	mysql.getConnection((error, conn)=>{
		conn.query(
			"INSERT INTO Cliente (nome_completo, sexo, data_nascimento, idade, cidade,estado) VALUES(?,?,?,?,?,?)",
			[req.body.nome_completo,req.body.sexo,req.body.data_nascimento,req.body.idade,req.body.cidade,req.body.estado],
			(error, resultado, field) =>{
				conn.release();
				if(error){
					res.status(500).send({
						error: error,
						response: null	
					});
				}
				res.status(201).send({
					mensagem: "Cliente inserido com uscesso.",
					id_cidade : resultado.id_cidade
				});
			}
		)
	});

});



router.delete('/',(req,res,next) =>{
	res.status(200).send({mensagem: "usando o delete dentro da rota clientes"})
});

module.exports = router;