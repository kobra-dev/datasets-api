const bin2string = (array: number[]) => {
    var result = ''
    for (var i = 0; i < array.length; ++i) {
        result += String.fromCharCode(array[i])
    }
    return result
}

export { bin2string }
