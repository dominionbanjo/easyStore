import { MessagingView } from "@/modules/website/components/messaging/MessagingView";
import { areSubdomainsDisabled } from "@/utils/subdomain";

const VendorMessagesPage = () => {
  const basePath = areSubdomainsDisabled() ? "/vendor/messages" : "/messages";
  return <MessagingView basePath={basePath} containerClassName="min-h-0 pt-0" />;
};

export default VendorMessagesPage;
