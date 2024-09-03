import { Grid2, TextField } from "@mui/material";

const Statistics = () => {
    return (
        <Grid2 container spacing={2} marginTop={2}>
            <Grid2>
                <TextField fullWidth label="Informe a quantidade de páginas" />
            </Grid2>
        </Grid2>
    );
};

export default Statistics;
