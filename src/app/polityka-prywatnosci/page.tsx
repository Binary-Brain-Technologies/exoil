import fs from "node:fs";
import path from "node:path";
import { PageHeader } from "@/components/page/PageHeader";
import { FactValue } from "@/components/ui/FactValue";
import { company } from "@/data/company";
import { legal } from "@/data/legal";
import { Markdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/seo";
import { isPublic } from "@/lib/verification";

const FILE = path.join(process.cwd(), "content", "legal", "polityka-prywatnosci.md");

function readPolicy(): string | null {
  return fs.existsSync(FILE) ? fs.readFileSync(FILE, "utf8") : null;
}

export function generateMetadata() {
  const approved = isPublic(legal.privacyPolicyApproved) && legal.privacyPolicyApproved.value && readPolicy() !== null;
  return pageMetadata({
    title: "Polityka prywatności",
    description: "Polityka prywatności Exoil Paliwa Sp. z o.o.: jak przetwarzamy dane z formularzy i w jaki sposób możesz skorzystać ze swoich praw.",
    path: "/polityka-prywatnosci/",
    noindex: !approved,
  });
}

export default function PrivacyPage() {
  const policy = readPolicy();
  const approved = isPublic(legal.privacyPolicyApproved) && legal.privacyPolicyApproved.value && policy !== null;
  return (
    <>
      <PageHeader trail={[{ name: "Polityka prywatności", path: "/polityka-prywatnosci/" }]} title="Polityka prywatności" tone="light" />
      <section className="bg-tank pb-24">
        <div className="frame">
          {approved && policy ? (
            <div className="prose-exoil">
              <Markdown source={policy} />
            </div>
          ) : (
            <div className="prose-exoil">
              <p>
                Pełna treść polityki prywatności jest w przygotowaniu. Administratorem danych osobowych przekazanych przez
                formularze na tej stronie jest <FactValue fact={company.legalName} />, <FactValue fact={company.address.street} />,{" "}
                <FactValue fact={company.address.postalCode} /> <FactValue fact={company.address.city} />, KRS{" "}
                <FactValue fact={company.krs} />.
              </p>
              <p>W sprawie swoich danych możesz skontaktować się z nami przez formularz na stronie Kontakt.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
