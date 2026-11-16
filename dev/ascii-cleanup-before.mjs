process.env.PHASE2_OUT = 'artifacts/ascii-cleanup';
const { server, browser, png, stopServers } = await import('./phase2-lib.mjs');
try {
  await server('after');
  for (const width of [1440, 390]) {
    const c = await browser({ width, height: 900, touch: width < 768 });
    try {
      await c.evaluate(`scrollTo(0,document.querySelector('#experience').getBoundingClientRect().top+scrollY-120)`);
      await new Promise(r => setTimeout(r, 1800));
      console.log(await png(c, 'before-' + width));
    } finally { await c.close(); }
  }
} finally { stopServers(); }
