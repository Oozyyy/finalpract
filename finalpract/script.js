const newsDatabase = [
    { id: 1, category: 'military', radical: false, title: "Обзор тактических перчаток с защитой костяшек. Стоит ли брать?", text: "Сравниваем популярные модели для страйкбола и полигона. Спойлер: дешевые быстро рвутся." },
    { id: 2, category: 'military', radical: false, title: "АКЦИЯ: Плитоносец Скаут со скидкой 30% в армейских магазинах!", text: "Успей купить качественное снаряжение по старой цене. Количество товара ограничено." },
    { id: 3, category: 'military', radical: true, title: "МИР НА ГРАНИ КАТАСТРОФЫ! Срочно закупаем сухпайки и бронежилеты!", text: "Эксперты прогнозируют глобальный конфликт в ближайшие 72 часа. Спасутся только подготовленные." },
    { id: 4, category: 'military', radical: true, title: "Скрытая правда о качестве армейской обуви, которую от нас прячут", text: "Why берцы со склада разваливаются через неделю? Мы провели собственное жесткое расследование." },

    { id: 5, category: 'economy', radical: false, title: "Центробанк снова изменил ключевую ставку. Что будет со вкладами?", text: "Разбираемся, в чем сейчас выгоднее держать рубли: на депозите или под подушкой." },
    { id: 6, category: 'economy', radical: false, title: "Как начать инвестировать, если у тебя есть всего 1000 рублей?", text: "Пошаговый гайд для новичков по покупке акций и облигаций крупных компаний." },
    { id: 7, category: 'economy', radical: true, title: "КРАХ ДОЛЛАРА БЛИЗОК! Мировая финансовая система рухнет завтра!", text: "Покупай крипту и золото, пока не поздно. Банки заблокируют все счета обычных граждан." },
    { id: 8, category: 'economy', radical: true, title: "Секретные крипто-сигналы: как сделать 5000% годовых без риска", text: "Они не хотят, чтобы ты знал эту схему. Уникальный баг в блокчейне делает людей миллионерами." },

    { id: 9, category: 'cats', radical: false, title: "Ученые доказали, что кошачье мурлыканье снижает уровень стресса", text: "Достаточно всего 15 минут в день гладить кота, чтобы нормализовать давление." },
    { id: 10, category: 'cats', radical: false, title: "Топ-5 самых смешных видео с котами за эту неделю", text: "Подборка пушистых неуклюжих созданий, которые поднимут вам настроение на весь день." },
    { id: 11, category: 'cats', radical: true, title: "ЗАГОВОР КОШАЧЬИХ: Как пушистые незаметно поработили человечество", text: "Шок-факты! Они заставили нас убирать за ними лотки и покупать им премиум корм. Мы в ловушке." },
    { id: 12, category: 'cats', radical: true, title: "Отказ от котиков ведет к депрессии и одиночеству: мнение радикальных пушистов", text: "Люди без домашних животных признаны скрытыми социопатами. Кошачья партия требует ввести налог на одиночество." }
];

let userInterests = {
    military: 33,
    economy: 33,
    cats: 34
};

function updateUIBars() {
    document.getElementById('weight-military').style.width = userInterests.military + '%';
    document.getElementById('weight-economy').style.width = userInterests.economy + '%';
    document.getElementById('weight-cats').style.width = userInterests.cats + '%';
}

function triggerRandomEvent() {
    const events = [
        { cat: 'military' },
        { cat: 'economy' },
        { cat: 'cats' }
    ];
    
    if (Math.random() < 0.25) {
        let luckyEvent = events[Math.floor(Math.random() * events.length)];
        userInterests[luckyEvent.cat] += 20;
        updateUIBars();
    }
}

function handleReaction(category, action) {
    let change = action === 'like' ? 15 : -15;

    userInterests[category] += change;

    let otherCategories = Object.keys(userInterests).filter(c => c !== category);
    let halfChange = change / 2;
    
    userInterests[otherCategories[0]] -= halfChange;
    userInterests[otherCategories[1]] -= halfChange;

    for (let cat in userInterests) {
        if (userInterests[cat] < 0) userInterests[cat] = 0;
        if (userInterests[cat] > 100) userInterests[cat] = 100;
    }

    updateUIBars();
    generateFeed();
}

function generateFeed() {
    triggerRandomEvent();
    const feedContainer = document.getElementById('news-feed');
    feedContainer.innerHTML = '';

    let sortedNews = [...newsDatabase].sort((a, b) => {
        let weightA = userInterests[a.category];
        let weightB = userInterests[b.category];
        return (weightB + Math.random() * 30) - (weightA + Math.random() * 30); 
    });

    let displayedCount = 0;

    sortedNews.forEach(news => {
        if (displayedCount >= 4) return;

        let weight = userInterests[news.category];
        
        if (news.radical && weight < 50) {
            return;
        }
        if (!news.radical && weight > 75 && Math.random() > 0.3) {
            return;
        }

        displayedCount++;

        let catText = 'Милитари';
        if(news.category === 'economy') catText = 'Экономика';
        if(news.category === 'cats') catText = 'Котики';

        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <span class="news-category cat-${news.category}">${catText} ${news.radical ? '[РАДИКАЛЬНО]' : ''}</span>
            <h4 class="news-title">${news.title}</h4>
            <p style="margin: 0; color: #aaa; font-size: 0.9rem;">${news.text}</p>
            <div class="actions">
                <button onclick="handleReaction('${news.category}', 'like')">Лайк</button>
                <button class="btn-dislike" onclick="handleReaction('${news.category}', 'dislike')">Скрыть</button>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}

function breakTheBubble() {
    userInterests = { military: 33, economy: 33, cats: 34 };
    updateUIBars();
    generateFeed();
}

updateUIBars();
generateFeed();