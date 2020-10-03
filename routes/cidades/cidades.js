const express = require('express');
const router =  express.Router();
const mysql = require('../../conexao/mysql').pool;

router.get('/', (req,res,next) => {
	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"SELECT * FROM Cidade ",
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});};
				const response ={
					quantidade: result.length,
					cidade: result.map(cidade =>{
						return{
							nome:cidade.nome,
							estado: cidade.estado,
						request: {
							tipo:"GET",
							descricao:"retorna cidades",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/cidades/${cidade.id_cidade}`
						}
						}
					})
				};
			return res.status(200).send({response:response});					
			}
		)
	});

});

router.get('/nome/:nome', (req,res,next) => {
	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"SELECT * FROM Cidade WHERE nome= ? ",
			[req.params.nome],
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});}
				const response = {
					mensagem:  `${result.length} resultados de busca para a cidade ${req.params.nome} encontrados.`,
					cliente:{
						id_cliente: result,
							nome_completo: req.body.nome ,
							estado: req.body.estado, 
						request: {
							tipo:"POST",
							descricao:"busca de cidade pelo nome",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/cidade`
						}
					}
				}
				if(result.length ==0){
				return res.status(404).send({message:`cidade nao encontrado para o nome ${req.params.id}`});					
			}			
				return res.status(200).send({response:response});					
			}
		)
	});

});

router.get('/estado/:estado', (req,res,next) => {
	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"SELECT * FROM Cidade WHERE estado= ? ",
			[req.params.estado],
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});}
				const response = {
					mensagem:  `${result.length} resultados de busca para o esstado ${req.params.estado} encontrados.`,
					cliente:{
						id_cliente: result,
							nome_completo: req.body.nome ,
							estado: req.body.estado, 
						request: {
							tipo:"POST",
							descricao:"busca de estado pelo nome",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/cidade/estado/${req.body.estado}`
						}
					}
				}
				if(result.length ==0){
				return res.status(404).send({message:`estado nao encontrado para o nome ${req.params.id}`});					
			}			
				return res.status(200).send({response:response});					
			}
		)
	});

});

router.post('/',(req,res,next) =>{
	//inserir na tabela cidade e depois na cliente	->paraa fazer
	
		var a = mysql.getConnection((error, conn)=>{
			if(error) {return res.status(500).send({error: error});}
			conn.query(
				"INSERT INTO Cidade (nome,estado) VALUES(?,?)",
				[req.body.nome,req.body.estado],
				(error, result, field) =>{
					conn.release();
					if(error) {return res.status(500).send({error: error});}
					const response = {
						mensagem: "Cidade inserida com sucesso.",
						clienteCriado:{
							id_cliente: result.insertId,
								nome: req.body.nome,
								estado: req.body.estado, 
							request: {
								tipo:"POST",
								descricao:"cidade inserida",
								url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/cidade/`
							}
						}
					}
					res.status(201).send({response:response});
				}
			)
		});
	
	});

module.exports = router;