# Comparison sheets for Phase III: the same crop of several frames, side by side or stacked, labelled.
#   python dev/phase3-sheet.py [--enhance] <out.jpg> <x0,y0,x1,y1 | full> <scale> <columns> label=frame.jpg [label=frame.jpg ...]
# --enhance stretches each tile's contrast: the ocean's glyphs are a few levels from the water's
# colour by design, too little to read in a small still. Paths are relative to the working directory.
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

enhance = '--enhance' in sys.argv
if enhance:
    sys.argv.remove('--enhance')

out, box, scale, columns = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4])
items = [arg.split('=', 1) for arg in sys.argv[5:]]
tiles = []
for label, path in items:
    image = Image.open(path).convert('RGB')
    if box != 'full':
        image = image.crop(tuple(int(v) for v in box.split(',')))
    if enhance:
        image = ImageOps.autocontrast(image, cutoff=(0.3, 0.3))
    if scale != 1:
        image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
    tiles.append((label, image))

try:
    font = ImageFont.truetype('consola.ttf', 18)
except OSError:
    font = ImageFont.load_default()
gap, bar = 10, 30
w, h = tiles[0][1].size
rows = -(-len(tiles) // columns)
sheet = Image.new('RGB', (columns * w + (columns + 1) * gap, rows * (h + bar) + (rows + 1) * gap), (16, 18, 24))
draw = ImageDraw.Draw(sheet)
for i, (label, image) in enumerate(tiles):
    x = gap + (i % columns) * (w + gap)
    y = gap + (i // columns) * (h + bar + gap)
    draw.text((x + 2, y + 5), label, fill=(222, 232, 246), font=font)
    sheet.paste(image, (x, y + bar))
sheet.save(out, quality=92)
print(out, sheet.size)
