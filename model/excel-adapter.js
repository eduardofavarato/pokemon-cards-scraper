const excel = require('excel4node');

class ExcelAdapter {
	constructor(filename) {
		this.filename = filename;
		this.workbook = new excel.Workbook();
		this.worksheet = this.workbook.addWorksheet('Cards');
		this.currentLine = 1;
		
		this.headerStyle = this.workbook.createStyle({
			font: {
				bold: true,
				color: '#000000',
				size: 14
			}
		});
		
		this.valueStyle = this.workbook.createStyle({
			font: {
			  	color: '#000000',
			  	size: 12
			}
		});
		
		this.addHeaders();
	}
	
	addHeaders() {
		this.worksheet.cell(this.currentLine, 1).string('Set').style(this.headerStyle);
		this.worksheet.cell(this.currentLine, 2).string('Name').style(this.headerStyle);
		this.worksheet.cell(this.currentLine, 3).string('Rarity').style(this.headerStyle);
		this.worksheet.cell(this.currentLine, 4).string('Type').style(this.headerStyle);
		this.worksheet.cell(this.currentLine, 5).string('Lowest Price').style(this.headerStyle);
		this.worksheet.cell(this.currentLine, 6).string('Average Price').style(this.headerStyle);
		this.worksheet.cell(this.currentLine, 7).string('Highest Price').style(this.headerStyle);
		
		this.currentLine++;
	}
	
	saveFile() {
		this.workbook.write(this.filename);
	}
	
	addCard(card) {
		this.worksheet.cell(this.currentLine, 1).string(card.set).style(this.valueStyle);
		this.worksheet.cell(this.currentLine, 2).string(card.name).style(this.valueStyle);
		this.worksheet.cell(this.currentLine, 3).string(card.rarity).style(this.valueStyle);
		this.worksheet.cell(this.currentLine, 4).string(card.type).style(this.valueStyle);
		this.worksheet.cell(this.currentLine, 5).string(card.lowestPrice).style(this.valueStyle);
		this.worksheet.cell(this.currentLine, 6).string(card.averagePrice).style(this.valueStyle);
		this.worksheet.cell(this.currentLine, 7).string(card.highestPrice).style(this.valueStyle);
		
		this.currentLine++;
	}
}

module.exports = ExcelAdapter