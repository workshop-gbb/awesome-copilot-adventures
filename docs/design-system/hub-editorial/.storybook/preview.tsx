import { useEffect, type ReactNode } from "react";
import type { Preview } from "@storybook/react-vite";
import "../tokens.css";
import "../components.css";
import "../src/studio.css";

function ThemeFrame({ theme, children }: { theme: string; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.heTheme = theme;
  }, [theme]);
  return <div className="he he-story-surface">{children}</div>;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema do Hub Editorial",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Claro" },
          { value: "dark", title: "Escuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [(Story, context) => <ThemeFrame theme={context.globals.theme}><Story /></ThemeFrame>],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: { test: "error" },
    options: {
      storySort: {
        order: ["Fundamentos", "Componentes", "Dados", "Gráficos", "Arquitetura", "Ícones", "Ilustrações", "Movimento", "Simulações"],
      },
    },
  },
};

export default preview;
