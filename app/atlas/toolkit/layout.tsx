import type { Metadata } from "next";
import LabAbout from "../../components/LabAbout";
import { labs } from "../../lib/labs";
import { labMeta } from "../../lib/labMeta";

const ID = "toolkit";

export const metadata: Metadata = {
  title: labs[ID].title,
  description: labMeta[ID].teaches,
  openGraph: { title: `${labs[ID].title} — Post-Quantum Atlas`, description: labMeta[ID].teaches },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LabAbout id={ID} />
    </>
  );
}
