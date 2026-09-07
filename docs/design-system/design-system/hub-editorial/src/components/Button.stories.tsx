import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Primitives";

const meta = {
  title: "Componentes/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Continuar", variant: "primary", disabled: false, busy: false },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "quiet", "danger"] },
    children: { control: "text" },
    onClick: { action: "click" },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
export const Secundario: Story = { args: { variant: "secondary" } };
export const Discreto: Story = { args: { variant: "quiet" } };
export const Destrutivo: Story = { args: { variant: "danger", children: "Excluir — exemplo" } };
export const Desabilitado: Story = { args: { disabled: true } };
export const Ocupado: Story = { args: { busy: true, children: "Processando — amostra" } };
