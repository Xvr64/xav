# Averages the Phase III performance runs per width and configuration, as Markdown tables.
#   python dev/phase3-summary.py <captures> [performance performance-extra ...]
import collections, json, os, sys

root = sys.argv[1]
names = sys.argv[2:] or ['performance', 'performance-extra']
ORDER = ['none', 'inertia', 'flow', 'wake', 'sea', 'all']

def get(row, path):
    for key in path.split('.'):
        row = row[key]
    return row

def mean(rows, path):
    return sum(get(r, path) for r in rows) / len(rows)

for name in names:
    file = os.path.join(root, name + '.json')
    if not os.path.exists(file):
        continue
    groups = collections.defaultdict(list)
    for r in json.load(open(file)):
        groups[(r['view'], r['config'])].append(r)
    views = sorted({v for v, _ in groups}, key=lambda v: -int(v))
    for view in views:
        print(f'\n**{view} px** ({name})\n')
        print('| Flags | Trials | CV read: mean / p95 / p99 ms | >34 ms | Cover p95 | Globe film: mean / p95 / p99 | >34 ms | Idle: mean / p95 | Stop-go: mean / p95 / p99 | >34 ms | Main thread, CV / idle ms | Ocean draw ms | Compile ms | Heap MB |')
        print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
        for config in ORDER:
            rows = groups.get((view, config))
            if not rows:
                continue
            m = lambda p, d=1: f'{mean(rows, p):.{d}f}'
            print(f"| {config} | {len(rows)} | {m('cv.mean')} / {m('cv.p95')} / {m('cv.p99')} | {m('cv.over34')} | {m('hero.p95')} | "
                  f"{m('globe.mean')} / {m('globe.p95')} / {m('globe.p99')} | {m('globe.over34')} | {m('idle.mean')} / {m('idle.p95')} | "
                  f"{m('stopGo.mean')} / {m('stopGo.p95')} / {m('stopGo.p99')} | {m('stopGo.over34')} | {m('cvCost.task', 0)} / {m('idleCost.task', 0)} | "
                  f"{m('oceanDrawMs.median', 2)} | {m('compileMs')} | {m('heapMB')} |")
