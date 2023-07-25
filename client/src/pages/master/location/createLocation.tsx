import useCreateMution from "@api/mutation";
import LocationForm, {
  locationFormValues,
} from "@components/form/LocationForm";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateLocationPage = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createLocationMutation } = useCreateMution();
  const navigate = useNavigate();

  const onSubmit = async (data: locationFormValues) => {
    await createLocationMutation.mutateAsync(data);
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
          isLoading={createLocationMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <LocationForm
        submitButtonRef={submitButtonRef}
        handleSubmitForm={onSubmit}
      />
    </div>
  );
};

export default CreateLocationPage;
