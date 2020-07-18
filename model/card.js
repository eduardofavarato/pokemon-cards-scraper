class Card {
	constructor(set, name, rarity, type, lowestPrice, averagePrice, highestPrice) {
		this.set = set;  
		this.name = name;  
		this.rarity = rarity;  
		this.type = type;  
		this.lowestPrice = lowestPrice;  
		this.averagePrice = averagePrice;  
		this.highestPrice = highestPrice; 
	}
	
	print() {
		console.log(`Set: ${this.set}`);
		console.log(`Name: ${this.name}`);
		console.log(`Rarity: ${this.rarity}`);
		console.log(`Type: ${this.type}`);
		console.log(`Lowest Price: ${this.lowestPrice}`);
		console.log(`Average Price: ${this.averagePrice}`);
		console.log(`Highest Price: ${this.highestPrice}`);
		console.log(`__________________________________`);
	}
}

module.exports = Card;