// ==UserScript==
// @name         Bot for Yandex (ekav)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  поиск в Яндекс по заданным словам
// @author       ekav
// @match        https://yandex.ru/*
// @match        https://www.detmir.ru/*
// @match        https://www.toyway.ru/*
// @grant        none
// ==/UserScript==

let sites = { //список сайтов с ключевыми словами для каждого
    "www.toyway.ru":['радиоуправляемый танк','робокар поли игрушка','детская железная дорога купить'],
    "www.detmir.ru":['lego duplo','лего дупло детский мир', 'лего на 2 года','барабан купить']
};

let site = Object.keys(sites)[getRandom(0,Object.keys(sites).length)]; //конкретный сайт, выбранный случайным образом из списка

let keywords = sites[site]; //ключевые слова конкретного сайта
let keyword = keywords[getRandom(0,keywords.length)]; //случайное из ключевых слов

let btnK = document.querySelectorAll(".button_theme_websearch")[0];
let YandexInput = document.getElementById('text');
let i = 0;
let links = document.links;

//если на сайте поисковика и запустили поиск, записать наш случайный сайт в cookie
//тот сайт, который будем искать в результатах поиска
if (btnK != undefined){
    document.cookie = "site="+site;
}else if (location.hostname == "yandex.ru"){
    //если после "хождений" вернулись на сайт поисковика,
    //взять наш случайный сайт из кукиз (тот сайт, который будем искать
    site = getCookie("site");
}else{
    //если зашли на конкретный сайт, то его и исследуем
    //с cookie не общаемся
    site = location.hostname;
}
// разобрались, как не потерять сайт
// идем дальше



if (btnK != undefined){
    document.cookie = "site="+site;
    let timerId = setInterval(()=>{
        YandexInput.value += keyword[i];
        i++;
        if (i==keyword.length){
            clearInterval(timerId);
            btnK.click();
        }
    },1000);
//}else if(location.host == "www.detmir.ru"){ //hostname у detmira не содержит detmir.ru
}else if(location.host.indexOf("detmir.ru") != -1){ //hostname у detmira не содержит detmir.ru
    setInterval(()=>{
        let cur_index = getRandom(0,links.length);
        if (getRandom(0,101)>=70){
            location.href = 'https://yandex.ru/';
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
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
