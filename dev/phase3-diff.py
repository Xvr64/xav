# How far apart are the baseline's ocean frames and the working tree's with no flag set?
#   python dev/phase3-diff.py <captures>/identical
# For each pair: the largest difference of any channel of any pixel (0-255), the mean difference,
# and the share of pixels that differ by more than 6 levels (a changed glyph is tens of levels).
import glob, json, os, sys
from PIL import Image, ImageChops, ImageStat

root = sys.argv[1]
rows = []
for before in sorted(glob.glob(os.path.join(root, '*-before.jpg'))):
    after = before.replace('-before.jpg', '-after.jpg')
    a, b = Image.open(before).convert('RGB'), Image.open(after).convert('RGB')
    diff = ImageChops.difference(a, b)
    worst = max(high for _, high in diff.getextrema())
    mean = sum(ImageStat.Stat(diff).mean) / 3
    grey = diff.convert('L')
    over = sum(grey.histogram()[7:]) / (grey.width * grey.height)
    rows.append({'frame': os.path.basename(before).replace('-before.jpg', ''), 'size': a.size == b.size, 'worst': worst, 'mean': round(mean, 4), 'over6': round(over, 6)})
    print(rows[-1])
json.dump(rows, open(os.path.join(root, '..', 'identical-diff.json'), 'w'), indent=2)
# The committed tree against itself, two draws of one moment a few frames apart (the dither's seed
# differs): worst 10-13 levels, mean 0.24-0.33, 0.005-0.02 % of pixels over 6. That is the floor.
ok = all(r['size'] and r['worst'] <= 16 and r['mean'] <= 0.5 and r['over6'] <= 0.0005 for r in rows)
print('IDENTICAL WITHIN DITHER' if ok else 'DIFFERENT')
sys.exit(0 if ok else 1)
