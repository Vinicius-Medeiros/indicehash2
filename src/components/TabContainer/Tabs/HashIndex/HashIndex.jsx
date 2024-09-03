import { Button, Grid2 as Grid, TextField } from "@mui/material";
import React from "react";
import useHashIndexContext from "../../../../hooks/useHashIndexContext";

const HashIndex = () => {
    const { tamanhoPagina, setTamanhoPagina, showAlert, quantidadePaginas, setQuantidadePaginas } = useHashIndexContext();

    const [valorInput, setValorInput] = React.useState(tamanhoPagina);

    const handleChangeTamanhoPaginaInput = event => {
        setValorInput(event.target.value);
    };

    const handleSalvarQuantidadePaginas = () => {
        const valorNumerico = Number(valorInput);

        if (valorNumerico === tamanhoPagina) {
            showAlert("Esse valor já é o tamanho atual!");
            setValorInput("");
        } else if (valorNumerico > 0) {
            setTamanhoPagina(valorNumerico);
            showAlert("Quantidade de páginas atualizadas!", "success");
            setValorInput("");
        } else {
            showAlert("Houve um erro ao salvar a nova quantidade de páginas!","error");
            setValorInput("");
        }
    };

	const getQuantidadePaginas = React.useMemo(() => {
		if (tamanhoPagina > 0) {
			setQuantidadePaginas(Math.ceil(quantidadePaginas / tamanhoPagina))
			return Math.ceil(quantidadePaginas / tamanhoPagina)
		} else {
			return quantidadePaginas
		}
	}, [tamanhoPagina])

    return (
        <Grid container spacing={2} marginTop={2}>
            <Grid size={{ md: 3 }}>
                <TextField
                    fullWidth
                    type="number"
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                                display: "none",
                            },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    label="Informe o tamanho da página no disco"
                    onChange={handleChangeTamanhoPaginaInput}
                    value={valorInput}
                />
            </Grid>
            <Grid size={{ md: 2.85 }} sx={{ display: "inline-flex" }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ alignSelf: "self-end" }}
                    onClick={handleSalvarQuantidadePaginas}
                >
                    SALVAR
                </Button>
            </Grid>
            <Grid size={{ md: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    focused
                    sx={{
                        "& :hover": {
                            cursor: "not-allowed",
                            pointerEvents: "none",
                        },
                        cursor: "not-allowed",
                        pointerEvents: "none",
                    }}
                    slotProps={{
                        textField: {
                            InputProps: {
                                readOnly: true,
                            },
                        },
                    }}
                    label="Tamanho da página no disco"
                    value={tamanhoPagina}
                />
            </Grid>
			<Grid size={{ md: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    focused
                    sx={{
                        "& :hover": {
                            cursor: "not-allowed",
                            pointerEvents: "none",
                        },
                        cursor: "not-allowed",
                        pointerEvents: "none",
                    }}
                    slotProps={{
                        textField: {
                            InputProps: {
                                readOnly: true,
                            },
                        },
                    }}
                    label="Quantidade de páginas no disco"
                    value={getQuantidadePaginas}
                />
            </Grid>
        </Grid>
    );
};

export default HashIndex;
