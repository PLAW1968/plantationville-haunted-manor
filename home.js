document.addEventListener('DOMContentLoaded',function(){
 const header=document.querySelector('.home-header'),menu=document.getElementById('menuToggle'),links=document.getElementById('homeLinks');
 const scroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>30);addEventListener('scroll',scroll,{passive:true});scroll();
 if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
 const els=document.querySelectorAll('.reveal');if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});els.forEach(e=>io.observe(e))}else els.forEach(e=>e.classList.add('in'));
});
