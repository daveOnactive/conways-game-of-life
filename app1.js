let list = (array, x, y) => {

    let lis = [
        
    ].forEach((a) => {
        return +!!a;
    });
};

let array = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0]
];


for (let y=0; y<array.length; y++) {
    for (let x=0; x<array[0].length; x++) {
        let a = [
            array[y-1][x-1], array[y-1][x], array[y-1][x+1],
            array[y][x-1], array[y][x+1],
            array[y+1][x-1], array[y+1][x], array[y+1][x+1]
        ].forEach((a) => {
            return +!!a;
        })

        console.log(a);
    }
}