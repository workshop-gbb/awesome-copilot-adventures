import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataDemo, dataCatalog } from "./Data";

const meta = {
  title: "Dados/Tabelas e listas",
  component: DataDemo,
  tags: ["autodocs"],
  args: { kind: "table" },
  argTypes: { kind: { control: "select", options: dataCatalog.map(item => item.id) } },
} satisfies Meta<typeof DataDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Tabela: Story = { args: { kind: "table" } };
export const Compacta: Story = { args: { kind: "table-compact" } };
export const Vazia: Story = { args: { kind: "table-empty" } };
export const Carregando: Story = { args: { kind: "table-loading" } };
export const Erro: Story = { args: { kind: "table-error" } };
export const Responsiva: Story = { args: { kind: "table-responsive" } };
export const Lista: Story = { args: { kind: "list-bullets" } };
export const Ordenada: Story = { args: { kind: "list-ordered" } };
export const Definicoes: Story = { args: { kind: "list-definitions" } };
export const Interativa: Story = { args: { kind: "list-interactive" } };
export const Arvore: Story = { args: { kind: "list-tree" } };
export const Timeline: Story = { args: { kind: "list-timeline" } };
export const Atividades: Story = { args: { kind: "list-activity" } };
export const Checklist: Story = { args: { kind: "list-checklist" } };
export const Quadro: Story = { args: { kind: "kanban" } };
