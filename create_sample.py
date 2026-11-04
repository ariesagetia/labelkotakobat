import csv
import json
import re
import os

lampiran1_quantities = {
    "AERIUS 5 MG TAB": "@30",
    "ALLERON 4 MG TAB": "@200",
    "ALLORIS 10 MG TAB": "@100",
    "BUFACARYL KAP": "@100",
    "CARBIDU 0.5 MG TAB": "@200",
    "CARBIDU 0.75 MG TAB": "@200",
    "CERINI 10 MG KAP": "@20",
    "CETIRGI 10 MG TAB": "@30",
    "CLARITIN 10 MG TAB": "@30",
    "CORTAMINE TAB": "@50",
    "CORTIDEX 0.5 MG TAB": "@100",
    "DANASONE 0.5 MG TAB": "@200",
    "DEXTAFEN KAP": "@100",
    "DEXTAMINE KAP": "@100",
    "DEXTEEM PLUS TAB": "@100",
    "FAMETSON 4 MG TAB": "@100",
    "FARIDEXON 0.5 MG TAB": "@100",
    "GRAFACHLOR TAB": "@100",
    "GRATHAZON 0.5 MG KAP": "@200",
    "HISTAPAN 50 MG TAB": "@100",
    "INCIDAL OD 10 MG BOX": "@4",
    "INCIDAL OD 10 MG STRIP": "@8",
    "INCLARIN 10 MG TAB": "@50",
    "INDEXON 0.5 MG TAB": "@100",
    "INTERHISTIN 50 MG TAB": "@100",
    "INTIDROL 16 MG TAB": "@20",
    "INTIDROL 4 MG TAB": "@50",
    "INTIDROL 8 MG TAB": "@100",
    "INTRIZIN 10 MG TAB": "@30",
    "KALMETHASONE 0.5 MG TAB": "@200",
    "LAMESON 16 MG TAB": "@100",
    "LAMESON 4 MG TAB": "@100",
    "LAMESON 8 MG TAB": "@100",
    "LANADEXON 0.5 MG KAP": "@100",
    "LERZIN 10 MG CAPS": "@100",
    "LORACOR 10 MG TAB": "@50",
    "MEDIXON 4 MG TAB": "@100",
    "METCOR 4 MG TAB": "@50",
    "METCOR 8 MG TAB": "@50",
    "MEXON KAP": "@100",
    "MOLACORT 0.5 MG TAB": "@100",
    "MOLACORT 0.75 MG TAB": "@200",
    "ORPHEN 4 MG TAB": "@200",
    "OZEN 10 MG TAB": "@10",
    "POLOFAR PLUS KAP": "@100",
    "PREDNICORT 4 MG TAB": "@50",
    "PREDNICORT 8 MG TAB": "@50",
    "PREDNOX 16 MG KAP": "@50",
    "PREDNOX 4 MG KAP": "@100",
    "PREDNOX 8 MG KAP": "@100",
    "PRONICY 4 MG TAB": "@100",
    "RHEMAFAR 4 MG TAB": "@100",
    "RHEMAFAR 8 MG KAP": "@50",
    "RYZICOR 10 MG TAB": "@50",
    "SANEXON 4 MG TAB": "@100",
    "SANEXON 8 MG TAB": "@100",
    "SANPRIMA FORTE TAB": "@100",
    "SEDARES 25 MG TAB": "@20",
    "TELFAST 60 MG TAB": "@10",
    "TELFAST HD 180 MG TAB": "@10",
    "TELFAST OD 120 MG TAB": "@10",
    "TIRIZ 10 MG KAP": "@30",
    "TRIAMCORT 4 MG TAB": "@100",
    "WINATIN 10 MG TAB": "@100",
    "ZENCET TAB": "@30",
    "ZENRIZ 10 MG TAB": "@30",
    "ZENTAMIN KAP": "@100"
}

with open("raw_data.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = []
    id_counter = 1
    
    for r in reader:
        item_str = (r.get('Item') or '').strip()
        cat_str = (r.get('KATEGORI') or '').strip()
        kan_str = (r.get('KANDUNGAN') or '').strip()
        
        qty_str = ""
        for k, v in lampiran1_quantities.items():
            if k.lower() == item_str.lower():
                qty_str = v
                break
                
        line1 = item_str
        line2 = qty_str
        
        m = re.search(r'^(.*?)\s+(TAB|KAP|CAPS|SYR|CR|GEL|OINT|INHALER|DROPS|SACH|STRIP|BOX|BTL|PCS|VIALS|DISKUS|SUPP|OVULA|LOT|EMULTION|SUSP|PATCH|AMPLOP|ROLL|TUBE|SPRAY|NEBULES)\s*(.*?)$', item_str, re.IGNORECASE)
        if m:
            base_name = m.group(1).strip()
            form_name = m.group(2).strip()
            rest = m.group(3).strip()
            line1 = base_name
            if rest and not qty_str:
                line2 = f"{form_name} {rest}"
            elif qty_str:
                line2 = f"{form_name} {rest} {qty_str}".strip()
            else:
                line2 = f"{form_name}"
        else:
            if qty_str:
                line2 = qty_str
                
        rows.append({
            "id": f"item-{id_counter}",
            "rawItem": item_str,
            "nama": line1,
            "kemasan": line2,
            "kategori": cat_str,
            "kandungan": kan_str
        })
        id_counter += 1

output_js = f"""// Sample data extracted from Lampiran 2 with formatting matching Lampiran 1
export const SAMPLE_DATA = {json.dumps(rows, indent=2)};

export const DEFAULT_CATEGORY_COLORS = {{
  "ALERGI": {{ "bg": "#6B2D82", "text": "#ffffff", "border": "#521d66" }},
  "ANTIBIOTIK": {{ "bg": "#C1121F", "text": "#ffffff", "border": "#960d17" }},
  "DEGENERATIF": {{ "bg": "#1D3557", "text": "#ffffff", "border": "#13233a" }},
  "GENERIK": {{ "bg": "#2E7D32", "text": "#ffffff", "border": "#1f5622" }},
  "HORMON": {{ "bg": "#C2185B", "text": "#ffffff", "border": "#880e4f" }},
  "MULTIVITAMIN": {{ "bg": "#E65100", "text": "#ffffff", "border": "#b23c00" }},
  "NYERI": {{ "bg": "#D84315", "text": "#ffffff", "border": "#9f2f0c" }},
  "OBAT BEBAS": {{ "bg": "#00897B", "text": "#ffffff", "border": "#005b52" }},
  "PENCERNAAN": {{ "bg": "#5D4037", "text": "#ffffff", "border": "#3e2723" }},
  "PERNAFASAN": {{ "bg": "#0277BD", "text": "#ffffff", "border": "#014c77" }},
  "SALEP": {{ "bg": "#455A64", "text": "#ffffff", "border": "#263238" }},
  "SARAF": {{ "bg": "#4527A0", "text": "#ffffff", "border": "#281364" }},
  "SUPPOSITORIA": {{ "bg": "#00838F", "text": "#ffffff", "border": "#00565f" }},
  "TM": {{ "bg": "#00695C", "text": "#ffffff", "border": "#00433a" }},
  "TT": {{ "bg": "#558B2F", "text": "#ffffff", "border": "#33691e" }},
  "T": {{ "bg": "#795548", "text": "#ffffff", "border": "#4e342e" }},
  "TANPA": {{ "bg": "#374151", "text": "#ffffff", "border": "#1f2937" }},
  "DEFAULT": {{ "bg": "#4B5563", "text": "#ffffff", "border": "#374151" }}
}};
"""

os.makedirs("src/data", exist_ok=True)
with open("src/data/sampleData.js", "w", encoding="utf-8") as f:
    f.write(output_js)

print(f"Generated sampleData.js with {len(rows)} items.")
