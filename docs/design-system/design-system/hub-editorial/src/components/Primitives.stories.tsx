import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitiveDemo, primitiveCatalog } from "./Primitives";

const meta = {
  title: "Componentes/Catálogo",
  component: PrimitiveDemo,
  tags: ["autodocs"],
  args: { kind: "buttons" },
  argTypes: { kind: { control: "select", options: primitiveCatalog.map(item => item.id) } },
} satisfies Meta<typeof PrimitiveDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Botoes: Story = { args: { kind: "buttons" } };
export const Badges: Story = { args: { kind: "badges" } };
export const Cards: Story = { args: { kind: "cards" } };
export const Campos: Story = { args: { kind: "fields" } };
export const Selecao: Story = { args: { kind: "selection" } };
export const Navegacao: Story = { args: { kind: "navigation" } };
export const Abas: Story = { args: { kind: "tabs" } };
export const Accordion: Story = { args: { kind: "accordion" } };
export const Dialog: Story = { args: { kind: "dialog" } };
export const Drawer: Story = { args: { kind: "drawer" } };
export const Toast: Story = { args: { kind: "toast" } };
export const Alertas: Story = { args: { kind: "alerts" } };
export const Progresso: Story = { args: { kind: "progress" } };
export const Skeleton: Story = { args: { kind: "skeleton" } };
export const Vazio: Story = { args: { kind: "empty" } };
export const Avatares: Story = { args: { kind: "avatars" } };
export const Tooltip: Story = { args: { kind: "tooltip" } };
export const Codigo: Story = { args: { kind: "code" } };
export const Etapas: Story = { args: { kind: "stepper" } };
