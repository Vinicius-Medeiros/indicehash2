import { Dataset as HashIcon } from "@mui/icons-material";
import { AppBar, Box, Typography } from "@mui/material";
import React from "react";
import TabContainer from "../../components/TabContainer/TabContainer";
import rawData from "../../data/words.txt";
import useHashIndexContext from "../../hooks/useHashIndexContext";
import { calcBucketIndex } from "../../utils/calcBucketIndex";
import { hashFunction } from "../../utils/hashFunction";

const Home = () => {
    const {
        setDados,
        tamanhoPagina,
        dados,
        setPaginas,
        arrBuckets,
        paginas,
        quantidadeBuckets,
        tamanhoBucket,
        setOverflow,
        setColisao
    } = useHashIndexContext();

    const splitArray = (array, chunkSize) => {
        let result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            let chunk = array.slice(i, i + chunkSize);
            result.push(chunk);
        }
        return result;
    };

    // Lê o arquivo words.txt e popula o estado de dados
    React.useEffect(() => {
        fetch(rawData)
            .then(response => response.text())
            .then(text => {
                const linesArray = text
                    .split("\n")
                    .map(line => line.trim())
                    .filter(line => line);
                setDados(linesArray);
            })
            .catch(error => console.error("Error fetching the file:", error));
    }, []);

    // Faz o mapeamento das páginas
    React.useEffect(() => {
        if (tamanhoPagina > 0) {
            setPaginas(splitArray(dados, tamanhoPagina));
        }
    }, [tamanhoPagina]);

    // Popula os buckets
    React.useEffect(() => {
        if (paginas.length > 0) {
            paginas.map((pagina, index) => {
                pagina.map(palavra => {
                    const codigoHash = hashFunction(palavra);
                    const indiceNoBucket = calcBucketIndex(codigoHash, quantidadeBuckets);
                    const numeroOverflow = arrBuckets[indiceNoBucket][0].overflow

                    if (arrBuckets[indiceNoBucket][0].bucket[numeroOverflow].length < tamanhoBucket) {
                        arrBuckets[indiceNoBucket][0].bucket[numeroOverflow].push({ palavra, index });
                    } else {
                        if (arrBuckets[indiceNoBucket][0].bucket[numeroOverflow + 1]) {
                            if (arrBuckets[indiceNoBucket][0].bucket[numeroOverflow + 1].length < tamanhoBucket) {
                                arrBuckets[indiceNoBucket][0].colisao += 1
                                arrBuckets[indiceNoBucket][0].bucket[numeroOverflow + 1].push({ palavra, index });
                            } else {
                                arrBuckets[indiceNoBucket][0].colisao += 1
                                arrBuckets[indiceNoBucket][0].overflow += 1
                                arrBuckets[indiceNoBucket][0].bucket.push([]);
                                arrBuckets[indiceNoBucket][0].bucket[numeroOverflow + 1].push({ palavra, index });
                            }
                        } else {
                            arrBuckets[indiceNoBucket][0].colisao += 1
                            arrBuckets[indiceNoBucket][0].overflow += 1
                            arrBuckets[indiceNoBucket][0].bucket.push([]);
                            arrBuckets[indiceNoBucket][0].bucket[numeroOverflow + 1].push({ palavra, index });
                        }
                    }
                });
            });
            console.log(arrBuckets)
            let totalColisao = 0
            let totalOverflow = 0
            arrBuckets.map(bucketStruct => {
                totalOverflow += bucketStruct[0].overflow
            })
            setOverflow(totalOverflow)
            setColisao(totalColisao)
        }
    }, [paginas]);

    return (
        <React.Fragment>
            <AppBar position="static">
                <Typography
                    variant="h2"
                    color="inherit"
                    component="div"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        backgroundColor: "#000080",
                    }}
                >
                    Banco de Dados
                    <HashIcon fontSize="large" />
                </Typography>
            </AppBar>
            <Box sx={{ margin: 2 }}>
                <TabContainer />
            </Box>
        </React.Fragment>
    );
};

export default Home;
