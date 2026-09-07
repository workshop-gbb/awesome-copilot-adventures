import type { ReactNode } from "react";

interface DemoFrameProps {
  title: string;
  description: string;
  children: ReactNode;
  controls?: ReactNode;
  note?: string;
}

export function DemoFrame({ title, description, children, controls, note }: DemoFrameProps) {
  return (
    <section className="he-demo">
      <div className="he-demo__heading">
        <div><h2>{title}</h2><p>{description}</p></div>
        {controls && <div className="he-demo__controls">{controls}</div>}
      </div>
      <div className="he-demo__canvas">{children}</div>
      {note && <p className="he-demo__note">{note}</p>}
    </section>
  );
}
