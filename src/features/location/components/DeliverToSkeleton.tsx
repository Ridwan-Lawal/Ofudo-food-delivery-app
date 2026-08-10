import SkeletonBlock from "@/components/SkeletonBlock";
import { radius } from "@/theme/tokens";

export default function DeliverToSkeleton() {
  return <SkeletonBlock width={120} height={20} borderRadius={radius.sm} />;
}
