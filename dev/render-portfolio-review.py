"""Offline geometry comparison, using production terrain/sampler output. No browser involved."""
import json, math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

out = Path('artifacts/ascii-pass')
data = json.loads(Path('node_modules/.cache/ascii-pass/geometry.json').read_text())
font_path = 'C:/Windows/Fonts/consola.ttf'
def font(size): return ImageFont.truetype(font_path, size)
def mix(a,b,t): return tuple(round(x*(1-t)+y*t) for x,y in zip(a,b))

for mobile in [False, True]:
    frames = [f for f in data['frames'] if f['mobile'] == mobile]
    box = frames[0]['size']; pad=26; header=88; gap=38
    W=box*2+pad*3; H=header+(box+gap)*len(frames)+35
    image=Image.new('RGB',(W,H),(7,18,33)); d=ImageDraw.Draw(image)
    d.text((pad,18), 'GLOBE / '+('358px mobile stage' if mobile else '1000px desktop stage'),font=font(20),fill=(222,232,246))
    d.text((pad,48),'Offline geometry plates - not browser screenshots',font=font(13),fill=(150,190,214))
    for row,f in enumerate(frames):
        y0=header+row*(box+gap); R=f['radius']; c=box/2
        for col in range(2):
            x0=pad+col*(box+pad); bg=(153,214,241) if row==0 else (7,18,33)
            panel=Image.new('RGB',(box,box),bg); p=ImageDraw.Draw(panel)
            if col==0:
                # Sea-glass baseline: illustrative radial wash + exact projected production dots.
                pixels=panel.load()
                for yy in range(box):
                    for xx in range(box):
                        rr=math.hypot(xx-c,yy-c)/R
                        if rr<=1:
                            a,b=((226,242,250),(198,226,244)) if row==0 else ((134,170,226),(96,132,204))
                            pixels[xx,yy]=mix(bg,mix(a,b,min(1,math.hypot(xx-c+R*.3,yy-c+R*.35)/(R*1.4))),.92 if row==0 else .66)
                inks=[(76,100,124),(52,74,98),(32,50,72)] if row==0 else [(30,52,104),(18,38,86),(8,22,62)]
                for dot in f['dots']:
                    x,y=round(dot['x']),round(dot['y']); s=dot['size']/2
                    ink=mix(panel.getpixel((x,y)),inks[dot['band']],dot['alpha'])
                    p.rectangle((x-s,y-s,x+s,y+s),fill=ink)
            else:
                face=font(round(f['lattice']['cellH']))
                ink=(31,59,87) if row==0 else (200,218,240)
                for cell in f['cells']:
                    p.text((cell['x'],cell['y']),cell['glyph'],font=face,fill=mix(bg,ink,cell['alpha']),anchor='mm')
            image.paste(panel,(x0,y0))
            d.text((x0,y0+box+5),f['city']+' / '+('current dots' if col==0 else 'ASCII experiment'),font=font(14),fill=(222,232,246))
    d.text((pad,H-25),'Routes, captions, page background and motion omitted. Consolas substitutes the web font.',font=font(11),fill=(150,190,214))
    image.save(out / ('globe-mobile.png' if mobile else 'globe-desktop.png'))

image=Image.new('RGB',(1000,300),(1,3,10)); d=ImageDraw.Draw(image)
d.text((26,22),'SEVEN CITIES / constellation geometry study',font=font(20),fill=(222,232,246))
d.text((26,52),'Existing sky mask and fading remain responsible for integration.',font=font(13),fill=(150,190,214))
for point in data['constellation']:
    d.text((point['x'],point['y']),point['glyph'],font=font(14),fill=mix((1,3,10),(150,190,214),point['light']),anchor='mm')
d.text((26,265),'Doha / Paris / Jakarta / Moscow / Singapore / Pau / Shanghai',font=font(13),fill=(150,190,214))
image.save(out / 'constellation.png')
print('Saved offline review plates to',out)
