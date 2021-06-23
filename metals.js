const axios = require('axios')
const cheerio = require('cheerio');
var moment = require('moment');
async function getResult(metal,date){
  const url = 'https://www.westmetall.com/en/markdaten.php?action=table&field=LME_'+encodeURIComponent(metal)+'_cash'
  axios.get(url).then((response) => {
    const $ = cheerio.load(response.data);
    const txt = $('tbody').text()
    const textArray = txt.split('\n').filter((item)=>{
      if(isNaN(Number.parseInt(item.substring(0,1)))===false) {
             return item;
      }
    })
    const finalArray = [];
    for(i=0;i<textArray.length;){
      let obj = {date:textArray[i],
          LME_Cash_Settlement:textArray[i+1],
          LME_3_month:textArray[i+2]}
      finalArray.push(obj);
      i = i+4
    }
    parseArray(finalArray);
    const obj = findUsingData(finalArray,date)
    return obj;
  })
}

  function parseArray(array){
    array.forEach(item=>{
      item.date = parseData(item.date);
      item.LME_Cash_Settlement = Number(item.LME_Cash_Settlement.replace(/,/g,''));
      item.LME_3_month = Number(item.LME_3_month.replace(/,/g,''));
    })
    return array;
  }

  function parseData(data){
    var day = moment(data,"DD-MMM-YYYY");
    var newDay = moment(day).format("DD.MM.YYYY"); 
    return newDay;
  }

  function findUsingData(array,date){
    let obj = {};
    array.forEach(item=>{
      if(date===item.date){
        obj = item;
      }
    })
    return obj;
  }

module.exports = getResult;