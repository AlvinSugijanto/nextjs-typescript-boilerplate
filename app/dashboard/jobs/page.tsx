import JobsView from "@/pages/jobs/view/jobs-view";

export const metadata = {
  title: "Jobs | Dashboard",
  description: "Manage your scraped LinkedIn jobs.",
};

export default function JobsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
          <JobsView />
        </div>
      </div>
    </div>
  );
}
