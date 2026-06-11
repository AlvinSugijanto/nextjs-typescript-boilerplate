import ConfigView from "@/pages/config/view/config-view";

export const metadata = {
  title: "Configuration | Dashboard",
  description: "Manage your filter rules to ignore specific recruiters or job posting content.",
};

export default function ConfigPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
          <ConfigView />
        </div>
      </div>
    </div>
  );
}
