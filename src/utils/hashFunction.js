
export const hashFunction = (index) => {
    const charCode = Array.from(index).map(char => char.charCodeAt(0))  
    const p = 17
    let SUM = 0
    for (let i = 0; i < charCode.length; i++) {
        SUM += charCode[i] * Math.pow(p, i) 
    }
    return SUM
}