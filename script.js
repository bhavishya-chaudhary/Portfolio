const DIR="assets/projects/";
const EXT=/\.(jpe?g|png|webp|gif|avif)$/i;
const FALLBACK=["desko.jpg","tilt-rotor.jpg","cnc.jpg","magnetic-gear.jpg","farmtrack.jpg"];

async function getImages(){
  try{
    const r=await fetch("https://api.github.com/repos/bhavishya-chaudhary/Portfolio/contents/assets/projects");
    if(!r.ok)throw new Error();
    const files=await r.json();
    const imgs=files.filter(x=>x.type==="file"&&EXT.test(x.name)).map(x=>x.name);
    return imgs.length?imgs.sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})):FALLBACK;
  }catch(e){return FALLBACK;}
}
function label(n){return n.replace(/\.[^.]+$/,"").replace(/[-_]+/g," ").trim();}
function match(n){
  n=n.toLowerCase();
  if(n.includes("desko"))return"desko";
  if(n.includes("tilt")||n.includes("vtol"))return"tilt-rotor";
  if(n.includes("cnc")||n.includes("3018"))return"cnc";
  if(n.includes("magnetic")||n.includes("bevel")||n.includes("gear"))return"magnetic";
  if(n.includes("farm"))return"farmtrack";
}
async function init(){
  const names=await getImages(), track=document.querySelector(".carousel-track"), dots=document.querySelector(".carousel-dots");
  let current=0,timer;
  names.forEach((name,i)=>{
    const card=document.createElement("div");card.className="carousel-card";
    const img=document.createElement("img");img.src=DIR+encodeURIComponent(name);img.alt=label(name);img.loading=i<3?"eager":"lazy";
    const cap=document.createElement("div");cap.className="image-name";cap.textContent=label(name);
    card.append(img,cap);track.appendChild(card);
    const dot=document.createElement("button");dot.type="button";dot.setAttribute("aria-label",label(name));dot.onclick=()=>{show(i);restart()};dots.appendChild(dot);
  });
  function render(){
    [...track.children].forEach((c,i)=>{
      let d=(i-current+names.length)%names.length;if(d>names.length/2)d-=names.length;
      c.className="carousel-card";
      if(d===0)c.classList.add("center");else if(d===-1)c.classList.add("left1");else if(d===1)c.classList.add("right1");else if(d===-2)c.classList.add("left2");else if(d===2)c.classList.add("right2");else c.classList.add("far");
    });
    [...dots.children].forEach((d,i)=>d.classList.toggle("active",i===current));
  }
  function show(i){current=(i+names.length)%names.length;render()}
  function restart(){clearInterval(timer);if(names.length>1)timer=setInterval(()=>show(current+1),4500)}
  document.querySelector(".carousel-arrow.left").onclick=()=>{show(current-1);restart()};
  document.querySelector(".carousel-arrow.right").onclick=()=>{show(current+1);restart()};
  render();restart();

  document.querySelectorAll("[data-project-image]").forEach(img=>{
    const found=names.find(n=>match(n)===img.dataset.projectImage);
    if(found)img.src=DIR+encodeURIComponent(found);else img.parentElement.style.display="none";
  });
}
document.addEventListener("DOMContentLoaded",init);
