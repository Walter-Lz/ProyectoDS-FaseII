
export const GetItem= async (idItem) => {
    try {
        const response = await fetch(`https://api.mercadolibre.com/items/${idItem}`);
        return response.json();
    }catch(err){
        console.log(err);
        throw err;
    }
}
export const WishlistUser = async () =>{
    try {
        const response = await  fetch('https://api.example.com/user/wishlist');
        return response.json();
    }catch(err){
        console.log(err);
        throw err;
    }
}
export const GetCategories = async () =>{
    try {
        const response = await fetch("https://api.mercadolibre.com/sites/MCR/categories");
        return response.json();
    }catch(err){
        console.log(err);
        throw err;
    }
}
export const GetALLProductsCategory = async (categoryFilter) =>{
    try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MCR/search?q=${categoryFilter}`);
        return response.json();
    }catch(err){
        console.log(err);
        throw err;
    }
    
}



export const SearchProduct  = async (idProduct) =>{
    try {
        const response =  await fetch(`https://api.mercadolibre.com/sites/MCR/search?q=${idProduct}`);
        return response.json();
    }catch(err){
        console.log(err);
        throw err;
    }
}