import type Hljs from 'highlight.js';

type HighlightJsModule = { default: typeof Hljs };

let highlightJsPromise: null | Promise<HighlightJsModule> = null;
let isLanguagesRegistered = false;

const loadHighlightJs = (): Promise<HighlightJsModule> => {
  highlightJsPromise ??= import('highlight.js/lib/core');
  return highlightJsPromise;
};

const registerLanguages = async (hljs: typeof Hljs): Promise<void> => {
  if (isLanguagesRegistered) {
    return;
  }

  const [
    { default: typescript },
    { default: xml },
    { default: python },
    { default: java },
    { default: go },
    { default: rust },
    { default: cpp },
    { default: css },
    { default: json },
    { default: yaml },
    { default: bash },
    { default: sql },
  ] = await Promise.all([
    import('highlight.js/lib/languages/typescript'),
    import('highlight.js/lib/languages/xml'),
    import('highlight.js/lib/languages/python'),
    import('highlight.js/lib/languages/java'),
    import('highlight.js/lib/languages/go'),
    import('highlight.js/lib/languages/rust'),
    import('highlight.js/lib/languages/cpp'),
    import('highlight.js/lib/languages/css'),
    import('highlight.js/lib/languages/json'),
    import('highlight.js/lib/languages/yaml'),
    import('highlight.js/lib/languages/bash'),
    import('highlight.js/lib/languages/sql'),
  ]);

  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('ts', typescript);
  hljs.registerLanguage('tsx', typescript);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('py', python);
  hljs.registerLanguage('java', java);
  hljs.registerLanguage('go', go);
  hljs.registerLanguage('rust', rust);
  hljs.registerLanguage('rs', rust);
  hljs.registerLanguage('cpp', cpp);
  hljs.registerLanguage('c', cpp);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('yaml', yaml);
  hljs.registerLanguage('yml', yaml);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('sh', bash);
  hljs.registerLanguage('shell', bash);
  hljs.registerLanguage('sql', sql);

  isLanguagesRegistered = true;
};

export const highlightElement = (element: HTMLElement): void => {
  void loadHighlightJs()
    .then(async ({ default: hljs }) => {
      await registerLanguages(hljs);
      if (element.children.length > 0) {
        element.replaceChildren(element.textContent ?? '');
      }
      delete element.dataset.highlighted;
      hljs.highlightElement(element);
    })
    .catch((error: unknown) => {
      console.error('code highlighting failed:', error);
    });
};
