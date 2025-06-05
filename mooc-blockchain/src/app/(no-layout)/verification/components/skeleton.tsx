import { Card, CardContent } from "@/components/ui/card";

export const BannerSkeleton = () => (
  <div className="bg-gray-200 animate-pulse p-4 rounded-lg mb-6 flex items-center justify-center gap-2">
    <div className="bg-gray-300 rounded-full p-1 w-6 h-6"></div>
    <div className="bg-gray-300 h-4 w-48 rounded"></div>
  </div>
);

export const TicketInfoSkeleton = () => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1">
          <div className="bg-gray-200 animate-pulse h-6 w-48 rounded mb-2"></div>
          <div className="bg-gray-200 animate-pulse h-4 w-16 rounded"></div>
        </div>
      </div>

      <div className="space-y-3">
        <InfoRowSkeleton />
        <InfoRowSkeleton />
        <InfoRowSkeleton />
      </div>
    </CardContent>
  </Card>
);

export const InfoRowSkeleton = () => (
  <div className="flex items-center justify-between">
    <div className="bg-gray-200 animate-pulse h-4 w-20 rounded"></div>
    <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
  </div>
);

export const HeaderSkeleton = () => (
  <div className="flex items-center justify-between mb-8 pt-4">
    <div className="bg-gray-200 animate-pulse h-8 w-32 rounded"></div>
    <div className="bg-gray-200 animate-pulse h-10 w-24 rounded-full"></div>
  </div>
);
