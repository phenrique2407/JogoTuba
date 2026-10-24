import IMG from './assets/apresentador.png';
import cardsData from './content/cards.json';
import questionsData from './content/questions.json';
import { TH, KEYS, RN, DN, TIME, DIFF_W, PICK_S } from './core/constants.js';
import { passiveSum, offer as coreOffer } from './core/cards.js';
import { calcPoints, resolveWrong, useActive } from './core/game.js';
import { buildBank, createPicker } from './core/questions.js';
import { escapeHtml } from './core/text.js';
import { pickWeighted } from './core/weighted.js';
const VER = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';
const $=s=>document.querySelector(s),A=$("#app");
const CARDS=cardsData;
// ===== persistência =====
const LS={g(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let prof=LS.g("mc_prof",{nick:"",best:0,last:0,unl:[]});
// ===== áudio =====
let AC,mus=true,G=null;
document.addEventListener("click",()=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)()}catch(e){}});
function snd(f,d=.1,ty="square",v=.05){if(!AC)return;try{const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
// ===== MÚSICA sintetizada (funk/acid-jazz: Jet Set Radio, Persona, BRC, Sonic Adventure) =====
const mf=n=>440*Math.pow(2,(n-69)/12),PENT=[0,3,5,7,10,12,15,17,19,22];
const SONG={
menu:{bpm:100,sw:.2,lt:"triangle",ch:[[50,[0,3,7,10,14]],[55,[0,4,7,10,14]],[48,[0,4,7,11,14]],[53,[0,4,7,11,14]]],bass:[0,,,0,12,,0,,,7,,0,,10,,5],k:"x..x...x..x.....",s:"....x..g.g..x...",h:"X.xoX.xxX.xoX.xx",st:"..x....x..x.....",lead:"5..4.3..2...3.2.3...2.0.....2.3."},
game:{bpm:142,sw:.08,lt:"square",ch:[[50,[0,3,7,10]],[46,[0,4,7,11]],[48,[0,4,7,10]],[55,[0,4,7,10]]],bass:[0,,0,12,0,,7,,0,,0,12,10,,7,5],k:"x..x..x.x..x.x..",s:"....x.......x..x",h:"XxxxXxxxXxxxXxxx",st:"x..x..x...x..x..",lead:"5.7.8.7.5.3.5...7.8.9.8.7.5.7.5."},
menu2:{bpm:88,sw:.28,lt:"triangle",base:57,ch:[[57,[0,3,7,10,14]],[53,[0,4,7,11,14]],[48,[0,4,7,11,14]],[55,[0,4,7,10,14]]],bass:[0,,,,0,,7,,,,0,,12,,7],k:"x.....x...x.....",s:"....x.......x..g",h:"x.x.x.x.x.x.x.xo",st:"x.....x...x.x...",lead:"3...5...7...5.3.....2...3.5....."},
menu3:{bpm:112,sw:.15,lt:"square",base:60,ch:[[48,[0,3,7,10,14]],[53,[0,3,7,10,14]],[44,[0,4,7,11,14]],[55,[0,4,7,10,14]]],bass:[0,,0,,7,,0,,10,,7,,5,,3],k:"x..x..x...x...x.",s:"....x..g....x..g",h:"X.xxX.xxX.xxX.xx",st:".x..x..x..x..x..",lead:"5.3.0...3.5.7...8.7.5.3.5.....3."},
game2:{bpm:150,sw:.05,lt:"square",base:64,ch:[[52,[0,3,7,10]],[48,[0,4,7,11]],[50,[0,4,7,10]],[47,[0,4,7,10]]],bass:[0,0,,0,,12,0,,0,0,,7,,5,7],k:"x..x.x..x..x.x..",s:"....x.......x...",h:"XxXxXxXxXxXxXxXx",st:"x.x...x.x.x...x.",lead:"7.8.7.5.7.8.7.8.7.5.3.5.7...5..."},
game3:{bpm:128,sw:.18,lt:"sawtooth",base:55,ch:[[55,[0,3,7,10]],[51,[0,4,7,11]],[53,[0,4,7,10]],[50,[0,3,7,10]]],bass:[0,,12,0,,,7,,0,,12,,10,,7,12],k:"x.....x..x.x....",s:"....x..g.g..x..g",h:"X.xoX.xoX.xoX.xo",st:"..x..x..x...x.x.",lead:"5.7.5.3.0.3.5...7.8.7.5.3...5.7."}};
let cur=null,nT=0,sx=0,NB,MB,MG;
function audioInit(){if(MB||!AC)return;MG=AC.createGain();const cp=AC.createDynamicsCompressor();MG.connect(cp);cp.connect(AC.destination);MB=AC.createGain();MB.connect(MG);NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
const GRP={menu:['menu','menu2','menu3'],game:['game','game2','game3']};let grp=null,lastH=null;
function setTrack(g,force){if(grp===g&&!force)return;grp=g;const p=cur;do{cur=pick(GRP[g])}while(cur===p);sx=0;nT=0}
// Efeitos sonoros
const SFX={click:()=>{snd(660,.06,'square',.05);setTimeout(()=>snd(990,.07,'square',.05),45)},hover:()=>snd(1400,.03,'triangle',.02),
 card:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>snd(f,.14,'square',.06),i*55)),
 pick:()=>[784,988,1175,1568].forEach((f,i)=>setTimeout(()=>snd(f,.22,'triangle',.08),i*70)),
 open:()=>{snd(440,.1,'triangle',.06);setTimeout(()=>snd(660,.12,'triangle',.06),70)},
 over:()=>[392,330,262,196].forEach((f,i)=>setTimeout(()=>snd(f,.4,'sawtooth',.08),i*220)),
 rec:()=>[523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>snd(f,.18,'square',.06),i*90))};
const sfx=n=>{try{SFX[n]()}catch(e){}};
document.addEventListener('click',e=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)()}catch(x){}const b=e.target.closest('button');if(b&&!b.disabled&&b.matches('.btn,.chip,.qt,.opt'))sfx('click')},true);
document.addEventListener('pointerover',e=>{const b=e.pointerType==='mouse'&&e.target.closest('button:not(:disabled)');if(b&&b!==lastH){lastH=b;sfx('hover')}});
document.addEventListener('pointerout',e=>{const b=e.target.closest('button');if(b&&!b.contains(e.relatedTarget))lastH=null});
function env(g,t,a,d,v){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function osc(ty,f,t,d,v,fl,det){const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);o.detune.value=det||0;env(g,t,.005,d,v);if(fl){const b=AC.createBiquadFilter();b.frequency.setValueAtTime(fl,t);b.frequency.exponentialRampToValueAtTime(Math.max(150,fl/4),t+d);o.connect(b);b.connect(g)}else o.connect(g);g.connect(MB);o.start(t);o.stop(t+d+.05)}
function nz(t,d,v,hp,bp){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type=bp?"bandpass":"highpass";f.frequency.setValueAtTime(hp,t);if(bp)f.frequency.exponentialRampToValueAtTime(bp,t+d);env(g,t,.002,d,v);s.connect(f);f.connect(g);g.connect(MB);s.start(t,Math.random()*.5);s.stop(t+d+.02)}
function kick(t,v){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);env(g,t,.002,.2,v);o.connect(g);g.connect(MB);o.start(t);o.stop(t+.25)}
function hit(S,x,t,sd){const b=x%16,c=S.ch[(x/16|0)%4],r=c[0],game=cur.startsWith('game'),hot=G&&G.lives===1,tense=game&&G&&G.c&&!G.c.done&&G.c.t<=5&&G.c.t>0;
 if(S.k[b]==="x"||(tense&&b%4===0))kick(t,.9);
 if(S.s[b]==="x"){nz(t,.14,.5,1800);osc("triangle",190,t,.1,.3)}else if(S.s[b]==="g")nz(t,.08,.15,2200);
 const h=S.h[b];if(h==="X")nz(t,.04,.14,7000);else if(h==="x"||h==="o"||((hot||tense)&&b%2))nz(t,h==="o"?.12:.04,.08,7000);
 const bn=S.bass[b];if(bn!==undefined){const f=mf(r-12+bn);osc("sawtooth",f,t,sd*1.7,.22,1500);osc("sine",f,t,sd*1.7,.3)}
 if(S.st[b]==="x")c[1].forEach((n,k)=>osc(game?"sawtooth":"triangle",mf(r+12+n),t,game?.13:.35,.045,game?2600:0,k*5-8));
 const li=S.lead[x%32];if(li!==".")osc(S.lt,mf((S.base||62)+PENT[+li]+(hot?12:0)),t,sd*1.9,.06,3200);
 if(!game&&x%64>=62)nz(t,.12,.2,500,3500)}
setInterval(()=>{if(!AC)return;audioInit();if(AC.state==="suspended")AC.resume();MG.gain.value=mus?.9:0;if(!mus||!cur)return;const S=SONG[cur],sd=60/S.bpm/4;if(nT<AC.currentTime)nT=AC.currentTime+.05;
 while(nT<AC.currentTime+.2){hit(S,sx,nT+(sx%2?S.sw*sd:0),sd);nT+=sd;sx++}},50);
// ===== APRESENTADOR durante o jogo =====
const pick=a=>a[Math.random()*a.length|0];let prT,lastSay=0;
function say(m,ms,force){if(!force&&Date.now()-lastSay<2500)return;lastSay=Date.now();const p=$("#pr"),im=$("#pri");if(!im.getAttribute("src"))im.src=IMG;$("#pb").textContent=m;p.classList.add("on");snd(300+Math.random()*120,.08,"square",.05);clearTimeout(prT);prT=setTimeout(()=>p.classList.remove("on"),ms||3000)}
const MENUL=['Bem-vindo ao SHOW DO BITLHÃO! Eu sou seu apresentador... e seu carrasco.','Escolha a matéria com sabedoria. Spoiler: não vai adiantar.','Boa noite, plateia! Mais um candidato confiante e mal informado.','Ligue o som e prepare o ego para ser esmagado.'],COLL=['Olha a coleção... meio vazia, né?','Cartas bloqueadas só aparecem de costas. Igual sua confiança.'],THL=['Todas as matérias? Corajoso... ou ingênuo.','Redes! Espero que seu conhecimento não fique caindo como o Wi-Fi.','Front-end... aposto que você só sabe centralizar uma div. Mal.','Back-end! Onde ninguém vê seus erros... até o servidor cair.','Ciência de Dados: se torturar os dados, eles confessam. E você?','DevOps! Vai precisar de uma esteira só para sustentar esse ego.','MySQL! Cuidado para não dar um DROP TABLE na própria dignidade.'],DIFFL=['Fácil? Sem vergonha, a gente entende. 35 segundos de pura segurança.','Médio. O famoso nem lá, nem cá. Respeito... mais ou menos.','Difícil! 15 segundos. Boa sorte, você vai precisar de muita.'],QUITL=['Desistiu? Já era de se esperar.','Fugir da run... clássico de quem estudou pouco.','Pode ir. A plateia vai sentir sua falta. Mentira.'],INTRO=["Vamos começar! Tenta não fazer vergonha logo na primeira.","Boa noite, candidato! Vamos começar o show... e a sua humilhação.","Vamos começar? Ou precisa de mais uns minutinhos pra se preparar psicologicamente?"],
NEWQ=["Essa eu sei que você não sabe.","Respira. Ou não, o relógio está correndo.","Fácil, né? Para mim. Para você, não sei.","Já pensou em chutar? Os leigos amam chutar.","Eu leio a pergunta e você faz cara de paisagem. Perfeito."],
WIN=["Sorte de principiante.","Parabéns! Quer um troféu? Não temos.","Até relógio parado acerta duas vezes por dia.","Uau. Anota aí: dia histórico.","Hm. Esperava mais drama."],
LOSE=["Hahaha! Errou. Já era de se esperar.","Essa doeu... em mim, de tanto rir.","Quase! (Mentira, nem perto.)","Vida a menos, dignidade também."],
TOUT=["Dormiu? O relógio não perdoa.","Tempo esgotado! Pensando muito, ou pouco?","Silêncio constrangedor... e uma vida a menos."],
HURRY=["Tic-tac, tic-tac... o relógio não espera!","Cinco segundos! Hora do pânico!","Vai, vai, vai! Ou não. Eu adoro quando falha."],
IDLE=["Tá difícil, né?","Se quiser, eu soletro as alternativas.","Eu espero. Mas o cronômetro não."],
LAST=["Só uma vida... Reza aí!","Última vida! Posso começar a escrever seu epitáfio?"],
CARD=["Escolhe uma carta. Nenhuma vai te salvar, mas vai lá.","Hora das cartas! Escolhe direito... ou não."],
HELP=["Ah, precisa de ajudinha? Claro, claro.","Usando carta? Que coragem... de admitir fraqueza.","Trapaça autorizada. Dessa vez."];
// ===== lógica (regras puras em src/core, testadas com Vitest) =====
const wpick=pickWeighted, esc=escapeHtml;
const offer=()=>coreOffer(CARDS), pv=f=>passiveSum(G.pas,f);
const SEEN=new Set(LS.g('mc_seen2',[]));
const _pick=createPicker(buildBank(questionsData.raw,questionsData.facts),SEEN,{onSave:s=>LS.s('mc_seen2',[...s])});
const pickQ=(d,tf)=>_pick(G,d,tf);
// ===== telas =====
function menu(){G=null;setTrack("menu");$("#pr").classList.remove("on");clearInterval(window.iv);A.classList.add("an");setTimeout(()=>{if(!G)say(pick(MENUL),4200,1)},700);document.body.classList.remove("danger");
 A.innerHTML=`<h1>SHOW DO<br>BITLHÃO</h1><div class=sub>ROGUELIKE DE TI · SÓ CLIQUE</div>
 <div class=box><b>Como jogar:</b> responda até perder as 3 vidas. A cada 5 perguntas escolha 1 de 3 cartas (30 s). Passivas duram a run; ativáveis são de uso único e só 1 por pergunta. Acerto rápido rende bônus.</div>
 <div class=box><b>Apelido</b><input id=nk maxlength=20 placeholder="Seu apelido" value="${prof.nick.replace(/"/g,"&quot;")}">
 <p><b>Matéria</b></p><div class=row id=th></div><p><b>Dificuldade (tempo por pergunta)</b></p><div class=row id=df></div></div>
 <div class=row><button class="btn yl" id=go>JOGAR</button><button class="btn" id=cl>COLEÇÃO</button><button class="btn cy" id=mt>♪ MÚSICA: ${mus?"ON":"OFF"}</button></div>
 <div class=chip>v${VER} · Recorde: ${prof.best} · Última: ${prof.last} · Cartas desbloqueadas: ${prof.unl.length}/${CARDS.length}</div>`;
 let th=-1,df=1;const ths=["TODAS",...TH],dfs=["FÁCIL · 35 s","MÉDIO · 25 s","DIFÍCIL · 15 s"];
 const draw=()=>{$("#th").innerHTML=ths.map((t,i)=>`<button class="chip ${i-1===th?"on":""}" data-i=${i-1}>${t}</button>`).join("");$("#df").innerHTML=dfs.map((t,i)=>`<button class="chip ${i===df?"on":""}" data-i=${i}>${t}</button>`).join("")};draw();
 $("#th").onclick=e=>{if(e.target.dataset.i){th=+e.target.dataset.i;draw();say(THL[th+1],3600,1)}};$("#df").onclick=e=>{if(e.target.dataset.i){df=+e.target.dataset.i;draw();say(DIFFL[df],3600,1)}};
 $("#mt").onclick=()=>{mus=!mus;$("#mt").textContent="♪ MÚSICA: "+(mus?"ON":"OFF")};
 $('#cl').onclick=()=>coll(1);$("#go").onclick=()=>{prof.nick=$("#nk").value.trim()||"Anônimo";LS.s("mc_prof",prof);
  G={theme:th,diff:df,lim:TIME[df],lives:3,score:0,turn:0,ok:0,pas:[],hand:[],lock:false,used:new Set()};nextQ()};}
function nextQ(){G.turn++;setTrack("game",G.turn>1&&G.turn%5===1);const d=wpick(DIFF_W[Math.min(3,(G.turn-1)/5|0)]);setQ(pickQ(d),{});
 if(G.turn===1)say(pick(INTRO),3800,1);else if(G.lives===1)say(pick(LAST),3200);else if(G.turn%5===1)say("Bloco novo, dificuldade nova. Vai precisar de sorte.",3200);else if(Math.random()<.35)say(pick(NEWQ))}
function setQ(q,o){const lim=G.lim+pv("time")+(o.extra||0);G.c=Object.assign({q,rem:[],shield:false,mult:1,pct:0,quick:false,fixed:0,t:lim,lim,done:false,rev:false,fresh:1},o);drawQ();
 clearInterval(window.iv);window.iv=setInterval(()=>{const c=G.c;if(G.pause)return;if(c.frz>0)c.frz-=.1;else c.t=Math.max(0,c.t-.1);upd();if(c.t<=5&&c.t>0&&Math.abs(c.t-Math.round(c.t))<.05)snd(880,.05,"square",.06);if(c.t<=5&&c.t>0&&!c.w5){c.w5=1;say(pick(HURRY),2600,1)}if(c.t<=c.lim-12&&c.t>6&&!c.w12){c.w12=1;say(pick(IDLE))}if(c.t<=0)answer(-1)},100)}
function upd(){const c=G.c,b=$(".bar");if(!b)return;$("#bf").style.width=(c.t/c.lim*100)+"%";$("#tt").textContent=c.t.toFixed(1)+" s";b.classList.toggle("low",c.t<=5)}
function drawQ(){const c=G.c,q=c.q;document.body.classList.toggle("danger",G.lives===1);
 A.innerHTML=`<div class=hud><span>❤️ ${"♥".repeat(G.lives)}</span><span>PERGUNTA ${G.turn}</span><span>★ ${G.score}</span><span>🃏 próx. escolha em ${5-(G.turn-1)%5}</span></div>
 <div class="box qbox"><span class=tag>${TH[q.th]} · ${DN[q.d]} · ${q.t==="m"?"MÚLTIPLA ESCOLHA":"VERDADEIRO OU FALSO"}${c.quick?" · RÁPIDA":""}</span><h2>${esc(q.x)}</h2></div>
 <div class=bar><i id=bf></i><b id=tt></b></div>
 <div class=opts>${q.o.map((t,i)=>`<button class="opt ${c.rem.includes(i)?"rem":""} ${c.rev&&i===q.a?"rev":""}" data-i=${i} ${c.rem.includes(i)||c.done?"disabled":""}>${esc(t)}</button>`).join("")}</div>
 <div class=hand><small>CARTAS ATIVÁVEIS ${G.lock?"(bloqueadas até a próxima escolha)":""}</small><br>${G.hand.length?G.hand.map((k,i)=>`<button class=mini data-h=${i} style="border-color:var(--${k.r==="c"?"tx":k.r==="r"?"cy":k.r==="e"?"pk":"yl"})" title="${k.desc}" ${G.lock||c.done?"disabled":""}>${k.ic} ${k.name} <small>${RN[k.r]}</small></button>`).join(""):"<small style=color:#999>nenhuma</small>"}
 <div style="font-size:.8rem;color:#bbb;margin-top:6px">${G.hand.length?"Passe o mouse/segure para ver o efeito. ":""}Passivas ativas: ${G.pas.length?G.pas.map(p=>p.ic).join(" "):"—"}</div></div><div class=fb id=fb></div>`;
 document.querySelector(".opts").onclick=e=>{const b=e.target.closest(".opt");if(b&&!b.disabled)answer(+b.dataset.i)};
 document.querySelector(".hand").onclick=e=>{const b=e.target.closest(".mini");if(b&&!b.disabled)useCard(+b.dataset.h)};A.classList.remove("shk");A.classList.toggle("an",!!c.fresh);c.fresh=0;layout();addQuit();upd()}
function useCard(i){const r=useActive(G,i,{pickQ,catalog:CARDS});if(!r)return;sfx('card');say(r.spin?'🎡 A roleta parou em: '+r.spin+'!':pick(HELP),2800,1);drawQ()}
function answer(i){const c=G.c;if(c.done)return;c.done=true;clearInterval(window.iv);const q=c.q,right=i===q.a;
 document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;const j=+b.dataset.i;if(j===q.a)b.classList.add("ok");else if(j===i)b.classList.add("no")});
 document.querySelectorAll(".mini,.fc").forEach(b=>b.disabled=true);let msg;
 if(right){const pts=calcPoints(G,c);G.score+=pts;G.ok++;msg=`ACERTOU! +${pts}`;snd(784,.12);setTimeout(()=>snd(1047,.2),120)}
 else{const w=resolveWrong(G,c),tag=i<0?"TEMPO ESGOTADO":"ERROU";msg=w.saved?tag+(w.saved==="trevo"?" — 🍀 o trevo salvou sua vida!":" — escudo salvou sua vida!"):tag+(w.lost>1?" −"+w.lost+" vidas":" −1 vida")+(w.revived?" — 🐦 a Fênix renasceu!":"");document.body.classList.toggle("danger",G.lives===1);snd(140,.4,"sawtooth",.1)}
 const f=$("#fb");if(f)f.textContent=msg;A.classList.remove("an");if(right){const sp=document.querySelectorAll(".hud span")[2];if(sp){sp.textContent="★ "+G.score;sp.classList.add("bump")}}else{A.classList.add("shk");const hs=document.querySelectorAll(".hud span")[0];if(hs)hs.textContent="❤️ "+"♥".repeat(Math.max(0,G.lives))}G.st=right?(G.st||0)+1:0;say(right?(G.st===3?"Três seguidas? Calma, não se anima.":pick(WIN)):(i<0?pick(TOUT):pick(LOSE)),3000,1);
 setTimeout(()=>{if(G.quit)return;if(G.lives<=0)return end();if(G.turn%5===0)cards();else nextQ()},1500)}
function cards(){G.lock=false;const cs=offer();let t=PICK_S+3;say(pick(CARD),3200,1);A.classList.add("an");
 A.innerHTML=`<div class=hud><span>ESCOLHA UMA CARTA</span><span id=ct>${PICK_S}s</span><span>★ ${G.score}</span></div>
 <div class=cards>${cs.map((k,i)=>`<button class="card" data-i=${i} style="--i:${i}"><div class=fl><div class=cb>?</div><div class=ff><div class="cf r-${k.r}"><div class=ct><b>${RN[k.r]}</b><em>${k.k==="p"?"PASSIVA":"ATIVÁVEL"}</em></div><div class=ic>${k.ic}</div><h3>${k.name}</h3><p>${k.desc}</p><small>${k.k==="p"?"DURAÇÃO: ATÉ O FIM DA RUN":"DURAÇÃO: USO ÚNICO"}</small></div></div></div></button>`).join("")}</div>
 <p class=sub>Cartas podem se repetir. Sem escolha em 30 s, você segue sem carta.</p>`;
 addQuit();const done=k=>{if(G.quit)return;clearInterval(window.iv);if(k){(k.k==="p"?G.pas:G.hand).push(k);if(!prof.unl.includes(k.id))prof.unl.push(k.id);LS.s("mc_prof",prof);snd(988,.2,"triangle",.08)}nextQ()};
 const cc=document.querySelector(".cards");cc.style.pointerEvents="none";setTimeout(()=>{cc.style.pointerEvents=""},2900);
 if(MB)nz(AC.currentTime,.4,.25,300,3000);[0,1,2].forEach(i=>setTimeout(()=>snd(500+i*200,.12,"triangle",.07),1250+i*600));
 cc.onclick=e=>{const b=e.target.closest(".card");if(b&&!cc.classList.contains("sel")){cc.classList.add("sel");b.classList.add("pk");clearInterval(window.iv);sfx('pick');setTimeout(()=>done(cs[+b.dataset.i]),650)}};
 clearInterval(window.iv);window.iv=setInterval(()=>{if(G.pause)return;t--;const e=$("#ct");if(e)e.textContent=Math.min(t,PICK_S)+"s";if(t===12)say("Escolhe logo! Eu tenho outros programas pra apresentar.",3000,1);if(t<=5)snd(700,.05);if(t<=0)done(null)},1000)}
function cardHTML(k){return `<div class=ct><b>${RN[k.r]}</b><em>${k.k==='p'?'PASSIVA':'ATIVÁVEL'}</em></div><div class=ic>${k.ic}</div><h3>${k.name}</h3><p>${k.desc}</p><small>${k.k==='p'?'DURAÇÃO: ATÉ O FIM DA RUN':'DURAÇÃO: USO ÚNICO'}</small>`}
// Em jogo: cartas inteiras, ativáveis à esquerda e passivas à direita
function layout(){const h=A.querySelector('.hand');if(h)h.remove();const c=G.c,mid=document.createElement('div'),gm=document.createElement('div');mid.className='mid';gm.className='gm';while(A.firstChild)mid.appendChild(A.firstChild);
 const col=(t,s,cl)=>`<div class='side ${cl}'><small>${t}</small>${s||'<em>nenhuma</em>'}</div>`;
 gm.innerHTML=col('⚡ ATIVÁVEIS'+(G.lock?' 🔒':''),G.hand.map((k,i)=>`<button class='fc r-${k.r}' data-h=${i} ${G.lock||c.done?'disabled':''}>${cardHTML(k)}</button>`).join(''),'L')+col('♾️ PASSIVAS',G.pas.map(k=>`<div class='fc r-${k.r}'>${cardHTML(k)}</div>`).join(''),'R');
 const cs=document.createElement('div');cs.className='cs';while(gm.firstChild)cs.appendChild(gm.firstChild);gm.appendChild(mid);gm.appendChild(cs);A.appendChild(gm);
 gm.querySelector('.L').onclick=e=>{const b=e.target.closest('.fc');if(b&&!b.disabled)useCard(+b.dataset.h)}}
// Coleção
const CF={s:'all',t:'all',r:'all'};
function coll(f){G=null;$('#pr').classList.remove('on');const un=k=>prof.unl.includes(k.id),sel=(k,o)=>o.map(([v,l])=>`<button class='chip ${CF[k]===v?'on':''}' data-k=${k} data-v=${v}>${l}</button>`).join('');
 const L=CARDS.filter(k=>(CF.s==='all'||(CF.s==='u')===un(k))&&(CF.t==='all'||k.k===CF.t)&&(CF.r==='all'||k.r===CF.r));A.classList.toggle('an',!!f);
 A.innerHTML=`<h1>COLEÇÃO</h1><div class=sub>${prof.unl.length}/${CARDS.length} DESBLOQUEADAS · EXIBINDO ${L.length}</div>
 <div class=box><b>Status</b><div class=row>${sel('s',[['all','TODAS'],['u','DESBLOQUEADAS'],['l','BLOQUEADAS']])}</div><b>Tipo</b><div class=row>${sel('t',[['all','TODOS'],['p','PASSIVAS'],['a','ATIVÁVEIS']])}</div><b>Raridade</b><div class=row>${sel('r',[['all','TODAS'],...KEYS.map(k=>[k,RN[k]])])}</div></div>
 <div class=cg>${L.map(k=>un(k)?`<button class='mc r-${k.r}' data-id=${k.id}><b>${RN[k.r]}</b><div class=ic>${k.ic}</div><h3>${k.name}</h3></button>`:`<div class='mc lk'>?</div>`).join('')||'<em>Nenhuma carta com esse filtro.</em>'}</div>
 <div class=row><button class='btn cy' id=bk>VOLTAR</button></div>`;
 if(f)say(pick(COLL),3000,1);
 A.querySelector('.box').onclick=e=>{const b=e.target.closest('[data-k]');if(b){CF[b.dataset.k]=b.dataset.v;coll()}};
 A.querySelector('.cg').onclick=e=>{const b=e.target.closest('.mc[data-id]');if(b)detail(CARDS.find(k=>k.id===b.dataset.id))};$('#bk').onclick=menu}
function detail(k){const o=document.createElement('div');o.className='ov';o.innerHTML=`<div class='dc cf r-${k.r}'>${cardHTML(k)}</div>`;o.onclick=()=>o.remove();document.body.appendChild(o);snd(880,.1,'triangle',.07)}
function addQuit(){const hud=A.querySelector('.hud');if(!hud||!G)return;const b=document.createElement('button');b.className='qt';b.textContent='✖ DESISTIR';b.onclick=quit;hud.appendChild(b)}
function quit(){if($('.ov'))return;G.pause=true;sfx('open');const o=document.createElement('div');o.className='ov';o.innerHTML=`<div class=box><h2>Desistir da run?</h2><p>Sua pontuação atual (${G.score}) entra no ranking e a partida termina.</p><div class=row><button class='btn cy' id=qn>CONTINUAR</button><button class='btn' id=qy>DESISTIR</button></div></div>`;document.body.appendChild(o);
 $('#qn').onclick=()=>{G.pause=false;o.remove()};$('#qy').onclick=()=>{o.remove();G.pause=false;G.quit=1;end()}}
const SAR=[[0,"Zero? Impressionante. Até chutando às cegas dá para acertar alguma."],[300,"Seu desempenho foi... decorativo. Estudar é grátis, sabia?"],[1000,"Nem ruim, nem bom. O tipo de nota que a gente esquece no boletim."],[2500,"Até que você sabe alguma coisa! Pena que o estagiário também sabe."],[6000,"Opa, quase respeitável. Quase. Não vá postar no LinkedIn ainda."],[1e9,"Uau. Você é bom mesmo... ou o gabarito vazou. Vou investigar."]];
function end(){clearInterval(window.iv);setTrack("menu");$("#pr").classList.remove("on");document.body.classList.remove("danger");const sc=G.score;prof.last=sc;const nb=sc>prof.best;if(nb)prof.best=sc;LS.s("mc_prof",prof);
 const rk=LS.g("mc_rank",[]);rk.push({n:prof.nick,s:sc,d:new Date().toLocaleDateString("pt-BR")});rk.sort((a,b)=>b.s-a.s);rk.length=Math.min(rk.length,5);LS.s("mc_rank",rk);
 const line=G.quit?pick(QUITL):SAR.find(x=>sc<=x[0])[1];sfx(nb&&sc>0?'rec':'over');
 A.innerHTML=`<h1>GAME OVER</h1><div class=sub>FIM DA RUN</div>
 <div class="box pres"><img src="${IMG}" alt="Apresentador"><div class=bub>${G.ok===0?"Nenhum acerto. ":""}${line}<br><small>(${G.ok} acertos em ${G.turn} perguntas)</small></div></div>
 <div class=box><div class=big>${sc} PTS</div><div>${nb?"🏆 NOVO RECORDE PESSOAL!":"Recorde pessoal: "+prof.best}</div></div>
 <div class=box><b>Ranking local</b><table>${rk.map((r,i)=>`<tr><td>${i+1}º</td><td>${r.n.replace(/[<>&]/g,"")}</td><td>${r.s}</td><td>${r.d}</td></tr>`).join("")}</table></div>
 <div class=row><button class="btn yl" id=again>PRÓXIMA PARTIDA</button><button class="btn cy" id=mn>MENU</button></div>`;
 $("#again").onclick=()=>{const g=G;G={theme:g.theme,diff:g.diff,lim:g.lim,lives:3,score:0,turn:0,ok:0,pas:[],hand:[],lock:false,used:new Set()};nextQ()};$("#mn").onclick=menu;A.classList.add("an");const bg=$(".big");let n=0;const ci=setInterval(()=>{n=Math.min(sc,n+Math.ceil(sc/40));bg.textContent=n+" PTS";if(n>=sc)clearInterval(ci)},30)}
menu();
