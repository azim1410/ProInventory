import { TextField } from '@mui/material'

type TxtFeildProps = {
    label: string,
    name: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const TextInp = ({ label, name, value, onChange }: TxtFeildProps) => {
    return (
        <TextField
            label={label}
            name={name}
            fullWidth
            margin="normal"
            value={value}
            onChange={onChange}
        />
    )
}

export default TextInp