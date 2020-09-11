// ==UserScript==
// @name         Bot for Yandex (ekav)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  поиск в Яндекс по заданным словам
// @author       ekav
// @match        https://yandex.ru/*
// @grant        none
// ==/UserScript==


let keywords = ['lego duplo','лего дупло детский мир', 'лего на 2 года'];
let keyword = keywords[getRandom(0,keywords.length)];
let btnK = document.querySelectorAll(".button_theme_websearch")[0];

if (btnK != undefined){
    document.getElementById('text').value = keyword;
    btnK.click();
}else{
    let links = document.links;

    for(let i=0; i<links.length; i++){
        if(links[i].href.indexOf("www.detmir.ru/catalog/index/name/lego_duplo/") != -1){
            console.log("Ссылка найдена "+links[i]);
            links[i].removeAttribute("target");
            links[i].click();
            break;
        }
    }
}

function getRandom(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}
