import { Button, Grid2 as Grid, Stack, TextField } from "@mui/material";
import React from "react";
import useHashIndexContext from "../../../../hooks/useHashIndexContext";
import { calcBucketIndex } from "../../../../utils/calcBucketIndex";
import { formatPercentage } from "../../../../utils/formatPercentage";
import { hashFunction } from "../../../../utils/hashFunction";

const HashIndex = () => {
    const {
        tamanhoPagina,
        setTamanhoPagina,
        showAlert,
        quantidadePaginas,
        setQuantidadePaginas,
        quantidadeBuckets,
        tamanhoBucket,
        arrBuckets,
        paginas,
        colisao,
        overflow
    } = useHashIndexContext();

    const [valorInput, setValorInput] = React.useState(tamanhoPagina);

    const [palavraAPesquisar, setPalavraAPesquisar] = React.useState("");

    const [quantidadeDeAcessos, setQuantidadeDeAcessos] = React.useState(0);
    const [tupla, setTupla] = React.useState();

    const [quantidadeAcessosIndice, setQuantidadeAcessosIndice] = React.useState(0);
    const [tuplaIndice, setTuplaIndice] = React.useState();

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
            showAlert(
                "Houve um erro ao salvar a nova quantidade de páginas!",
                "error"
            );
            setValorInput("");
        }
    };

    const getQuantidadePaginas = React.useMemo(() => {
        if (tamanhoPagina > 0) {
            setQuantidadePaginas(Math.ceil(quantidadePaginas / tamanhoPagina));
            return Math.ceil(quantidadePaginas / tamanhoPagina);
        } else {
            return quantidadePaginas;
        }
    }, [tamanhoPagina]);

    const handleChangePalavraAPesquisar = event => {
        setPalavraAPesquisar(event.target.value);
    };

    const handlePesquisarPalavra = () => {
        //console.log("pesquisei por =>", palavraAPesquisar);
        const codigoHash = hashFunction(palavraAPesquisar);
        //console.log("codigo has gerado =>", codigoHash);
        const bucketIndex = calcBucketIndex(codigoHash, quantidadeBuckets);
        //console.log("indice do bucket =>", bucketIndex);
        const bucketComPalavra = arrBuckets[bucketIndex][0];
        //console.log("bucketComPalavra =>", bucketComPalavra);
        if (bucketComPalavra.bucket.length > 1) {
            let objetoARetornar = {};
            let sumIteracoes = 0
            for (let i = 0; i < bucketComPalavra.bucket.length; i++) {
                objetoARetornar = bucketComPalavra.bucket[i].find(
                    obj => {
                        sumIteracoes += 1
                        return obj.palavra === palavraAPesquisar
                    }
                );
                if (objetoARetornar) {
                    //console.log("objeto retornado ", objetoARetornar);
                    break;
                }
            }
            // console.log(
            //     `A palavra "${objetoARetornar.palavra}" está na página no disco de número = ${objetoARetornar.index}`
            // );
            if (objetoARetornar) {
                setQuantidadeAcessosIndice(sumIteracoes)
				const tuplaindice = {
					objetoARetornar: objetoARetornar,
					bucketIndex: bucketIndex,
				}
                setTuplaIndice(tuplaindice)
                const isPresente = paginas[objetoARetornar.index].includes(
                    objetoARetornar.palavra
                );
                if (isPresente) {
                    showAlert(`Foi confirmado... Palavra esta contida de fato na página: ${objetoARetornar.index}`, 'success')
                } else { 
                    showAlert('Palavra não esta contido na pagina esperada!', 'info')
                }
            } else {
                showAlert('Palavra não se encontra mapeada!', 'error')
            }
        } else {
            let sumIteracoes = 0
            const objetoRetornado = bucketComPalavra.bucket.find(
                obj => {
                    sumIteracoes += 1
                    return obj.palavra === palavraAPesquisar
                }
            );
            // console.log(
            //     `A palavra "${objetoRetornado?.palavra}" está na página no disco de número = ${objetoRetornado?.index}`
            // );
            if (objetoRetornado) {
                setQuantidadeAcessosIndice(sumIteracoes)
				const tuplaindice = {
					objetoARetornar: objetoRetornado,
					bucketIndex: bucketIndex,
				}
                setTuplaIndice(tuplaindice)
                const isPresente = paginas[objetoRetornado?.index].includes(
                    objetoRetornado?.palavra
                );
                if (isPresente) {
                    showAlert(`Foi confirmado... Palavra esta contida de fato na página: ${objetoRetornado.index}`, 'success')
                } else { 
                    showAlert('Palavra não esta contido na pagina esperada!', 'info')
                }
            } else {
                showAlert('Palavra não se encontra mapeada!', 'error')
            }
        }
    };

    const handlePesquisarPalavraTableScan = () => {
        let objetoEncontrado;
        let paginasPassadas = 0;
        paginas.find((pagina, index) => {
            paginasPassadas += 1;
            objetoEncontrado = pagina.find(
                palavra => palavra == palavraAPesquisar
            );
            if (objetoEncontrado) {
                objetoEncontrado = {
                    palavra: objetoEncontrado,
                    numeroPagina: index,
                };
                return objetoEncontrado;
            }
        });
        if (objetoEncontrado) {
            setTupla(objetoEncontrado)
            setQuantidadeDeAcessos(paginasPassadas);
            showAlert('Palavra encontrada!', 'success')
        } else {
            showAlert('Palavra não esta presente no disco!', 'error')
        }
    };

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
            <Grid size={{ md: 2.89 }} sx={{ display: "inline-flex" }}>
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
                    value={tamanhoPagina === 0 ? 1 : tamanhoPagina}
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
            <Grid size={{ md: 3 }}>
                <TextField
                    fullWidth
                    label="Pesquisar"
                    value={palavraAPesquisar}
                    onChange={handleChangePalavraAPesquisar}
                />
            </Grid>
            <Grid size={{ md: 2.89 }} sx={{ display: "inline-flex" }}>
                <Stack direction="row" display="flex" gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ alignSelf: "self-end" }}
                        onClick={handlePesquisarPalavra}
                    >
                        PESQUISAR
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ alignSelf: "self-end" }}
                        onClick={handlePesquisarPalavraTableScan}
                    >
                        PESQUISAR - TableScan
                    </Button>
                </Stack>
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
                    label="Tamanho de cada bucket"
                    value={tamanhoBucket}
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
                    label="Quantidade de buckets"
                    value={quantidadeBuckets}
                />
            </Grid>
            <Grid size={{ md: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    focused
                    slotProps={{
                        textField: {
                            InputProps: {
                                readOnly: true,
                            },
                        },
                    }}
                    label="Tupla Encontrada (pesquisa por índice) :"
                    value={tuplaIndice ? `( indice = ${tuplaIndice.bucketIndex} , chave = ${tuplaIndice.objetoARetornar.palavra} , pagina = ${tuplaIndice.objetoARetornar.index} )` : ''}
                />
            </Grid>
            <Grid size={{ md: 2.89 }}>
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
                    label="Quantidade de iterações para encontrar a tupla"
                    value={quantidadeAcessosIndice}
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
                    label="Quantidade Total de Colisões"
                    value={colisao}
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
                    label="Quantidade Total de Overflows"
                    value={overflow}
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
                    label="Tupla Encontrada (pesquisa por TableScan) :"
                    value={tupla ? `( chave = ${tupla.palavra} , numeroPagina = ${tupla.numeroPagina} )` : ''}
                />
            </Grid>
            <Grid size={{ md: 2.89 }}>
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
                    label="Quantidade de acessos que foram feitos a disco"
                    value={quantidadeDeAcessos}
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
                    label="Percentual de Colisões"
                    value={ colisao === 0 ? '%' : `${formatPercentage((colisao / 466549).toFixed(2))}` }
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
                    label="Percentual de Overflows"
                    value={ overflow === 0 ? '%' : `${formatPercentage((overflow / 466549).toFixed(8))}` }
                />
            </Grid>
        </Grid>
    );
};

export default HashIndex;
