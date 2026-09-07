import { useCallback, useState } from "react";
import * as Device from "expo-device";
import { useQuery } from "@tanstack/react-query";

export function useFeaturesSelect() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const featuresQuery = useQuery({
    queryKey: [
      "device-features",
      Device.brand,
      Device.modelName,
      Device.deviceType,
    ],
    queryFn: Device.getPlatformFeaturesAsync,
  });

  const toggleFeature = useCallback((value: string) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(value)) {
        return prev.filter((f) => f !== value);
      }
      return [...prev, value];
    });
  }, []);

  return { selectedFeatures, toggleFeature, featuresQuery };
}
