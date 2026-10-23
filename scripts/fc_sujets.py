"""Classement des fact-checks par sujet, à partir de mots-clés dans leur titre.

Classement automatique et imparfait : un titre peut recevoir plusieurs sujets, ou aucun
(« autre »). Les règles sont volontairement lisibles pour pouvoir être corrigées à la main.
"""
import re
RULES = [
    ("immig", r"immigr|migra|étranger|asile|sans-papier|frontière|clandestin|OQTF|naturalis|droit du sol|regroupement familial|visa|Ocean Viking"),
    ("securite", r"délinquan|crimin|police|policier|insécurité|sécurité|agression|prison|justice|juge|magistrat|drogue|crack|narco|terror|attentat|violence|émeute|meurtre|homicide|tués|viol\b|flashball|travaux d'intérêt général"),
    ("eco", r"impôt|taxe|TVA|fiscal|dette|déficit|budget|économi|salaire|SMIC|chômage|emploi|pouvoir d'achat|inflation|entreprise|milliard|PIB|croissance|prélèvements|banca|riches|export|Shein|carburant|essence|prix"),
    ("retraites", r"retraite|pension"),
    ("sante", r"santé|hôpital|médecin|covid|vaccin|soignant|\bAME\b|maladie|cancer|dépression|alcool|\bvin\b|PMA"),
    ("energie", r"énergie|électricité|nucléaire|éolien|climat|CO2|carbone|écolog|pollution|plastique|voiture|électrique|\bgaz\b|pétrole|SNCF|TGV|tunnel|Lyon-Turin|bio\b"),
    ("agri", r"agricult|vache|élevage|viande|\blait\b|pesticide|paysan|alimentaire"),
    ("logement", r"logement|loyer|HLM|immobilier|passoires thermiques|sans domicile|sans-abri"),
    ("solidarite", r"pauvre|pauvreté|minima|RSA|allocation|sans domicile|sans-abri|chômeur"),
    ("monde", r"Union européenne|\bUE\b|Europe|européen|Bruxelles|Russie|russe|Ukraine|Poutine|Israël|Gaza|Hamas|Iran|États-Unis|Trump|Chine|chinois|Pologne|Espagne|Allemagne|Algérie|Canada|OTAN|guerre|traité (de|d'|d’|sur)|Géorgie|géorgien|Etats-Unis|Venezuela|Roumanie|pakistanais"),
    ("instit", r"Assemblée|élection|électeur|scrutin|Constitution|49\.3|référendum|député|sondage|investiture|Sénat|ministre|gouvernement|dissolution|législatives|campagne présidentielle|Conseil constitutionnel|assistants parlementaires|1er-Mai|loi\b"),
    ("societe", r"école|maternelle|lycée|collège|éducation|laïcité|voile|islam|musulman|religion|femme|genre|IVG|avortement|famille|natalité|enfants|binationa|prénom|Pétain|nazisme|fascisme|résistant|Antiquité|histor|langue|raciste|antisémit|homophob|ChatGPT|légion d'honneur|jeunes"),
]
_RX = [(t, re.compile(rx, re.I)) for t, rx in RULES]
def sujets(titre):
    return [t for t, rx in _RX if rx.search(titre)] or ["autre"]
