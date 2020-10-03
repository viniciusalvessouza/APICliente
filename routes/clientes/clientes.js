const express = require('express');
const router =  express.Router();
const mysql = require('../../conexao/mysql').pool;

router.get('/', (req,res,next) => {
	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"SELECT id_cliente, nome_completo, sexo, data_nascimento, idade, id_cidade, nome,estado FROM (Cliente, Cidade)  WHERE cidade = id_cidade",
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});};
				const response ={
					quantidade: result.length,
					clientes: result.map(cliente =>{
						return{
							id_cliente: cliente.id_cliente,
							nome_completo: cliente.nome_completo ,
							sexo: cliente.sexo ,
							data_nascimento: cliente.data_nascimento ,
							idade: cliente.idade,
							id_cidade: cliente.id_cidade,
							cidade: cliente.nome,
							estado: cliente.estado, 
						request: {
							tipo:"GET",
							descricao:"retorna clientes",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/clientes/${cliente.id_cliente}`
						}
						}
					})
				};
			return res.status(200).send({response:response});					
			}
		)
	});

});

router.get('/id/:id', (req,res,next) => {
	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"SELECT * FROM Cliente WHERE id_cliente = ? ",
			[req.params.id],
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});}
				const response = {
					mensagem: `resultado de busca para o id ${req.params.id} encontrado.`,
					cliente:{
						id_cliente: result,
							nome_completo: req.body.nome_completo ,
							sexo: req.body.sexo ,
							data_nascimento: req.body.data_nascimento ,
							idade: req.body.idade,
							cidade: req.body.cidade,
							estado: req.body.estado, 
						request: {
							tipo:"POST",
							descricao:"busca de cliente pelo id",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/clientes/`
						}
					}
				}
				if(result.length ==0){
				return res.status(404).send({message:"Cliente nao encontrado para o id "+req.params.id});					
			}			
				return res.status(200).send({response:response});					
			}
		)
	});

});

router.get('/nome/:nome', (req,res,next) => {
	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"SELECT * FROM Cliente WHERE nome_completo= ? ",
			[req.params.nome],
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});}
				const response = {
					mensagem:  `${result.length} resultados de busca para o nome ${req.params.nome} encontrados.`,
					cliente:{
						id_cliente: result,
							nome_completo: req.body.nome_completo ,
							sexo: req.body.sexo ,
							data_nascimento: req.body.data_nascimento ,
							idade: req.body.idade,
							cidade: req.body.cidade,
							estado: req.body.estado, 
						request: {
							tipo:"POST",
							descricao:"busca de cliente pelo nome",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/clientes/`
						}
					}
				}
				if(result.length ==0){
				return res.status(404).send({message:`Cliente nao encontrado para o nome ${req.params.id}`});					
			}			
				return res.status(200).send({response:response});					
			}
		)
	});

});

router.post('/',(req,res,next) =>{

	mysql.getConnection((error, conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"INSERT INTO Cliente (nome_completo, sexo, data_nascimento, idade, cidade) VALUES(?,?,?,?,?);",
			[req.body.nome_completo,req.body.sexo,req.body.data_nascimento,req.body.idade,req.body.cidade],
			(error, result, field) =>{
				conn.release();
				if(error) {return res.status(500).send({error: error});}
				const response = {
					mensagem: "Cliente inserido com sucesso.",
					clienteCriado:{
						id_cliente: result.insertId,
							nome_completo: req.body.nome_completo ,
							sexo: req.body.sexo ,
							data_nascimento: req.body.data_nascimento ,
							idade: req.body.idade,
							cidade: req.body.cidade,
							estado: req.body.estado, 
						request: {
							tipo:"POST",
							descricao:"cliente inserido",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/clientes/`
						}
					}
				}
				res.status(201).send({response:response});
			}
		)
	});

});

router.patch('/',(req,res,next)=>{

	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"UPDATE Cliente SET nome_completo = ? WHERE id_cliente = ?",
			[req.body.nome_completo,req.body.id_cliente],
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});}
				const response = {
					mensagem: "Cliente atualizado com sucesso.",
					clienteCriado:{
						id_cliente: req.body.id_cliente,
							nome_completo: req.body.nome_completo ,
							sexo: req.body.sexo ,
							data_nascimento: req.body.data_nascimento ,
							idade: req.body.idade,
							cidade: req.body.cidade,
							estado: req.body.estado, 
						request: {
							tipo:"PATCH",
							descricao:"cliente atualizado",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/clientes/${req.body.id_cliente}`
						}
					}
				}
			
				return res.status(202).send({response:response});					
			}
		)
	});
	
});

router.delete('/',(req,res,next) =>{
	mysql.getConnection((error,conn)=>{
		if(error) {return res.status(500).send({error: error});}
		conn.query(
			"DELETE FROM Cliente WHERE id_cliente = ?",
			[req.body.id_cliente],
			(error,result,fields)=>{
				if(error) {return res.status(500).send({error: error});}
				const response = {
					mensagem: "Cliente removido com sucesso.",
					clienteCriado:{
						id_cliente: result,
							nome_completo: req.body.nome_completo ,
							sexo: req.body.sexo ,
							data_nascimento: req.body.data_nascimento ,
							idade: req.body.idade,
							cidade: req.body.cidade,
							estado: req.body.estado, 
						request: {
							tipo:"POST",
							descricao:"cliente removido",
							url:`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/clientes/`
						}
					}
				}
			
				return res.status(202).send({response:result});					
			}
		)
	});
});

module.exports = router;