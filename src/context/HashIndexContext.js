import { Alert, Snackbar } from "@mui/material";
import React, { createContext } from "react";

/*
    466.549 palavras que são a quantiade de dados
    Quandidade de paginas = 466.549 / tamanho da pagina ( USUARIO DEFINE )
    Número de buckets = 466.549 / tamanho do bucket ( A GENTE DEFINE )
*/

const initialState = {
    dados: [],
    tamanhoPagina: 0,
    quantidadePaginas: 466549,
    paginas: [],
    arrBuckets: [],
    tamanhoBucket: 0,
    quantidadeBuckets: 0,
    colisao: 0,
    overflow: 0
};

export const HashIndexContext = createContext(initialState);

const HashIndexContextProvider = props => {
    const [dados, setDados] = React.useState([]);
    const [colisao, setColisao] = React.useState(0)
    const [overflow, setOverflow] = React.useState(0)

    const [tamanhoPagina, setTamanhoPagina] = React.useState(0);
    const [quantidadePaginas, setQuantidadePaginas] = React.useState(466549);
    const [tamanhoBucket, setTamanhoBucket] = React.useState(200);
    const [quantidadeBuckets, setQuantidadeBuckets] = React.useState(Math.ceil(466549 / tamanhoBucket));

    const [paginas, setPaginas] = React.useState([]);
    const [arrBuckets, setArrBuckets] = React.useState(Array.from({ length: quantidadeBuckets }, () => [{
        bucket: [[]],
        colisao: 0,
        overflow: 0
    }]));

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("info");

    const showAlert = (newMessage, newSeverity = "info") => {
        setMessage(newMessage);
        setSeverity(newSeverity);
        setOpen(true);
    };

    const hideAlert = () => {
        setOpen(false);
    };

    const value = {
        dados,
        setDados,
        tamanhoPagina,
        setTamanhoPagina,
        paginas,
        setPaginas,
        arrBuckets,
        setArrBuckets,
        showAlert,
        quantidadePaginas,
        setQuantidadePaginas,
        tamanhoBucket,
        setTamanhoBucket,
        quantidadeBuckets,
        setQuantidadeBuckets,
        colisao,
        setColisao,
        overflow,
        setOverflow
    };

    const { children } = props;

    return (
        <HashIndexContext.Provider value={value}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={hideAlert}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={hideAlert}
                    variant="filled"
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </HashIndexContext.Provider>
    );
};

export default HashIndexContextProvider;
