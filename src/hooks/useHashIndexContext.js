import { useContext } from "react"
import { HashIndexContext } from "../context/HashIndexContext"

const useHashIndexContext = () => {
    const context = useContext(HashIndexContext)

    return context
}

export default useHashIndexContext