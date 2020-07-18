let util = {};

util.sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

util.handleAttempts = (attemptNumber) => {
	if (attemptNumber == 5){
		console.log(`Ocorreu um erro ao conectar com o website ligapokemon.com. Entre em contato com o desenvolvedor.`)
		process.exit();	
	} 
}

module.exports = util;