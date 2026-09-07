import type { Meta, StoryObj } from "@storybook/react-vite";
import { FoundationDemo, foundationCatalog } from "./Foundations";
const meta = {
  title: "Fundamentos/Sistema visual",
  component: FoundationDemo,
  tags: ["autodocs"],
  args: { kind: "colors" },
  argTypes: { kind: { control: "select", options: foundationCatalog.map(item => item.id) } },
} satisfies Meta<typeof FoundationDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Cores: Story = { args: { kind: "colors" } };
export const Tipografia: Story = { args: { kind: "typography" } };
export const Espacamento: Story = { args: { kind: "spacing" } };
export const Layout: Story = { args: { kind: "layout" } };
export const Superficies: Story = { args: { kind: "surfaces" } };
export const Acessibilidade: Story = { args: { kind: "accessibility" } };
