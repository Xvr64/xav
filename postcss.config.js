import tailwindcss from 'tailwindcss';
import tailwindcssV4 from '@tailwindcss/postcss';
import postcss from 'postcss';

export default {
  plugins: [{
    postcssPlugin: 'project-tailwind-version',
    async Once(root, { result }) {
      // Each page gets its own Tailwind version, including its own preflight.
      const file = result.opts.from?.replace(/\\/g, '/').split('?')[0];
      const plugin = file?.endsWith('/liquid-glass.css') ? tailwindcssV4() : tailwindcss();
      const processed = await postcss([plugin]).process(root, result.opts);
      result.messages.push(...processed.messages);
    },
  }]
};
