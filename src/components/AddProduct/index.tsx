import { Button } from '@mui/material'
import { PRIMARY_CLR } from '../../assets/colors'

type BtnProps = {
    title: string,
    onChange: () => void,
}

const AddProductBtn = ({ title, onChange }: BtnProps) => {
    return (

        <Button
            variant="contained"
            sx={{
                backgroundColor: PRIMARY_CLR,
                borderRadius: "10px",
                boxShadow: "none",
                height:'3rem'
            }}
            onClick={onChange}
        >
            {title}
        </Button>

    )
}

export default AddProductBtn