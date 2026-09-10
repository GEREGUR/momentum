import { Fragment } from "react/jsx-runtime";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/shared/ui/select";
import { useFeaturesSelect } from "./use-features-select";

export const FeaturesSelect = () => {
  const { selectedFeatures, featuresQuery, toggleFeature } =
    useFeaturesSelect();

  if (featuresQuery.isPending) {
    return <span>loading...</span>;
  }

  if (featuresQuery.isError) {
    return <span>error: {featuresQuery.error.message}</span>;
  }

  return (
    <Select>
      <SelectTrigger>
        <SelectInput placeholder="Select features" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          {featuresQuery.data.map((feat) => (
            <Fragment key={feat}>
              <SelectItem
                label={feat}
                value={feat}
                onPress={() => toggleFeature(feat)}
              />

              {selectedFeatures.includes(feat) ? (
                <span>✅</span>
              ) : (
                <span>⛔</span>
              )}
            </Fragment>
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};
