import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import LocationForm, {
  locationFormValues,
} from "@components/form/LocationForm";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditLocationPage = () => {
  const params = useParams();
  const { locationCode } = params;
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { updateLocationMutation } = useCreateMution();
  const { useFetchSingleLocation } = useApiServices();
  if (!locationCode) return;

  const { data } = useFetchSingleLocation(locationCode);

  if (!data) return;

  const onSubmit = async (data: locationFormValues) => {
    await updateLocationMutation.mutateAsync(data);
    navigate("/app/master/locations");
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Create Location
          </h2>
        </div>
        <AppButton
          isLoading={updateLocationMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <LocationForm
        defaultValues={data}
        submitButtonRef={submitButtonRef}
        handleSubmitForm={onSubmit}
      />
    </div>
  );
};

export default EditLocationPage;
