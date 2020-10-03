var express = require("express");
const app =express();
const bodyParser = require("body-parser");
const rotaCliente = require("./routes/clientes/clientes");
const rotaCidade = require("./routes/cidades/cidades");



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((res, req ,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Header',
				'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
	);
	if(req.method =="OPTIONS"){
		res.header('Acces-Control-Methods','PUT, POST, PATCH, DELETE, GET');
		return res.status(200).send({});
	}
	next()
});

app.use("/clientes",rotaCliente);
app.use("/cidades",rotaCidade);

app.use((res,req,next)=>{
	const error =  new Error("Nao funcionou");
	error.status="404"
	next(error.message);
});



app.use((res,req,next)=>{
	res.status(error.status || 500)
	return res.send({error: {mensagem: error.message}})
});

app.listen(8080, function(){console.log("servidor rodando em "+process.env.SERVER_HOST+":"+ process.env.SERVER_PORT)});
