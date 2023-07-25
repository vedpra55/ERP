import { Location } from "@@types/system";
import { FC, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AppInput from "@components/input/AppInput";
import CheckboxInput from "@components/input/CheckboxInput";
import { locationSchema } from "@utils/validator";

interface Props {
  defaultValues?: Location;
  handleSubmitForm(data: locationFormValues): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
}

export type locationFormValues = {
  locationCode: string;
  locationName: string;
  shortName: string;
  closedFlag?: boolean;
};

const LocationForm: FC<Props> = ({
  defaultValues,
  handleSubmitForm,
  submitButtonRef,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<locationFormValues>({
    resolver: yupResolver(locationSchema),
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        locationCode: defaultValues.location_code,
        locationName: defaultValues.location_name,
        shortName: defaultValues.short_name,
        closedFlag: defaultValues.closed_flag,
      });
    }
  }, [defaultValues]);

  return (
    <form
      onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      className="grid grid-cols-12 gap-5 items-end mt-5"
    >
      {!defaultValues && (
        <AppInput
          name="locationCode"
          placeholder="Location Code"
          register={register}
          errorMsg={errors.locationCode?.message}
        />
      )}
      <AppInput
        name="locationName"
        placeholder="Location Name"
        register={register}
        errorMsg={errors.locationName?.message}
      />
      <AppInput
        name="shortName"
        placeholder="Short Name"
        register={register}
        errorMsg={errors.shortName?.message}
      />
      <CheckboxInput
        register={register}
        placeholder="Closed Flag"
        name="closedFlag"
      />
      <button type="submit" className="hidden" ref={submitButtonRef}></button>
    </form>
  );
};

export default LocationForm;
