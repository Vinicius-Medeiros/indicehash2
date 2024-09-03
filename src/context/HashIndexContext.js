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
    buckets: [],
};

export const HashIndexContext = createContext(initialState);

const HashIndexContextProvider = props => {
    const [dados, setDados] = React.useState([]);
    const [tamanhoPagina, setTamanhoPagina] = React.useState(0);
    const [quantidadePaginas, setQuantidadePaginas] = React.useState(466549);
    const [paginas, setPaginas] = React.useState([]);
    const [buckets, setBuckets] = React.useState([]);

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
        buckets,
        setBuckets,
        showAlert,
        quantidadePaginas,
        setQuantidadePaginas
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
