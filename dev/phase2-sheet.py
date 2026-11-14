# Contact sheets for Phase II: crops of recorded frames, stacked.
#   python dev/phase2-sheet.py titles <prefix> <x0,y0,x1,y1> <out> [ms,ms,...]
#   python dev/phase2-sheet.py pair <before.jpg> <after.jpg> <out> [x0,y0,x1,y1]
import glob, os, re, sys
from PIL import Image, ImageDraw

root = os.path.join(os.path.dirname(__file__), '..', 'artifacts', 'phase2')

def titles(prefix, box, out, wanted=None):
    files = sorted(glob.glob(os.path.join(root, 'titles', prefix + '-*.jpg')))
    stamped = [(int(re.search(r'-(-?\d+)ms\.jpg$', f).group(1)), f) for f in files]
    if wanted:
        picks = [min(stamped, key=lambda s: abs(s[0] - ms)) for ms in wanted]
    else:
        picks = stamped
    box = tuple(box)
    w, h = box[2] - box[0], box[3] - box[1]
    sheet = Image.new('RGB', (w, (h + 4) * len(picks)), (255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    for i, (ms, f) in enumerate(picks):
        sheet.paste(Image.open(f).crop(box), (0, i * (h + 4)))
        draw.text((6, i * (h + 4) + 4), f'{ms} ms', fill=(255, 255, 255))
    sheet.save(os.path.join(root, out), quality=90)

def pair(before, after, out, box=None):
    a, b = Image.open(os.path.join(root, before)), Image.open(os.path.join(root, after))
    if box:
        a, b = a.crop(tuple(box)), b.crop(tuple(box))
    w, h = a.size
    stacked = w > h * 1.5
    sheet = Image.new('RGB', (w, h * 2 + 8) if stacked else (w * 2 + 8, max(h, b.size[1])), (255, 255, 255))
    sheet.paste(a, (0, 0))
    sheet.paste(b, (0, h + 8) if stacked else (w + 8, 0))
    sheet.save(os.path.join(root, out), quality=90)

if __name__ == '__main__':
    ints = lambda s: [int(v) for v in s.split(',')]
    if sys.argv[1] == 'titles':
        titles(sys.argv[2], ints(sys.argv[3]), sys.argv[4], ints(sys.argv[5]) if len(sys.argv) > 5 else None)
    else:
        pair(sys.argv[2], sys.argv[3], sys.argv[4], ints(sys.argv[5]) if len(sys.argv) > 5 else None)
