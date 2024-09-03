import { Dataset as HashIcon } from "@mui/icons-material";
import { AppBar, Box, Typography } from "@mui/material";
import React from "react";
import TabContainer from "../../components/TabContainer/TabContainer";
import rawData from "../../data/words.txt";
import useHashIndexContext from "../../hooks/useHashIndexContext";

const Home = () => {
    const { setDados, tamanhoPagina, dados, setPaginas, paginas } = useHashIndexContext();

    const splitArray = (array, chunkSize) => {
        let result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            let chunk = array.slice(i, i + chunkSize);
            result.push(chunk);
        }
        return result;
    }

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

    React.useEffect(() => {
        if (tamanhoPagina > 0) {
            setPaginas(splitArray(dados, tamanhoPagina))
        }
    }, [tamanhoPagina])

    console.log(paginas)

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
