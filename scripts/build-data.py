#!/usr/bin/env python3
"""Rebuilds src/data/appliances.json and src/data/eia.json from the official files.

  python3 scripts/build-data.py            # reuses .cache-raw/ if present
  python3 scripts/build-data.py --fetch    # downloads again (ENERGY STAR Socrata API + EIA xlsx)

Sources (public domain):
  ENERGY STAR certified product lists, data.energystar.gov (EPA; 17 U.S.C. 105)
  EIA Electric Power Monthly, table 5.6.A (average residential price by state, month and month a year earlier)
Only models whose `markets` field lists the United States are kept. Rows whose dimensions are outside a plausible
range in inches (entered in centimeters or empty) are left out of the size tools and counted in `excluded`.
"""
import json, os, sys, statistics, subprocess, datetime, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, '.cache-raw')
DS = {'fridge': 'p5st-her9', 'washer': 'bghd-e2wd', 'dryer': 't9u7-4d2j', 'dish': 'q8py-6w3f', 'ac': '5xn2-dv4h', 'freezer': '8t9c-g3tn', 'dehu': 'mgiu-hu4z'}
os.makedirs(os.path.join(RAW, 'es'), exist_ok=True)
if '--fetch' in sys.argv:
    for k, i in DS.items():
        subprocess.run(['curl', '-s', '-o', f'{RAW}/es/{i}.json', f'https://data.energystar.gov/resource/{i}.json?$limit=20000'], check=True)
        subprocess.run(['curl', '-s', '-o', f'{RAW}/es/{i}.meta.json', f'https://data.energystar.gov/api/views/{i}.json'], check=True)
    subprocess.run(['curl', '-sL', '-o', f'{RAW}/t56a.xlsx', 'https://www.eia.gov/electricity/monthly/xls/table_5_06_a.xlsx'], check=True)

def load(k):
    rows = json.load(open(f'{RAW}/es/{DS[k]}.json'))
    return [r for r in rows if 'United States' in (r.get('markets') or '')]
def f(r, k):
    try: return float(r[k])
    except (KeyError, TypeError, ValueError): return None
def updated(k):
    p = f'{RAW}/es/{DS[k]}.meta.json'
    if not os.path.exists(p): return None
    return datetime.datetime.fromtimestamp(json.load(open(p))['rowsUpdatedAt'], datetime.UTC).strftime('%Y-%m-%d')

class Idx:
    def __init__(self): self.items = []
    def __call__(self, x):
        if x not in self.items: self.items.append(x)
        return self.items.index(x)

out = {'retrieved': datetime.date.today().isoformat(), 'cats': {}}
excluded = {}

# Refrigerators (no depth in the file).
B, T = Idx(), Idx()
rows = []
for r in load('fridge'):
    w, h, v, e, s = f(r, 'width_in'), f(r, 'height_in'), f(r, 'capacity_total_volume_ft3'), f(r, 'annual_energy_use_kwh_yr'), f(r, 'us_federal_standard_kwh_yr')
    if None in (w, h, v, e) or not (10 <= w <= 50 and 15 <= h <= 90):
        excluded['fridge'] = excluded.get('fridge', 0) + 1; continue
    rows.append([w, h, v, round(e), round(s) if s else 0, T(r['type']), 1 if r.get('standard_or_counter_depth') == 'Yes' else 0,
                 1 if r.get('built_in') == 'Yes' else 0, 1 if r.get('ice_maker') == 'Yes' else 0, B(r['brand_name'].strip()), r['model_number'].strip()])
out['cats']['fridge'] = {'id': DS['fridge'], 'fields': ['w', 'h', 'vol', 'kwh', 'fed', 'type', 'cd', 'builtin', 'ice', 'brand', 'model'], 'types': T.items, 'brands': B.items, 'rows': rows}

# Clothes washers.
B, rows = Idx(), []
wid = {}
for r in load('washer'):
    w, h, d, v, e, wa = (f(r, k) for k in ('width_inches', 'height_inches', 'depth_inches', 'volume_cubic_feet', 'annual_energy_use_kwh_year', 'annual_water_use_gallons_year'))
    # Most washer rows publish the width only: height and depth stay 0 (unknown) and those models are counted apart.
    if None in (w, v, e) or not (18 <= w <= 34) or (h is not None and not 25 <= h <= 80) or (d is not None and not 18 <= d <= 40):
        excluded['washer'] = excluded.get('washer', 0) + 1; continue
    wid[len(rows)] = r.get('paired_energy_star_clothes_dryer_energy_star_model_identifier')
    rows.append([w, h or 0, d or 0, v, round(e), round(wa or 0), 0 if r['load_configuration'] == 'Front Load' else 1, B(r['brand_name'].strip()), r['model_number'].strip()])
out['cats']['washer'] = {'id': DS['washer'], 'fields': ['w', 'h', 'd', 'vol', 'kwh', 'water', 'top', 'brand', 'model'], 'brands': B.items, 'rows': rows}

# Clothes dryers.
B, rows, did = Idx(), [], {}
for r in load('dryer'):
    w, h, d, c, e = (f(r, k) for k in ('width_inches', 'height_inches', 'depth_inches', 'drum_capacity_cu_ft', 'estimated_annual_energy_use_kwh_yr'))
    pt = r.get('product_type') or ''
    if None in (w, h, d, c, e) or not pt or not (18 <= w <= 34 and 25 <= h <= 50 and 15 <= d <= 40):
        excluded['dryer'] = excluded.get('dryer', 0) + 1; continue
    did[r['energy_star_model_identifier']] = len(rows)
    rows.append([w, h, d, c, round(e), 1 if pt.startswith('Gas') else 0, 1 if 'Ventless' in pt else 0, 1 if 'Compact' in pt else 0, B(r['brand_name'].strip()), r['model_number'].strip()])
out['cats']['dryer'] = {'id': DS['dryer'], 'fields': ['w', 'h', 'd', 'cap', 'kwh', 'gas', 'ventless', 'compact', 'brand', 'model'], 'brands': B.items, 'rows': rows}
out['pairs'] = [[wi, did[x]] for wi, x in wid.items() if x and x in did]

# Dishwashers (width and depth only).
B, rows = Idx(), []
for r in load('dish'):
    w, d, p, e, g = (f(r, k) for k in ('width_inches', 'depth_inches', 'capacity_maximum_number_of_place_settings', 'annual_energy_use_kwh_year', 'water_use_gallons_cycle'))
    if None in (w, d, e) or not (15 <= w <= 30 and 18 <= d <= 30):
        excluded['dish'] = excluded.get('dish', 0) + 1; continue
    rows.append([w, d, round(p or 0), round(e), g or 0, 1 if r.get('type') == 'Compact' else 0, B(r['brand_name'].strip()), r['model_number'].strip()])
out['cats']['dish'] = {'id': DS['dish'], 'fields': ['w', 'd', 'place', 'kwh', 'gal', 'compact', 'brand', 'model'], 'brands': B.items, 'rows': rows}

# Room air conditioners.
B, rows = Idx(), []
for r in load('ac'):
    w, h, d, btu, e, ceer = (f(r, k) for k in ('width_inches', 'height_inches', 'depth_inches', 'cooling_capacity_btu_hour', 'annual_energy_use_kwh_yr', 'combined_energy_efficiency_ratio_ceer'))
    if None in (btu, e):
        excluded['ac'] = excluded.get('ac', 0) + 1; continue
    rows.append([w or 0, h or 0, d or 0, round(btu), round(e), ceer or 0, 0 if r.get('type') == 'Window' else 1, B(r['brand_name'].strip()), r['model_number'].strip()])
out['cats']['ac'] = {'id': DS['ac'], 'fields': ['w', 'h', 'd', 'btu', 'kwh', 'ceer', 'wall', 'brand', 'model'], 'brands': B.items, 'rows': rows}

# Freezers (no dimensions in the file).
B, T, rows = Idx(), Idx(), []
for r in load('freezer'):
    v, e = f(r, 'capacity_total_volume_ft3'), f(r, 'annual_energy_use_kwh_yr')
    if None in (v, e):
        excluded['freezer'] = excluded.get('freezer', 0) + 1; continue
    rows.append([v, round(e), T(r['type']), B(r['brand_name'].strip()), r['model_number'].strip()])
out['cats']['freezer'] = {'id': DS['freezer'], 'fields': ['vol', 'kwh', 'type', 'brand', 'model'], 'types': T.items, 'brands': B.items, 'rows': rows}

# Dehumidifiers.
B, rows = Idx(), []
for r in load('dehu'):
    p, e = f(r, 'dehumidifier_water_removal_capacity_per_appendix_x1_pints_day'), f(r, 'annual_energy_consumption_kwh_yr')
    if None in (p, e):
        excluded['dehu'] = excluded.get('dehu', 0) + 1; continue
    rows.append([p, round(e), 1 if 'Whole' in (r.get('dehumidifier_type') or '') else 0, B(r['brand_name'].strip()), r['model_number'].strip()])
out['cats']['dehu'] = {'id': DS['dehu'], 'fields': ['pints', 'kwh', 'whole', 'brand', 'model'], 'brands': B.items, 'rows': rows}

for k in DS:
    out['cats'][k]['updated'] = updated(k) or '2026-11-12'
    out['cats'][k]['excluded'] = excluded.get(k, 0)
json.dump(out, open(os.path.join(ROOT, 'src/data/appliances.json'), 'w'), separators=(',', ':'))
print({k: (len(v['rows']), v['excluded'], v['updated']) for k, v in out['cats'].items()}, 'pairs', len(out['pairs']))

# EIA table 5.6.A, residential column.
import openpyxl
ws = openpyxl.load_workbook(f'{RAW}/t56a.xlsx').active
head = [c for c in next(ws.iter_rows(min_row=2, max_row=2, values_only=True)) if c][0]
m = re.search(r'by State, (\w+ \d{4}) and (\d{4})', head)
states = {}
DIV = {'New England', 'Middle Atlantic', 'East North Central', 'West North Central', 'South Atlantic', 'East South Central', 'West South Central', 'Mountain', 'Pacific Contiguous', 'Pacific Noncontiguous'}
for row in ws.iter_rows(min_row=5, values_only=True):
    name = (row[0] or '').strip()
    if not name or name in DIV or not isinstance(row[1], (int, float)): continue
    states[name] = {'now': row[1], 'year_ago': row[2]}
eia = {'title': head, 'month': m.group(1), 'prev': f"{m.group(1).split()[0]} {m.group(2)}", 'retrieved': datetime.date.today().isoformat(), 'states': states}
json.dump(eia, open(os.path.join(ROOT, 'src/data/eia.json'), 'w'), indent=0)
print(eia['month'], eia['prev'], len(states), list(states)[-3:])
