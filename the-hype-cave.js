  const EPISODES = [
    {n:'07', lane:'combat', cat:'Boxing', short:'Joshua Jones', title:'Joshua "The Real War" Jones', desc:"Philly's undefeated pro boxer on life in & out the ring, his Top 5, Danny Garcia & Boots vs. Zayas.", dur:'35 min', date:'May 20', yt:'j2ZYHew5Pp4'},
    {n:'06', lane:'hiphop', cat:'Hip-Hop · Camden', short:'Porta Rich', title:'Porta Rich', desc:"Camden NJ's own on Peedi Crakk's impact, the passing of his son, and the Jersey hip-hop scene.", dur:'1h 4m', date:'May 11', yt:'J4KuE7ixfwo'},
    {n:'05', lane:'nfl', cat:'NFL · Eagles', short:'Wali Lundy', title:'Wali Lundy', desc:"Ex-Houston Texan & lifelong Eagles fan on his NFL career, draft night, Mike Vick & Iverson.", dur:'55 min', date:'Apr 8', yt:'gcbiWWDdDGQ'},
    {n:'04', lane:'hiphop', cat:'Hip-Hop · Wrestling', short:'B.A.R.S. Murre', title:'B.A.R.S. Murre', desc:"South Jersey's BSF affiliate on Benny the Butcher, the scene, white MCs, wrestling & the Sixers.", dur:'37 min', date:'Mar 25', yt:'dCIbvs3uTQc'},
    {n:'03', lane:'hiphop', cat:'Battle Rap', short:'ENESS', title:'ENESS', desc:"The Philly legend on battle rap culture, the Diddy situation, the music scene & the Birds.", dur:'50 min', date:'Mar 11', yt:'nHgrWl6BFAc'},
    {n:'02', lane:'combat', cat:'Pro Wrestling', short:'Chris White', title:'Chris White', desc:"CZW pro wrestler on Combat Zone Wrestling, his thoughts on Hulk Hogan and his Top 5.", dur:'30 min', date:'Feb 25', yt:'GpDikUh3Bbg'},
    {n:'01', lane:'hiphop', cat:'Hip-Hop', short:'Frankie Krutches', title:'Frankie Krutches', desc:"The debut. Frankie on his relationship with Dipset, becoming a Cowboys fan, NY hip-hop & Kartalk.", dur:'29 min', date:'Feb 11', yt:'PGo11BLDHMU'},
    {n:'00', lane:'origin', cat:'Trailer · Welcome', short:'The Trailer', title:'Introducing The Hype Cave', desc:"Step into the Cave — the new home for the Eagles, hip-hop culture, and combat sports. Hosted by Mr. Hype.", dur:'1 min', date:'Nov 24', yt:'De1193K-ntU'},
  ];

  const SAFE_YT_ID = /^[A-Za-z0-9_-]{8,}$/;
  const SAFE_YT_LANES = new Set(['combat', 'hiphop', 'nfl', 'origin']);
  const grid = document.getElementById('epGrid');
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const featArt = document.getElementById('featArt');
  const yr = document.getElementById('yr');
  const isLocal = location.protocol === 'file:';

  const sanitizeText = (value, max = 140) => {
    const text = String(value ?? '').trim();
    return text.slice(0, max);
  };

  const sanitizeEpisodeNumber = value => {
    const n = String(value ?? '').replace(/[^\d]/g, '').slice(0, 3);
    return n || '00';
  };

  const sanitizeLane = lane => SAFE_YT_LANES.has(lane) ? lane : 'origin';

  const sanitizeYoutubeId = value => {
    const id = String(value ?? '').trim();
    return SAFE_YT_ID.test(id) ? id : '';
  };

  const createSafeElement = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = sanitizeText(text);
    return el;
  };

  const makePlayIcon = () => {
    const circle = createSafeElement('div', 'circle');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', '#07090a');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M8 5v14l11-7z');
    svg.appendChild(path);
    circle.appendChild(svg);
    return circle;
  };

  const createYouTubeEmbed = yt => {
    const id = sanitizeYoutubeId(yt);
    if (!id) return null;
    const url = new URL(`https://www.youtube.com/embed/${id}`);
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('rel', '0');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('modestbranding', '1');

    const frame = document.createElement('iframe');
    frame.src = url.toString();
    frame.title = 'The Hype Cave';
    frame.loading = 'lazy';
    frame.allow = 'autoplay;clipboard-write;encrypted-media;fullscreen;gyroscope;picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    frame.setAttribute('frameborder', '0');
    return frame;
  };

  const openYouTubeFallback = yt => {
    const id = sanitizeYoutubeId(yt);
    if (!id) return;
    const url = `https://www.youtube.com/watch?v=${id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const resolveThumb = (img, id) => {
    const safeId = sanitizeYoutubeId(id);
    if (!safeId || !img) return;
    const set = q => {
      img.src = `https://i.ytimg.com/vi/${safeId}/${q}`;
    };
    const big = new Image();
    big.onload = () => {
      if (big.naturalWidth >= 1000) set('maxresdefault.jpg');
      else {
        const mq = new Image();
        mq.onload = () => { if (mq.naturalWidth >= 200) set('mqdefault.jpg'); };
        mq.src = `https://i.ytimg.com/vi/${safeId}/mqdefault.jpg`;
      }
    };
    big.onerror = () => {
      const fallback = new Image();
      fallback.onload = () => { if (fallback.naturalWidth >= 200) set('mqdefault.jpg'); };
      fallback.src = `https://i.ytimg.com/vi/${safeId}/mqdefault.jpg`;
    };
    big.src = `https://i.ytimg.com/vi/${safeId}/maxresdefault.jpg`;
  };

  const createEpisodeCard = epRaw => {
    const ep = {
      n: sanitizeEpisodeNumber(epRaw.n),
      lane: sanitizeLane(epRaw.lane),
      cat: sanitizeText(epRaw.cat, 80),
      short: sanitizeText(epRaw.short, 48),
      title: sanitizeText(epRaw.title, 96),
      desc: sanitizeText(epRaw.desc, 260),
      dur: sanitizeText(epRaw.dur, 40),
      date: sanitizeText(epRaw.date, 40),
      yt: sanitizeYoutubeId(epRaw.yt),
    };

    const card = createSafeElement('article', 'card reveal');
    const thumb = createSafeElement('div', `card-thumb poster lane-${ep.lane}`);
    const posterIn = createSafeElement('div', 'poster-in');
    const ytThumb = createSafeElement('div', 'ytthumb');
    const ytThumbImg = createSafeElement('img', 'ytthumb-img');
    ytThumb.appendChild(ytThumbImg);
    const eq = createSafeElement('div', 'eq');
    const play = createSafeElement('div', 'play');

    thumb.appendChild(createSafeElement('span', 'pbar'));
    thumb.appendChild(createSafeElement('span', 'wm', ep.n));

    for (let i = 0; i < 4; i++) {
      eq.appendChild(createSafeElement('i'));
    }
    thumb.appendChild(eq);

    posterIn.appendChild(createSafeElement('div', 'pcat', ep.cat));
    posterIn.appendChild(createSafeElement('div', 'pname', ep.short));
    posterIn.appendChild(createSafeElement('div', 'prule'));
    thumb.appendChild(posterIn);

    if (ep.yt) {
      ytThumb.dataset.yt = ep.yt;
      resolveThumb(ytThumbImg, ep.yt);
      const ytout = createSafeElement('a', 'ytout');
      ytout.href = `https://www.youtube.com/watch?v=${ep.yt}`;
      ytout.target = '_blank';
      ytout.rel = 'noopener noreferrer';
      ytout.title = 'Watch on YouTube';
      ytout.setAttribute('aria-label', 'Watch on YouTube');
      ytout.textContent = '↗';
      thumb.appendChild(ytout);

      play.dataset.yt = ep.yt;
      play.setAttribute('role', 'button');
      play.setAttribute('tabindex', '0');
      play.setAttribute('aria-label', `Play ${ep.title}`);
      play.appendChild(makePlayIcon());
      thumb.appendChild(play);
    }

    thumb.appendChild(ytThumb);
    thumb.appendChild(createSafeElement('span', 'epnum', `EP ${ep.n}`));
    card.appendChild(thumb);

    const body = createSafeElement('div', 'card-body');
    body.appendChild(createSafeElement('div', 'cat', ep.cat));
    const h4 = createSafeElement('h4', null, ep.title);
    body.appendChild(h4);
    body.appendChild(createSafeElement('p', null, ep.desc));
    const foot = createSafeElement('div', 'card-foot');
    foot.appendChild(createSafeElement('span', null, `▶ ${ep.dur || 'TBD'}`));
    foot.appendChild(createSafeElement('span', null, ep.date || ''));
    body.appendChild(foot);

    card.appendChild(body);
    return card;
  };

  const renderEpisodes = () => {
    if (!grid) return;
    EPISODES.forEach(ep => {
      const card = createEpisodeCard(ep);
      grid.appendChild(card);
    });
  };
  renderEpisodes();

  grid?.addEventListener('click', e => {
    const play = e.target.closest('.play');
    if (!play) return;
    const yt = play.dataset.yt;
    if (isLocal) {
      openYouTubeFallback(yt);
      return;
    }

    const card = play.closest('.card');
    if (!card || card.querySelector('.embed')) return;
    const embed = document.createElement('div');
    const frame = createYouTubeEmbed(yt);
    if (!frame) return;

    const body = card.querySelector('.card-body');
    const thumb = card.querySelector('.card-thumb');
    if (body) body.classList.add('is-hidden');
    if (thumb) thumb.classList.add('is-hidden');

    embed.className = 'embed';
    embed.appendChild(frame);
    card.appendChild(embed);
  });

  grid?.addEventListener('keydown', e => {
    const play = e.target.closest('.play');
    if (!play) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    play.click();
  });

  if (featArt) {
    const featPlay = featArt.querySelector('.play');
    if (featPlay) {
      featArt.classList.add('is-clickable');
      featArt.addEventListener('click', e => {
        if (e.target.closest('.ytout')) return;
        if (isLocal) {
          openYouTubeFallback(featPlay.dataset.yt);
          return;
        }
        if (featArt.dataset.playing) return;
        const frame = createYouTubeEmbed(featPlay.dataset.yt);
        if (!frame) return;
        frame.className = 'feat-frame';
        featArt.dataset.playing = '1';
        featArt.replaceChildren(frame);
      });
    }
  }

  if (header) {
    addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30));
  }

  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.classList.add(`reveal-delay-${Math.min(i, 6)}`);
    io.observe(el);
  });

  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = new Set((a.getAttribute('rel') || '').toLowerCase().split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    a.setAttribute('rel', [...rel].join(' '));
  });

  if (yr) yr.textContent = new Date().getFullYear();
