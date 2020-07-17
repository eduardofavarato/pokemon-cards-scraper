const cheerio = require('cheerio');
const axios = require('axios');
var excel = require('excel4node');
	  
const baseUrl = `https://www.ligapokemon.com.br/?view=cards/search&card=&page=`

let workbook = new excel.Workbook();
let worksheet = workbook.addWorksheet('Cards');

const headerStyle = workbook.createStyle({
	font: {
		bold: true,
		  color: '#000000',
		  size: 14
	}
});

const valueStyle = workbook.createStyle({
	font: {
	  color: '#000000',
	  size: 12
	}
});

let excelLine = 1;
writeExcelHeaders(worksheet);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

getNumberOfPages()
	.then(async (numberOfPages) => {
		for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
			console.log(`Processing page ${pageNumber} of ${numberOfPages}`);
			
			const pageUrl = baseUrl.concat(pageNumber);
			await processPage(pageUrl);
		}
		workbook.write('PokemonCards.xlsx');
		console.log(`Completed successfully!`);
	})

async function processPage(pageUrl) {
	await axios.get(pageUrl)
		.then((response) => {
			const $ = cheerio.load(response.data);
			const cardsTableRows = $('#cotacao-busca > tbody > tr');
			
			for(let rowIndex = 0; rowIndex < cardsTableRows.length; rowIndex++) {
				const row = cardsTableRows.get(rowIndex);
				processRow(row);
            }
		}).catch(function (e) {
			console.log("############### ERROR ###############");
			console.log(e);
		});	
}

function processRow(row) {
	const row$ = cheerio.load(row);
	const columns = row$('td');
	
	const set = extractInfoFromImageElement(columns.get(0));
	const name = extractInfoFromParagraphElement(columns.get(1));
	const rarity = extractInfoFromImageElement(columns.get(2));
	const type = extractInfoFromImageElement(columns.get(3));
	const lowestPrice = extractInfoFromParagraphElement(columns.get(4));
	const averagePrice = extractInfoFromParagraphElement(columns.get(5));
	const highestPrice = extractInfoFromParagraphElement(columns.get(6));
	
	const card = new Card(set, name, rarity, type, lowestPrice, averagePrice, highestPrice);
	card.writeToExcel(worksheet);
}

function extractInfoFromImageElement(imageElement) {
	const imageElement$ = cheerio.load(imageElement);
	const image = imageElement$('img').get(0);
	
	return image 
		? image.attribs['title']
		: '';
}

function extractInfoFromParagraphElement(paragraphElement) {
	const paragraphElement$ = cheerio.load(paragraphElement);
	return paragraphElement$('p').text();
}

function getNumberOfPages() {
	const firstPageUrl = baseUrl.concat(1);
	
	return axios.get(firstPageUrl)
		.then((response) => {
			const $ = cheerio.load(response.data);
			const lastPageLinkObject = $('#paginacao-2 > .brancoP:last-child')[0];
			const lastPageUrl = lastPageLinkObject.attribs['href'];
			const lastPageUrlParams = new URLSearchParams(lastPageUrl);

			return lastPageUrlParams.get('page');
		}).catch(function (e) {
			console.log(e);
			return 0;
		});	
}

function writeExcelHeaders(excelWorksheet) {
	excelWorksheet.cell(excelLine, 1).string("set").style(headerStyle);
	excelWorksheet.cell(excelLine, 2).string("name").style(headerStyle);
	excelWorksheet.cell(excelLine, 3).string("rarity").style(headerStyle);
	excelWorksheet.cell(excelLine, 4).string("type").style(headerStyle);
	excelWorksheet.cell(excelLine, 5).string("lowestPrice").style(headerStyle);
	excelWorksheet.cell(excelLine, 6).string("averagePrice").style(headerStyle);
	excelWorksheet.cell(excelLine, 7).string("highestPrice").style(headerStyle);
	
	excelLine++;
}

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
	
	writeToExcel(excelWorksheet) {
		excelWorksheet.cell(excelLine, 1).string(this.set).style(valueStyle);
		excelWorksheet.cell(excelLine, 2).string(this.name).style(valueStyle);
		excelWorksheet.cell(excelLine, 3).string(this.rarity).style(valueStyle);
		excelWorksheet.cell(excelLine, 4).string(this.type).style(valueStyle);
		excelWorksheet.cell(excelLine, 5).string(this.lowestPrice).style(valueStyle);
		excelWorksheet.cell(excelLine, 6).string(this.averagePrice).style(valueStyle);
		excelWorksheet.cell(excelLine, 7).string(this.highestPrice).style(valueStyle);
		
		excelLine++;
	}
}