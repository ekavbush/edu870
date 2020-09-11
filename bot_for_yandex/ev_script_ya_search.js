// ==UserScript==
// @name         Bot for Yandex (ekav)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  поиск в Яндекс по заданным словам
// @author       ekav
// @match        https://yandex.ru/*
// @match        https://www.detmir.ru/*
// @grant        none
// ==/UserScript==


let keywords = ['lego duplo','лего дупло детский мир', 'лего на 2 года','барабан купить'];
let keyword = keywords[getRandom(0,keywords.length)];
let btnK = document.querySelectorAll(".button_theme_websearch")[0];
let YandexInput = document.getElementById('text');
let i = 0;
let links = document.links;

if (btnK != undefined){
    let timerId = setInterval(()=>{
        YandexInput.value += keyword[i];
        i++;
        if (i==keyword.length){
            clearInterval(timerId);
            btnK.click();
        }
    },1000);
}else if(location.host == "www.detmir.ru"){ //hostname у detmira не содержит detmir.ru
    setInterval(()=>{
        let cur_index = getRandom(0,links.length);
        if (getRandom(0,101)>=70){
            location.href = 'https://www.yandex.ru/';
        }
        else if (links[cur_index].href.indexOf("www.detmir.ru") != -1) {
            links[cur_index].click();
        }
    },getRandom(3000,7000));
}else{
    let nextYaPage = true;
    for(let i=0; i<links.length; i++){
        if(links[i].href.indexOf("www.detmir.ru") != -1){
            let link = links[i];
            nextYaPage = false;
            setTimeout(()=>{
                links[i].removeAttribute("target");
                link.click();
            },getRandom(1000,4000));
            break;
        }
    }
    if (document.querySelector('.pager__item_current_yes').innerText=="7"){
        //document.querySelector('.pager__item_current_yes') - номер текущей страницы
        nextYaPage = false;
        location.href = 'https://www.yandex.ru/';
    }

    if (nextYaPage){
        //document.querySelectorAll('.pager__item_kind_next')[0] - Слово "Дальше"
        setTimeout(()=>{document.querySelectorAll('.pager__item_kind_next')[0].click();},getRandom(1000,4000));
    }
}

function getRandom(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}
