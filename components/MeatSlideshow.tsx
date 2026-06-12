'use client';
import {useEffect,useState} from 'react';

const slides=[
  {src:'/images/capital-city-hero.png',title:'Premium proteins, freezer ready',text:'A stocked-home first impression for families, grill nights, and practical food security.'},
  {src:'/images/category-beef.svg',title:'Steakhouse-style beef',text:'Ribeyes, strips, roasts, burger, and beef-forward freezer planning.'},
  {src:'/images/category-chicken.svg',title:'Weeknight chicken staples',text:'Clean portions for meal prep, quick dinners, and busy family weeks.'},
  {src:'/images/category-pork.svg',title:'Pork, ribs, and comfort cuts',text:'Useful freezer cuts for slow cooking, grilling, and family meals.'},
  {src:'/images/freezer-family.png',title:'Family freezer boxes',text:'Sized around household needs, freezer space, and how often you cook at home.'}
];

export default function MeatSlideshow(){
  const [active,setActive]=useState(0);
  useEffect(()=>{const timer=window.setInterval(()=>setActive(current=>(current+1)%slides.length),4200);return()=>window.clearInterval(timer)},[]);
  const slide=slides[active];
  return <section className="meat-slideshow" aria-label="Capital City Provisions protein slideshow">
    <figure>
      <img src={slide.src} alt={slide.title}/>
      <figcaption><strong>{slide.title}</strong><span>{slide.text}</span></figcaption>
    </figure>
    <div className="slide-dots" aria-label="Choose slideshow image">
      {slides.map((item,index)=><button key={item.title} type="button" className={index===active?'active':''} aria-label={`Show ${item.title}`} onClick={()=>setActive(index)}/>) }
    </div>
    <style>{`
      .meat-slideshow{position:relative;min-width:0}
      .meat-slideshow figure{margin:0;position:relative;overflow:hidden;border:1px solid rgba(217,155,61,.45);border-radius:28px;background:linear-gradient(180deg,#fff8ed,#fff1dc);box-shadow:0 22px 60px rgba(73,30,10,.18)}
      .meat-slideshow img{display:block;width:100%;height:min(58vh,560px);min-height:360px;object-fit:cover;background:#fff1dc}
      .meat-slideshow figcaption{position:absolute;left:18px;right:18px;bottom:18px;display:grid;gap:4px;border:1px solid rgba(255,247,237,.55);border-radius:20px;background:rgba(20,8,4,.78);backdrop-filter:blur(10px);padding:14px 16px;color:#fff7ed;box-shadow:0 12px 32px rgba(0,0,0,.28)}
      .meat-slideshow strong{font-size:1.08rem;text-transform:uppercase;letter-spacing:.08em;color:#f8d16a}
      .meat-slideshow span{color:#fff1dc;line-height:1.45;font-weight:700}
      .slide-dots{position:absolute;right:18px;top:18px;display:flex;gap:8px;z-index:2}
      .slide-dots button{width:12px;height:12px;border-radius:999px;border:1px solid #fff7ed;background:rgba(20,8,4,.55);cursor:pointer}
      .slide-dots button.active{background:#f8d16a;border-color:#7f1d1d}
      @media(max-width:760px){.meat-slideshow img{height:auto;min-height:0;aspect-ratio:1.08/1}.meat-slideshow figcaption{position:static;border-radius:0;border-left:0;border-right:0;border-bottom:0;background:#140804}.slide-dots{top:12px;right:12px}.meat-slideshow figure{border-radius:22px}}
    `}</style>
  </section>;
}
