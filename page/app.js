function T(k,txt){return `<button class="term" data-k="${k}">${txt}</button>`}
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const C=[["le_pen","Le Pen","RN"],["melenchon","Mélenchon","LFI"],["glucksmann","Glucksmann","Place publique"],["philippe","Philippe","Horizons"],["attal","Attal","Renaissance"],["retailleau","Retailleau","LR"],["zemmour","Zemmour","Reconquête"],["tondelier","Tondelier","Écologistes"],["roussel","Roussel","PCF"],["ruffin","Ruffin","Debout !"]];
const NAME=Object.fromEntries(C.map(c=>[c[0],c[1]]));NAME.bardella="Bardella";
const PGSLUG={le_pen:"marine-le-pen",melenchon:"jean-luc-melenchon",glucksmann:"raphael-glucksmann",philippe:"edouard-philippe",attal:"gabriel-attal",retailleau:"bruno-retailleau",zemmour:"eric-zemmour",tondelier:"marine-tondelier",roussel:"fabien-roussel",ruffin:"francois-ruffin",bardella:"jordan-bardella"};
const LAB=["−−","−","0","+","++"], POSCLS={"-2":"m2","-1":"m1","0":"p0","1":"p1","2":"p2"};
const PG="https://poligraph.fr/elections/presidentielle-2027/themes/";
const PGL=PG+"logement-urbanisme", PGA=PG+"agriculture-alimentation";
const PL="https://place-publique.eu/document/3Ari5O0s5O1L4iK1uyUhI0/pp-acte-un.pdf", AEC="https://web.archive.org/web/20260829200732/https://melenchon2027.fr/programme2025/livre/", RN22="https://rassemblementnational.fr/22-mesures", ECO="https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf";

/* Thèmes : 9 choisis + 3 « autres ». look = grille d'analyse propre au thème ; ms = mesures sourcées (curées à la main). */
const THEMES=[
{id:"eco",name:"Économie & budget",look:[["Combien ?","Coût ou recette annoncé, et sur quelle durée."],["Estimation indépendante","Écart entre le chiffre du candidat et un "+T("chiffrage","chiffrage")+" extérieur."],["Qui paie, qui gagne ?","Ménages modestes, classes moyennes, entreprises, plus riches."],["Effets secondaires","Évitement fiscal, emploi, prix, "+T("dette","dette")+"."]],
 ms:[["le_pen","Baisser la TVA de 20 % à 5,5 % sur carburants, fioul, gaz et électricité.","RN, 22 mesures",RN22,"old"],
 ["melenchon","SMIC à 1 600 € nets immédiatement, salaires indexés sur l'inflation.","L'Avenir en commun 2025",AEC+"chapitre8/s4/"],
 ["melenchon","« Héritage maximum » : "+T("tranche","tranche")+" à 100 % au-delà de 12 M€. Les Surligneurs y voyaient un risque de censure par le "+T("conscons","Conseil constitutionnel")+".","Mesure 2022 reprise ; analyse Les Surligneurs","https://www.actu-juridique.fr/ntic-numerique-medias-presse/cette-semaine-chez-les-surligneurs-jl-melenchon-peut-il-confisquer-un-heritage-au-dela-de-12-millions/"],
 ["glucksmann","SMIC à 1 600 € nets dans les deux ans.","Place publique, Acte I (2026)",PL],
 ["philippe","Pacte fiscal : 50 Md€ de baisse des "+T("prod","impôts de production")+" contre 50 Md€ d'aides publiques en moins. Pas de nouvel impôt sur le quinquennat.","edouardphilippe.fr (2026)","https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere"],
 ["attal","Supprimer le plafond légal d'heures supplémentaires (220 h/an par défaut).","attalpresident.fr (2026)","https://attalpresident.fr/programme/travail-salaires"],
 ["retailleau","Seuil annuel de travail porté à 1 623 h (au lieu de 1 607 h), soit deux jours de plus, rémunérés.","LR, « Le travail gagnant » (2026)","https://republicains.fr/wp-content/uploads/2026/01/51705_LesRepublicains_Brochures_A5-40P_DEF.pdf"],
 ["zemmour","Réduire de 20 % la contribution française au budget de l'UE.","Reconquête, européennes 2024","https://assets.ericzemmour.fr/document/Programme%20Reconqu%C3%AAte%20Europ%C3%A9ennes%202024.pdf","old"],
 ["tondelier","Salaire minimum à 2 000 € bruts dès 2027.","Les Écologistes, programme juillet 2026",ECO+"#page=55"],
 ["roussel","Bloquer le prix des carburants à 1,60 €/L.","Tract PCF (2026)","https://assets.nationbuilder.com/pcf/pages/44150/attachments/original/1789976419/tract_carburant.pdf"],
 ["ruffin","Indexer les salaires sur l'inflation, comme jusqu'en 1982.","nouspresident.fr (2026)","https://nouspresident.fr/statut-travailleurs-essentiels/"]]},
{id:"logement",name:"Logement",look:[["Combien et où ?","Nombre de logements, zones tendues ou non, délai réaliste."],["Qui finance ?","État, bailleurs sociaux, communes, investisseurs privés."],["Effet sur les prix","Loyers, prix d'achat, coût du foncier."],["Qui y gagne ?","Locataires, primo-accédants, propriétaires, bailleurs."]],
 ms:[["le_pen","Priorité fondée sur la nationalité pour l'accès au logement social ; abroger les interdictions liées au DPE ; remplacer MaPrimeRénov' par un dispositif « 100 % Rénov ».","Poligraph, programmes RN (2024-2025)",PGL],
 ["melenchon","Construire 200 000 logements publics par an pendant 5 ans ; encadrer les loyers partout, à la baisse dans les grandes villes ; renforcer la "+T("sru","loi SRU")+" (30 %) ; limiter à 5 les logements transmissibles par héritage.","Poligraph, L'Avenir en commun (2025)",PGL],
 ["glucksmann","Fonds national pour aider les collectivités à acheter du foncier et construire du logement social ; programme « Logement d'abord » ; abroger la loi Kasbarian.","Poligraph, Place publique (mars 2026)",PGL],
 ["philippe","Prêt à taux zéro à chaque naissance pour aider les familles qui s'agrandissent à déménager.","Poligraph, propositions de candidature (juillet 2026)",PGL],
 ["attal","Jusqu'à 500 000 logements supplémentaires par surélévation ; priorité de logement social pour les métiers en tension.","Poligraph, programme Renaissance (2025)",PGL],
 ["retailleau","Revenir à 450 000 logements par an ; abroger le Zéro artificialisation nette (ZAN) ; supprimer les interdictions de louer fondées sur le DPE ; logement social réservé aux ménages des 5 premiers déciles.","Poligraph, programme LR (mai 2026)",PGL],
 ["tondelier","500 000 rénovations performantes par an ; généraliser et pérenniser l'encadrement des loyers ; MaPrimeRénov' portée à 5 Md€ en 2027.","Poligraph, Les Écologistes (2026)",PGL],
 ["ruffin","Garantir un logement abordable et proche du travail pour les travailleurs essentiels ; réorienter le « 1 % logement » vers eux.","Poligraph, propositions de candidature (avril 2026)",PGL]],
 gap:"Zemmour et Roussel n'ont aucune mesure logement publiée sur Poligraph. Les listes ci-dessus sont partielles : Poligraph en recense 49 pour Retailleau et 24 pour Mélenchon, mais ses pages de mesures ne sont pas accessibles automatiquement."},
{id:"sante",name:"Santé",look:[["Accès","Déserts médicaux, délais, distance aux urgences."],["Financement","Sécu, mutuelles, "+T("ondam","ONDAM")+", hôpital public vs privé."],["Soignants","Où les trouver, en combien de temps ? On ne forme pas un médecin en 5 ans."],["Prévention","Part du curatif vs prévention et santé-environnement."]],
 ms:[["le_pen","Plan d'urgence santé de 20 Md€ ; arrêter les fermetures de lits et de maternités.","RN, 22 mesures",RN22,"old"],
 ["melenchon",T("secu100","« 100 % Sécu »")+" ; urgences, maternité ou EHPAD public à moins de 30 minutes de chaque Français.","L'Avenir en commun 2025",AEC+"chapitre15/s2/"],
 ["glucksmann","Sortir de la "+T("t2a","tarification à l'acte")+" à l'hôpital, lutter contre la financiarisation ; plan de prévention hors ONDAM.","Place publique, Acte I (2026)",PL],
 ["philippe","Stabiliser les dépenses de santé en misant sur la prévention et la technologie plutôt que sur la hausse des moyens.","edouardphilippe.fr (2026)","https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere"],
 ["zemmour","Recruter 1 000 médecins salariés par l'État dans les déserts médicaux.","Programme 2022","https://assets.nationbuilder.com/themes/61c071ce4764e8b1483d1a8c/attachments/original/1648220408/programme_eric_zemmour_presidentielle_2022.pdf?1648220408","old"],
 ["tondelier","Interdire les "+T("pfas","PFAS")+" et perturbateurs endocriniens ; 2 000 centres de santé d'ici 2030.","Les Écologistes, juillet 2026",ECO+"#page=114"],
 ["roussel","Aller vers le 100 % Sécurité sociale ; pôle public du médicament.","Lettre aux soignants (2026)","https://assets.nationbuilder.com/pcf/pages/44149/attachments/original/1789976358/lettre_aux_soignants.pdf"]],
 gap:"Attal, Retailleau et Ruffin : aucune mesure santé trouvée dans les sources lues."},
{id:"retraites",name:"Retraites",look:[["Âge et durée","Qui part quand, avec combien d'annuités ?"],["Équilibre financier","Comment le système reste payé : cotisations, impôts, déficit ?"],["Les jeunes","Effet sur la pension future des actifs d'aujourd'hui."],["Modèle",T("repart","Répartition")+" ou part de "+T("capi","capitalisation")+"."]],
 ms:[["le_pen","Retraite à 60 ans pour ceux qui ont commencé avant 20 ans, avec 40 annuités.","RN, 22 mesures",RN22,"old"],
 ["melenchon","Abroger les 64 ans ; retraite à 60 ans à taux plein avec 40 annuités.","L'Avenir en commun 2025",AEC+"chapitre8/s8/"],
 ["glucksmann","Abroger la réforme de 2023.","Place publique, Acte I (2026)",PL],
 ["tondelier","Abroger les 64 ans, revenir à 62 ans et viser 60 ans.","Les Écologistes, juillet 2026",ECO+"#page=116"]]},
{id:"solidarite",name:"Solidarité & protection sociale",look:[["Montant et ciblage","Qui reçoit quoi, à partir de quel seuil ?"],["Conditions","Activité, nationalité, durée de résidence."],["Non-recours","Une part des ayants droit ne demande pas l'aide. La mesure le corrige-t-elle ?"],["Incitation au travail","Gagne-t-on toujours plus en reprenant un emploi ?"]],
 ms:[["retailleau","« RIA socle » de 300 € par mois pour un adulte de moins de 65 ans sans activité ni revenu, en situation régulière.","LR, « Le travail gagnant » (2026)","https://republicains.fr/wp-content/uploads/2026/01/51705_LesRepublicains_Brochures_A5-40P_DEF.pdf"]]},
{id:"energie",name:"Énergie & environnement",look:[["Émissions","Combien de CO₂ évité, et d'ici quand ?"],["Coût et facture","Pour l'État et pour les ménages."],["Délai réel","Un "+T("epr2","EPR2")+" ou un réseau de transport ne se construit pas en 5 ans."],["Dépendances","Gaz importé, uranium, panneaux et batteries."]],
 ms:[["le_pen","Arrêter l'éolien et démanteler progressivement les parcs ; relancer nucléaire, hydroélectricité, hydrogène.","RN, 22 mesures",RN22,"old"],
 ["melenchon","Baisser les émissions de 65 % en 2030 ; plan de 200 Md€ d'investissements écologiques et sociaux.","L'Avenir en commun 2025",AEC+"chapitre12/s1/"],
 ["glucksmann","Grande loi Climat : -90 % en 2040, neutralité en 2050 ; loi anti fast-fashion, score carbone obligatoire.","Place publique, Acte I (2026)",PL],
 ["philippe","Relancer le nucléaire, développer les renouvelables, électrifier les usages ; prix du carbone aux frontières de l'UE.","edouardphilippe.fr (2026)","https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante"],
 ["attal","Tripler le rythme de baisse des émissions (de 1,8 % à 5 % par an) ; rénovation thermique massive.","attalpresident.fr (2026)","https://attalpresident.fr/programme/dette-ecologique"],
 ["retailleau","8 EPR2 supplémentaires si les 6 premiers avancent bien ; abroger le volet électricité de la "+T("ppe","PPE 3")+" et stopper les appels d'offres solaire et éolien en mer.","LR, livret « Électricité » (2026)","https://republicains.fr/wp-content/uploads/2026/05/LR_Electricite_vFF070626.pdf"],
 ["zemmour","Supprimer l'interdiction des "+T("thermique","thermiques en 2035")+" et tout financement de l'éolien.","Reconquête, européennes 2024","https://assets.ericzemmour.fr/document/Programme%20Reconqu%C3%AAte%20Europ%C3%A9ennes%202024.pdf","old"],
 ["tondelier","Limiter les thermiques à 110 km/h sur autoroute ; moratoire sur les "+T("megab","mégabassines")+".","Les Écologistes, juillet 2026",ECO+"#page=23"],
 ["roussel","Baisser de 30 % les tarifs de l'électricité et du gaz ; transports publics gratuits.","Discours 40e congrès PCF (2026)","https://www.pcf.fr/40e_congres_discours_de_cloture_de_fabien_roussel"],
 ["ruffin","Interdire la publicité pour les produits les plus polluants ; interdire les vols intérieurs si le train fait moins de 4 h.","nouspresident.fr (2026)","https://nouspresident.fr/travaillisme-ecologique/"]]},
{id:"agri",name:"Agriculture",look:[["Revenu agricole","Les agriculteurs vivent-ils mieux de leur production ?"],["Prix consommateur","Qui absorbe la hausse : distributeurs, État ou ménages ?"],["Cadre européen","La PAC et les accords commerciaux se décident à Bruxelles."],["Ressources","Eau, sols, pesticides."]],
 ms:[["le_pen","« Exception agriculturelle » : exclure l'agriculture des accords de libre-échange ; 80 % de produits français dans les cantines.","Poligraph, programmes RN (2024)",PGA],
 ["melenchon","Créer 300 000 emplois agricoles par une agriculture relocalisée et écologique ; cantines 100 % bio et locales.","Poligraph, L'Avenir en commun (2025)",PGA],
 ["glucksmann","Réformer la PAC pour soutenir la majorité des agriculteurs ; revenu de transition écologique pour ceux qui changent de pratiques.","Poligraph, Place publique (mars 2026)",PGA],
 ["philippe","100 territoires de souveraineté alimentaire ; supprimer toute surtransposition agricole ; plan de transmission des exploitations.","Poligraph, propositions de candidature (juillet 2026)",PGA],
 ["attal","Contrats de transition agricole tripartites (bien-être animal, réduction des pesticides) ; origine affichée pour les produits hors UE.","Poligraph, programme Renaissance (2025)",PGA],
 ["retailleau","Reconnaître le stockage d'eau agricole comme d'« intérêt général majeur ».","Poligraph, programme LR (février 2026)",PGA],
 ["tondelier","Sortie progressive des pesticides de synthèse et des engrais azotés d'ici 2050 ; moratoire sur les "+T("megab","mégabassines")+".","Poligraph / Les Écologistes (juillet 2026)",PGA]],
 gap:"Zemmour, Roussel et Ruffin n'ont aucune mesure agriculture publiée sur Poligraph. Liste partielle pour les autres (49 mesures pour Retailleau)."},
{id:"immig",name:"Immigration",look:[["Faisabilité juridique","Constitution, "+T("cedh","CEDH")+", droit de l'UE : la mesure tient-elle ?"],["Chiffres réels","Flux par motif : travail, famille, asile, études."],["Exécution","Une loi ne suffit pas : voir le faible taux d'exécution des "+T("oqtf","OQTF")+"."],["Économie","Besoins des secteurs en tension (santé, BTP, agriculture)."]],ms:[]},
{id:"instit",name:"Institutions",look:[["Révision requise ?","Beaucoup de mesures exigent une "+T("rev","révision constitutionnelle")+"."],["Équilibre des pouvoirs","Président, Parlement, juges, citoyens."],["Garde-fous","Que se passe-t-il si la mesure est mal utilisée ?"],["Majorité nécessaire","Le président seul ne peut presque rien changer ici."]],ms:[]},
{id:"securite",name:"Sécurité & justice",extra:1,look:[["Effet mesuré","La mesure a-t-elle fait baisser la délinquance là où elle a été essayée ?"],["Capacité","Places de prison, juges, policiers : existent-ils ?"],["Libertés","Quels contrôles, quels recours ?"],["Constitution","Peines automatiques, mineurs : le juge constitutionnel veille."]],ms:[]},
{id:"monde",name:"Europe & international",extra:1,look:[["Cadre européen","Ce qui se décide à Paris, et ce qui se décide à Bruxelles."],["Alliances","OTAN, Ukraine, relations avec la Russie et les États-Unis."],["Coût","Budget de la défense, contribution à l'UE."],["Crédibilité","Une sortie ou un veto a des conséquences : lesquelles ?"]],ms:[]},
{id:"societe",name:"Société & éducation",extra:1,look:[["Droits","Qui gagne ou perd un droit ?"],["Consensus","Existe-t-il une majorité dans l'opinion et au Parlement ?"],["Mise en œuvre","Moyens, délais, acteurs concernés."],["Valeurs","Ici, les désaccords sont souvent de principe plus que de chiffres."]],ms:[]}
];

const KEY="boussole2027_v2";
let S={a:{},w:{}};
try{const r=localStorage.getItem(KEY)||localStorage.getItem("boussole2027_v1");if(r){S=JSON.parse(r);
 /* migration v1 -> v2 : ancienne clé "eco0" vers id de question MonVote */
 const MAP={eco:["q3","q38","q18","q39","q41","q9"],sante:["q8","q19","q16"],retraites:["q4","q31"],solidarite:["q45","q24","q46","q11"],energie:["q10","q15","q44"],agri:["q37"],immig:["q1","q21","q42","q22"],instit:["q7","q13","q33","q12"]};
 for(const k of Object.keys(S.a)){const m=k.match(/^([a-z]+)(\d+)$/);if(m&&MAP[m[1]]){S.a[MAP[m[1]][+m[2]]]=S.a[k];delete S.a[k]}}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

let Q=[],AFF=[],FC=[],META={};
let curTheme="eco", openSrc=null; /* openSrc = qid|cand */

function srcHTML(q,c){
 const l=q.src[c]||[];
 if(!l.length)return `<div class="srcpanel"><h5>${NAME[c]}</h5><p class="src">Aucune source publiée par MonVote2027 pour cette position.</p></div>`;
 return `<div class="srcpanel"><h5>${NAME[c]} : ${q.pos[c]==null?"pas de position":LAB[q.pos[c]+2]}</h5>${l.map(s=>`<div class="srcitem"><div class="meta"><span class="badge-type${s.type.startsWith("Vote")?" vote":""}">${esc(s.type)}</span>${esc(s.date)}</div><div><b>${esc(s.titre)}</b></div>${s.citation?`<div class="cit">${esc(s.citation)}</div>`:""}${s.url?`<a class="src" href="${esc(s.url)}" target="_blank" rel="noopener">Voir la source</a>`:""}</div>`).join("")}<p class="src">Citations résumées par MonVote2027 : vérifie la source avant de citer.</p></div>`;
}
function qHTML(q){
 const mine=S.a[q.qid];
 const cols=[-2,-1,0,1,2].map(v=>`<div class="col c${v}"><div class="lab">${LAB[v+2]}</div>${C.filter(c=>q.pos[c[0]]===v).map(c=>{const voted=(q.src[c[0]]||[]).some(s=>s.type.startsWith("Vote"));return `<button class="cand${voted?" voted":""}" data-src="${q.qid}|${c[0]}" aria-pressed="${openSrc===q.qid+"|"+c[0]}" title="${voted?"Position appuyée sur un vote":"Voir les sources"}">${c[1]}</button>`}).join("")}</div>`).join("");
 const missing=C.filter(c=>q.pos[c[0]]==null).map(c=>c[1]);
 const os=openSrc&&openSrc.startsWith(q.qid+"|")?srcHTML(q,openSrc.split("|")[1]):"";
 return `<div class="q"><h4><span class="mono">Q${q.n}</span> ${esc(q.text)}</h4>${q.context?`<p class="ctx">${esc(q.context)}</p>`:""}<div class="scale">${cols}</div>${missing.length?`<p class="src">Sans position : ${missing.join(", ")}</p>`:""}${os}
 <div class="mine"><span class="lbl">Ma position</span><div class="vote">${[-2,-1,0,1,2].map(v=>`<button data-q="${q.qid}" data-v="${v}" aria-pressed="${mine===v}">${LAB[v+2]}</button>`).join("")}</div></div></div>`;
}
function renderThemes(){
 const th=THEMES.find(t=>t.id===curTheme), w=S.w[th.id]??2, qs=Q.filter(q=>q.theme===th.id);
 const chip=t=>`<button class="chip" data-th="${t.id}" aria-pressed="${t.id===curTheme}">${t.name}</button>`;
 let h=`<div class="themepick"><div class="chips" role="group" aria-label="Thèmes principaux">${THEMES.filter(t=>!t.extra).map(chip).join("")}</div><div class="chipgrp"><span class="grplab">Autres thèmes</span><div class="chips" role="group" aria-label="Autres thèmes">${THEMES.filter(t=>t.extra).map(chip).join("")}</div></div></div>
 <div class="block"><h2>${th.name}</h2>
 <div class="weight"><label for="w-${th.id}" class="mono">Importance pour moi</label><input id="w-${th.id}" type="range" min="0" max="3" step="1" value="${w}" data-w="${th.id}"><span class="mono" id="wl">${["Aucune","Faible","Moyenne","Forte"][w]}</span></div></div>
 <div class="block"><h3>Ce qu'il faut regarder sur ce thème</h3><div class="lookfor">${th.look.map(l=>`<div><b>${l[0]}</b><span>${l[1]}</span></div>`).join("")}</div></div>
 <div class="block"><h3>${qs.length} question${qs.length>1?"s":""} qui séparent les candidats</h3>
 <div class="legend"><span>Positions MonVote2027, de −− (tout à fait contre) à ++ (tout à fait pour). Clique sur un nom pour voir ses sources. Nom souligné en bleu : position appuyée sur un vote au Parlement.</span></div>
 ${qs.map(qHTML).join("")}</div>`;
 if(th.gap)h+=`<p class="note">${th.gap}</p>`;
 if(th.ms.length)h+=`<div class="block"><h3>Mesures phares sourcées</h3><div class="measures">${th.ms.map(m=>`<div class="m"><div class="who">${NAME[m[0]]}</div><div class="what">${m[1]}${m[4]==="old"?'<span class="tag old">source 2022-2024</span>':""}<div class="src"><a href="${m[3]}" target="_blank" rel="noopener">${m[2]}</a></div></div></div>`).join("")}</div>
 <p class="src">Absent de la liste = aucune mesure trouvée dans les sources lues, pas forcément absence de proposition.</p></div>`;
 document.getElementById("v-themes").innerHTML=h;
}

function renderAff(){
 const res=C.map(c=>{let num=0,den=0;Q.forEach(q=>{const u=S.a[q.qid],w=S.w[q.theme]??2,p=q.pos[c[0]];if(u===undefined||w===0||p==null)return;num+=w*(4-Math.abs(u-p));den+=w*4});return [c,den?num/den:null]});
 const n=Object.keys(S.a).filter(k=>Q.some(q=>q.qid===k)).length;
 res.sort((a,b)=>(b[1]??-1)-(a[1]??-1));
 let h=`<div class="block"><h2>Mon affinité</h2><p class="lede">Tu as répondu à ${n} question${n>1?"s":""} sur ${Q.length}. Pour chaque question, plus ta position est proche de celle du candidat, plus il marque de points ; chaque thème compte selon l'importance que tu lui as donnée.</p></div>`;
 if(!n)h+=`<p class="note">Réponds à quelques questions dans l'onglet Thèmes : ton classement apparaîtra ici.</p>`;
 else h+=`<div class="bars">${res.map(([c,s])=>`<div class="bar"><span class="mono">${c[1]}</span><div class="track"><div class="fill" style="width:${s===null?0:Math.round(s*100)}%"></div></div><span class="v">${s===null?"—":Math.round(s*100)+" %"}</span></div>`).join("")}</div>
 <p class="note">Ce score ne dit pas pour qui voter. Les questions sont formulées par MonVote2027, et le score ignore le réalisme, le financement, les votes passés et la probité. Sers-t'en pour repérer des surprises, puis va lire le détail.</p>`;
 h+=`<div class="card"><h3>Sauvegarder mes réponses</h3><p class="src">Tes réponses restent dans ce navigateur seulement. Pour les retrouver sur un autre appareil, copie ce texte et colle-le là-bas.</p>
 <textarea id="exp" aria-label="Export">${esc(JSON.stringify(S))}</textarea>
 <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="cp">Copier</button><button class="btn ghost" id="imp">Importer ce texte</button><button class="btn ghost" id="rst">Tout effacer</button></div><p class="src" id="msg"></p></div>`;
 document.getElementById("v-affinite").innerHTML=h;
}

const THNAME=Object.fromEntries(THEMES.map(t=>[t.id,t.name]));
const posKey=p=>p==null?"na":p>0?"pour":p<0?"contre":"neutre";
/* accord avec moi : écart d'au plus 1 cran = accord, d'au moins 3 crans = désaccord */
const meKey=(q,c)=>{const u=S.a[q.qid],p=q.pos[c];if(u===undefined||p==null)return "na";const d=Math.abs(u-p);return d<=1?"accord":d>=3?"desaccord":"entre"};
function sel(id,label,opts,cur){return `<div class="fctl"><label for="${id}" class="mono">${label}</label><select id="${id}">${opts.map(([v,t])=>`<option value="${v}"${cur===v?" selected":""}>${t}</option>`).join("")}</select></div>`}
function seg(name,opts,cur){return `<div class="fctl"><span class="mono">Affichage</span><div class="seg" role="group">${opts.map(([v,t])=>`<button data-seg="${name}" data-val="${v}" aria-pressed="${cur===v}">${t}</button>`).join("")}</div></div>`}
let VF={cand:"all",pos:"all",theme:"all",view:"liste"};
function voteRows(){const rows=[];Q.forEach(q=>C.forEach(c=>(q.src[c[0]]||[]).forEach(s=>{if(s.type.startsWith("Vote"))rows.push({q,c:c[0],s})})));return rows}
function vposOK(r){const v=VF.pos;if(v==="all")return true;if(v==="accord"||v==="desaccord")return meKey(r.q,r.c)===v;return posKey(r.q.pos[r.c])===v}
function vsrc(r){return `<div class="src"><span class="badge-type vote">${esc(r.s.type)}</span>${esc(r.s.date)} · ${esc(r.s.titre)}${r.s.url?` · <a href="${esc(r.s.url)}" target="_blank" rel="noopener">source</a>`:""}</div>${r.s.citation?`<div class="src">${esc(r.s.citation)}</div>`:""}`}
function renderVotes(){
 const all=voteRows(), answered=Object.keys(S.a).length>0;
 const f=all.filter(r=>(VF.cand==="all"||r.c===VF.cand)&&vposOK(r)&&(VF.theme==="all"||r.q.theme===VF.theme)).sort((a,b)=>a.q.n-b.q.n||C.findIndex(c=>c[0]===a.c)-C.findIndex(c=>c[0]===b.c));
 const base=all.filter(r=>VF.theme==="all"||r.q.theme===VF.theme);
 const uniq=l=>[...new Map(l.map(r=>[r.q.qid+"|"+r.c,r])).values()];
 const summary=C.map(c=>{const l=uniq(base.filter(r=>r.c===c[0])),n=l.length,k=t=>l.filter(r=>posKey(r.q.pos[r.c])===t).length;
  return `<button class="fcrow rowbtn${n?"":" few"}" data-vcand="${c[0]}" aria-pressed="${VF.cand===c[0]}"><span class="mono">${c[1]}</span><div class="stack">${n?["pour","neutre","contre"].map(t=>k(t)?`<span class="vk-${t}" style="width:${k(t)/n*100}%" title="${t} : ${k(t)}"></span>`:"").join(""):""}</div><span class="v mono">${n}</span></button>`}).join("");
 const themes=[...new Set(all.map(r=>r.q.theme))];
 const posOpts=[["all","Toutes"],["pour","Pour (+ / ++)"],["neutre","Neutre (0)"],["contre","Contre (− / −−)"]].concat(answered?[["accord","D'accord avec moi"],["desaccord","Pas d'accord avec moi"]]:[]);
 let list;
 if(VF.view==="liste") list=f.map(r=>`<div class="vrow"><div><span class="mono">${NAME[r.c]}</span> · <span class="posb ${POSCLS[r.q.pos[r.c]]}">${r.q.pos[r.c]==null?"?":LAB[r.q.pos[r.c]+2]}</span> sur <b>Q${r.q.n}</b> ${esc(r.q.text)} <span class="fam">${THNAME[r.q.theme]}</span></div>${vsrc(r)}</div>`).join("");
 else {const byQ=new Map();f.forEach(r=>{if(!byQ.has(r.q.qid))byQ.set(r.q.qid,[]);byQ.get(r.q.qid).push(r)});
  list=[...byQ.values()].map(rs=>{const q=rs[0].q,voted=new Set(rs.map(r=>r.c));
   const cols=[-2,-1,0,1,2].map(v=>`<div class="col c${v}"><div class="lab">${LAB[v+2]}</div>${C.filter(c=>q.pos[c[0]]===v).map(c=>`<span class="cand${voted.has(c[0])?" voted":" faded"}">${c[1]}</span>`).join("")}</div>`).join("");
   return `<div class="q"><h4><span class="mono">Q${q.n}</span> ${esc(q.text)}</h4><div class="scale">${cols}</div><details><summary class="src">${rs.length>1?`Voir les ${rs.length} votes`:"Voir le vote"}</summary>${rs.map(r=>`<div class="vrow"><div><span class="mono">${NAME[r.c]}</span></div>${vsrc(r)}</div>`).join("")}</details></div>`}).join("")}
 document.getElementById("v-votes").innerHTML=`<div class="block"><h2>Promesses vs votes</h2><p class="lede">${uniq(all).length} positions sont justifiées par un vote réel à l'Assemblée ou au Sénat (le candidat lui-même ou son groupe). Ce sont les positions les plus solides : elles reposent sur un acte, pas sur une promesse.</p></div>
 <div class="block"><h3>Ce que chacun a voté</h3><p class="src">Pour chaque candidat, ses positions appuyées sur un vote : pour ou contre l'énoncé de la question. Clique sur une ligne pour filtrer la liste.</p>
 <div class="bars">${summary}</div><div class="legend"><span><span class="sw vk-pour"></span>Pour l'énoncé</span><span><span class="sw vk-neutre"></span>Neutre</span><span><span class="sw vk-contre"></span>Contre l'énoncé</span></div></div>
 <div class="filters">${sel("vf-cand","Candidat",[["all","Tous"],...C.map(c=>[c[0],c[1]])],VF.cand)}${sel("vf-pos","Position",posOpts,VF.pos)}${sel("vf-theme","Thème",[["all","Tous"],...THEMES.filter(t=>themes.includes(t.id)).map(t=>[t.id,t.name])],VF.theme)}${seg("vview",[["liste","Liste"],["question","Par question"]],VF.view)}</div>
 ${!answered?'<p class="src">Réponds à des questions dans l\'onglet Thèmes pour pouvoir filtrer sur tes accords et désaccords.</p>':""}
 <p class="mono">${f.length} vote${f.length>1?"s":""} affiché${f.length>1?"s":""}</p>
 <div>${list||'<p class="note">Aucun vote ne correspond à ces filtres.</p>'}</div>
 <p class="note">Peu de votes pour Glucksmann, Philippe, Tondelier ou Zemmour : ils ne siègent pas à l'Assemblée (Glucksmann est député européen, et ses votes à Strasbourg ne sont pas couverts ici). L'absence de vote ne veut pas dire incohérence.</p>
 <div class="card"><h3>Deux votes de groupe marquants</h3>
 <p><b>Loi immigration, 19 décembre 2023</b> : adoptée par 349 voix contre 186. RN et LR pour, gauche contre, majorité présidentielle divisée. Sans les 88 voix RN, le texte n'avait pas la majorité absolue. <a class="src" href="https://datan.fr/votes/legislature-16/vote_3213" target="_blank" rel="noopener">Datan</a></p>
 <p><b>${T("censure","Motion de censure")} sur les retraites, 20 mars 2023</b> : rejetée à 9 voix près (278 sur 287 nécessaires). Gauche, LIOT, RN et 19 LR sur 61 pour ; Renaissance, MoDem et Horizons ne l'ont pas votée. <a class="src" href="https://datan.fr/votes/legislature-16/vote_1240" target="_blank" rel="noopener">Datan</a></p></div>`;
}

const STCLS={"définitive":"def","non définitive":"nondef","relaxe":"relaxe","en cours":"cours"};
const STLAB={"définitive":"condamnation définitive","non définitive":"condamnation non définitive","relaxe":"relaxe / non-lieu","en cours":"procédure en cours"};
function affHTML(a){return `<div class="aff"><div class="row"><span class="st ${STCLS[a.stade]}">${STLAB[a.stade]}</span><span class="fam">${esc(a.categorie)} · ${a.famille}</span></div><div><b>${esc(a.titre)}</b></div><div class="src">${esc(a.statut)}${a.date?" · "+esc(a.date):""}${a.juridiction?" · "+esc(a.juridiction):""}${a.peine?" · "+esc(a.peine):""}</div>${a.description?`<div style="font-size:.92rem">${esc(a.description)}</div>`:""}<div class="src"><a href="${esc(a.page)}" target="_blank" rel="noopener">Fiche Poligraph</a>${a.source?` · <a href="${esc(a.source)}" target="_blank" rel="noopener">première source</a>`:""}</div></div>`}
function renderJustice(){
 const order=[...C.map(c=>c[0]),"bardella"];
 const cards=order.map(id=>{
  const mine=AFF.filter(a=>a.cand===id&&["DIRECT","INDIRECT","MENTIONED_ONLY"].includes(a.role_code));
  const other=AFF.filter(a=>a.cand===id&&["PLAINTIFF","VICTIM"].includes(a.role_code));
  const k=s=>mine.filter(a=>a.stade===s).length;
  const prob=mine.filter(a=>a.famille==="probité"&&(a.stade==="définitive"||a.stade==="non définitive")).length;
  return `<details class="ccard"${id==="le_pen"?" open":""}><summary><h3>${NAME[id]}${id==="bardella"?' <span class="fam">pressenti Premier ministre</span>':""}</h3><span class="counts">${mine.length} mis en cause · ${k("définitive")} déf. · ${k("non définitive")} non déf. · ${k("en cours")} en cours · ${k("relaxe")} relaxe · probité condamnée : ${prob}</span></summary>
  ${mine.length?mine.map(affHTML).join(""):'<p class="src" style="padding-top:10px">Aucune affaire où il ou elle est mis en cause dans la base Poligraph.</p>'}
  ${other.length?`<p class="mono" style="margin-top:12px">Comme plaignant ou victime</p>${other.map(affHTML).join("")}`:""}</details>`}).join("");
 document.getElementById("v-justice").innerHTML=`<div class="block"><h2>Justice</h2><p class="lede">Affaires recensées par Poligraph, classées par stade. Une condamnation non définitive peut encore être annulée ; une enquête n'est pas une culpabilité. La présomption d'innocence s'applique.</p>
 <div class="legend"><span><span class="st def">définitive</span> plus de recours possible</span><span><span class="st nondef">non définitive</span> appel ou pourvoi en cours</span><span><span class="st cours">en cours</span> enquête, instruction, plainte</span><span><span class="st relaxe">relaxe</span> relaxe, non-lieu, classement</span></div></div>
 <p class="note">Distingue deux familles : la <b>probité</b> (détournement, emploi fictif, favoritisme…) concerne l'usage de l'argent public ; l'<b>expression</b> (diffamation, injure, incitation à la haine) concerne des propos. Les mettre dans le même compteur fausse la comparaison.</p>
 ${cards}<p class="src">Source : <a href="https://poligraph.fr/affaires" target="_blank" rel="noopener">Poligraph, export des affaires</a> (base citoyenne : elle peut être incomplète).</p>`;
}

const VORD=["TRUE","MOSTLY_TRUE","HALF_TRUE","MISLEADING","OUT_OF_CONTEXT","MOSTLY_FALSE","FALSE","UNVERIFIABLE"];
const VLAB={TRUE:"Vrai",MOSTLY_TRUE:"Plutôt vrai",HALF_TRUE:"À moitié vrai",MISLEADING:"Trompeur",OUT_OF_CONTEXT:"Hors contexte",MOSTLY_FALSE:"Plutôt faux",FALSE:"Faux",UNVERIFIABLE:"Invérifiable"};
const FAM={TRUE:"vrai",MOSTLY_TRUE:"vrai",HALF_TRUE:"nuance",MISLEADING:"nuance",OUT_OF_CONTEXT:"nuance",MOSTLY_FALSE:"faux",FALSE:"faux",UNVERIFIABLE:"inv"};
const FORD=["vrai","nuance","faux","inv"], FLAB={vrai:"Vrai ou plutôt vrai",nuance:"Nuancé ou trompeur",faux:"Faux ou plutôt faux",inv:"Invérifiable"};
const FEW=5;
let FF={cand:"all",verdict:"all",fc:"all",year:"all",mode:"fam",sort:"recent"};
const fcYear=f=>(f.date||"").slice(0,4)||"?";
function fcVerdictOK(f){const v=FF.verdict;return v==="all"||(v.startsWith("fam:")?FAM[f.verdict]===v.slice(4):f.verdict===v)}
function renderFC(){
 const ids=[...C.map(c=>c[0]),"bardella"];
 const ctx=FC.filter(f=>(FF.fc==="all"||f.fc===FF.fc)&&(FF.year==="all"||fcYear(f)===FF.year)); /* périmètre des barres */
 const keys=FF.mode==="fam"?FORD:VORD, kOf=f=>FF.mode==="fam"?FAM[f.verdict]:f.verdict, cls=k=>FF.mode==="fam"?"vf-"+k:"v-"+k, lab=k=>FF.mode==="fam"?FLAB[k]:VLAB[k];
 const rows=ids.map(id=>{const l=ctx.filter(f=>f.cand===id),n=l.length;
  return `<button class="fcrow rowbtn${n<FEW?" few":""}" data-fccand="${id}" aria-pressed="${FF.cand===id}"><span class="mono">${NAME[id]}</span><div class="stack" role="img" aria-label="${NAME[id]} : ${n} vérifications">${n?keys.map(k=>{const c=l.filter(f=>kOf(f)===k).length;return c?`<span class="${cls(k)}" style="width:${c/n*100}%" title="${lab(k)} : ${c}"></span>`:""}).join(""):""}</div><span class="v mono">${n}</span></button>`}).join("");
 const list=ctx.filter(f=>(FF.cand==="all"||f.cand===FF.cand)&&fcVerdictOK(f)).sort((a,b)=>FF.sort==="recent"?(b.date||"").localeCompare(a.date||""):(a.date||"").localeCompare(b.date||""));
 /* frise par année : vérifications de la sélection (candidat + verdict + fact-checker), par famille */
 const yl=FC.filter(f=>(FF.cand==="all"||f.cand===FF.cand)&&fcVerdictOK(f)&&(FF.fc==="all"||f.fc===FF.fc));
 const years=[...new Set(FC.map(fcYear))].filter(y=>y!=="?").sort(), ymax=Math.max(1,...years.map(y=>yl.filter(f=>fcYear(f)===y).length));
 const yearChart=`<div class="ychart" role="img" aria-label="Vérifications par année">${years.map(y=>{const l=yl.filter(f=>fcYear(f)===y);return `<button class="ycol" data-fcyear="${y}" aria-pressed="${FF.year===y}" title="${y} : ${l.length}"><span class="yn">${l.length||""}</span><span class="ybar" style="height:${l.length/ymax*85}%">${FORD.map(k=>{const c=l.filter(f=>FAM[f.verdict]===k).length;return c?`<span class="vf-${k}" style="flex:${c}"></span>`:""}).join("")}</span><span class="ylab">${y}</span></button>`}).join("")}</div>`;
 const fcs=[...new Set(FC.map(f=>f.fc))].sort((a,b)=>FC.filter(f=>f.fc===b).length-FC.filter(f=>f.fc===a).length);
 const verdictOpts=[["all","Tous"],...FORD.map(k=>["fam:"+k,FLAB[k]]),...VORD.map(v=>[v,"· "+VLAB[v]])];
 document.getElementById("v-factchecks").innerHTML=`<div class="block"><h2>Fact-checks</h2><p class="lede">Déclarations vérifiées par des fact-checkers (TF1 Info, AFP Factuel, Franceinfo, Le Monde…), quand le candidat en est l'auteur direct. Données Poligraph.</p></div>
 <p class="note">Ne lis pas ces barres comme un « taux de mensonge ». Les fact-checkers choisissent ce qu'ils vérifient : plus une personne parle dans les médias et plus une affirmation paraît douteuse, plus elle a de chances d'être vérifiée. Les lignes grisées comptent moins de ${FEW} vérifications : trop peu pour conclure. Ce qui compte, c'est le contenu de chaque vérification.</p>
 <div class="filters">${seg("fmode",[["fam","4 familles"],["detail","8 verdicts"]],FF.mode)}</div>
 <div class="bars">${rows}</div>
 <div class="legend">${keys.filter(k=>k!=="OUT_OF_CONTEXT").map(k=>`<button class="legbtn" data-fcverdict="${FF.mode==="fam"?"fam:"+k:k}" aria-pressed="${FF.verdict===(FF.mode==="fam"?"fam:"+k:k)}"><span class="sw ${cls(k)}"></span>${lab(k)}</button>`).join("")}</div>
 <p class="src">Clique sur une ligne pour filtrer par candidat, sur une couleur pour filtrer par verdict.</p>
 <div class="block"><h3>Au fil du temps</h3><p class="src">Nombre de vérifications par année pour la sélection en cours. Clique sur une année pour filtrer.</p>${yearChart}</div>
 <div class="block"><h3>Les vérifications</h3>
 <div class="filters">${sel("ff-cand","Candidat",[["all","Tous"],...ids.map(id=>[id,NAME[id]])],FF.cand)}${sel("ff-verdict","Verdict",verdictOpts,FF.verdict)}${sel("ff-fc","Fact-checker",[["all","Tous"],...fcs.map(x=>[x,x])],FF.fc)}${sel("ff-year","Année",[["all","Toutes"],...years.slice().reverse().map(y=>[y,y])],FF.year)}${sel("ff-sort","Ordre",[["recent","Plus récentes d'abord"],["old","Plus anciennes d'abord"]],FF.sort)}${FF.cand!=="all"||FF.verdict!=="all"||FF.fc!=="all"||FF.year!=="all"?'<button class="btn ghost" id="ff-reset">Effacer les filtres</button>':""}</div>
 <p class="mono">${list.length} vérification${list.length>1?"s":""}</p>
 <div class="fclist">${list.map(f=>`<div class="vrow"><div><span class="sw v-${f.verdict}"></span><b>${VLAB[f.verdict]||esc(f.verdict)}</b> · <span class="mono">${NAME[f.cand]}</span> · ${esc(f.date)}</div><div><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titre)}</a> <span class="src">(${esc(f.fc)})</span></div></div>`).join("")||'<p class="note">Aucune vérification ne correspond à ces filtres.</p>'}</div></div>`;
}

const CONTRO=[
 {who:"Jordan Bardella (RN, pressenti Premier ministre)",title:"Écrits antisémites attribués par Mediapart",
  lv:[["fait","Contradiction reconnue","Il avait affirmé que Jean-Marie Le Pen n'était pas antisémite, a parlé ensuite de « remarque maladroite », puis a reconnu en mai 2024 des propos « éminemment antisémites » du fondateur du FN.","https://fr.euronews.com/2026/09/30/jordan-bardella-repond-a-emmanuel-macron-sur-lantisemitisme"],
  ["alleg","Allégation contestée","Mediapart lui attribue des propos antisémites et complotistes dans des conversations privées entre 2013 et 2015. Il parle de « faux grossiers » et a porté plainte en "+T("diff","diffamation")+" (plainte déposée, selon Poligraph).","https://poligraph.fr/affaires/plainte-en-diffamation-de-jordan-bardella-contre-mediapart"],
  ["q","Point à surveiller","Il dit qu'on lui prête des propos tenus « mineur ». Il a eu 18 ans le 13 septembre 2013 et les échanges cités vont jusqu'en 2015. Si les messages sont authentiques, cette défense ne tient pas sur les dates.","https://www.euronews.com/2026/09/28/national-rallys-bardella-denies-report-he-made-antisemitic-remarks"],
  ["fait","Fact-checks","Sur 25 déclarations vérifiées, une majorité est jugée fausse, plutôt fausse ou trompeuse (voir l'onglet Fact-checks). C'est un indice de rapport aux faits, pas une preuve de mensonge délibéré.",""]]},
 {who:"Marine Le Pen (RN)",title:"Assistants parlementaires européens",
  lv:[["fait","Décision de justice","Condamnée en appel le 7 juillet 2026 pour détournement de fonds du Parlement européen. La peine d'"+T("inelig","inéligibilité")+" a été réduite, ce qui lui permet d'être candidate. Selon Poligraph, un pourvoi en cassation est en cours : la condamnation n'est donc pas définitive.","https://poligraph.fr/affaires/marine-le-pen-condamnation-de-marine-le-pen-pour-detournement-de-fonds-publics-dans-l-affaire-des-assistants-parlementaires-europeens-du-fn"]]},
 {who:"Jean-Luc Mélenchon (LFI)",title:"Coût du programme contesté",
  lv:[["alleg","Estimation contestée","Selon L'Essentiel de l'Éco, l'Institut Montaigne chiffrait le programme 2022 (d'architecture fiscale proche) à 332 Md€ de dépenses annuelles en plus, contre 250 Md€ revendiqués par LFI. Source secondaire, à vérifier sur le chiffrage 2027.","https://lessentieldeleco.fr/7512-melenchon-promet-une-economie-collectiviste-ce-que-ca-signifie-vraiment/"]]},
 {who:"Édouard Philippe (Horizons)",title:"Cité numérique du Havre",
  lv:[["alleg","Procédure en cours","Poligraph recense une information judiciaire pour favoritisme et détournement de fonds publics autour de la Cité numérique du Havre, où il est mis en cause. Instruction en cours : aucune culpabilité établie.","https://poligraph.fr/affaires/affaire-de-favoritisme-et-detournement-de-fonds-publics-au-havre"]]},
 {who:"Éric Zemmour (Reconquête)",title:"Condamnations pour ses propos",
  lv:[["fait","Décisions de justice","Plusieurs condamnations définitives pour provocation à la haine ou injure, dont celle confirmée par la Cour de cassation en septembre 2025 (15 000 €) pour un discours de 2019. Détail dans l'onglet Justice.","https://poligraph.fr/affaires/eric-zemmour-diatribe-anti-immigration-de-2019"]]},
 {who:"Tous les grands candidats de 2022",title:"Des programmes mal financés",
  lv:[["fait","Analyse indépendante (2022)","L'Institut Montaigne concluait que les programmes de Macron et Pécresse n'amélioraient pas les finances publiques, et que ceux de Le Pen, Zemmour et Mélenchon menaçaient plus sérieusement la soutenabilité de la dette.","https://acteurspublics.fr/articles/victor-poirier-aucun-programme-ne-prevoit-des-financements-a-la-hauteur"]]}
];
function renderContro(){
 document.getElementById("v-controverses").innerHTML=`<div class="block"><h2>Controverses</h2><p class="lede">Chaque élément est classé par niveau de preuve. Ne mélange pas les niveaux dans un argument : c'est ce qui permet à l'autre de tout balayer.</p>
 <div class="legend"><span><span class="tag ok">fait établi</span> décision de justice, déclaration reconnue</span><span><span class="tag old">allégation</span> contestée ou non tranchée</span><span><span class="tag thin">à surveiller</span> incohérence à vérifier</span></div></div>
 ${CONTRO.map(c=>`<div class="card"><p class="mono">${c.who}</p><h3>${c.title}</h3><div class="levels">${c.lv.map(l=>`<div class="lvl"><span class="badge ${l[0]==="fait"?"b-fait":l[0]==="alleg"?"b-alleg":"b-q"}">${l[1]}</span><div>${l[2]}${l[3]?` <a class="src" href="${l[3]}" target="_blank" rel="noopener">source</a>`:""}</div></div>`).join("")}</div></div>`).join("")}
 <p class="note">Pour la liste complète et neutre des procédures de chaque candidat, voir l'onglet Justice. Cette page-ci ne retient que les sujets qui pèsent dans le débat public.</p>`;
}

const REPO="https://github.com/Tanguyrhd/boussole-2027";
function renderMethode(){
 const fetched=(META.fetched_at||"").slice(0,10);
 document.getElementById("v-methode").innerHTML=`<div class="block"><h2>Méthode</h2>
 <p class="lede">D'où viennent les données, comment elles sont traitées, et ce que cette page ne sait pas faire.</p></div>
 <div class="card"><h3>Les sources</h3>
 <p><b>Candidats retenus</b> : les 10 premiers du sondage Ifop du 17-19 octobre 2026 (Le Pen 35 %, Mélenchon 15 %, Glucksmann 12 %, Philippe 12 %, Attal 6 %, Retailleau 6 %, Zemmour 3,5 %, Tondelier 3 %, Roussel 2 %, Ruffin 2 %). Bardella apparaît dans Justice et Fact-checks comme Premier ministre pressenti.</p>
 <p><b>Positions</b> : <a href="https://monvote2027.fr/donnees" target="_blank" rel="noopener">MonVote2027</a>, 100 questions sur 5 niveaux, chacune avec ses sources (programmes, déclarations, articles, votes).</p>
 <p><b>Affaires judiciaires et fact-checks</b> : exports de l'API publique de <a href="https://poligraph.fr" target="_blank" rel="noopener">Poligraph</a>.</p>
 <p><b>Mesures phares, controverses, glossaire</b> : rédigés à la main à partir de <a href="https://votons-2027.fr/themes/economie" target="_blank" rel="noopener">Votons</a>, de Poligraph et de la presse. Chaque mesure et chaque controverse renvoie à sa source.</p></div>
 <div class="card"><h3>Ce qui est automatique, ce qui ne l'est pas</h3>
 <div class="tbl"><table><thead><tr><th>Contenu</th><th>Mise à jour</th></tr></thead><tbody>
 <tr><td>Positions des candidats et leurs sources</td><td>Automatique (script)</td></tr>
 <tr><td>Affaires judiciaires</td><td>Automatique (script)</td></tr>
 <tr><td>Fact-checks</td><td>Automatique (script)</td></tr>
 <tr><td>Rangement des questions par thème</td><td>Automatique, par une règle fixe sur les étiquettes de MonVote2027</td></tr>
 <tr><td>Liste des 10 candidats</td><td>À la main</td></tr>
 <tr><td>Mesures phares, controverses, glossaire</td><td>À la main</td></tr>
 </tbody></table></div>
 <p class="src">Données téléchargées le ${esc(fetched||"?")}, page construite le ${esc(META.built_at||"?")}.</p></div>
 <div class="card"><h3>Comment le score d'affinité est calculé</h3>
 <p>Pour chaque question où tu as répondu et où le candidat a une position, l'écart entre vous va de 0 (même position) à 4 (de −− à ++). La question rapporte <span class="mono">4 − écart</span> points sur 4, multipliés par le poids que tu as donné à son thème (0 à 3, « Moyenne » = 2 par défaut).</p>
 <p class="mono">score = Σ poids × (4 − |toi − candidat|) ÷ Σ poids × 4</p>
 <p>Un score de 100 % veut dire que vous avez la même position partout ; 50 %, un écart moyen de deux crans. Un candidat sans position sur une question n'est ni récompensé ni pénalisé : la question est simplement ignorée pour lui.</p></div>
 <div class="card"><h3>Limites connues</h3>
 <ul class="lim">
 <li><b>Les questions ne sont pas neutres par nature.</b> Leur choix et leur formulation viennent de MonVote2027 ; ton score dépend d'eux.</li>
 <li><b>Les citations sont des résumés</b> rédigés par MonVote2027 : vérifie la source avant de citer un candidat.</li>
 <li><b>Les votes au Parlement européen ne sont pas couverts</b>, ce qui pénalise la lecture de Glucksmann et Bardella.</li>
 <li><b>Les mesures phares sont partielles</b> : les pages de mesures de Poligraph sont protégées contre les accès automatisés.</li>
 <li><b>Les bases citoyennes peuvent être incomplètes</b> : l'absence d'une affaire ou d'un fact-check ne prouve rien.</li>
 <li><b>Certaines mesures datent de 2022 ou 2024</b> (étiquette jaune) et n'ont pas forcément été reprises pour 2027.</li></ul></div>
 <div class="card"><h3>Une erreur, une source manquante ?</h3>
 <p>Le code et les données sont publics. Signale une erreur en ouvrant une <a href="${REPO}/issues" target="_blank" rel="noopener">issue sur GitHub</a>, ou préviens-moi directement. Pour une erreur de position d'un candidat, le plus efficace est de la signaler aussi à <a href="https://monvote2027.fr/contact" target="_blank" rel="noopener">MonVote2027</a>.</p>
 <p class="src">Code source : <a href="${REPO}" target="_blank" rel="noopener">${REPO.replace("https://","")}</a></p></div>`;
}

function show(v){document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.v===v));document.querySelectorAll("section.view").forEach(s=>s.hidden=s.id!=="v-"+v);if(v==="affinite")renderAff();if(v==="votes")renderVotes()}
document.querySelector("nav.tabs").addEventListener("click",e=>{const b=e.target.closest("button[data-v]");if(b)show(b.dataset.v)});

const pop=document.getElementById("pop");
document.addEventListener("click",e=>{
 const t=e.target.closest(".term");
 if(t){const g=GLO[t.dataset.k];if(g){pop.querySelector("h4").textContent=g[0];pop.querySelector(".def").textContent=g[1];pop.querySelector(".why").textContent="Pourquoi ça compte : "+g[2];pop.hidden=false}return}
 if(e.target.closest("#pop .x")){pop.hidden=true;return}
 const th=e.target.closest("[data-th]");if(th){curTheme=th.dataset.th;openSrc=null;renderThemes();return}
 const sb=e.target.closest("[data-src]");if(sb){openSrc=openSrc===sb.dataset.src?null:sb.dataset.src;renderThemes();return}
 const q=e.target.closest("button[data-q]");if(q){const v=+q.dataset.v;if(S.a[q.dataset.q]===v)delete S.a[q.dataset.q];else S.a[q.dataset.q]=v;save();renderThemes();return}
 if(e.target.id==="cp"){const ta=document.getElementById("exp"),m=document.getElementById("msg");navigator.clipboard.writeText(ta.value).then(()=>m.textContent="Copié.").catch(()=>{ta.select();m.textContent="Sélectionné : copie-le manuellement."});return}
 if(e.target.id==="imp"){try{const o=JSON.parse(document.getElementById("exp").value);if(o&&o.a&&o.w){S=o;save();renderAff();document.getElementById("msg").textContent="Réponses importées."}}catch(err){document.getElementById("msg").textContent="Texte invalide : colle exactement le texte copié depuis l'autre appareil."}return}
 if(e.target.id==="rst"){S={a:{},w:{}};save();renderAff();return}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")pop.hidden=true});
document.addEventListener("input",e=>{if(e.target.dataset.w){const v=+e.target.value;S.w[e.target.dataset.w]=v;save();document.getElementById("wl").textContent=["Aucune","Faible","Moyenne","Forte"][v]}});
document.addEventListener("change",e=>{const id=e.target.id,v=e.target.value;
 if(id.startsWith("vf-")){VF[id.slice(3)]=v;renderVotes()}
 if(id.startsWith("ff-")){FF[id.slice(3)]=v;renderFC()}});
document.addEventListener("click",e=>{
 const s=e.target.closest("[data-seg]");if(s){if(s.dataset.seg==="vview"){VF.view=s.dataset.val;renderVotes()}else{FF.mode=s.dataset.val;FF.verdict="all";renderFC()}return}
 const vc=e.target.closest("[data-vcand]");if(vc){VF.cand=VF.cand===vc.dataset.vcand?"all":vc.dataset.vcand;renderVotes();return}
 const fc=e.target.closest("[data-fccand]");if(fc){FF.cand=FF.cand===fc.dataset.fccand?"all":fc.dataset.fccand;renderFC();return}
 const fv=e.target.closest("[data-fcverdict]");if(fv){FF.verdict=FF.verdict===fv.dataset.fcverdict?"all":fv.dataset.fcverdict;renderFC();return}
 const fy=e.target.closest("[data-fcyear]");if(fy){FF.year=FF.year===fy.dataset.fcyear?"all":fy.dataset.fcyear;renderFC();return}
 if(e.target.id==="ff-reset"){FF={...FF,cand:"all",verdict:"all",fc:"all",year:"all"};renderFC()}});

Promise.all(["questions","affaires","factchecks","meta"].map(n=>fetch(`data/${n}.json`).then(r=>{if(!r.ok)throw new Error(n);return r.json()})))
.then(([q,a,f,m])=>{Q=q;AFF=a;FC=f;META=m;
 document.getElementById("stamp").innerHTML=`Données du ${esc(m.built_at)}<br>1er tour : 18 avril 2027<br>2nd tour : 2 mai 2027`;
 renderThemes();renderVotes();renderJustice();renderFC();renderContro();renderMethode();
 const h0=(location.hash||"").slice(1);if(["themes","affinite","votes","justice","factchecks","controverses","methode"].includes(h0))show(h0);})
.catch(err=>{document.getElementById("v-themes").innerHTML=`<p class="note">Les données n'ont pas pu être chargées (${esc(err.message)}). Recharge la page ; si le problème persiste, les fichiers de données manquent dans la publication.</p>`});
