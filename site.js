(()=>{
 const m=document.getElementById('menuToggle'),n=document.getElementById('navLinks')||document.getElementById('homeLinks');if(m&&n)m.onclick=()=>n.classList.toggle('open');
 const a=document.getElementById('hauntAudio'),s=document.getElementById('soundToggle');
 if(a&&s){
   const track=a.dataset.track||'manor',timeKey=track==='babyboo'?'pvBabyBooMusicTime':'pvMusicTime',prefKey='pvMusicMuted';
   a.volume=.34;
   // localStorage is origin-scoped. When the site is tested directly from file://,
   // Firefox can give each HTML file separate storage. window.name survives normal
   // same-tab page navigation, so mirror the mute preference there for local testing.
   const windowPref=()=>{const m=(window.name||'').match(/(?:^|\|)PV_MUSIC_MUTED=([01])(?:\||$)/);return m?m[1]:null};
   const setWindowPref=v=>{const parts=(window.name||'').split('|').filter(x=>x&&!x.startsWith('PV_MUSIC_MUTED='));parts.push('PV_MUSIC_MUTED='+v);window.name=parts.join('|')};
   const preferredMuted=()=>{const w=windowPref();if(w!==null)return w==='1';return localStorage.getItem(prefKey)==='1'};
   const savePreference=muted=>{const v=muted?'1':'0';localStorage.setItem(prefKey,v);setWindowPref(v)};
   // Seed the cross-page mirror from any existing stored preference.
   if(windowPref()===null)setWindowPref(localStorage.getItem(prefKey)==='1'?'1':'0');
   const updateButton=()=>{s.textContent=preferredMuted()?'UNMUTE':'MUTE'};
   a.muted=preferredMuted();updateButton();

   const saved=Number(sessionStorage.getItem(timeKey)||0);
   const restoreTime=()=>{if(saved>0&&Number.isFinite(saved)&&Number.isFinite(a.duration)){try{a.currentTime=Math.min(saved,Math.max(0,a.duration-.25))}catch(e){}}};
   if(a.readyState>=1)restoreTime();else a.addEventListener('loadedmetadata',restoreTime,{once:true});

   let starting=false;
   const attemptPlay=()=>{
     if(!a.paused||starting)return;
     starting=true;
     let p;
     try{p=a.play()}catch(e){starting=false;return}
     if(p&&typeof p.then==='function')p.then(()=>{starting=false}).catch(()=>{starting=false});else starting=false;
   };
   const activate=()=>{
     a.muted=preferredMuted();
     attemptPlay();
   };

   // Try immediately. If audible autoplay is blocked, every genuine interaction
   // remains armed until playback actually succeeds.
   attemptPlay();
   document.addEventListener('pointerdown',activate,true);
   document.addEventListener('keydown',activate,true);

   s.addEventListener('click',()=>{
     const next=!preferredMuted();
     savePreference(next);
     a.muted=next;
     updateButton();
     if(!next)attemptPlay();
   });

   const saveTime=()=>{if(Number.isFinite(a.currentTime))sessionStorage.setItem(timeKey,String(a.currentTime))};
   window.addEventListener('pagehide',saveTime);
   window.addEventListener('beforeunload',saveTime);
   setInterval(()=>{if(!a.paused)saveTime()},1000);

   window.addEventListener('pageshow',e=>{if(e.persisted){a.muted=preferredMuted();updateButton();attemptPlay()}});
 }
 const d=document.getElementById('cdDays');
 if(d){const now=new Date(),y=now.getFullYear(),halloween=new Date(y,9,31,16,30,0),nov1=new Date(y,10,1,0,0,0),target=(now>=nov1)?new Date(y+1,9,31,16,30,0):halloween,dateEl=document.getElementById('countdownDate'),dayEl=document.getElementById('countdownDay'),kicker=document.getElementById('countdownKicker');if(dateEl)dateEl.textContent='31 OCTOBER '+target.getFullYear()+' · 4:30 PM';if(dayEl)dayEl.textContent=target.toLocaleDateString('en-GB',{weekday:'long'}).toUpperCase();const tick=()=>{let x=target-Date.now();if(x<=0&&Date.now()<nov1.getTime()){x=0;if(kicker)kicker.textContent='THE MANOR HAS AWAKENED'}else if(x<0){location.reload();return}const day=Math.floor(x/86400000);x%=86400000;const hr=Math.floor(x/3600000);x%=3600000;const mi=Math.floor(x/60000),se=Math.floor((x%60000)/1000);d.textContent=day;document.getElementById('cdHours').textContent=String(hr).padStart(2,'0');document.getElementById('cdMins').textContent=String(mi).padStart(2,'0');document.getElementById('cdSecs').textContent=String(se).padStart(2,'0')};tick();setInterval(tick,1000)}
 const tl=document.getElementById('awakeningTimeline');if(tl){const n=new Date(),md=(n.getMonth()+1)*100+n.getDate(),order=['dormant','stirring','building','awakening','showtime'];let current='dormant';if(md>=630&&md<801)current='stirring';else if(md>=801&&md<1024)current='building';else if(md>=1024&&md<1031)current='awakening';else if(md===1031)current='showtime';const ci=order.indexOf(current);[...tl.querySelectorAll('.phase')].forEach((el,i)=>{el.classList.toggle('done',i<ci);el.classList.toggle('current',i===ci)})}
 const shuffle=x=>{x=[...x];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
 document.querySelectorAll('[data-media-category]').forEach(c=>{const cat=c.dataset.mediaCategory,items=shuffle((window.PV_MEDIA&&window.PV_MEDIA[cat])||[]),stage=c.querySelector('.carousel-stage');items.forEach((entry,i)=>{const item=typeof entry==='string'?{src:entry,caption:''}:entry,src=item.src||'';if(!src)return;const fig=document.createElement('figure');fig.className='memory-slide';const video=/\.(mp4|webm|mov)$/i.test(src);if(video){const v=document.createElement('video');v.src=src;v.controls=true;v.preload='metadata';v.playsInline=true;v.dataset.lightbox='1';fig.appendChild(v)}else{const im=document.createElement('img');im.src=src;im.alt=item.caption||cat.replaceAll('-',' ')+' photograph';im.loading=i?'lazy':'eager';im.dataset.lightbox='1';fig.appendChild(im)}if(item.caption){const cap=document.createElement('figcaption');cap.className='media-caption';cap.textContent=item.caption;fig.appendChild(cap)}stage.appendChild(fig)})});
 const lb=document.createElement('div');lb.className='media-lightbox';lb.setAttribute('aria-hidden','true');lb.innerHTML='<button class="media-lightbox-close" type="button" aria-label="Close">×</button><div class="media-lightbox-content"></div>';document.body.appendChild(lb);const lbc=lb.querySelector('.media-lightbox-content');const closeLb=()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true');lbc.querySelectorAll('video').forEach(v=>v.pause());lbc.innerHTML=''};lb.querySelector('button').onclick=closeLb;lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});document.addEventListener('click',e=>{const el=e.target.closest('[data-lightbox="1"]');if(!el)return;if(el.tagName==='VIDEO'){e.preventDefault();el.pause()}const clone=el.cloneNode(true);clone.removeAttribute('data-lightbox');if(clone.tagName==='VIDEO'){clone.controls=true;clone.autoplay=true;}lbc.innerHTML='';lbc.appendChild(clone);lb.classList.add('open');lb.setAttribute('aria-hidden','false')});
 document.querySelectorAll('[data-carousel]').forEach(c=>{const slides=[...c.querySelectorAll('.memory-slide')],dots=c.querySelector('.carousel-dots');if(!slides.length)return;let i=0,t;slides.forEach((_,x)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show item '+(x+1));b.onclick=()=>show(x,true);dots.appendChild(b)});const db=[...dots.children];function show(x,user=false){i=(x+slides.length)%slides.length;slides.forEach((el,j)=>{el.classList.toggle('active',j===i);const v=el.querySelector('video');if(v&&j!==i)v.pause()});db.forEach((el,j)=>el.classList.toggle('active',j===i));if(user)restart()}function restart(){clearInterval(t);t=setInterval(()=>show(i+1),Number(c.dataset.delay)||5000)}c.querySelector('.prev').onclick=()=>show(i-1,true);c.querySelector('.next').onclick=()=>show(i+1,true);show(0);restart();c.addEventListener('mouseenter',()=>clearInterval(t));c.addEventListener('mouseleave',restart)});
 const rf=document.getElementById('routeForm');if(rf)rf.addEventListener('submit',e=>{e.preventDefault();const origin=document.getElementById('routeFrom').value.trim(),dest='49 Plantation Road, Hextable, Kent, BR8 7SA',u='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(dest)+(origin?'&origin='+encodeURIComponent(origin):'');window.open(u,'_blank','noopener')});
})();


 // Single-folder updates generated by ADMIN/UPDATE-MEDIA.cmd.
 const updates=(window.PV_UPDATES||[]);
 document.querySelectorAll('[data-update-section]').forEach(host=>{
   const section=host.dataset.updateSection;
   const entries=updates.filter(x=>(x.section||'').toLowerCase()===section.toLowerCase());
   if(!entries.length){host.innerHTML='<p class="updates-empty">Nothing has escaped the shadows yet. Check back soon.</p>';return;}
   host.innerHTML='';
   entries.forEach(entry=>{
     const article=document.createElement('article');article.className='stirring-card';
     if(entry.image){const im=document.createElement('img');im.src=entry.image;im.alt=entry.title||'PlantationVille update';im.loading='lazy';im.onerror=()=>{im.remove();article.classList.add('no-image')};article.appendChild(im)}else{article.classList.add('no-image')}
     const copy=document.createElement('div');copy.className='stirring-copy';
     if(entry.badge){const b=document.createElement('span');b.className='update-badge';b.textContent=entry.badge;copy.appendChild(b)}
     if(entry.date){const d=document.createElement('div');d.className='stirring-date';d.textContent=entry.date;copy.appendChild(d)}
     const h=document.createElement('h3');h.textContent=entry.title||'From the Manor';copy.appendChild(h);
     (entry.body||'').split(/\n\s*\n/).filter(Boolean).forEach(p=>{const el=document.createElement('p');el.textContent=p.replace(/\s*\n\s*/g,' ');copy.appendChild(el)});
     article.appendChild(copy);host.appendChild(article);
   });
 });


 // V30 story carousels: one image + story panel at a time.
 document.querySelectorAll('[data-story-carousel]').forEach(carousel=>{
   const stage=carousel.querySelector('.story-stage');
   const cards=[...stage.querySelectorAll('.stirring-card')];
   if(!cards.length)return;
   let index=0; const dots=carousel.querySelector('.story-dots');
   cards.forEach((card,i)=>{const dot=document.createElement('span');dot.className='story-dot';dots.appendChild(dot)});
   const render=()=>{cards.forEach((c,i)=>c.classList.toggle('active',i===index));[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===index))};
   carousel.querySelector('.prev').addEventListener('click',()=>{index=(index-1+cards.length)%cards.length;render()});
   carousel.querySelector('.next').addEventListener('click',()=>{index=(index+1)%cards.length;render()});
   render();
 });
