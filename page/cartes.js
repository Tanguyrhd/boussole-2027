/* ---------- Cartes candidats / partis ----------
   Tout est calculé à partir des 100 positions MonVote2027, avec la même règle pour chaque candidat.
   QM[qid] = [type, libellé si « pour », libellé si « contre »]
     type "change" : la phrase propose un changement par rapport à aujourd'hui (contexte MonVote de la question)
     type "keep"   : la phrase décrit ce qui existe déjà (nucléaire pilier, 2035, RSA conditionné, relations avec la Russie)
   Rupture = « tout à fait pour » un changement, ou « tout à fait contre » ce qui existe. */
const QM={
 q1:["change","Moins d'immigration légale","Immigration légale maintenue"],
 q2:["change","Peines alourdies pour les violences","Pas de hausse des peines"],
 q3:["change","Plus d'impôts sur les très grandes fortunes","Pas d'impôt supplémentaire sur les fortunes"],
 q4:["change","Retraite à un âge plus bas","Âge de départ maintenu"],
 q5:["change","Appliquer les mandats de la CPI, même contre des alliés","Pas d'application systématique des mandats de la CPI"],
 q6:["change","Sortie de l'Union européenne","Rester dans l'Union européenne"],
 q7:["change","Une part de proportionnelle aux législatives","Scrutin majoritaire maintenu"],
 q8:["change","Embauches massives à l'hôpital et à l'école","Pas d'embauches massives"],
 q9:["change","SMIC nettement augmenté","Pas de forte hausse du SMIC"],
 q10:["keep","Le nucléaire reste un pilier","Le nucléaire n'est plus un pilier"],
 q11:["change","Services publics ouverts à la gestion privée","Services publics gardés hors du privé"],
 q12:["change","Sortie de l'OTAN","Rester dans l'OTAN"],
 q13:["change","Référendum d'initiative citoyenne (RIC)","Pas de RIC"],
 q14:["change","Uniforme obligatoire à l'école","Pas d'uniforme obligatoire"],
 q15:["change","Fin des aides aux énergies fossiles","Aides aux énergies fossiles maintenues"],
 q16:["change","Cannabis récréatif légalisé","Cannabis toujours interdit"],
 q17:["change","Excuses officielles pour le passé colonial","Pas d'excuses officielles"],
 q18:["change","Grand plan d'investissement public, même avec plus de déficit","Pas de relance par le déficit"],
 q19:["change","Suppression de l'aide médicale d'État","Aide médicale d'État maintenue"],
 q20:["change","Plus d'aide au développement","Pas de hausse de l'aide au développement"],
 q21:["change","Fin du droit du sol","Droit du sol maintenu"],
 q22:["change","Expulsion systématique des étrangers en situation irrégulière","Pas d'expulsion systématique"],
 q23:["change","Droit de vote local des étrangers non européens","Pas de droit de vote des étrangers"],
 q24:["change","5 ans d'attente pour les aides sociales des étrangers","Pas de délai de 5 ans"],
 q25:["change","Double nationalité restreinte","Double nationalité maintenue"],
 q26:["change","Priorité à l'immigration de travail","Pas de priorité au travail"],
 q27:["change","Regroupement familial facilité","Regroupement familial durci ou maintenu"],
 q28:["change","Plus de demandeurs d'asile accueillis","Pas plus de demandeurs d'asile"],
 q29:["change","Retour des peines planchers","Pas de peines planchers"],
 q30:["change","Mineurs de 16 ans jugés comme des majeurs","Justice des mineurs spécifique maintenue"],
 q31:["change","Développer la retraite par capitalisation","Rester sur la répartition"],
 q32:["change","Priorité aux peines alternatives à la prison","Pas de priorité aux peines alternatives"],
 q33:["change","Autorité indépendante sur les violences policières","Contrôle par l'IGPN et l'IGGN maintenu"],
 q34:["change","Parlementaires sans autre activité rémunérée","Cumul d'activités maintenu"],
 q35:["change","Plus de places de prison","Pas de nouvelles places de prison"],
 q36:["change","Réseaux sociaux responsables des contenus","Pas de responsabilité des plateformes"],
 q37:["change","Prix planchers garantis pour les agriculteurs","Pas de prix planchers"],
 q38:["change","Contribution sur les très gros héritages","Pas de contribution sur les héritages"],
 q39:["change","Baisse des cotisations patronales","Pas de baisse des cotisations patronales"],
 q40:["change","Interdiction de délocaliser après des aides publiques","Pas d'interdiction de délocaliser"],
 q41:["change","Nationalisations dans l'énergie et les transports","Pas de nouvelles nationalisations"],
 q42:["change","Pouvoir déroger à la CEDH sur l'immigration","Respect intégral de la CEDH"],
 q43:["change","Engager le désarmement nucléaire","Garder la dissuasion nucléaire"],
 q44:["keep","Fin des voitures thermiques neuves en 2035","Revenir sur la fin des thermiques en 2035"],
 q45:["change","Revenu universel","Pas de revenu universel"],
 q46:["change","Plus de TVA sur les produits de première nécessité","TVA maintenue sur ces produits"],
 q47:["change","Travailler plus de 35 heures par semaine","35 heures maintenues"],
 q48:["change","Droit de grève limité dans les services publics","Droit de grève intact"],
 q49:["change","PMA remboursée et élargie","PMA inchangée"],
 q50:["change","GPA légalisée","GPA toujours interdite"],
 q51:["change","Aide à mourir légalisée","Pas d'aide active à mourir"],
 q52:["change","Accès à l'avortement élargi","Pas d'élargissement de l'avortement"],
 q53:["change","Taxe carbone sur les billets d'avion","Pas de taxe carbone sur l'avion"],
 q54:["change","Moitié des sièges aux salariés dans les grandes entreprises","Pas de cogestion à égalité"],
 q55:["change","Contrôle strict des loyers","Pas de contrôle strict des loyers"],
 q56:["change","Licenciements économiques simplifiés","Procédures de licenciement maintenues"],
 q57:["change","Taxe carbone augmentée","Pas de hausse de la taxe carbone"],
 q58:["change","Fin progressive de l'élevage intensif","Élevage intensif autorisé"],
 q59:["change","Fin progressive des pesticides","Pesticides autorisés"],
 q60:["change","Corrida interdite","Corrida maintenue"],
 q61:["change","100 % d'électricité renouvelable en 2050","Pas d'objectif 100 % renouvelable"],
 q62:["change","Plus de nouvelles autoroutes","Nouvelles autoroutes possibles"],
 q63:["change","Défense portée à 3 % du PIB","Pas de défense à 3 % du PIB"],
 q64:["change","Taxe sur les superprofits pétroliers","Pas de taxe sur les superprofits"],
 q65:["change","Plus de soutien militaire à l'Ukraine","Pas plus de soutien militaire à l'Ukraine"],
 q66:["change","Contrôles renforcés aux frontières de l'UE","Pas de renforcement des frontières de l'UE"],
 q67:["change","Armée européenne commune","Pas d'armée européenne"],
 q68:["keep","RSA conditionné à des heures d'activité","Fin des heures obligatoires pour le RSA"],
 q69:["keep","Relations diplomatiques maintenues avec la Russie","Rupture des relations avec la Russie"],
 q70:["change","Interdiction de la reconnaissance faciale","Reconnaissance faciale possible"],
 q71:["change","Moins de présence militaire en Afrique","Présence militaire en Afrique maintenue"],
 q72:["change","Fiscalité harmonisée dans l'UE","Pas d'harmonisation fiscale"],
 q73:["change","Passage à une VIe République","Garder la Ve République"],
 q74:["change","Suppression du 49.3","49.3 maintenu"],
 q75:["change","Plus de pouvoirs au Parlement","Équilibre des pouvoirs inchangé"],
 q76:["change","Réquisition des logements vides","Pas de réquisitions"],
 q77:["change","Aides agricoles conditionnées à l'environnement","Pas de conditions environnementales strictes"],
 q78:["change","Signes religieux interdits pour tous dans les services publics","Règles sur les signes religieux inchangées"],
 q79:["change","Congé menstruel remboursé","Pas de congé menstruel"],
 q80:["change","Plus de moyens pour l'audiovisuel public","Pas plus de moyens pour l'audiovisuel public"],
 q81:["change","Éducation à la sexualité renforcée et obligatoire","Éducation à la sexualité inchangée"],
 q82:["change","Revenu maximum légal","Pas de revenu maximum"],
 q83:["change","Limiter la concentration des médias","Pas de nouvelles règles sur les médias"],
 q84:["change","Fin de la carte scolaire","Carte scolaire maintenue"],
 q85:["change","Plus d'autonomie pour l'outre-mer","Statuts de l'outre-mer inchangés"],
 q86:["change","Droit de vote à 16 ans","Droit de vote à 18 ans"],
 q87:["change","Forte hausse du RSA et de l'AAH","Pas de forte hausse des minima sociaux"],
 q88:["change","Service national obligatoire","SNU volontaire"],
 q89:["change","Sécurité sociale à 100 %","Remboursements inchangés"],
 q90:["change","Centres de santé publics contre les déserts médicaux","Pas de réseau de centres publics"],
 q91:["change","Suppression de Parcoursup","Parcoursup maintenu"],
 q92:["change","Mention de genre neutre à l'état civil","Deux mentions de sexe maintenues"],
 q93:["change","Autoroutes renationalisées","Autoroutes concédées au privé"],
 q94:["change","Publicité alcool, tabac, malbouffe restreinte","Règles sur la publicité inchangées"],
 q95:["change","Plus de logements sociaux","Pas plus de logements sociaux"],
 q96:["change","Blocage des réseaux sociaux en cas d'émeutes","Pas de blocage des réseaux sociaux"],
 q97:["change","Expulsions de locataires facilitées","Protection des locataires maintenue"],
 q98:["change","Taxe sur la fast fashion","Pas de taxe sur la fast fashion"],
 q99:["change","Crime d'écocide","Pas de crime d'écocide"],
 q100:["change","Construire plus facilement en zone protégée","Zones protégées préservées"]
};
/* 6 jauges : chaque question compte +1 ou −1 selon qu'être « pour » pousse vers la droite de la jauge. */
const AXES=[
 {id:"eco",t:"Économie",g:"État",d:"Marché",q:{q3:-1,q8:-1,q9:-1,q11:1,q18:-1,q38:-1,q39:1,q41:-1,q45:-1,q47:1,q54:-1,q56:1,q64:-1,q82:-1,q87:-1,q89:-1,q93:-1,q31:1}},
 {id:"immig",t:"Immigration",g:"Ouverture",d:"Fermeture",q:{q1:1,q19:1,q21:1,q22:1,q23:-1,q24:1,q25:1,q27:-1,q28:-1,q42:1,q66:1}},
 {id:"europe",t:"Europe",g:"Plus d'UE",d:"Souveraineté",q:{q6:1,q67:-1,q72:-1,q12:1,q5:-1}},
 {id:"eco2",t:"Écologie",g:"Prioritaire",d:"Secondaire",q:{q15:-1,q44:-1,q53:-1,q57:-1,q58:-1,q59:-1,q61:-1,q62:-1,q77:-1,q99:-1,q98:-1,q100:1}},
 {id:"secu",t:"Sécurité",g:"Prévention",d:"Fermeté",q:{q2:1,q29:1,q30:1,q32:-1,q35:1,q33:-1,q70:-1,q96:1,q14:1,q48:1}},
 {id:"instit",t:"Institutions",g:"Changer",d:"Garder",q:{q7:-1,q13:-1,q73:-1,q74:-1,q75:-1,q86:-1,q34:-1}}
];
const PMETA={
 melenchon:{p:"La France insoumise",col:"#c9283e",fam:"Gauche radicale"},
 roussel:{p:"Parti communiste français",col:"#c4001a",fam:"Gauche communiste"},
 ruffin:{p:"Debout",col:"#e0623a",fam:"Gauche"},
 tondelier:{p:"Les Écologistes",col:"#2a9157",fam:"Gauche écologiste"},
 glucksmann:{p:"Place publique",col:"#d93a7c",fam:"Gauche sociale-démocrate"},
 attal:{p:"Renaissance",col:"#d9a400",fam:"Centre"},
 philippe:{p:"Horizons",col:"#1b6fb5",fam:"Centre droit"},
 retailleau:{p:"Les Républicains",col:"#2a55a8",fam:"Droite"},
 le_pen:{p:"Rassemblement national",col:"#0d378a",fam:"Extrême droite"},
 zemmour:{p:"Reconquête",col:"#1b2a4a",fam:"Extrême droite"}
};
const CORD=["melenchon","roussel","ruffin","tondelier","glucksmann","attal","philippe","retailleau","le_pen","zemmour"];
let CM={mode:"cand",flip:{},filtre:"all"};
function axisScore(c,ax){let s=0,n=0;for(const [q,o] of Object.entries(ax.q)){const qq=Q.find(x=>x.qid===q);if(!qq)continue;const p=qq.pos[c];if(p==null)continue;s+=p*o;n++}return n?[s/(2*n),n]:[null,0]}
function cardData(c){
 const mean=q=>{const v=CORD.map(x=>q.pos[x]).filter(v=>v!=null);return v.reduce((a,b)=>a+b,0)/v.length};
 const rupt=[],keep=[],soft=[];
 for(const q of Q){const m=QM[q.qid],p=q.pos[c];if(!m||p==null)continue;
  const dist=Math.abs(p-mean(q));
  if(m[0]==="change"&&p===2)rupt.push([m[1],q,dist]);
  else if(m[0]==="keep"&&p===-2)rupt.push([m[2],q,dist]);
  else if(m[0]==="change"&&p===-2)keep.push([m[2],q,dist]);
  else if(m[0]==="keep"&&p===2)keep.push([m[1],q,dist]);
  else if(m[0]==="change"&&p===1)soft.push([m[1],q,dist]);}
 const by=l=>l.sort((a,b)=>b[2]-a[2]||a[1].n-b[1].n);
 return {rupt:by(rupt),keep:by(keep),soft:by(soft)};
}
function gauge(c,ax){const [v,n]=axisScore(c,ax);if(v==null)return "";const pct=Math.round((v+1)/2*100);
 return `<div class="cg"><span class="cg-t">${ax.t}</span><span class="cg-r"><span class="cg-bar" role="img" aria-label="${ax.t} : ${ax.g} ↔ ${ax.d}, ${pct} sur 100"><span class="cg-m"></span><span class="cg-d" style="left:${pct}%"></span></span><span class="cg-e"><span>${ax.g}</span><span>${ax.d}</span></span></span></div>`}
function measuresOf(c){const out=[];for(const t of THEMES)for(const m of (t.ms||[]))if(m[0]===c&&out.length<4)out.push([t.name,m]);return out}
function partyVotes(c){const out=[];for(const ch of ["an","ep"]){if(!PARTY[c]||!PARTY[c][ch])continue;
  const l=pAvail(ch).filter(x=>x!==c).map(x=>[x,...pAgree(c,x,ch,"all")]).filter(x=>x[1]!=null).sort((a,b)=>b[1]-a[1]);
  if(l.length)out.push(`<li><b>${ch==="an"?"À l'Assemblée":"Au Parlement européen"}</b> : vote le plus souvent avec ${PARTY[l[0][0]][ch]} (${Math.round(l[0][1]*100)} %), le moins avec ${PARTY[l[l.length-1][0]][ch]} (${Math.round(l[l.length-1][1]*100)} %).</li>`)}
 return out.join("")}
function cardHTML(c){
 const pm=PMETA[c], d=cardData(c), party=CM.mode==="parti", flipped=!!CM.flip[c];
 const ini=NAME[c].split(/[\s-]/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
 /* 5 changements, au plus 2 par thème, pour donner une vue d'ensemble */
 const pool=d.rupt.length>=3?d.rupt:d.rupt.concat(d.soft.map(x=>[x[0]+" (plutôt)",x[1],x[2]]));
 const per={},top=[];for(const r of pool){const t=r[1].theme;if((per[t]||0)>=2)continue;per[t]=(per[t]||0)+1;top.push(r);if(top.length===5)break}
 const dv=(typeof DITVOTE!=="undefined"?DITVOTE.filter(x=>x.cand===c).length:0);
 const front=`<div class="cface cfront">
  <div class="chead" style="background:${pm.col}"><span class="cini">${party?esc(PARTY[c]&&(PARTY[c].an||PARTY[c].ep)||pm.p).slice(0,3):ini}</span><div><div class="cname">${party?esc(pm.p):NAME[c]}</div><div class="csub">${party?"candidat : "+NAME[c]:esc(pm.p)}</div></div></div>
  <div class="cfam"><span>${esc(pm.fam)}</span><span class="mono" title="Questions où il veut un changement fort par rapport à aujourd'hui">${d.rupt.length} changement${d.rupt.length>1?"s":""} fort${d.rupt.length>1?"s":""}</span></div>
  <div class="cgauges">${AXES.map(ax=>gauge(c,ax)).join("")}</div>
  <div class="csec"><div class="cst">Ce qui changerait</div><ul class="clist">${top.map(([l,q])=>`<li><span class="cth">${THNAME[q.theme]}</span>${esc(l)}</li>`).join("")}</ul></div>
  <button class="cflip" data-cflip="${c}">Retourner la carte ↻</button></div>`;
 const ms=measuresOf(c);
 const back=`<div class="cface cback">
  <div class="chead slim" style="background:${pm.col}"><div class="cname">${party?esc(pm.p):NAME[c]}</div></div>
  ${ms.length?`<div class="csec"><div class="cst">Mesures phares</div><ul class="clist small">${ms.map(([t,m])=>`<li><span class="cth">${esc(t)}</span>${m[1]} <a class="src" href="${m[3]}" target="_blank" rel="noopener">source</a></li>`).join("")}</ul></div>`:""}
  ${d.keep.length?`<div class="csec"><div class="cst">Ce qu'il garderait</div><ul class="clist small">${d.keep.slice(0,3).map(([l])=>`<li>${esc(l)}</li>`).join("")}</ul></div>`:""}
  <div class="csec"><div class="cst">${party?"Comment le parti vote":"Comment vote son parti"}</div><ul class="clist small">${partyVotes(c)||"<li>Pas de groupe au Parlement.</li>"}${dv?`<li>${dv} cas « Dit / a voté » publié${dv>1?"s":""}.</li>`:""}</ul></div>
  <div class="clinks"><button class="linkbtn" data-cgo="duel" data-c="${c}">Face à face</button><button class="linkbtn" data-cgo="justice" data-c="${c}">Justice</button><button class="linkbtn" data-cgo="factchecks" data-c="${c}">Fact-checks</button></div>
  <button class="cflip" data-cflip="${c}">Retourner la carte ↻</button></div>`;
 return `<article class="ccardx${flipped?" flipped":""}" style="--pc:${pm.col}" aria-label="Carte ${NAME[c]}"><div class="cinner">${front}${back}</div></article>`;
}
/* Hémicycle : les 10 candidats assis de la gauche vers la droite, sur deux rangées ; un clic ouvre la carte en grand. */
const SEATS=(()=>{const pts=[];
 for(const [k,r] of [[4,0.6],[6,1]])for(let i=0;i<k;i++){const t=Math.PI*(1-(i+0.5)/k);pts.push({x:50+44*r*Math.cos(t),y:94-84*r*Math.sin(t),t})}
 pts.sort((a,b)=>b.t-a.t); /* de gauche à droite, toutes rangées confondues */
 const out={};CORD.forEach((c,i)=>out[c]=pts[i]);return out})();
function seatHTML(c){const pm=PMETA[c],p=SEATS[c],party=CM.mode==="parti";
 const ini=NAME[c].split(/[\s-]/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
 return `<button class="seat" data-copen="${c}" style="left:${p.x}%;top:${p.y}%;--pc:${pm.col}" aria-label="Ouvrir la carte de ${NAME[c]}">
  <span class="seat-h"><span class="seat-i">${ini}</span></span><span class="seat-n">${party?esc(PARTY[c]&&(PARTY[c].an||PARTY[c].ep)||pm.p):NAME[c]}</span><span class="seat-p">${esc(party?NAME[c]:pm.p)}</span></button>`}
function openCard(c){CM.open=c;CM.flip[c]=false;
 let m=document.getElementById("cmodal");if(!m){m=document.createElement("div");m.id="cmodal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");document.body.appendChild(m)}
 const i=CORD.indexOf(c),prev=CORD[(i+9)%10],next=CORD[(i+1)%10];
 m.innerHTML=`<div class="cm-back" data-cclose="1"></div><div class="cm-box"><button class="cm-x" data-cclose="1" aria-label="Fermer">×</button>${cardHTML(c)}
  <div class="cm-nav"><button class="cm-arrow" data-copen="${prev}" aria-label="Carte précédente">‹ ${NAME[prev]}</button><button class="cm-arrow" data-copen="${next}" aria-label="Carte suivante">${NAME[next]} ›</button></div></div>`;
 m.hidden=false;document.body.classList.add("cm-on");const b=m.querySelector(".cflip");if(b)b.focus()}
function closeCard(){const m=document.getElementById("cmodal");if(m)m.hidden=true;document.body.classList.remove("cm-on");
 const s=CM.open&&document.querySelector(`.seat[data-copen="${CM.open}"]`);CM.open=null;if(s)s.focus()}
document.addEventListener("click",e=>{const o=e.target.closest("[data-copen]");if(o){openCard(o.dataset.copen);return}if(e.target.closest("[data-cclose]")){closeCard();return}});
document.addEventListener("keydown",e=>{if(!CM.open)return;if(e.key==="Escape")closeCard();
 if(e.key==="ArrowRight"||e.key==="ArrowLeft"){const i=CORD.indexOf(CM.open);openCard(CORD[(i+(e.key==="ArrowRight"?1:9))%10])}});
function renderCartes(){
 document.getElementById("v-cartes").innerHTML=`<div class="block"><h2>Les candidats, à leur place</h2>
 <p class="lede">Chaque candidat est assis comme dans l'hémicycle, de la gauche vers la droite. Touche une place pour ouvrir sa carte : ce qu'il ou elle changerait, et où il ou elle se situe sur six grandes questions.</p>
 <div class="filters"><div class="fctl"><span class="mono">Afficher</span><div class="seg" role="group">${[["cand","Candidats"],["parti","Partis"]].map(([v,t])=>`<button data-cmode="${v}" aria-pressed="${CM.mode===v}">${t}</button>`).join("")}</div></div></div></div>
 <div class="hemi" role="group" aria-label="Hémicycle des candidats"><div class="hemi-floor"></div>${CORD.map(seatHTML).join("")}<div class="hemi-lab"><span>Gauche</span><span>Droite</span></div></div>
 <details class="block"><summary class="src">Comment les cartes sont calculées</summary>
 <p class="src"><b>Placement</b> : ordre gauche-droite habituel de la science politique, avec la famille politique indiquée sur chaque carte. Ce n'est pas un classement des candidats.</p>
 <p class="src"><b>Ce qui changerait</b> : parmi les 100 questions MonVote2027, celles où le candidat est « tout à fait pour » un changement par rapport à la situation actuelle (telle que décrite par MonVote), ou « tout à fait contre » ce qui existe déjà. On affiche les 5 où il se distingue le plus des autres candidats, avec au plus 2 par thème. S'il en a moins de 3, on complète avec ses positions « plutôt pour » (marquées). Les libellés reprennent les phrases MonVote en version courte.</p>
 <p class="src"><b>Jauges</b> : moyenne de ses positions sur un groupe de questions (liste dans le code source), de la même façon pour tous. Le trait du milieu = position neutre. Une jauge résume une tendance, pas un programme.</p>
 <p class="src"><b>Famille politique</b> : classification courante en science politique et dans la presse. Le classement du RN à l'extrême droite par le ministère de l'Intérieur a été validé par le Conseil d'État en 2024.</p>
 <p class="src"><b>Partis</b> : la carte reprend les positions du candidat (le programme du parti pour 2027) et ajoute la façon dont son groupe vote réellement.</p></details>`;
 if(CM.open)openCard(CM.open);
}
