import { sleep } from './util.js';
import Card from './model/card.js';
import ExcelAdapter from './model/excel-adapter.js';
import cheerio from 'cheerio';
import axios from 'axios';

const BASE_URL = `https://www.ligapokemon.com.br/?view=cards/search&card=&page=`
const excel = new ExcelAdapter('PokemonCards.xlsx');

let numberOfPagesProcessed = 0;

getNumberOfPages()
	.then(async (numberOfPages) => {
		for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
			const pageUrl = BASE_URL.concat(pageNumber);
			processPage(pageUrl);
		}
		
		while (numberOfPagesProcessed != numberOfPages) {
			console.log(`${numberOfPagesProcessed} pages processed of ${numberOfPages}`);
			await sleep(500);	
		}
		
		excel.saveFile();
		console.log(`Completed successfully!`);
	})
	
function processPage(pageUrl) {
	axios.get(pageUrl)
		.then((response) => {
			const $ = cheerio.load(response.data);
			const cardsTableRows = $('#cotacao-busca > tbody > tr');
			
			for(let rowIndex = 0; rowIndex < cardsTableRows.length; rowIndex++) {
				const row = cardsTableRows.get(rowIndex);
				processRow(row);
			}
			
			numberOfPagesProcessed++;
		}).catch(function (e) {
			console.log(`############### ERROR ###############`);
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
	excel.addCard(card);
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
	const firstPageUrl = BASE_URL.concat(1);
	
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