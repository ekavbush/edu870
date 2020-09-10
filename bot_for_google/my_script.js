// ==UserScript==
// @name         Bot for google (ekav)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  поиск в google по заданным словам!
// @author       ekav
// @match        https://www.google.com/*
// @grant        none
// ==/UserScript==

let keywords = ['lego duplo','лего дупло детский мир', 'лего на 2 года'];
let keyword = keywords[getRandom(0,keywords.length)];
let btnK = document.getElementsByName('btnK')[0];

if (btnK != undefined){
    document.getElementsByName('q')[0].value = keyword;
    document.getElementsByName('btnK')[0].click();
}else{
    let links = document.links;

    for(let i=0; i<links.length; i++){
        if(links[i].href.indexOf("www.detmir.ru/catalog/index/name/lego_duplo/") != -1){
            console.log("Ссылка найдена "+links[i]);
            links[i].click();
            break;
        }
    }
}

function getRandom(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}
