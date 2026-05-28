// app/learn/[moduleId]/page.tsx
import { modules } from "../../lib/curriculum";
import ModuleClient from "./module-client";

export function generateStaticParams() {
  return modules.map(m => ({ moduleId: m.id }));
}

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  return <ModuleClient params={params} />;
}
