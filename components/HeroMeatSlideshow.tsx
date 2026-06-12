'use client';
import {useEffect,useState} from 'react';

const slides=[
  {src:'/images/capital-city-hero.png',title:'Steakhouse-style stock-ups',text:'Premium proteins planned around real home cooking.'},
  {src:'/images/category-beef.svg',title:'Beef for the grill',text:'Steaks, burger, roasts, and useful freezer staples.'},
  {src:'/images/category-chicken.svg',title:'Weeknight chicken',text:'Simple proteins for fast dinners and meal prep.'},
  {src:'/images/category-pork.svg',title:'Pork and comfort cuts',text:'Ribs, chops, and family-ready freezer variety.'},
  {src:'/images/freezer-family.png',title:'Freezer-ready boxes',text:'Cryovac packed and built for household storage.'}
];

export default function HeroMeatSlideshow(){
  const [active,setActive]=useState(0);
  useEffect(()=>{const timer=window.setInterval(()=>setActive(current=>(current+1)%slides.length),3600);return()=>window.clearInterval(timer)},[]);
  const slide=slides[active];
  return <aside className="hero-meat-slideshow" aria-label="Premium protein slideshow">
    <figure>
      <img src={slide.src} alt={slide.title}/>
      <figcaption><strong>{slide.title}</strong><span>{slide.text}</span></figcaption>
    </figure>
    <div className="hero-slide-dots" aria-hidden="true">{slides.map((item,index)=><button key={item.title} type="button" className={index===active?'active':''} onClick={()=>setActive(index)} tabIndex={-1}/>)}</div>
    <style>{`
      .hero-meat-slideshow{position:relative;z-index:1;align-self:center;justify-self:end;width:min(430px,34vw);margin-right:clamp(1rem,4vw,4rem)}
      .hero-meat-slideshow figure{position:relative;margin:0;overflow:hidden;border:1px solid rgba(216,174,100,.45);border-radius:28px;background:rgba(0,0,0,.64);box-shadow:0 28px 70px rgba(0,0,0,.5),inset 0 0 0 1px rgba(255,255,255,.06)}
      .hero-meat-slideshow img{display:block;width:100%;aspect-ratio:1.05/1;object-fit:cover;background:#100904;filter:saturate(1.08) contrast(1.05)}
      .hero-meat-slideshow figcaption{position:absolute;left:14px;right:14px;bottom:14px;display:grid;gap:4px;border:1px solid rgba(255,226,164,.34);border-radius:18px;background:rgba(0,0,0,.78);padding:12px 14px;font-family:Arial,sans-serif}
      .hero-meat-slideshow strong{color:#ffe2a4;font-size:.9rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      .hero-meat-slideshow span{color:#fff7ed;font-size:.86rem;line-height:1.35}
      .hero-slide-dots{position:absolute;right:16px;top:16px;display:flex;gap:7px}
      .hero-slide-dots button{width:10px;height:10px;border:1px solid rgba(255,255,255,.8);border-radius:999px;background:rgba(0,0,0,.62);padding:0}
      .hero-slide-dots button.active{background:#d8ae64;border-color:#d8ae64}
      @media(max-width:1100px){.hero-meat-slideshow{width:min(360px,42vw);margin-right:1rem}.hero-meat-slideshow figcaption{position:static;border-left:0;border-right:0;border-bottom:0;border-radius:0}}
      @media(max-width:720px){.hero-meat-slideshow{width:100%;margin:1rem 0 0;justify-self:stretch}.hero-meat-slideshow img{aspect-ratio:1.35/1}.hero-slide-dots{top:10px;right:10px}}
    `}</style>
  </aside>;
}
