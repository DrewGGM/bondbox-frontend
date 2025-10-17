const handler = (error : any):Error => {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error("99-03-05")
    } 
    throw new Error(error.response.data.code)
}

export default handler;