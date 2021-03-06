// ==UserScript==
// @name         Google-Yandex Bot (ekav)
// @namespace    http://tampermonkey.net/
// @version      2.0 final release
// @description  try to take over the world!
// @author       ekav
// @match        https://yandex.ru/*
// @match        https://www.google.com/*
// @match        https://my-shop.ru/*
// @match        https://www.toyway.ru/*

// @grant        none
// ==/UserScript==

let my_searchers = { //список поисковиков с индивидуальными параметрами верстки каждого
    //в массиве передаем параметры для каждого поисковика:
    //[0] - как искать поле ввода ключевых слов на главной странице
    //[1] - как искать кнопку Поиск на главной странице
    //[2] - как найти номер текущей страницы результатов поиска
    //[3] - кнопка Следующий-Далее на не первых страницах результатов поиска

    "yandex.ru":[document.getElementById('text'),document.querySelectorAll(".button_theme_websearch")[0],document.querySelector('.pager__item_current_yes'),document.querySelectorAll('.pager__item_kind_next')[0]],
    "www.google.com":[document.getElementsByName('q')[0],document.getElementsByName('btnK')[0],document.querySelector('.YyVfkd'),document.getElementById('pnnext')]
};

let my_searcher; //текущий поисковик

let who = Object.keys(my_searchers).indexOf(location.host); //найти в списке поисковиков, того, кто запустил бота
if (who != -1){ //значит бота запустил поисковик
    my_searcher = Object.keys(my_searchers)[who];
}else{//значит бота запустила прокликиваемая страница и посковик надо выбрать случ образом
    my_searcher = Object.keys(my_searchers)[getRandom(0,Object.keys(my_searchers).length)]; //поисковая система случайным образом
}
let searcherParams = my_searchers[my_searcher];

//console.log("страница запуска = "+location.host+" my_searcher="+my_searcher);
//console.log("в списке поисковиков нашли = "+Object.keys(my_searchers)[who]);

let btnK = searcherParams[1];
let searcherInput = searcherParams[0];
let numOfCurrentPage = searcherParams[2];
let btnKnext = searcherParams[3];

let i = 0;
let links = document.links;

//console.log("параметры: "+my_searcher);

let sites = { //список сайтов с ключевыми словами для каждого
    "www.toyway.ru":['радиоуправляемый танк','робокар поли игрушка','детская железная дорога купить'],
    "my-shop.ru":['lego duplo','лего дупло my shop', 'лего на 2 года','барабан купить']
};

let site = Object.keys(sites)[getRandom(0,Object.keys(sites).length)]; //конкретный сайт, выбранный случайным образом из списка

let keywords = sites[site]; //ключевые слова конкретного сайта
let keyword = keywords[getRandom(0,keywords.length)]; //случайное из ключевых слов

//console.log("тут сайт в начале "+site);
//console.log("тут keyword в начале "+keyword);

if (btnK != undefined){
    //если на сайте поисковика и запустили поиск, надо записать наш случайный сайт в cookie
    //(тот сайт, который будем искать в результатах поиска)
    document.cookie = "site="+site;
}else if (location.hostname == my_searcher){
    //если после "хождений" вернулись на сайт поисковика,
    //взять наш случайный сайт из кукиз (тот сайт, который будем искать)
    site = getCookie("site");
}else{
    //если зашли на конкретный сайт, то его и исследуем
    //с cookie не общаемся
    site = location.hostname;
}
// разобрались, как не потерять сайт. идем дальше

//console.log("сайт:"+site);

if (btnK != undefined){ //начальная страница поисковика
    let timerId = setInterval(()=>{
        searcherInput.value += keyword[i];
        i++;
        if (i==keyword.length){
            clearInterval(timerId);
            btnK.click();
        }
    },1000);
}else if(location.host == site){ //пришли на искомую страницу
    setInterval(()=>{
        let cur_index = getRandom(0,links.length);
        if (getRandom(0,101)>=70){ //уже достаточно походили, возвращаемся в поисковик
            location.href = "https://"+my_searcher;
        }
        else if (links[cur_index].href.indexOf(site) != -1) { // ходим по странице, которую накликиваем
            links[cur_index].click();
        }
    },getRandom(3000,7000));
}
else{ //ходим по страницам поисковика с результатами поиска,
    //либо до 10й страницы, либо до нужного сайта
    let nextSPage = true;
    for(let i=0; i<links.length; i++){
        if(links[i].href.indexOf(site) != -1){
            let link = links[i];
            nextSPage = false;
            setTimeout(()=>{
                links[i].removeAttribute("target"); //для Google можно оставить, так как
                //Попытка удаления аттрибута, которого нет на элементе не вызывает ошибки
                link.click();
            },getRandom(1000,4000));
            break;
        }
    }

    if (numOfCurrentPage.innerText=="10"){
        //document.querySelector('.pager__item_current_yes') - номер текущей страницы в Яндексе
        nextSPage = false;
        location.href = "https://"+my_searcher;
    }

    if (nextSPage){
        //document.querySelectorAll('.pager__item_kind_next')[0] - Слово "Дальше" в Яндексе
        setTimeout(()=>{btnKnext.click();},getRandom(1000,4000));
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
