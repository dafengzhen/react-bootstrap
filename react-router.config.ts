import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'src',
  prerender: ({ getStaticPaths }) => getStaticPaths(),
  ssr: false,
} satisfies Config;
