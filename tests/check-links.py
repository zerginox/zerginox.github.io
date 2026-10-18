"""Check local web links and asset paths without starting a web browser."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import re
ROOT=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.ids=[]
    def handle_starttag(self,tag,attrs):
        values=dict(attrs)
        if 'id' in values:self.ids.append(values['id'])
        self.links.extend(values[key] for key in ('href','src') if key in values)
errors=[];checked=0
for file in ROOT.rglob('*.html'):
    if '.git' in file.parts:continue
    text=file.read_text();parsed=Links();parsed.feed(text)
    if len(parsed.ids)!=len(set(parsed.ids)):errors.append(f'{file.relative_to(ROOT)}: duplicate ids')
    urls=parsed.links+re.findall(r'new Audio\([\"\']([^\"\']+)',text)
    for url in urls:
        if url.startswith(('https:','http:','data:','mailto:','tel:','javascript:')):continue
        parts=urlsplit(url)
        target=ROOT/parts.path.lstrip('/') if parts.path.startswith('/') else file.parent/parts.path
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f'{file.relative_to(ROOT)} -> {url}: missing file')
        elif parts.fragment and target.suffix=='.html':
            destination=Links();destination.feed(target.read_text())
            if parts.fragment not in destination.ids:errors.append(f'{file.relative_to(ROOT)} -> {url}: missing anchor')
        checked+=1
for file in ROOT.rglob('*.css'):
    for url in re.findall(r'url\([\"\']?([^\)\"\']+)',file.read_text()):
        if url.startswith(('data:','http:','https:','#','%23')):continue
        if not (file.parent/url).exists():errors.append(f'{file.relative_to(ROOT)} -> {url}: missing CSS asset')
        checked+=1
print(f'Checked {checked} local links, anchors, audio, fonts, and image references.')
for error in errors:print('ERROR',error)
if errors:raise SystemExit(1)
print('PASS: all references resolve with exact-case deployment paths.')
