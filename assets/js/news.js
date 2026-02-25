// Настройка источников новостей (RSS). Можно менять на свои.
const RSS_SOURCES = [
  "https://www.power-grid.com/feed/",
  "https://www.tdworld.com/rss",
  "https://www.smart-energy.com/feed/"
];

// Используем бесплатный конвертер RSS->JSON (ограничения по скорости). При ошибке — local JSON.
const RSS2JSON = (url) => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

async function fetchRss(url){
  const res = await fetch(RSS2JSON(url));
  if(!res.ok) throw new Error("rss2json failed");
  return res.json();
}

function renderItem(post){
  const card = document.createElement('a');
  card.className = 'card';
  card.href = post.link || post.url || '#';
  card.target = '_blank';
  const date = post.pubDate ? new Date(post.pubDate) : (post.date ? new Date(post.date) : null);
  card.innerHTML = `
    <h3>${post.title || 'Без названия'}</h3>
    <p class="muted">${post.description ? post.description.replace(/<[^>]*>/g,'').slice(0,180)+'…' : ''}</p>
    <small class="muted">${date ? date.toLocaleDateString() : ''}</small>
  `;
  return card;
}

async function loadNews(){
  const wrap = document.getElementById('news-list');
  wrap.innerHTML = '<div class="muted">Загрузка новостей…</div>';
  let items = [];
  try{
    for(const src of RSS_SOURCES){
      try{
        const data = await fetchRss(src);
        const posts = (data.items||[]).map(i => ({
          title:i.title, description:i.description, link:i.link, pubDate:i.pubDate
        }));
        items.push(...posts);
      }catch(e){ /* ignore per-source error */ }
    }
    if(!items.length) throw new Error('No RSS loaded');
  }catch(e){
    // Fallback to local JSON
    const res = await fetch('assets/news/news.json');
    const data = await res.json();
    items = data.items || [];
  }
  // sort by date desc
  items.sort((a,b)=> new Date(b.pubDate||b.date||0) - new Date(a.pubDate||a.date||0));
  wrap.innerHTML='';
  items.slice(0,20).forEach(p => wrap.appendChild(renderItem(p)));
}

document.addEventListener('DOMContentLoaded', loadNews);