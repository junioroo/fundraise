import {Controller} from "react-hook-form";
import TextField from "@mui/material/TextField";

export const InputText = ({name, control, label}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={(
        {
          field: {onChange, value},
          fieldState: {error},
          formState,
        }) => (
        <TextField
          sx={{margin: '5px 0'}}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
        />
      )}
    />
  );
};
