'use client';
import {useEffect,useState} from 'react';

const slides=[
  {src:'/images/capital-city-hero.png',title:'Steakhouse Stock-Ups',text:'Premium proteins planned around real home cooking.'},
  {src:'/images/freezer-family.png',title:'Freezer-Ready Boxes',text:'Cryovac packed and built for household storage.'},
  {src:'/images/category-beef.svg',title:'Prime Beef Energy',text:'Steaks, burger, roasts, and useful freezer staples.'},
  {src:'/images/category-chicken.svg',title:'Weeknight Protein',text:'Simple cuts for fast dinners and meal prep.'},
  {src:'/images/category-pork.svg',title:'Family Comfort Cuts',text:'Ribs, chops, and variety for stocked homes.'}
];

export default function HeroMeatSlideshow(){
  const [active,setActive]=useState(0);
  useEffect(()=>{const timer=window.setInterval(()=>setActive(current=>(current+1)%slides.length),4200);return()=>window.clearInterval(timer)},[]);
  const slide=slides[active];
  return <aside className="hero-meat-slideshow" aria-label="Premium protein slideshow">
    <figure>
      <img src={slide.src} alt={slide.title}/>
      <figcaption><strong>{slide.title}</strong><span>{slide.text}</span></figcaption>
    </figure>
    <div className="hero-slide-dots" aria-hidden="true">{slides.map((item,index)=><button key={item.title} type="button" className={index===active?'active':''} onClick={()=>setActive(index)} tabIndex={-1}/>)}</div>
    <style>{`
      .hero-meat-slideshow{position:relative;z-index:1;align-self:center;justify-self:end;width:min(460px,35vw);margin-right:clamp(1rem,4vw,4rem)}
      .hero-meat-slideshow figure{position:relative;margin:0;overflow:hidden;border:1px solid rgba(226,201,143,.5);border-radius:32px;background:linear-gradient(180deg,rgba(26,19,15,.9),rgba(8,6,4,.96));box-shadow:0 32px 80px rgba(0,0,0,.58),inset 0 0 0 1px rgba(255,255,255,.06)}
      .hero-meat-slideshow figure:before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(circle at 78% 18%,rgba(226,201,143,.18),transparent 28%),linear-gradient(180deg,transparent 36%,rgba(0,0,0,.82))}
      .hero-meat-slideshow img{display:block;width:100%;aspect-ratio:1.02/1;object-fit:cover;background:#100904;filter:saturate(1.13) contrast(1.07);transform:scale(1.01);transition:transform .7s ease}
      .hero-meat-slideshow:hover img{transform:scale(1.045)}
      .hero-meat-slideshow figcaption{position:absolute;left:14px;right:14px;bottom:14px;z-index:2;display:grid;gap:5px;border:1px solid rgba(255,226,164,.34);border-radius:20px;background:rgba(8,6,4,.82);backdrop-filter:blur(12px);padding:14px 16px;font-family:Arial,sans-serif}
      .hero-meat-slideshow strong{color:#ffe2a4;font-size:.82rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      .hero-meat-slideshow span{color:#fff7ed;font-size:.9rem;line-height:1.4}
      .hero-slide-dots{position:absolute;right:18px;top:18px;z-index:3;display:flex;gap:8px}
      .hero-slide-dots button{width:10px;height:10px;border:1px solid rgba(255,255,255,.82);border-radius:999px;background:rgba(0,0,0,.62);padding:0}
      .hero-slide-dots button.active{background:#e2c98f;border-color:#e2c98f;box-shadow:0 0 0 4px rgba(226,201,143,.15)}
      @media(max-width:1100px){.hero-meat-slideshow{width:min(380px,42vw);margin-right:1rem}}
      @media(max-width:760px){.hero-meat-slideshow{display:block!important;width:100%;margin:1.15rem 0 0;justify-self:stretch}.hero-meat-slideshow figure{border-radius:24px}.hero-meat-slideshow img{aspect-ratio:1.35/1}.hero-meat-slideshow figcaption{left:10px;right:10px;bottom:10px;padding:12px}.hero-slide-dots{top:12px;right:12px}}
    `}</style>
  </aside>;
}
