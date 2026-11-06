import { PageHeader } from "@/components/bte/page-header";
import { JoinApplicationFields } from "./join-application-fields";

export const metadata = { title: "Apply to join BTE" };

export default function JoinApplicationPage() {
  return (
    <>
      <PageHeader
        title="Apply to join BTE"
        description="Tell us how you would like to contribute to BTE."
      />
      <JoinApplicationFields />
    </>
  );
}
