
export const calcBucketIndex = (codigoHash, quantidadeBuckets) => {
    return codigoHash % quantidadeBuckets
}
